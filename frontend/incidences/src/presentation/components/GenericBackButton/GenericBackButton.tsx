import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IconArrowBack } from '@tabler/icons-react';
import { useWindowSize } from '../../hooks/useWindowSize'; // Asegúrate de que la ruta sea correcta
import '../BackButton/BackButton.css'; // Importar los estilos del botón de volver

interface GenericBackButtonProps {
  text?: string;
  to?: string | number;
  onClick?: () => void;
  className?: string;
}

const GenericBackButton: React.FC<GenericBackButtonProps> = ({
  text = 'Volver',
  to,
  onClick,
  className,
}) => {
  const navigate = useNavigate();
  const { width } = useWindowSize();
  const isMobile = width && width < 768;

  const handleGoBack = () => {
    if (onClick) {
      onClick();
    } else if (typeof to === 'number') {
      navigate(to);
    } else if (to) {
      navigate(to);
    } else {
      navigate(-1); // Comportamiento por defecto si no se especifica 'to' ni 'onClick'
    }
  };

  const buttonContent = (
    <>
      <IconArrowBack stroke={2} /> {isMobile ? null : text}
    </>
  );

  if (to && typeof to === 'string' && !onClick) {
    return (
      <Link to={to} className={`back-button ${className || ''}`}>
        {buttonContent}
      </Link>
    );
  }

  return (
    <button onClick={handleGoBack} className={`back-button ${className || ''}`}>
      {buttonContent}
    </button>
  );
};

export default GenericBackButton;
