import { useState } from 'react';
import '../css/main.css';

function Main() {
    const [ previewImage, setPreviewImage ] = useState(null);

    const handlefilechange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setPreviewImage(previewUrl);
        }
    }

    return (
        <div className='container'>
            <form>
                <div className="image-container">
                    {
                        previewImage ? (
                            <img className='preview-image' src={previewImage} alt="Selected Preview" />
                        ) : <p>Upload an Image</p>
                    }
                </div>
                <input type="file" onChange={handlefilechange} />
                <input type="submit" />
            </form>
        </div>
    );
}

export default Main; 