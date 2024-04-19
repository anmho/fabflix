package com.cs122b.fabflix.services;

import com.cs122b.fabflix.models.Movie;
import com.cs122b.fabflix.models.PaginatedResult;
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



    public Movie findMovieById(String id) throws SQLException {
        return movieRepository.getMovieById(id);
    }
    public PaginatedResult<Movie> filterMovies(
            MovieFilterParams filterParams,
            MovieSortParams sortParams,
            PaginationParams pageParams
    ) throws SQLException {

        int limit = pageParams.getLimit();
        int page = pageParams.getPage();

        // add one to the limit so that we can easily see if a page is the last page or not
        List<Movie> movies = movieRepository.filterMovies(filterParams, sortParams, pageParams);
        System.out.println("movies size: " + movies.size());
        return new PaginatedResult<>(
                page,
                limit,
                movies
        );
    }
}
