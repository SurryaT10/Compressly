from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from PIL import Image, UnidentifiedImageError
import io
import base64
from Model import Model

app = FastAPI()

# List of allowed origins
origins = [
    "https://compressly-frontend.onrender.com",  # Your frontend domain
    "http://localhost:3000"
]

# Allow CORS for React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return "Welcome to Compressly"

@app.post("/upload")
@app.post("/upload/")
async def uploadImage(file: UploadFile = File(...), colors: int = Form(8)):
    try:
        # Read uploaded file
        image_data = await file.read()
        
        try:
            # Convert image bytes to a PIL Image
            original_image = Image.open(io.BytesIO(image_data))
            print(f"Image format: {original_image.format}")
        except UnidentifiedImageError:
            return JSONResponse(
                {"error": "Uploaded file is not a valid image. Please upload a file in a supported format (e.g., PNG, JPG)."},
                status_code=400,
            )
        
        # Ensure image is in RGB mode
        # Convert all images to RGB (handle different modes)
        if original_image.mode not in ("RGB", "RGBA", "L"):
            raise HTTPException(status_code=400, detail="Unsupported image mode.")
        else:
            original_image = original_image.convert("RGB")
        
        model = Model(colors)
        compressed_image, centroids = model.generateCompressedImage(original_image)
                
        # Convert NumPy array to a PIL Image
        new_image = Image.fromarray(compressed_image)

        # Convert to indexed color palette
        new_image = new_image.convert("P", palette=Image.ADAPTIVE, colors=colors)

        # Optimize and save as PNG
        buffer = io.BytesIO()
        new_image.save(buffer, format="PNG", optimize=True)
        base64_image = base64.b64encode(buffer.getvalue()).decode("utf-8")

        # Calculate metrics
        metrics = model.calculate_metrics(original_image, compressed_image)

        # Return response
        return JSONResponse({
            "compressed_image": f"data:image/png;base64,{base64_image}",
            "metrics": metrics,
            "centroids": centroids.tolist()
        })
    except HTTPException as e:
        # Re-raise HTTP exceptions
        raise e
    except Exception as e:
        print(f"Error during uploadImage: {e}")
        return {"error": str(e)}