import { useState, useRef } from 'react';
import Comparison from './Comparison';
import Modal from './Modal';
import { FaRegImage } from "react-icons/fa6";
import '../css/main.css';

function Main() {
    const [image, setImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [compressedImage, setCompressedImage] = useState(null);
    const [metrics, setMetrics] = useState(null);
    const [modal, showModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [colorCountIndex, setColorCountIndex] = useState(3);

    const bottomRef = useRef(null); // Ref for scrolling
    const allowedValues = [2, 4, 8, 16, 32, 64, 128, 256];

    const handleFileChange = async (event) => {
        const file = event.target.files[0];

        setImage(file);

        const previewUrl = URL.createObjectURL(file);
        setPreviewImage(previewUrl);
        setCompressedImage(null);
        setMetrics(null);

        // Scroll to the bottom
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);

        await getCompressedImage(file, allowedValues[colorCountIndex]);
    };

    const getCompressedImage = async (file, colors) => {
        setLoading(true);
        await getImage(file, colors);
        setLoading(false);
    }

    const getImage = async(file, colors) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("colors", colors);

        try {
            const response = await fetch("http://127.0.0.1:8000/upload", {
                method: "POST",
                body: formData,
            });
            const data = await response.json();
            if (data.compressed_image) {
                const base64String = data.compressed_image.split(",")[1]; // Remove "data:image/png;base64,"
                const sizeInBytes = (base64String.length * 3) / 4 - (base64String.endsWith("==") ? 2 : base64String.endsWith("=") ? 1 : 0);
                const compressed_size = sizeInBytes / 1024;
                const original_size = file.size / 1024;
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
    }

    return (
        <div  onClick={() => showModal(false)} className="main">
            <h1 style={{marginTop:"1em"}}>Image Compresser</h1>
            <div className="container">
                <input type="file" id="file-input" onChange={handleFileChange} />
                <label 
                    id="file-input-label" 
                    htmlFor="file-input"
                    style={{ opacity: loading ? 0.5 : 1, pointerEvents: loading ? "none" : "auto" }}
                ><FaRegImage style={{marginRight:"2px"}} />Select Image</label>
            </div>

            <div className="slider-container">
                <label htmlFor="color-slider">Number of Colors: {allowedValues[colorCountIndex]}</label>
                <input 
                    id="color-slider" 
                    type="range" 
                    min="0" 
                    max={allowedValues.length - 1} 
                    step="1" 
                    value={colorCountIndex} 
                    onChange={(e) => setColorCountIndex(parseInt(e.target.value, 10))}
                    onMouseUp={async () => { 
                        if (image) {
                            setCompressedImage(null);
                            await getImage(image, allowedValues[colorCountIndex]);
                        }
                    }}
                    onTouchEnd={async () => { 
                        if (image) {
                            setCompressedImage(null);
                            await getImage(image, allowedValues[colorCountIndex]);
                        }
                    }}
                    disabled={loading} 
                />
            </div>

            {
                previewImage ? (
                    <div ref={bottomRef} className="image-container">
                        <div className="preview-container">
                            <h3>Original Image</h3>
                            <img className="preview-image" src={previewImage} alt="original-image" />
                        </div>

                        <div className="preview-container">
                            { compressedImage ? <h3>Compressed Image</h3> : null }
                            {
                                compressedImage ? (
                                    <img className="preview-image" src={compressedImage} alt="original-image" />
                                ) : <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                                        <div className="loader"></div>
                                        <p>Compressing...</p>
                                    </div>
                            }
                        </div>
                    </div>
                ) : null
            }

            {
                previewImage ? (
                    <input className="button" type="button" 
                        onClick={(event) => {
                            event.stopPropagation(); // Prevent event from bubbling to parent
                            showModal(true)
                        }
                    } value="Compare" />
                ) : null
            }

            { modal && metrics ? 
                <Modal>
                    <Comparison metrics={metrics} />
                </Modal> : null
            }
        </div>
    );
}

export default Main;
