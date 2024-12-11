from sklearn.cluster import MiniBatchKMeans
import numpy as np
from skimage.metrics import structural_similarity as ssim
from PIL import Image
import io

class Model:
    def __init__(self, clusters: int) -> None:
        self.kmeans = MiniBatchKMeans(n_clusters=clusters, batch_size=1000, max_iter=500)
        
    def generateCompressedImage(self, image):
        """
        Compress the image by reducing the color palette using KMeans clustering.
        """
        # Resize image for faster processing
        resized_image = image.resize((image.width // 4, image.height // 4))
        resized_array = np.array(resized_image)  # Convert resized image to NumPy array
        
        # Flatten the resized image into [pixel_count, 3]
        input_image = resized_array.reshape(-1, 3)
        
        # Normalize pixel values for better clustering
        input_image = input_image / 255.0

        # Fit KMeans to the pixel data
        self.kmeans.fit(input_image)
        
        # Replace pixels with their corresponding cluster center
        labels = self.kmeans.labels_
        mean_colors = self.kmeans.cluster_centers_
        compressed_pixels = mean_colors[labels]

        # Rescale pixels to 0-255 and reshape to image dimensions
        compressed_pixels = (compressed_pixels * 255).astype(np.uint8)
        compressed_image = compressed_pixels.reshape(resized_array.shape)

        # Upscale the compressed image back to original size
        compressed_image = Image.fromarray(compressed_image).resize((image.width, image.height), Image.NEAREST)

        return np.array(compressed_image), mean_colors
    
    def calculate_metrics(self, original_image, compressed_image):
        # Count unique colors
        unique_colors_original = len(np.unique(np.array(original_image).reshape(-1, 3), axis=0))
        unique_colors_compressed = len(np.unique(np.array(compressed_image).reshape(-1, 3), axis=0))

        # Structural Similarity Index
        original_gray = np.array(original_image.convert("L"))
        compressed_gray = np.array(Image.fromarray(compressed_image).convert("L"))
        similarity, _ = ssim(original_gray, compressed_gray, full=True)

        return {
            "unique_colors_original": unique_colors_original,
            "unique_colors_compressed": unique_colors_compressed,
            "ssim": similarity
        }
