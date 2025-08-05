import { createContext, useContext, useEffect } from "react";

const ImageUploaderContext = createContext();

export const ImageUploader = ({ children }) => {
    const uploadToCloudinary = async (file: File) => {
        const url = `https://api.cloudinary.com/v1_1/dkxv4i4dx/upload`;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'Tickets');

        const response = await fetch(url, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) throw new Error('Cloudinary upload failed');
        const data = await response.json();
        return data.secure_url; // <- This is the public URL
    };

    return (
        <ImageUploaderContext.Provider value={{ uploadToCloudinary }}>
            {children}
        </ImageUploaderContext.Provider>
    );
};

export const useImageUploader = () => useContext(ImageUploaderContext);