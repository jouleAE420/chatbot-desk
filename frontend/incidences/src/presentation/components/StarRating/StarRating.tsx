import React from 'react';
import './StarRating.css';

// Define las props que el componente espera recibir
interface StarRatingProps {
  rating: number | null | undefined;
}

const StarRating: React.FC<StarRatingProps> = ({ rating }) => {
  const numericRating = rating || 0;

  return (
    <div className="star-rating">
      {[...Array(5)].map((_, index) => {
        const starClass = index < numericRating ? 'star-filled' : 'star-empty';
        return <span key={index} className={`star ${starClass}`}>★</span>;
      })}
    </div>
  );
};

export default StarRating;