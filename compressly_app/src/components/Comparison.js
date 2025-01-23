import React from "react";
import { motion } from "framer-motion";
import ClusterGraph from "./ClusterGraph";
import "../css/comparison.css";

function Comparison(props) {
    return (
        <motion.div
            className="comparison-container"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
        >
            {props.centroids && (
                <div className="graph-section">
                    <h3>Cluster Visualization</h3>
                    <ClusterGraph centroids={props.centroids} />
                </div>
            )}

            <div className="metrics-section">
                <h2>Comparison Metrics</h2>
                <motion.table
                    className="comparison-table"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                >
                    <thead>
                        <tr>
                            <th>Metric</th>
                            <th>Original Image</th>
                            <th>Compressed Image</th>
                            <th>Improvement (%)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>File Size (KiloBytes)</td>
                            <td>{props.metrics.original_size}KB</td>
                            <td>{props.metrics.compressed_size}KB</td>
                            <td>{props.metrics.size_reduction.toFixed(2)}%</td>
                        </tr>
                        <tr>
                            <td>Unique Colors</td>
                            <td>{props.metrics.unique_colors_original}</td>
                            <td>{props.metrics.unique_colors_compressed}</td>
                            <td>
                                {(
                                    ((props.metrics.unique_colors_original -
                                        props.metrics.unique_colors_compressed) /
                                        props.metrics.unique_colors_original) *
                                    100
                                ).toFixed(2)}
                                %
                            </td>
                        </tr>
                        <tr>
                            <td>Structural Similarity (SSIM)</td>
                            <td colSpan="2">{props.metrics.ssim.toFixed(4)}</td>
                            <td>N/A</td>
                        </tr>
                    </tbody>
                </motion.table>
            </div>
        </motion.div>
    );
}

export default Comparison;
