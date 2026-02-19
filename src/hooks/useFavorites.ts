import { useState, useCallback, useEffect } from 'react';
import type { Movie } from '../types';

const STORAGE_KEY = 'movie-favorites';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Movie[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = useCallback((movie: Movie) => {
    setFavorites(prev => {
      if (prev.some(fav => fav.imdbID === movie.imdbID)) {
        return prev;
      }
      return [movie, ...prev];
    });
  }, []);

  const removeFavorite = useCallback((imdbID: string) => {
    setFavorites(prev => prev.filter(fav => fav.imdbID !== imdbID));
  }, []);

  const toggleFavorite = useCallback((movie: Movie) => {
    setFavorites(prev => {
      const exists = prev.some(fav => fav.imdbID === movie.imdbID);
      if (exists) {
        return prev.filter(fav => fav.imdbID !== movie.imdbID);
      }
      return [movie, ...prev];
    });
  }, []);

  const isFavorite = useCallback((imdbID: string) => {
    return favorites.some(fav => fav.imdbID === imdbID);
  }, [favorites]);

  const clearFavorites = useCallback(() => {
    setFavorites([]);
  }, []);

  return {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    clearFavorites,
  };
};