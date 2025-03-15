import base64
from openai import OpenAI
from PIL import Image
from io import BytesIO

def encode_image_file(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

def resize_image(image_path, max_width=1024, max_height=1024, output_format=None):
    image = Image.open(image_path)
    img_format = output_format or image.format or 'JPEG'
    
    if image.width > max_width or image.height > max_height:
        ratio = min(max_width / image.width, max_height / image.height)
        new_width = int(image.width * ratio)
        new_height = int(image.height * ratio)
        
        image = image.resize((new_width, new_height))
        
        byte_stream = BytesIO()
        image.save(byte_stream, format=img_format)
        byte_stream.seek(0)
        
        return byte_stream
    
    return None

def load_image_from_path(image_path, detail="auto", resize=True, max_width=1024, max_height=1024):
    if resize:
        resized_image = resize_image(image_path, max_width, max_height)
        
        if resized_image:
            base64_image = base64.b64encode(resized_image.getvalue()).decode('utf-8')
        else:
            base64_image = encode_image_file(image_path)
    else:
        base64_image = encode_image_file(image_path)
        
    return {
        "type": "image_url",
        "image_url": {
            "url": f"data:image/jpeg;base64,{base64_image}",
            "detail": detail
        }
    }

def query_openai_with_image_and_text(
    text_prompt, 
    image_source=None, 
    api_key=None, 
    model="gpt-4o", 
    max_tokens=1000,
    temperature=0.7):

    system_prompt = """
You are an AI dermatologist capable of analyzing images and textual descriptions of skin conditions. You will be provided with up to three diagnoses, a patient history, and potentially an image of the affected area. Your task is to generate a structured JSON response based on these inputs.

### Instructions:
- If a diagnosis appears multiple times, include it only once.
- Base your output strictly on the provided diagnoses, patient history, and image analysis.
- If an image is provided, incorporate visible clinical features into your response.
- Format your response as JSON with the following keys:
  1. **Diagnosis** – Name of the condition.
  2. **Risk factors** – List of contributing factors.
  3. **Clinical features** – List of symptoms or key characteristics.

### Response Format:
- Your response must be **JSON only** with **no extra text**.
- Do not provide explanations, disclaimers, or additional information outside the JSON structure.

**Example Output:**
```json
[
  {
    "Diagnosis": "Psoriasis",
    "Risk factors": [
      "Genetic predisposition",
      "Stress",
      "Autoimmune conditions",
      "Smoking"
    ],
    "Clinical features": [
      "Red patches with silvery scales",
      "Itching and burning sensation",
      "Cracked, dry skin that may bleed",
      "Thickened or ridged nails"
    ]
  },
  {
    "Diagnosis": "Eczema",
    "Risk factors": [
      "Family history of allergies",
      "Asthma",
      "Environmental triggers",
      "Skin barrier dysfunction"
    ],
    "Clinical features": [
      "Dry, sensitive skin",
      "Severe itching",
      "Red, inflamed patches",
      "Fluid-filled blisters that may ooze"
    ]
  }
]
"""
    client = OpenAI(api_key=api_key)
    
    content = [{"type": "text", "text": text_prompt}]
    
    if image_source:
        if isinstance(image_source, dict):
            content.append(image_source)
        else:
            content.append(load_image_from_path(image_source))
    
    messages = []
    
    if system_prompt:
        messages.append({"role": "system", "content": system_prompt})
    
    messages.append({"role": "user", "content": content})
    
    response = client.chat.completions.create(
        model=model,
        messages=messages,
        max_tokens=max_tokens,
        temperature=temperature
    )
    
    return response.choices[0].message.content