import { useState, useEffect, useCallback } from 'react';
import moviesClient from '../clients/movies.client';
import type { ApiResponse, Result } from '../types';

interface MovieFilters {
  year?: number;
  voteAverage?: number;
}

interface UseMoviesReturn {
  movies: Result[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  nextPage: () => void;
  prevPage: () => void;
  goToPage: (page: number) => void;
  applyFilters: (filters: MovieFilters) => void;
}

export const useMovies = (): UseMoviesReturn => {
  const [movies, setMovies] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [currentFilters, setCurrentFilters] = useState<MovieFilters>({});

  const fetchMovies = async (page: number, filters: MovieFilters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response: ApiResponse = await moviesClient.getMovies({ page, ...filters });
      setMovies(response.results);
      setTotalPages(response.total_pages);
      setCurrentPage(page);
      setCurrentFilters(filters);
    } catch (err) {
      setError('Failed to fetch movies');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(1);
  }, []);

  const nextPage = () => {
    if (currentPage < totalPages) {
      fetchMovies(currentPage + 1, currentFilters);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      fetchMovies(currentPage - 1, currentFilters);
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      fetchMovies(page, currentFilters);
    }
  };

  const applyFilters = useCallback((filters: MovieFilters) => {
    fetchMovies(1, filters);
  }, []);

  return {
    movies,
    loading,
    error,
    currentPage,
    totalPages,
    nextPage,
    prevPage,
    goToPage,
    applyFilters,
  };
};