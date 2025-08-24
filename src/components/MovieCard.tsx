import type { Result } from '../types';

interface MovieCardProps {
  movie: Result;
}

export const MovieCard = ({ movie }: MovieCardProps) => {
  const imageUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
    : 'https://via.placeholder.com/300x450?text=No+Image';

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 8) return 'text-green-600';
    if (rating >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative">
        <img 
          src={imageUrl} 
          alt={movie.title}
          className="w-full h-64 object-cover"
        />
        <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded-lg">
          <span className={`font-bold ${getRatingColor(movie.vote_average)}`}>
            ★ {movie.vote_average.toFixed(1)}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2">
          {movie.title}
        </h3>
        
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span className="font-medium">
            {formatDate(movie.release_date)}
          </span>
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
            {movie.vote_count} votes
          </span>
        </div>
        
        {movie.overview && (
          <p className="text-gray-700 text-sm mt-3 line-clamp-3">
            {movie.overview}
          </p>
        )}
      </div>
    </div>
  );
};