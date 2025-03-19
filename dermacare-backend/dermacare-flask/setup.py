import os
from dotenv import load_dotenv
from langchain_experimental.open_clip import OpenCLIPEmbeddings
from langchain_iris import IRISVector
from langchain.docstore.document import Document
import re
import time
import sys

def check_requirements():
    errors = []
      
    # Check for OpenAI API key
    if not os.environ.get("OPENAI_API_KEY"):
        errors.append("ERROR: OPENAI_API_KEY environment variable not found")
    
    # Check for Kaggle API credentials
    kaggle_path = os.path.join(os.getcwd(), ".kaggle", "kaggle.json")
    if not os.path.exists(kaggle_path):
        errors.append(f"ERROR: Kaggle credentials not found at {kaggle_path}")
    
            
    # Check IRIS connection
    try:
        hostname = os.getenv('IRIS_HOSTNAME', 'localhost')
        import socket
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        result = sock.connect_ex((hostname, 1972))
        if result != 0:
            errors.append(f"ERROR: Cannot connect to IRIS database at {hostname}:1972")
        sock.close()
    except Exception as e:
        errors.append(f"ERROR: IRIS connection test failed: {str(e)}")
    
    return errors

def extract_diagnosis(filename):
    """
    Extracts a diagnosis string from a filename by removing leading numbers/special characters
    and capitalizing the remaining words.
    """
    try:
        name = os.path.splitext(filename)[0]
        cleaned = re.sub(r'^[\d_\-]+', '', name)
        parts = re.split(r'[\d_\-]+', cleaned)
        diagnosis = ' '.join(part.strip().capitalize() for part in parts if part.strip())
        return diagnosis
    except Exception as e:
        print(f"Warning: Could not extract diagnosis from {filename}: {str(e)}")
        return "Unknown"

def create_documents_from_images(root_dir):
    """
    Walk through the dataset directory and create a Document for each image.
    The document's page_content is set to the image file path and its metadata contains the diagnosis.
    """
    docs = []
    errors = []
    skipped = 0
    
    for root, dirs, files in os.walk(root_dir):
        for file in files:
            if file.lower().endswith(('.png', '.jpg', '.jpeg')):
                try:
                    full_path = os.path.join(root, file)
                    # Verify image can be opened
                    from PIL import Image
                    Image.open(full_path).verify()
                    
                    diagnosis = extract_diagnosis(file)
                    doc = Document(page_content=full_path, metadata={"diagnosis": diagnosis, "path": full_path})
                    docs.append(doc)
                except Exception as e:
                    errors.append(f"Error processing {file}: {str(e)}")
                    skipped += 1
    
    return docs, errors, skipped

def batch(iterable, n=1):
    """Yield successive n-sized batches from iterable."""
    for i in range(0, len(iterable), n):
         yield iterable[i:i + n]

def main():
    print("Starting setup process...")
    
    # Check requirements first
    errors = check_requirements()
    if errors:
        print("\nSetup cannot continue due to the following errors:")
        for error in errors:
            print(error)
        sys.exit(1)
    
    # Load environment variables
    load_dotenv()
    
    # Download the dataset from Kaggle
    print("\nDownloading dataset from Kaggle...")
    try:
        import kagglehub
        dataset_path = kagglehub.dataset_download("shubhamgoel27/dermnet")
        print("Dataset downloaded to:", dataset_path)
    except Exception as e:
        print(f"Error downloading dataset: {str(e)}")
        print("Attempting to use local dataset path...")
        dataset_path = "../data/dermnet_data"
        if not os.path.exists(dataset_path):
            print(f"ERROR: Local dataset not found at {dataset_path}")
            sys.exit(1)
    
    try:
        # Create documents from images
        print("\nProcessing images...")
        docs, errors, skipped = create_documents_from_images(dataset_path)
        
        if errors:
            print("\nWarnings during image processing:")
            for error in errors:
                print(f"- {error}")
        
        print(f"\nProcessed {len(docs)} images successfully")
        if skipped > 0:
            print(f"Skipped {skipped} problematic images")
        
        if not docs:
            print("No valid documents created. Aborting setup.")
            sys.exit(1)
        
        # Initialize the image embedding function
        print("\nInitializing embedding function...")
        try:
            print("Loading OpenCLIP model (this may take a few minutes)...")
            multimodal_ef = OpenCLIPEmbeddings(
                model_name="ViT-B-32",  
                checkpoint="laion2b_s34b_b79k"
            )
            print("OpenCLIP model loaded successfully!")
        except Exception as e:
            print(f"\nERROR: Failed to initialize embedding function:")
            print(f"Error details: {str(e)}")
            print("\nPossible solutions:")
            print("1. Try using a machine with more RAM")
            print("2. Clear other running programs")
            print("3. Try using a smaller model (currently attempting with ViT-B-32)")
            sys.exit(1)
        
        # Set up IRIS connection parameters
        username = 'demo'
        password = 'demo'
        hostname = os.getenv('IRIS_HOSTNAME', 'localhost')
        port = '1972'
        namespace = 'USER'
        CONNECTION_STRING = f"iris://{username}:{password}@{hostname}:{port}/{namespace}"
        COLLECTION_NAME = "dermnet_multimodal"
        
        # Create vector store
        print("\nCreating vector store...")
        start = time.time()
        
        try:
            batch_size = 1000

            for i, batch_docs in enumerate(batch(docs, batch_size)):
                print(f"Processing batch {i+1} with {len(batch_docs)} documents...")
                if i == 0:
                    # Create the store for the first batch
                    db = IRISVector.from_documents(
                        embedding=multimodal_ef,
                        documents=batch_docs,
                        collection_name=COLLECTION_NAME,
                        connection_string=CONNECTION_STRING,
                    )
                else:
                    # For subsequent batches, add documents to the existing store
                    db.add_documents(batch_docs)
                print(f"Batch {i+1} processed.")
            
            elapsed = time.time() - start
            ids = db.get().get("ids", [])
            print("\nSetup completed successfully!")
            print(f"Number of docs in vector store: {len(ids)}")
            print(f"Time taken: {elapsed:.2f} seconds")
            
        except Exception as e:
            print(f"\nERROR: Failed to create vector store: {str(e)}")
            sys.exit(1)
            
    except KeyboardInterrupt:
        print("\nSetup interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\nUnexpected error during setup: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()