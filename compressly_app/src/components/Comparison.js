import ClusterGraph from './ClusterGraph';

function Comparison(props) {
    return (
        <div className="comparison-table">
          {props.centroids && <ClusterGraph centroids={props.centroids} />}
            <h2>Comparison Metrics</h2>
          <table border="1" style={{ borderCollapse: "collapse", width: "100%" }}>
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
                    ((props.metrics.unique_colors_original - props.metrics.unique_colors_compressed) /
                      props.metrics.unique_colors_original) * 100
                  ).toFixed(2)}
                  %
                </td>
              </tr>
              <tr>
                <td>Structural Similarity</td>
                <td colSpan="2">{props.metrics.ssim.toFixed(4)}</td>
                <td>N/A</td>
              </tr>
            </tbody>
          </table>
        </div>
    );
}

export default Comparison