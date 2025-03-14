import os
from langchain_experimental.open_clip import OpenCLIPEmbeddings
from langchain_iris import IRISVector
import traceback

def init_db():
    """Initialize database connection"""
    print("\nStarting database initialization...")
    try:
        # IRIS DB connection params
        username = 'demo'
        password = 'demo'
        hostname = os.getenv('IRIS_HOSTNAME', 'localhost')
        port = '1972'
        namespace = 'USER'
        CONNECTION_STRING = f"iris://{username}:{password}@{hostname}:{port}/{namespace}"
        COLLECTION_NAME = "dermnet_multimodal"

        print(f"Database connection string: {CONNECTION_STRING}")
        print(f"Collection name: {COLLECTION_NAME}")

        # Initialize the embedding function
        print("\nInitializing OpenCLIP embedding function...")
        try:
            multimodal_ef = OpenCLIPEmbeddings(
                model_name="ViT-B-32",  # Using smaller model as discussed
                checkpoint="laion2b_s34b_b79k"
            )
            print("OpenCLIP embedding function initialized successfully!")
        except Exception as e:
            print(f"Failed to initialize OpenCLIP: {str(e)}")
            print("Traceback:")
            print(traceback.format_exc())
            raise

        # Connect to DB
        print("\nConnecting to IRIS database...")
        try:
            db = IRISVector.from_documents(
                embedding=multimodal_ef,
                documents=[],  # Passing empty list so it doesn't re-embed
                collection_name=COLLECTION_NAME,
                connection_string=CONNECTION_STRING,
            )
            print("Successfully connected to IRIS database!")
        except Exception as e:
            print(f"Failed to connect to IRIS database: {str(e)}")
            print("Traceback:")
            print(traceback.format_exc())
            raise

        return multimodal_ef, db

    except Exception as e:
        print(f"\nError in init_db: {str(e)}")
        print("Full traceback:")
        print(traceback.format_exc())
        raise

def query_db_with_image_and_text(image_path, multimodal_ef, db):
    """Query the database with image and text"""
    print(f"\nQuerying database with image: {image_path}")
    try:
        query_embedding = multimodal_ef.embed_image([image_path])[0]
        print("Image embedded successfully")

        results = db.similarity_search_by_vector(query_embedding, k=3)
        print(f"Found {len(results)} similar results")

        print("\nTop similar results:")
        for result in results:
            diagnosis = result.metadata.get("diagnosis", "N/A")
            path = result.metadata.get("path", "N/A")
            print(f"Diagnosis: {diagnosis} | Path: {path}")

        return results
    except Exception as e:
        print(f"Error in query_db_with_image_and_text: {str(e)}")
        print("Traceback:")
        print(traceback.format_exc())
        raise

def combine_text(results, patient_hist):
    """Combine results and patient history"""
    try:
        diagnoses = [result.metadata.get("diagnosis", "N/A") for result in results]
        top_diagnoses_str = "Top Diagnosis: " + ", ".join(diagnoses)
        combined_output = f"{top_diagnoses_str}, Patient history: {patient_hist}"
        print(f"\nCombined text output: {combined_output}")
        return combined_output
    except Exception as e:
        print(f"Error in combine_text: {str(e)}")
        print("Traceback:")
        print(traceback.format_exc())
        raise