// Types pour la recherche de films

export interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Type: 'movie' | 'series' | 'episode';
  Poster: string;
}

export interface MovieDetails extends Movie {
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Ratings: Array<{
    Source: string;
    Value: string;
  }>;
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  BoxOffice?: string;
  Production?: string;
  Website?: string;
}

export interface SearchResponse {
  Search: Movie[];
  totalResults: string;
  Response: string;
  Error?: string;
}

export type MovieType = 'all' | 'movie' | 'series' | 'episode';

export interface SearchFilters {
  type: MovieType;
  year: string;
}

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  isLoading: boolean;
  placeholder?: string;
}

export interface FilterBarProps {
  filters: SearchFilters;
  onFilterChange: (filters: SearchFilters) => void;
  onReset: () => void;
}

export interface MovieCardProps {
  movie: Movie;
  onSelect: (id: string) => void;
  onToggleFavorite: (movie: Movie) => void;
  isFavorite: boolean;
}

export interface MovieGridProps {
  movies: Movie[];
  onSelectMovie: (id: string) => void;
  onToggleFavorite: (movie: Movie) => void;
  favorites: Movie[];
}

export interface MovieModalProps {
  movieId: string;
  isOpen: boolean;
  onClose: () => void;
  onToggleFavorite: (movie: Movie) => void;
  isFavorite: boolean;
}

export interface PaginationProps {
  currentPage: number;
  totalResults: number;
  resultsPerPage: number;
  onPageChange: (page: number) => void;
}

export interface FavoritesListProps {
  favorites: Movie[];
  onSelectMovie: (id: string) => void;
  onRemoveFavorite: (id: string) => void;
  onClearAll: () => void;
}

export interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}