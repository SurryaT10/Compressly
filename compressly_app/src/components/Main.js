import { useState } from 'react';
import Comparison from './Comparison';
import Modal from './Modal';
import '../css/main.css';

function Main() {
    const [image, setImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [compressedImage, setCompressedImage] = useState(null);
    const [metrics, setMetrics] = useState(null);
    const [modal, showModal] = useState(false);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setImage(file);
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setPreviewImage(previewUrl);
            setCompressedImage(null);
            setMetrics(null);
        }
    };

    const handleContainerClick = () => {
        document.getElementById('file-input').click();
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!image) return ;

        const formData = new FormData();
        formData.append("file", image);

        try {
            const response = await fetch("http://127.0.0.1:8000/upload/", {
                method: "POST",
                body: formData,
            });
            const data = await response.json();
            if (data.compressed_image) {
                const base64String = data.compressed_image.split(",")[1]; // Remove "data:image/png;base64,"
                const sizeInBytes = (base64String.length * 3) / 4 - (base64String.endsWith("==") ? 2 : base64String.endsWith("=") ? 1 : 0);
                const compressed_size = sizeInBytes / 1024;
                const original_size = image.size / 1024;
                const size_reduction = (original_size - compressed_size) / original_size * 100;

                setCompressedImage(data.compressed_image);
                data.metrics = {
                    ...data.metrics,
                    "original_size": original_size.toFixed(2),
                    "compressed_size": compressed_size.toFixed(2),
                    "size_reduction": size_reduction,
                }
                setMetrics(data.metrics);
            }
        } catch (error) {
            console.error("Error uploading image:", error);
        }
    };

    return (
        <div onClick={() => showModal(false)} className='container'>
            <form>
                <div className={`image-container ${compressedImage ? 'compare-mode' : ''}`} onClick={handleContainerClick}>
                    {previewImage ? (
                        <img className={`preview-image ${compressedImage ? 'compare-image' : ''}`} 
                             src={previewImage} 
                             alt="Selected Preview" />
                        ) : <p>Upload an Image</p>
                    }
                    {compressedImage && (
                        <img id='compressed-img' className={`preview-image ${compressedImage ? 'compare-image move-right' : ''}`} 
                             src={compressedImage} 
                             alt="Comparison " />
                    )}
                </div>
                {/* Hidden File Input */}
                <input type="file" id="file-input" style={{ display: "none" }} onChange={handleFileChange} />
                <input className="button" type="submit" onClick={handleSubmit} value="Generate" />
                <input className="button" type="button" 
                    onClick={(event) => {
                        event.stopPropagation(); // Prevent event from bubbling to parent
                        showModal(true)
                    }
                } value="Compare" />
            </form>
            { modal && metrics ? 
                <Modal>
                    <Comparison metrics={metrics} />
                </Modal> : null
            }
        </div>
    );
}

export default Main;
