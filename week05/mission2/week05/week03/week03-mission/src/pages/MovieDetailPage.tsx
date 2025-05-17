import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Movie } from '../types/movie';  
import { useEffect, useState } from 'react';

const MovieDetailPage = () => {
  const { movieId } = useParams();
  const [movie, setMovie] = useState<Movie | null>(null); 
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await axios.get<Movie>(
          `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
            },
          }
        );
        setMovie(response.data); 
      } catch {
        setError(true);
      } 
    };

    fetchMovie();
  }, [movieId]);

  if (error) return <div>영화 정보를 불러오는데 실패</div>;
  if (!movie) return <div></div>;

  return (
    <div className="bg-gray-800 text-white p-8 flex flex-col md:flex-row">
      <img src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} alt={movie.original_title} className="w-full md:w-1/3 mb-4 md:mb-0 md:mr-4" />
      <div>
        <h1 className="text-3xl font-bold mb-2">{movie.original_title}</h1>
        <p className="italic mb-1">개요:</p>
        <p className="mb-4">{movie.overview}</p>
        <p className="mb-4">언어: {movie.original_language}</p>
        <p className="mb-2">개봉일: {movie.release_date}</p>
        <p>인기도: {movie.popularity} </p>
        <p>평점: {movie.vote_average} ({movie.vote_count} 투표)</p>
      </div>
    </div>
  );  
};

export default MovieDetailPage;
