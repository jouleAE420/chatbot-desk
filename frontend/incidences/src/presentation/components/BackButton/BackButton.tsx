import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useWindowSize from '../../utils/useWindowSize';
import './BackButton.css'; 

const BackButton: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { width } = useWindowSize(); 

  const handleGoBack = () => {
    if (location.state && location.state.from) {
      navigate(location.state.from);
    } else {
      navigate(-1);
    }
  };
//definicion de variable para saber si es movil o no
  const isMobile = width && width < 768; 

  return (
    <button onClick={handleGoBack} className="back-button">
      &larr; {isMobile ? null : 'Volver'}
    </button>
  );
};

export default BackButton;
