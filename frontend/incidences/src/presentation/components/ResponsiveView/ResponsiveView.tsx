import React from 'react';
import { useWindowSize } from '../../hooks/useWindowSize';

type Breakpoint = 'mobile' | 'desktop';

interface Props {
  children: React.ReactNode;
  showOn?: Breakpoint;
  hideOn?: Breakpoint;
}

const BREAKPOINT = 768; // Pixels

export const ResponsiveView: React.FC<Props> = ({ children, showOn, hideOn }) => {
  const { width } = useWindowSize();

  if (!width) {
    // During server-side rendering or initial mount, width might be undefined.
    // You can return null or a loader.
    return null;
  }

  const isMobile = width < BREAKPOINT;
  const isDesktop = width >= BREAKPOINT;

  let shouldRender = true;

  if (showOn) {
    if (showOn === 'mobile' && !isMobile) {
      shouldRender = false;
    }
    if (showOn === 'desktop' && !isDesktop) {
      shouldRender = false;
    }
  }

  if (hideOn) {
    if (hideOn === 'mobile' && isMobile) {
      shouldRender = false;
    }
    if (hideOn === 'desktop' && isDesktop) {
      shouldRender = false;
    }
  }

  return shouldRender ? <>{children}</> : null;
};
