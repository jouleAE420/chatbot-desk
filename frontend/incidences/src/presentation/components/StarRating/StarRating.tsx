import React from 'react';
import './StarRating.css';

// Define las props que el componente espera recibir
interface StarRatingProps {
  rating: number;
}
//componente funcional de react
const StarRating: React.FC<StarRatingProps> = ({ rating }) => {
  //returna el JSX que define la estructura visual del componente
  return (
    <div className="star-rating">
      {[...Array(5)].map((_, index) => {
        const starClass = index < rating ? 'star-filled' : 'star-empty';
        return <span key={index} className={`star ${starClass}`}>★</span>;
      })}
    </div>
  );
};

export default StarRating;