import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { GenericBackButton } from '../GenericBackButton'; // Importar el nuevo componente

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
    <GenericBackButton onClick={handleGoBack} text="Volver" />
  );
};

export default BackButton;
