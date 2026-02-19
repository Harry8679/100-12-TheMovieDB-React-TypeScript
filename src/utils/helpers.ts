export const formatYear = (year: string): string => {
  // Gérer les formats comme "2020-2023" ou "2020–"
  return year.split('–')[0].split('-')[0];
};

export const getYearOptions = (): string[] => {
  const currentYear = new Date().getFullYear();
  const years: string[] = [''];
  
  for (let year = currentYear; year >= 1900; year--) {
    years.push(year.toString());
  }
  
  return years;
};

export const getDefaultPoster = (): string => {
  return 'https://via.placeholder.com/300x450/1e293b/cbd5e1?text=No+Poster';
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

export const formatRuntime = (runtime: string): string => {
  const minutes = parseInt(runtime);
  if (isNaN(minutes)) return runtime;
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) return `${mins}min`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}min`;
};

export const getRatingColor = (rating: string): string => {
  const num = parseFloat(rating);
  if (isNaN(num)) return 'text-gray-400';
  if (num >= 8) return 'text-green-400';
  if (num >= 6) return 'text-yellow-400';
  return 'text-red-400';
};

export const getTypeIcon = (type: string): string => {
  const icons: Record<string, string> = {
    movie: '🎬',
    series: '📺',
    episode: '📹',
  };
  return icons[type] || '🎥';
};

export const getTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    movie: 'Film',
    series: 'Série',
    episode: 'Épisode',
  };
  return labels[type] || type;
};