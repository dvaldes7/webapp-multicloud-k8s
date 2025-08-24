import { useState } from 'react';

interface MovieFilters {
  year?: number;
  voteAverage?: number;
}

interface UseMovieFiltersReturn {
  filters: MovieFilters;
  setYear: (year: number | undefined) => void;
  setVoteAverage: (voteAverage: number | undefined) => void;
  clearFilters: () => void;
}

export const useMovieFilters = (): UseMovieFiltersReturn => {
  const [filters, setFilters] = useState<MovieFilters>({});

  const setYear = (year: number | undefined) => {
    setFilters(prev => ({ ...prev, year }));
  };

  const setVoteAverage = (voteAverage: number | undefined) => {
    setFilters(prev => ({ ...prev, voteAverage }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  return {
    filters,
    setYear,
    setVoteAverage,
    clearFilters,
  };
};