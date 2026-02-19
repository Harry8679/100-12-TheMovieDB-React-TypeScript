import { useState } from 'react';
import { useMovieSearch } from '../hooks/useMovieSearch';
import { useFavorites } from '../hooks/useFavorites';
import { SearchBar } from './SearchBar';
import { FilterBar } from './FilterBar';
import { MovieGrid } from './MovieGrid';
import { MovieModal } from './MovieModal';
import { MovieSkeleton } from './MovieSkeleton';
import { Pagination } from './Pagination';
import { FavoritesList } from './FavoritesList';
import { ErrorMessage } from './ErrorMessage';

export const MovieSearch = () => {
  const {
    searchQuery,
    setSearchQuery,
    filters,
    handleFilterChange,
    handleReset,
    movies,
    totalResults,
    currentPage,
    handlePageChange,
    loading,
    error,
    resultsPerPage,
  } = useMovieSearch();

  const {
    favorites,
    toggleFavorite,
    isFavorite,
    clearFavorites,
  } = useFavorites();

  const [selectedMovieId, setSelectedMovieId] = useState<string | null>(null);

  const handleSelectMovie = (id: string) => {
    setSelectedMovieId(id);
  };

  const handleCloseModal = () => {
    setSelectedMovieId(null);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 dark:text-white mb-4">
            🎬 Recherche de Films
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-2">
            Projet 12/100 • Debouncing & Search
          </p>
          <p className="text-gray-500 dark:text-gray-500 text-sm">
            Recherche optimisée avec debounce de 500ms
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onSearch={() => {}}
            isLoading={loading}
          />
        </div>

        {/* Filters */}
        {searchQuery && (
          <div className="mb-8">
            <FilterBar
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={handleReset}
            />
          </div>
        )}

        {/* Results info */}
        {searchQuery && !loading && movies.length > 0 && (
          <div className="mb-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              <span className="font-bold">{totalResults}</span> résultat{totalResults > 1 ? 's' : ''} pour{' '}
              <span className="font-bold">"{searchQuery}"</span>
            </p>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <MovieSkeleton />
        ) : error ? (
          <ErrorMessage message={error} />
        ) : movies.length > 0 ? (
          <>
            <MovieGrid
              movies={movies}
              onSelectMovie={handleSelectMovie}
              onToggleFavorite={toggleFavorite}
              favorites={favorites}
            />
            <Pagination
              currentPage={currentPage}
              totalResults={totalResults}
              resultsPerPage={resultsPerPage}
              onPageChange={handlePageChange}
            />
          </>
        ) : searchQuery ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Aucun résultat
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Essayez une autre recherche
            </p>
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎥</div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Recherchez vos films préférés
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Entrez le titre d'un film ou d'une série
            </p>
          </div>
        )}

        {/* Favorites */}
        {favorites.length > 0 && (
          <div className="mt-12">
            <FavoritesList
              favorites={favorites}
              onSelectMovie={handleSelectMovie}
              onRemoveFavorite={(id) => {
                const movie = favorites.find(f => f.imdbID === id);
                if (movie) toggleFavorite(movie);
              }}
              onClearAll={clearFavorites}
            />
          </div>
        )}

        {/* Modal */}
        {selectedMovieId && (
          <MovieModal
            movieId={selectedMovieId}
            isOpen={!!selectedMovieId}
            onClose={handleCloseModal}
            onToggleFavorite={toggleFavorite}
            isFavorite={isFavorite(selectedMovieId)}
          />
        )}
      </div>
    </div>
  );
};