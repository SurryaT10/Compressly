import React, { useEffect, useRef } from "react";
import { Chart as ChartJS, ScatterController, LinearScale, PointElement, Tooltip, Legend } from "chart.js";

// Register Chart.js components
ChartJS.register(ScatterController, LinearScale, PointElement, Tooltip, Legend);

function ClusterGraph({ centroids }) {
    const canvasRef = useRef(null);
    let chartInstance = useRef(null); // Store chart instance

    useEffect(() => {
        const ctx = canvasRef.current.getContext("2d");

        // Destroy existing chart instance to avoid canvas reuse
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        // Create a new chart instance
        chartInstance.current = new ChartJS(ctx, {
            type: "scatter",
            data: {
                datasets: centroids.map((centroid, index) => ({
                    label: `Cluster ${index + 1}`,
                    data: [{ x: centroid[0], y: centroid[1], r: 5 }], // RGB to 2D projection
                    backgroundColor: `rgb(${centroid[0]}, ${centroid[1]}, ${centroid[2]})`,
                })),
            },
            options: {
                scales: {
                    x: { type: "linear", position: "bottom", title: { display: true, text: "Red" } },
                    y: { type: "linear", title: { display: true, text: "Green" } },
                },
            },
        });

        // Cleanup function to destroy the chart on component unmount
        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [centroids]);

    return <canvas ref={canvasRef} />;
}

export default ClusterGraph;
