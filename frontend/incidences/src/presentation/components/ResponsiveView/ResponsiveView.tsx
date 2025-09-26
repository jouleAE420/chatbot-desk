import React from 'react';
import { useWindowSize } from '../../hooks/useWindowSize';
type Breakpoint = 'mobile' | 'desktop';
// Define las props que el componente espera recibir
interface Props {
  children: React.ReactNode;
  showOn?: Breakpoint;
  hideOn?: Breakpoint;
}

//aqui definimos el punto de quiebre entre movil y escritorio
const BREAKPOINT = 768; 

export const ResponsiveView: React.FC<Props> = ({ children, showOn, hideOn }) => {
  const { width } = useWindowSize();
//si no tenemos el ancho de la ventana, no renderizamos nada
  if (!width) {
  //retornamos null si no tenemos el ancho de la ventana
    return null;
  }
//definimos si es movil o escritorio
  const isMobile = width < BREAKPOINT;
  //definimos si es escritorio
  const isDesktop = width >= BREAKPOINT;
//decidimos si renderizar o no el contenido basado en las props showOn y hideOn
  let shouldRender = true;
//si showOn esta definido, verificamos si coincide con el tamaño actual
  if (showOn) {
    //si showOn es movil y no estamos en movil, no renderizamos
    if (showOn === 'mobile' && !isMobile) {
      shouldRender = false;
    }
    //si showOn es escritorio y no estamos en escritorio, no renderizamos
    if (showOn === 'desktop' && !isDesktop) {
      shouldRender = false;
    }
  }
//si hideOn esta definido, verificamos si coincide con el tamaño actual
  if (hideOn) {
  //si hideOn es movil y estamos en movil, no renderizamos
    if (hideOn === 'mobile' && isMobile) {
      shouldRender = false;
    }
  // si hideOn es escritorio y estamos en escritorio, no renderizamos
    if (hideOn === 'desktop' && isDesktop) {
      shouldRender = false;
    }
  }
//retornamos el contenido si debe renderizarse, sino null
  return shouldRender ? <>{children}</> : null;
};
