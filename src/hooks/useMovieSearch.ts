import { useState, useCallback, useEffect } from 'react';
import { omdbApi } from '../services/omdbApi';
import { useDebounce } from './useDebounce';
import type { Movie, SearchFilters } from '../types';

const RESULTS_PER_PAGE = 10;

export const useMovieSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    type: 'all',
    year: '',
  });
  const [movies, setMovies] = useState<Movie[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debounce de la recherche
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Fonction de recherche
  const performSearch = useCallback(async (
    query: string,
    page: number,
    currentFilters: SearchFilters
  ) => {
    if (!query.trim()) {
      setMovies([]);
      setTotalResults(0);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await omdbApi.searchMovies(
        query,
        page,
        currentFilters.type,
        currentFilters.year
      );

      setMovies(response.Search);
      setTotalResults(parseInt(response.totalResults));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(message);
      setMovies([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  }, []);

  // Recherche automatique quand la query debounced change
  useEffect(() => {
    if (debouncedSearchQuery) {
      setCurrentPage(1);
      performSearch(debouncedSearchQuery, 1, filters);
    } else {
      setMovies([]);
      setTotalResults(0);
      setError(null);
    }
  }, [debouncedSearchQuery, filters, performSearch]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    performSearch(debouncedSearchQuery, page, filters);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [debouncedSearchQuery, filters, performSearch]);

  const handleFilterChange = useCallback((newFilters: SearchFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  }, []);

  const handleReset = useCallback(() => {
    setSearchQuery('');
    setFilters({ type: 'all', year: '' });
    setMovies([]);
    setTotalResults(0);
    setCurrentPage(1);
    setError(null);
  }, []);

  return {
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
    resultsPerPage: RESULTS_PER_PAGE,
  };
};