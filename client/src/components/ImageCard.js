// src/components/ImageCard.js
import React from 'react';
import '../styles/imagecard.css';
import { url } from '../components/Base_url';

const ImageCard = ({ image, onClick }) => {
    return (
        <div className="image-card" onClick={() => onClick(image)}>
            <img src={url +`/assets/${image.image}`} alt={image.name} />
        </div>
    );
};

export default ImageCard;
