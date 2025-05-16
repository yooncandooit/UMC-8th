import { useState } from "react"
import { MovieResponse } from "../types/movie";
import MovieCard from "../components/MovieCard";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useParams } from "react-router-dom";
import useCustomFetch from "../hooks/useCustomFetch";

export default function MoviePage(){
    const [page, setPage] = useState(1);
    const { category } = useParams<{ category: string; }>();
    
    const url= `https://api.themoviedb.org/3/movie/${category}?language=en-US&page=${page}`
    const { data:movies, isPending, isError } = useCustomFetch<MovieResponse>(url);

    if (isError) {
        <div>
            <span className='text-red-500 text-2xl'>에러 발생</span>
        </div>
    }
    
    return(
        <>
            <div className='flex items-center justify-center gap-6 mt-5'>
                <button
                    className='bg-[#dda5e3] text-white px-6 py-3 rounded-lg shadhow-me hover:bg-[#b2dab1] transmition-all duration-200 disabled: bg-gray-300
                    cursor-pointer diabled:cursor-not-allowed'
                    disabled={page === 1} onClick={(): void => setPage((prev): number => prev - 1)}>
                    {'<'}
                </button>
                <span>{page} 페이지</span>
                <button
                    className='bg-[#dda5e3] text-white px-6 py-3 rounded-lg shadow-me hover:bg-[#b2dab1] transmition-all duration-200
                    cursor-pointer'
                    onClick={(): void => setPage((prev): number => prev + 1)}>
                    {'>'}
                </button>
            </div>

            {isPending && (
                <div className='flex items-center justify-center h-dvh'>
                    <LoadingSpinner/>
                </div>
            )}

            {!isPending && (
                <div className='p-10 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
                    {movies?.results.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
            )
            }
        </>
    );
}