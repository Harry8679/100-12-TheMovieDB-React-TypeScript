import type { Movie, MovieDetails, SearchResponse } from '../types';

// const API_KEY = import.meta.env.VITE_OMDB_API_KEY as string;
const API_KEY = import.meta.env.VITE_OMDB_API_KEY || '709f4c3e7cb875e88e2525cdf70ae5a4';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

if (!API_KEY) {
  console.warn('⚠️ VITE_OMDB_API_KEY is not set in .env file');
}

// Types TMDB
interface TMDBMovie {
  id: number;
  title?: string;
  name?: string;
  release_date?: string;
  first_air_date?: string;
  poster_path: string | null;
  media_type?: string;
}

interface TMDBSearchResponse {
  results: TMDBMovie[];
  total_results: number;
  total_pages: number;
}

interface TMDBMovieDetails {
  id: number;
  title?: string;
  name?: string;
  release_date?: string;
  first_air_date?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  genres: Array<{ id: number; name: string }>;
  runtime?: number;
  episode_run_time?: number[];
  vote_average: number;
  vote_count: number;
  status: string;
  tagline: string;
  credits?: {
    cast: Array<{ name: string; character: string }>;
    crew: Array<{ name: string; job: string }>;
  };
  production_countries: Array<{ name: string }>;
  spoken_languages: Array<{ english_name: string }>;
  production_companies: Array<{ name: string }>;
}

// Transformer TMDB → Notre format
function transformTMDBMovie(movie: TMDBMovie): Movie {
  const isMovie = movie.media_type === 'movie' || movie.title !== undefined;
  const title = movie.title || movie.name || 'Sans titre';
  const year = movie.release_date || movie.first_air_date || '';
  const yearFormatted = year ? year.split('-')[0] : 'N/A';
  
  return {
    imdbID: `tmdb${movie.id}`,
    Title: title,
    Year: yearFormatted,
    Type: isMovie ? 'movie' : 'series',
    Poster: movie.poster_path 
      ? `${IMAGE_BASE_URL}${movie.poster_path}` 
      : 'N/A',
  };
}

function transformTMDBDetails(details: TMDBMovieDetails): MovieDetails {
  const isMovie = details.title !== undefined;
  const title = details.title || details.name || 'Sans titre';
  const year = details.release_date || details.first_air_date || '';
  const yearFormatted = year ? year.split('-')[0] : 'N/A';
  
  const director = details.credits?.crew.find(c => c.job === 'Director')?.name || 'N/A';
  const writers = details.credits?.crew
    .filter(c => c.job === 'Writer' || c.job === 'Screenplay')
    .slice(0, 3)
    .map(w => w.name)
    .join(', ') || 'N/A';
  const actors = details.credits?.cast.slice(0, 5).map(a => a.name).join(', ') || 'N/A';
  const runtime = details.runtime || details.episode_run_time?.[0] || 0;
  
  return {
    imdbID: `tmdb${details.id}`,
    Title: title,
    Year: yearFormatted,
    Type: isMovie ? 'movie' : 'series',
    Poster: details.poster_path 
      ? `${IMAGE_BASE_URL}${details.poster_path}` 
      : 'N/A',
    Rated: 'N/A',
    Released: year || 'N/A',
    Runtime: runtime ? `${runtime} min` : 'N/A',
    Genre: details.genres.map(g => g.name).join(', ') || 'N/A',
    Director: director,
    Writer: writers,
    Actors: actors,
    Plot: details.overview || 'Aucune description disponible',
    Language: details.spoken_languages.map(l => l.english_name).join(', ') || 'N/A',
    Country: details.production_countries.map(c => c.name).join(', ') || 'N/A',
    Awards: 'N/A',
    Ratings: [
      {
        Source: 'TMDB',
        Value: `${details.vote_average.toFixed(1)}/10`,
      },
    ],
    Metascore: 'N/A',
    imdbRating: details.vote_average.toFixed(1),
    imdbVotes: details.vote_count.toLocaleString('fr-FR'),
    BoxOffice: undefined,
    Production: details.production_companies.map(c => c.name).join(', ') || undefined,
    Website: undefined,
  };
}

export const omdbApi = {
  // Rechercher des films
  async searchMovies(
    query: string,
    page: number = 1,
    type?: string,
    year?: string
  ): Promise<SearchResponse> {
    const params = new URLSearchParams({
      api_key: API_KEY,
      query: query,
      page: page.toString(),
      language: 'fr-FR',
    });

    if (year) {
      params.append('year', year);
      params.append('primary_release_year', year); // Pour les films
      params.append('first_air_date_year', year); // Pour les séries
    }

    // Endpoint selon le type
    let endpoint = '/search/multi'; // Par défaut : tout
    if (type === 'movie') {
      endpoint = '/search/movie';
    } else if (type === 'series') {
      endpoint = '/search/tv';
    }

    const response = await fetch(`${BASE_URL}${endpoint}?${params}`);

    if (!response.ok) {
      throw new Error('Erreur réseau');
    }

    const data: TMDBSearchResponse = await response.json();

    if (data.results.length === 0) {
      throw new Error('Aucun résultat trouvé');
    }

    // Filtrer selon le type si nécessaire
    let filteredResults = data.results;
    if (type && type !== 'all') {
      filteredResults = data.results.filter(movie => {
        if (type === 'movie') return movie.media_type === 'movie' || movie.title !== undefined;
        if (type === 'series') return movie.media_type === 'tv' || movie.name !== undefined;
        return true;
      });
    }

    // Exclure les personnes des résultats
    filteredResults = filteredResults.filter(movie => movie.media_type !== 'person');

    return {
      Search: filteredResults.map(transformTMDBMovie),
      totalResults: data.total_results.toString(),
      Response: 'True',
    };
  },

  // Récupérer les détails d'un film
  async getMovieDetails(imdbID: string): Promise<MovieDetails> {
    // Extraire l'ID TMDB
    const tmdbId = imdbID.replace('tmdb', '');
    
    // Déterminer si c'est un film ou une série (on teste les deux)
    let details: TMDBMovieDetails | null = null;
    
    try {
      // Essayer en tant que film
      const movieParams = new URLSearchParams({
        api_key: API_KEY,
        language: 'fr-FR',
        append_to_response: 'credits',
      });
      
      const movieResponse = await fetch(`${BASE_URL}/movie/${tmdbId}?${movieParams}`);
      if (movieResponse.ok) {
        details = await movieResponse.json();
      }
    } catch {
      // Continuer si erreur
    }

    if (!details) {
      try {
        // Essayer en tant que série
        const tvParams = new URLSearchParams({
          api_key: API_KEY,
          language: 'fr-FR',
          append_to_response: 'credits',
        });
        
        const tvResponse = await fetch(`${BASE_URL}/tv/${tmdbId}?${tvParams}`);
        if (tvResponse.ok) {
          details = await tvResponse.json();
        }
      } catch {
        throw new Error('Film introuvable');
      }
    }

    if (!details) {
      throw new Error('Film introuvable');
    }

    return transformTMDBDetails(details);
  },
};