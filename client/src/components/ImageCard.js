// src/components/ImageCard.js
import React from 'react';
import '../styles/imagecard.css';

const url='http://localhost:5000' || 'https://photo-gallery-server-d6g0.onrender.com';

const ImageCard = ({ image, onClick }) => {
    return (
        <div className="image-card" onClick={() => onClick(image)}>
            <img src={url +`/assets/${image.image}`} alt={image.name} />
        </div>
    );
};

export default ImageCard;
