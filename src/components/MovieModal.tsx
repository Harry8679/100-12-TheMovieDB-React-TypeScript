import { useState, useEffect } from 'react';
import { omdbApi } from '../services/omdbApi';
import { getDefaultPoster, formatRuntime, getRatingColor } from '../utils/helpers';
import type { MovieModalProps } from '../types';
import type { MovieDetails } from '../types';

export const MovieModal = ({
  movieId,
  isOpen,
  onClose,
  onToggleFavorite,
  isFavorite,
}: MovieModalProps) => {
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !movieId) return;

    const fetchDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await omdbApi.getMovieDetails(movieId);
        setMovie(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erreur lors du chargement';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [movieId, isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const poster = movie?.Poster !== 'N/A' ? movie?.Poster : getDefaultPoster();

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Chargement...</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg"
            >
              Fermer
            </button>
          </div>
        ) : movie ? (
          <>
            {/* Hero section */}
            <div className="relative h-96">
              <img
                src={poster}
                alt={movie.Title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-white dark:from-gray-800 via-transparent to-transparent" />
            </div>

            {/* Content */}
            <div className="p-8 -mt-32 relative">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Poster */}
                <div className="shrink-0">
                  <img
                    src={poster}
                    alt={movie.Title}
                    className="w-48 rounded-xl shadow-2xl"
                  />
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
                        {movie.Title}
                      </h2>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm font-semibold">
                          {movie.Year}
                        </span>
                        <span className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm font-semibold">
                          {movie.Rated}
                        </span>
                        <span className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm font-semibold">
                          {formatRuntime(movie.Runtime)}
                        </span>
                      </div>
                    </div>

                    {/* Favorite button */}
                    <button
                      onClick={() => onToggleFavorite(movie)}
                      className="p-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-full transition-colors"
                    >
                      {isFavorite ? (
                        <svg className="w-6 h-6 text-red-500 fill-current" viewBox="0 0 20 20">
                          <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                        </svg>
                      ) : (
                        <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      )}
                    </button>
                  </div>

                  {/* Ratings */}
                  <div className="flex flex-wrap gap-4 mb-6">
                    {movie.imdbRating !== 'N/A' && (
                      <div className="flex items-center gap-2">
                        <span className="text-yellow-500">⭐</span>
                        <span className={`text-2xl font-bold ${getRatingColor(movie.imdbRating)}`}>
                          {movie.imdbRating}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          / 10
                        </span>
                      </div>
                    )}
                    {movie.Metascore !== 'N/A' && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Metascore:
                        </span>
                        <span className="text-xl font-bold text-green-500">
                          {movie.Metascore}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Genre */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {movie.Genre.split(', ').map((genre) => (
                        <span
                          key={genre}
                          className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Plot */}
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                    {movie.Plot}
                  </p>

                  {/* Details grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {movie.Director !== 'N/A' && (
                      <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Réalisateur:</span>
                        <p className="font-semibold text-gray-800 dark:text-white">{movie.Director}</p>
                      </div>
                    )}
                    {movie.Actors !== 'N/A' && (
                      <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Acteurs:</span>
                        <p className="font-semibold text-gray-800 dark:text-white">{movie.Actors}</p>
                      </div>
                    )}
                    {movie.Writer !== 'N/A' && (
                      <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Scénariste:</span>
                        <p className="font-semibold text-gray-800 dark:text-white">{movie.Writer}</p>
                      </div>
                    )}
                    {movie.Language !== 'N/A' && (
                      <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Langue:</span>
                        <p className="font-semibold text-gray-800 dark:text-white">{movie.Language}</p>
                      </div>
                    )}
                    {movie.Country !== 'N/A' && (
                      <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Pays:</span>
                        <p className="font-semibold text-gray-800 dark:text-white">{movie.Country}</p>
                      </div>
                    )}
                    {movie.Awards !== 'N/A' && (
                      <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Prix:</span>
                        <p className="font-semibold text-gray-800 dark:text-white">{movie.Awards}</p>
                      </div>
                    )}
                    {movie.BoxOffice && movie.BoxOffice !== 'N/A' && (
                      <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Box Office:</span>
                        <p className="font-semibold text-gray-800 dark:text-white">{movie.BoxOffice}</p>
                      </div>
                    )}
                  </div>

                  {/* Additional ratings */}
                  {movie.Ratings.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-3">Autres notes:</h3>
                      <div className="flex flex-wrap gap-4">
                        {movie.Ratings.map((rating) => (
                          <div
                            key={rating.Source}
                            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg"
                          >
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                              {rating.Source}
                            </div>
                            <div className="font-bold text-gray-800 dark:text-white">
                              {rating.Value}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};