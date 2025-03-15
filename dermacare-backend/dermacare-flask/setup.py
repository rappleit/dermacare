import os
from dotenv import load_dotenv
from langchain_experimental.open_clip import OpenCLIPEmbeddings
from langchain_iris import IRISVector
from langchain.docstore.document import Document
import re
import time
import sys

def check_requirements():
    """Check if all requirements are met before starting setup"""
    errors = []
    
    # Check for .env file and required variables
  
    # Check for data directory
    dataset_path = "../data/dermnet_data"
    if not os.path.exists(dataset_path):
        errors.append(f"ERROR: Dataset directory not found at {dataset_path}")
    
    # Check IRIS connection
    try:
        hostname = os.getenv('IRIS_HOSTNAME', 'localhost')
        # Simple connection test (you might want to adjust this based on your IRIS setup)
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
    
    # Use local dataset path
    dataset_path = "../data/dermnet_data"
    
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
                model_name="ViT-B-32",  # Using a smaller model first
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
            db = IRISVector.from_documents(
                embedding=multimodal_ef,
                documents=docs,
                collection_name=COLLECTION_NAME,
                connection_string=CONNECTION_STRING,
            )
            
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