import React, { useRef, useState } from "react";
import '../../styles/utils/StylishImageUploader.css';
import {useImageUploader} from "./ImageUploader";

export default function StylishImageUploader({setFormData}) {
    const fileInputRef = useRef(null);
    const [preview, setPreview] = useState(null);

    const { uploadToCloudinary } = useImageUploader();

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
            try {
                const imageUrl = await uploadToCloudinary(file);
                console.log('Image uploaded:', imageUrl);

                // ➕ Now save `imageUrl` to Supabase (example)
                setFormData(prev => ({...prev, image_url: imageUrl}));

            } catch (err) {
                console.error(err);
            }
        }
    };

    return (
        <div className="image-uploader-container">
            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="file-input-hidden"
                onChange={handleFileChange}
            />
            <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="upload-button"
            >
                Apasă aici
            </button>

            {preview && (
                <img
                    src={preview}
                    alt="preview"
                    className="preview-image"
                />
            )}
        </div>
    );
}