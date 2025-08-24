import { useEffect } from 'react'
import { useMovies } from './hooks/useMovies'
import { useMovieFilters } from './hooks/useMovieFilters'
import { MovieCard } from './components/MovieCard'
import { MovieFilters } from './components/MovieFilters'
import { Pagination } from './components/Pagination'
import './App.css'

function App() {
  const { 
    movies, 
    loading, 
    error, 
    currentPage, 
    totalPages, 
    nextPage, 
    prevPage, 
    goToPage,
    applyFilters 
  } = useMovies();

  const {
    filters,
    setYear,
    setVoteAverage,
    clearFilters
  } = useMovieFilters();

  useEffect(() => {
    applyFilters(filters);
  }, [filters, applyFilters]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading movies...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🎬 Explorador de Películas 🎬
          </h1>
          <p className="text-gray-600">
            Discover popular movies from around the world
          </p>
        </header>

        <MovieFilters
          year={filters.year}
          voteAverage={filters.voteAverage}
          onYearChange={setYear}
          onVoteAverageChange={setVoteAverage}
          onClearFilters={clearFilters}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={goToPage}
          onNext={nextPage}
          onPrev={prevPage}
        />

        <footer className="text-center mt-12 text-gray-500 text-sm">
          <p>
            Page {currentPage} of {totalPages.toLocaleString()} • Powered by
            TMDB API
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App
