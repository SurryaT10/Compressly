from sklearn.cluster import KMeans
import numpy as np
from skimage.metrics import structural_similarity as ssim
from PIL import Image
import io

class Model:
    def __init__(self, clusters: int) -> None:
        self.kmeans = KMeans(n_clusters=clusters, max_iter=1000)
        
    def generateCompressedImage(self, image):
        input_image = image.reshape(image.shape[0] * image.shape[1], 3)
        
        self.kmeans.fit(input_image)
        
        mean_colors = self.kmeans.cluster_centers_
        l = self.kmeans.labels_
        new_image = np.array([mean_colors[l[i]] for i in range(input_image.shape[0])])
        new_image = np.round(new_image).astype(np.uint8)
        
        new_image = new_image.reshape(image.shape[0],image.shape[1],3)
        
        return new_image, mean_colors
    
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
