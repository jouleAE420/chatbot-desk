import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { GenericBackButton } from '../GenericBackButton'; // Importar el nuevo componente
//aqui declaramos el componente funcional de react
const BackButton: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
//funcion para regresar a la pagina anterior o a una especifica
  const handleGoBack = () => {
    if (location.state && location.state.from) {
      navigate(location.state.from);
    } else {
      navigate(-1);
    }
  };
//returna el boton generico con las props necesarias
  return (
    <GenericBackButton onClick={handleGoBack} text="Volver" />
  );
};

export default BackButton;
