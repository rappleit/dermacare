from flask import Flask, request, jsonify
import os
from dotenv import load_dotenv
from utils.db_utils import init_db, query_db_with_image_and_text, combine_text
from utils.gpt_utils import query_openai_with_image_and_text
import traceback

print("Starting Flask application...")

app = Flask(__name__)

print("Loading environment variables...")
load_dotenv()
api_key = os.getenv('OPENAI_API_KEY')

if not api_key:
    print("ERROR: OPENAI_API_KEY not found in environment variables")
    raise ValueError("OPENAI_API_KEY not found in environment variables")
else:
    print("OpenAI API key loaded successfully")

print("Initializing database connection...")
try:
    print("Attempting to initialize embedding function and connect to database...")
    multimodal_ef, db = init_db()
    print("Database connection established successfully!")
except Exception as e:
    print(f"Failed to initialize database: {str(e)}")
    print("Full error:")
    print(traceback.format_exc())
    raise

@app.errorhandler(Exception)
def handle_error(error):
    """Global error handler"""
    print(f"Error occurred: {str(error)}")
    print("Full traceback:")
    print(traceback.format_exc())
    return jsonify({
        "error": str(error),
        "type": error.__class__.__name__
    }), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    print("Health check requested")
    try:
        # Test database connection
        db.get()
        print("Health check successful")
        return jsonify({
            "status": "healthy",
            "database": "connected"
        }), 200
    except Exception as e:
        print(f"Health check failed: {str(e)}")
        return jsonify({
            "status": "unhealthy",
            "database": "disconnected",
            "error": str(e)
        }), 500

@app.route('/predict', methods=['POST'])
def predict():
    print("Prediction requested")
    try:
        # Validate request
        if 'image' not in request.files:
            print("Error: No image provided in request")
            return jsonify({"error": "No image provided"}), 400
        
        if 'patient_history' not in request.form:
            print("Error: No patient history provided in request")
            return jsonify({"error": "No patient history provided"}), 400
        
        image = request.files['image']
        patient_hist = request.form['patient_history']
        
        print(f"Processing image: {image.filename}")
        
        # Validate image
        if not image.filename:
            print("Error: Empty image file")
            return jsonify({"error": "Empty image file"}), 400
        
        if not image.filename.lower().endswith(('.png', '.jpg', '.jpeg')):
            print(f"Error: Invalid image format: {image.filename}")
            return jsonify({"error": "Invalid image format. Must be PNG or JPEG"}), 400
        
        # Save image temporarily
        temp_path = "temp_image.jpg"
        try:
            print("Saving temporary image file...")
            image.save(temp_path)
            
            # Verify image can be opened
            from PIL import Image
            Image.open(temp_path).verify()
            print("Image verified successfully")
            
            print("Querying database...")
            results = query_db_with_image_and_text(temp_path, multimodal_ef, db)
            
            if not results:
                print("No similar images found in database")
                return jsonify({"error": "No similar images found in database"}), 404
            
            print("Combining text...")
            combined_output = combine_text(results, patient_hist)
            
            print("Querying OpenAI...")
            response = query_openai_with_image_and_text(
                text_prompt=combined_output,
                image_source=temp_path,
                api_key=api_key,
                model="gpt-4o",
                max_tokens=1000,
                temperature=0.4
            )
            
            print("Processing completed successfully")
            return jsonify({
                "response": response,
                "similar_diagnoses": [r.metadata.get("diagnosis") for r in results]
            }), 200
            
        except Exception as e:
            print(f"Error processing image: {str(e)}")
            print("Full traceback:")
            print(traceback.format_exc())
            raise Exception(f"Error processing image: {str(e)}")
        
        finally:
            # Clean up temporary file
            if os.path.exists(temp_path):
                print("Cleaning up temporary file...")
                os.remove(temp_path)
                
    except Exception as e:
        print(f"Prediction failed: {str(e)}")
        print("Full traceback:")
        print(traceback.format_exc())
        raise Exception(f"Prediction failed: {str(e)}")

if __name__ == '__main__':
    print("\nStarting Flask server...")
    print("Access the API at http://localhost:5000")
    print("Available endpoints:")
    print("  - GET  /health  - Check server health")
    print("  - POST /predict - Make a prediction")
    print("\nPress Ctrl+C to stop the server")
    app.run(debug=True, port=5000)
else:
    print("Warning: App is being imported, not run directly")