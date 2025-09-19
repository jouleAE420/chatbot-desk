import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useWindowSize from '../../utils/useWindowSize'; // Import the hook
import './BackButton.css'; 

const BackButton: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { width } = useWindowSize(); // Use the hook

  const handleGoBack = () => {
    if (location.state && location.state.from) {
      navigate(location.state.from);
    } else {
      navigate(-1);
    }
  };

  const isMobile = width && width < 768; // Define mobile breakpoint

  return (
    <button onClick={handleGoBack} className="back-button">
      &larr; {isMobile ? null : 'Volver'}
    </button>
  );
};

export default BackButton;
