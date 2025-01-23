import React from "react";
import { motion } from "framer-motion";
import "../css/about.css";

function About({ onClose }) {
    return (
        <div className="about-overlay" onClick={onClose}>
            <motion.div
                className="about-modal-content"
                onClick={(e) => e.stopPropagation()} // Prevent click on the modal from propagating to the overlay
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5 }}
            >
                <button className="close-btn" onClick={onClose}>
                    &times;
                </button>
                <h1>Compressly: Optimize Your Image Colors and Size</h1>
                <p>
                    Compressly is a tool designed to reduce the size of your images by compressing their color palettes
                    using the K-Means Clustering algorithm. This project focuses on optimizing images, reducing the
                    number of unique colors while maintaining visual quality, making it ideal for image compression and
                    storage.
                </p>
                <h3>Key Features:</h3>
                <ul>
                    <li>
                        <strong>Color Palette Reduction:</strong> Compress the image by clustering similar colors and
                        reducing the number of unique colors used.
                    </li>
                    <li>
                        <strong>Image Size Optimization:</strong> Shrinks the file size of images, making them
                        lightweight and efficient for web use.
                    </li>
                    <li>
                        <strong>Preserved Quality:</strong> Retains the visual essence of the image while reducing its
                        complexity.
                    </li>
                    <li>
                        <strong>Real-Time Processing:</strong> Accepts user-submitted images and dynamically applies
                        K-Means clustering to optimize colors.
                    </li>
                </ul>
                <h3>Why Use Compressly?</h3>
                <h4>Compressly is perfect for:</h4>
                <ul>
                    <li>Web Developers: Optimize images for faster loading times and reduced bandwidth.</li>
                    <li>Graphic Designers: Simplify color schemes for stylized, posterized effects.</li>
                    <li>Data Storage: Save storage space while preserving image integrity.</li>
                    <li>Compression Tools: Enhance existing PNG optimization workflows by reducing color complexity.</li>
                </ul>
            </motion.div>
        </div>
    );
}

export default About;
