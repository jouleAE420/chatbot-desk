import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './BackButton.css'; 

const BackButton: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleGoBack = () => {
 
    if (location.state && location.state.from) {
      navigate(location.state.from);
    } else {
      navigate(-1);
    }
  };

  return (
    <button onClick={handleGoBack} className="back-button">
      &larr; Volver
    </button>
  );
};

export default BackButton;