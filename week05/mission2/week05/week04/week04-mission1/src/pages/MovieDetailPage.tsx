import { useParams } from 'react-router-dom';
import { LoadingSpinner } from '../components/LoadingSpinner';
import useCustomFetch from '../hooks/useCustomFetch';
import { MovieDetailResponse } from '../types/movie';

const MovieDetailPage = () => {
  const params = useParams();
  const url=`https://api.themoviedb.org/3/movie/${params.movieId}?language=en-US`
  
  const { isPending, isError, data: movie } = useCustomFetch<MovieDetailResponse> (url);
    if (isError) {
        return <div>
            <span className='text-red-500 text-2xl'>에러 발생</span>
        </div>
  }
  if (isPending) {
    return <div className='flex items-center justify-center h-dvh'>
                          <LoadingSpinner/>
                      </div>
  }

  return (
    <>
    <div className="bg-gray-800 text-white p-8 flex flex-col md:flex-row">
      <img src={`https://image.tmdb.org/t/p/w300${movie?.poster_path}`} alt={movie?.original_title} className="w-full md:w-1/3 mb-4 md:mb-0 md:mr-4" />
      <div>
        <h1 className="text-3xl font-bold mb-2">{movie?.original_title}</h1>
        <p className="italic mb-1">개요:</p>
        <p className="mb-4">{movie?.overview}</p>
        <p className="mb-4">언어: {movie?.original_language}</p>
        <p className="mb-2">개봉일: {movie?.release_date}</p>
        <p>인기도: {movie?.popularity} </p>
        <p>평점: {movie?.vote_average} ({movie?.vote_count} 투표)</p>
      </div>
      </div>
      </>
  );  
};

export default MovieDetailPage;
