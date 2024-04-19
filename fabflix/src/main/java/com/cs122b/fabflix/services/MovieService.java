package com.cs122b.fabflix.services;

import com.cs122b.fabflix.models.Movie;
import com.cs122b.fabflix.models.PaginatedResults;
import com.cs122b.fabflix.params.MovieFilterParams;
import com.cs122b.fabflix.params.MovieSortParams;
import com.cs122b.fabflix.params.PaginationParams;
import com.cs122b.fabflix.repository.MovieRepository;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.UnsupportedEncodingException;
import java.lang.reflect.Field;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class MovieService {
    private final MovieRepository movieRepository;
    public MovieService(MovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }



    public Movie findMovieById(String id) throws SQLException {
        return movieRepository.getMovieById(id);
    }
    public PaginatedResults<Movie> filterMovies(
            MovieFilterParams filterParams,
            MovieSortParams sortParams,
            PaginationParams pageParams
    ) throws SQLException {

        int limit = pageParams.getLimit();
        int page = pageParams.getPage();

        // add one to the limit so that we can easily see if a page is the last page or not

        // change the page params thingy
        List<Movie> movies = movieRepository.filterMovies(filterParams, sortParams, pageParams);
        System.out.println("movies size: " + movies.size());

        // determine if it is the first or last page

        boolean isFirstPage = page == 0;
        boolean isLastPage = movies.size() < limit + 1;


        // we should hoist the logic up here. should request one more page.
        // parameters for repository should be change to be limit offset for more granularity by the caller


        ObjectMapper mapper = new ObjectMapper();
        HashMap<String, Object> params = new HashMap<>();
        Map<String, Object> filterMap = mapper.convertValue(filterParams, Map.class);
        Map<String, Object> sortMap = mapper.convertValue(sortParams, Map.class);
        params.putAll(filterMap);
        params.putAll(sortMap);

        // create the links
        // set the links

        var baseUrl = "/api/movies";

        System.out.println(params);


        String nextLink = null;
        String prevLink = null;
        try {
            var queryStr
                    = makeQueryString(params);
            if (!isFirstPage) {
                prevLink = String.format("%s?%s&page=%d&limit=%d", baseUrl, queryStr, page-1, limit);
            }
            if (!isLastPage) {
                nextLink = String.format("%s?%s&page=%d&limit=%d", baseUrl, queryStr, page+1, limit);
            }
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException(e);
        }




        var results = new PaginatedResults<>(
                page,
                limit,
                movies
        );
        results.setPrevLink(prevLink);
        results.setNextLink(nextLink);

        return results;
    }



    String makeQueryString(Map<String, Object> queryParams) throws UnsupportedEncodingException {
        List<String> pairs = new ArrayList<>();

        for (var entry : queryParams.entrySet()) {
            String key = entry.getKey();
            Object value = entry.getValue();
            System.out.println("key: " + key);
            System.out.println("value: " + value);
            if (value != null) {
                pairs.add(String.format("%s=%s", key, value));
            }
        }

        return String.join("&", pairs);
    }
}
