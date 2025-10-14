export const timeAgo = (timestamp: number): string => {
  const now = new Date();
  const past = new Date(timestamp);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return `unos segundos`;
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minuto${diffInMinutes > 1 ? 's' : ''}`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
  }

  const diffInDays = Math.floor(diffInHours / 24);

  // Duraciones de más de un año (ej: "1 año y 2 meses")
  if (diffInDays >= 365) {
    const years = Math.floor(diffInDays / 365);
    const remainingDays = diffInDays % 365;
    const months = Math.floor(remainingDays / 30.44); // Promedio de días en un mes
    
    const parts = [];
    if (years > 0) {
      parts.push(`${years} año${years > 1 ? 's' : ''}`);
    }
    if (months > 0) {
      parts.push(`${months} mes${months > 1 ? 'es' : ''}`);
    }
    return parts.join(' y ');
  }

  // Duraciones de más de un mes (ej: "2 meses y 15 días")
  if (diffInDays >= 30) {
    const months = Math.floor(diffInDays / 30.44);
    const days = Math.floor(diffInDays % 30.44);

    const parts = [];
    if (months > 0) {
      parts.push(`${months} mes${months > 1 ? 'es' : ''}`);
    }
    if (days > 0) {
      parts.push(`${days} día${days > 1 ? 's' : ''}`);
    }
    return parts.join(' y ');
  }

  // Duraciones de más de una semana (ej: "2 semanas y 3 días")
  if (diffInDays >= 7) {
      const weeks = Math.floor(diffInDays / 7);
      const days = diffInDays % 7;
      const parts = [];
      if (weeks > 0) {
          parts.push(`${weeks} semana${weeks > 1 ? 's' : ''}`);
      }
      if (days > 0) {
          parts.push(`${days} día${days > 1 ? 's' : ''}`);
      }
      return parts.join(' y ');
  }

  // Duraciones en días
  return `${diffInDays} día${diffInDays > 1 ? 's' : ''}`;
};