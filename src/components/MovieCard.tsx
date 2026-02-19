import { getDefaultPoster, getTypeIcon, truncateText } from '../utils/helpers';
import type { MovieCardProps } from '../types';

export const MovieCard = ({ movie, onSelect, onToggleFavorite, isFavorite }: MovieCardProps) => {
  const poster = movie.Poster !== 'N/A' ? movie.Poster : getDefaultPoster();

  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
      {/* Poster */}
      <div 
        className="relative cursor-pointer h-112.5 overflow-hidden"
        onClick={() => onSelect(movie.imdbID)}
      >
        <img
          src={poster}
          alt={movie.Title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <button className="w-full py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg font-semibold hover:bg-white/30 transition-colors">
            Voir détails
          </button>
        </div>

        {/* Type badge */}
        <div className="absolute top-3 left-3 px-3 py-1 bg-black/70 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
          {getTypeIcon(movie.Type)} {movie.Type}
        </div>

        {/* Favorite button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(movie);
          }}
          className="absolute top-3 right-3 p-2 bg-black/70 backdrop-blur-sm rounded-full hover:bg-black/90 transition-colors"
        >
          {isFavorite ? (
            <svg className="w-5 h-5 text-red-500 fill-current" viewBox="0 0 20 20">
              <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          )}
        </button>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-bold text-gray-800 dark:text-white mb-1 line-clamp-1" title={movie.Title}>
          {truncateText(movie.Title, 30)}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {movie.Year}
        </p>
      </div>
    </div>
  );
};