import React from "react";
import "../css/slider.css";

function Slider({ image, allowedValues, setCompressedImage, colorCountIndex, setColorCountIndex, getImage, loading }) {

    return (
        <div className="slider-container">
                <label htmlFor="color-slider"><span style={{"color":"white"}}>Number of Colors: </span>{allowedValues[colorCountIndex]}</label>
                <div className="custom-slider">
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
            </div>
    );
}

export default Slider;