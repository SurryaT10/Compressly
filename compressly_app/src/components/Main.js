import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import Comparison from "./Comparison";
import About from "./About";
import Modal from "./Modal";
import "../css/main.css";
import { FaRegImage } from "react-icons/fa6";

function Main({ showAboutModal, onCloseModal }) {
    const [image, setImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [compressedImage, setCompressedImage] = useState(null);
    const [metrics, setMetrics] = useState(null);
    const [aboutModal, setAboutModal] = useState(false);
    const [modal, showModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [colorCountIndex, setColorCountIndex] = useState(2);
    const [centroids, setCentroids] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    const bottomRef = useRef(null); // Ref for scrolling
    const allowedValues = [2, 4, 8, 16, 32, 64, 128, 256];
    const MAX_FILE_SIZE_MB = 2;

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];

        if (!file) {
            setErrorMessage('Error uploading file.');
            
            return;
        }

        // Check file size
        if (file.size / 1024 / 1024 > MAX_FILE_SIZE_MB) {
            setErrorMessage(`File is too large. Please upload an image smaller than ${MAX_FILE_SIZE_MB}MB.`);
            
            return;
        }

        setImage(file);

        const previewUrl = URL.createObjectURL(file);
        setPreviewImage(previewUrl);
        setCompressedImage(null);
        setMetrics(null);
        setErrorMessage(null);

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
            const response = await fetch(`${process.env.REACT_APP_API_URL}/upload`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData);
                return;
            }

            const data = await response.json();
            if (data.compressed_image) {
                const base64String = data.compressed_image.split(",")[1]; // Remove "data:image/png;base64,"
                const sizeInBytes = (base64String.length * 3) / 4 - (base64String.endsWith("==") ? 2 : base64String.endsWith("=") ? 1 : 0);
                const compressed_size = sizeInBytes / 1024;
                const original_size = file.size / 1024;
                const size_reduction = (original_size - compressed_size) / original_size * 100;

                setCompressedImage(data.compressed_image);
                setErrorMessage(null);

                console.log(data);
                data.metrics = {
                    ...data.metrics,
                    "original_size": original_size.toFixed(2),
                    "compressed_size": compressed_size.toFixed(2),
                    "size_reduction": size_reduction,
                }
                setMetrics(data.metrics);
                setCentroids(data.centroids);
            }
        } catch (error) {
            setError(error);
        }
    }

    const setError = (errorData) => {
        setErrorMessage(errorData.error || "An unknown error occurred");
        setImage(null);
        setPreviewImage(null);
        setCompressedImage(null);
        setLoading(false);
    }

    const downloadCompressedImage = () => {
        if (!compressedImage) return;
        const a = document.createElement("a");
        a.href = compressedImage;
        a.download = "compressed_image.png";
        a.click();
    };

    return (
        <div onClick={() => {
                showModal(false);
                onCloseModal();
            }}
            className="compressly"
        >
            {/* Header Section */}
            <motion.div
                className="header"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <h1>Compressly</h1>
                <button className="about-btn" onClick={() => setAboutModal(true)}>
                    About
                </button>
            </motion.div>

            {/* Upload Section */}
            <motion.div
                className="upload-section"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            >
                <div className="upload-zone">
                    <FaRegImage size={50} />
                    <p>Drag and drop your image here, or click to upload.</p>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                    />
                </div>
            </motion.div>

            {errorMessage && (
                <motion.div
                    className="error-message"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    {errorMessage}
                </motion.div>
            )}

            {/* Display Images */}
            {previewImage && (
                <motion.div
                    className="image-section"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <div className="image-container">
                        <h3>Original Image</h3>
                        <motion.img
                            src={previewImage}
                            alt="Original"
                            whileHover={{ scale: 1.05 }}
                        />
                    </div>

                    <div className="image-container">
                        <h3>Compressed Image</h3>
                        {loading ? (
                            <div className="loader"></div>
                        ) : (
                            <motion.img
                                src={compressedImage}
                                alt="Compressed"
                                whileHover={{ scale: 1.05 }}
                            />
                        )}
                    </div>
                </motion.div>
            )}

            {/* Buttons */}
            {compressedImage && (
                <motion.div
                    className="button-section"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <button onClick={(event) => {
                        event.stopPropagation()
                        showModal(true)}
                        } 
                        className="compare-btn">
                        Compare
                    </button>
                    <button className="download-btn" onClick={downloadCompressedImage}>
                        Download
                    </button>

                    { modal && metrics ? 
                        <Modal>
                            <Comparison centroids={centroids} metrics={metrics} />
                        </Modal> : null
                    }
                </motion.div>
            )}

            {/* About Modal */}
            {aboutModal && (
                <Modal>
                    <About onClose={() => setAboutModal(false)} />
                </Modal>
            )}
        </div>
    );
}

export default Main;
