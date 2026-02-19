import { getDefaultPoster, truncateText } from '../utils/helpers';
import type { FavoritesListProps } from '../types';

export const FavoritesList = ({
  favorites,
  onSelectMovie,
  onRemoveFavorite,
  onClearAll,
}: FavoritesListProps) => {
  if (favorites.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
        <div className="text-6xl mb-4">❤️</div>
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
          Aucun favori
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Ajoutez des films à vos favoris pour les retrouver ici
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
          ❤️ Mes Favoris ({favorites.length})
        </h3>
        <button
          onClick={onClearAll}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors text-sm"
        >
          Tout effacer
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {favorites.map((movie) => {
          const poster = movie.Poster !== 'N/A' ? movie.Poster : getDefaultPoster();

          return (
            <div
              key={movie.imdbID}
              className="group relative bg-gray-50 dark:bg-gray-700 rounded-xl overflow-hidden shadow hover:shadow-xl transition-all"
            >
              <div
                className="cursor-pointer"
                onClick={() => onSelectMovie(movie.imdbID)}
              >
                <img
                  src={poster}
                  alt={movie.Title}
                  className="w-full h-64 object-cover"
                />
                <div className="p-3">
                  <h4 className="font-semibold text-gray-800 dark:text-white text-sm line-clamp-1">
                    {truncateText(movie.Title, 25)}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {movie.Year}
                  </p>
                </div>
              </div>

              {/* Remove button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveFavorite(movie.imdbID);
                }}
                className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};