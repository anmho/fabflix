package com.cs122b.fabflix.models;

import com.cs122b.fabflix.params.MovieFilterParams;
import com.cs122b.fabflix.params.MovieSortParams;
import com.cs122b.fabflix.params.PaginationParams;
import com.cs122b.fabflix.repository.PaginationResult;

import java.util.List;
import java.util.Map;

public class MovieList {
    private List<Movie> movies;
    private String nextPage;
    private String prevPage;
    private static final String baseURL = "/api/movies";



    public MovieList(
            PaginationParams paginationParams,
            MovieFilterParams filterParams,
            MovieSortParams sortParams,
            PaginationResult<Movie> moviesResult
    ) {
        movies = moviesResult.getPageRecords();

        int limit = paginationParams.getLimit();
        int page = paginationParams.getPage();


        String queryString = createQueryString(limit, page, filterParams, sortParams);

    }

    private String createQueryString(
            int limit,
            int page,
            MovieFilterParams filterParams,
            MovieSortParams sortParams
    ) {


//        Map<String, String> params;
//        String.format("%s?", baseURL)


        return null;
    }

    public List<Movie> getMovies() {
        return movies;
    }

//    public String getNextPage() {
//        String nextPage = ;
//        return nextPage;
//    }

//    public String getPrevPage() {
//        return prevPage;
//    }
}
