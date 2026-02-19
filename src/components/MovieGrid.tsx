import type { MovieGridProps } from '../types';
import { MovieCard } from './MovieCard';

export const MovieGrid = ({ movies, onSelectMovie, onToggleFavorite, favorites }: MovieGridProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
      {movies.map((movie) => (
        <MovieCard
          key={movie.imdbID}
          movie={movie}
          onSelect={onSelectMovie}
          onToggleFavorite={onToggleFavorite}
          isFavorite={favorites.some(fav => fav.imdbID === movie.imdbID)}
        />
      ))}
    </div>
  );
};