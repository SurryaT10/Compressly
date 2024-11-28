from fastapi import FastAPI, File, UploadFile
from fastapi import Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from PIL import Image
import numpy as np
import io
import base64
from Model import Model

app = FastAPI()


# Allow CORS for React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return "Welcome to Compressly"

@app.post("/upload")
@app.post("/upload/")
async def uploadImage(file: UploadFile = File(...), colors: int = Form(16)):
    try:
        # Read uploaded file
        image_data = await file.read()
        # Convert image bytes to a PIL Image
        original_image = Image.open(io.BytesIO(image_data))
        
        model = Model(colors)
        compressed_image, centroids = model.generateCompressedImage(np.array(original_image))
        
        # Convert NumPy array to a PIL Image
        new_image = Image.fromarray(compressed_image)

        # Convert to indexed color palette
        new_image = new_image.convert("P", palette=Image.ADAPTIVE, colors=16)

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
    except Exception as e:
        return {"error": str(e)}