package com.cs122b.fabflix.services;

import com.cs122b.fabflix.models.Movie;
import com.cs122b.fabflix.models.MovieList;
import com.cs122b.fabflix.params.MovieFilterParams;
import com.cs122b.fabflix.params.MovieSortParams;
import com.cs122b.fabflix.params.PaginationParams;
import com.cs122b.fabflix.repository.MovieRepository;

import java.sql.SQLException;
import java.util.List;

public class MovieService {

    private final MovieRepository movieRepository;
    public MovieService(MovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }
    public List<Movie> getMoviesByStarId(String starId) throws SQLException {
        try {
            return movieRepository.getMoviesByStarId(starId);
        } catch (SQLException e) {
            System.out.println(e);
            throw e;
        }
    }
    public Movie getMovieById(String id) throws SQLException {
        try {
            return movieRepository.getMovieById(id);
        } catch (SQLException e) {
            System.out.println(e);
            throw e;
        }
    }


    public MovieList findMovies(
            PaginationParams paginationParams,
            MovieFilterParams filterParams,
            MovieSortParams sortParams
    ) {

//        List<Movie> movies = movieRepository.filterMovies(
//                paginationParams,
//                filterParams,
//                sortParams
//        );

        // build the response

        // need to get the total number of records as well

//        MovieList movieList = new MovieList(
//                movies);

        return null;

    }
}
