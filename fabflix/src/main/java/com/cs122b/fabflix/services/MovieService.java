package com.cs122b.fabflix.services;

import com.cs122b.fabflix.models.Movie;
import com.cs122b.fabflix.models.MovieCompletion;
import com.cs122b.fabflix.models.PaginatedResults;
import com.cs122b.fabflix.params.CreateMovieParams;
import com.cs122b.fabflix.params.MovieFilterParams;
import com.cs122b.fabflix.params.MovieSortParams;
import com.cs122b.fabflix.params.PaginationParams;
import com.cs122b.fabflix.repository.Database;
import com.cs122b.fabflix.repository.MovieRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
//import org.apache.log4j.BasicConfigurator;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;


import java.sql.SQLException;
import java.util.*;

public class MovieService {
    private final MovieRepository movieRepository;
    private final Logger log = LogManager.getLogger(MovieService.class.getName());

    public MovieService(MovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }

    public List<Movie> getMoviesWithStar(String starId) throws SQLException {
        return movieRepository.getMoviesWithStar(starId);
    }

    // should return a response object, sqlexceptions should not be leaky like that
    public String createMovie(CreateMovieParams params) throws SQLException {
        if (params.getGenres().size() != 1) {
            throw new IllegalArgumentException("new movie must have exactly one genre");
        }

        if (params.getStars().size() != 1) {
            throw new IllegalArgumentException("new movie must have 1 star");
        }
        String movieId = movieRepository.createMovie(params);
        return movieId;
    }



    public List<MovieCompletion> getSearchCompletions(String query) {
        String[] tokens = query.split("[,-.\\s]");

        StringJoiner joiner = new StringJoiner(" ", "+", "*");
        for (String token : tokens) {
            joiner.add(token);
        }

        String match = joiner.toString();
        log.info("match: " + match);
        List<MovieCompletion> movieCompletions = new ArrayList<>();

        try (var conn = Database.getReadInstance().getConnection()) {
            var stmt = conn.prepareStatement(
                    "SELECT id, title, director, year " +
                            "FROM movies WHERE MATCH(title) AGAINST (? IN BOOLEAN MODE) LIMIT 10");
            stmt.setString(1, match);
            var rs = stmt.executeQuery();
            while (rs.next()) {
                String id = rs.getString("id");
                String title = rs.getString("title");
                int year = rs.getInt("year");
                String director = rs.getString("director");

                MovieCompletion completion = new MovieCompletion();
                completion.setId(id);
                completion.setTitle(title);
                completion.setYear(year);
                completion.setDirector(director);

                movieCompletions.add(completion);
            }
            return movieCompletions;
        } catch (SQLException e) {
            log.error(e);
            throw new RuntimeException(e);
        }
    }

    public Movie findMovieById(String id) throws SQLException {
        return movieRepository.getMovieById(id);
    }

    private String createURL(String baseURL, Map<String, Object> queryParams, int limit, int page) {
        List<String> pairs = new ArrayList<>();

        for (var entry : queryParams.entrySet()) {
            String key = entry.getKey();
            Object value = entry.getValue();

            if (value != null) {
                pairs.add(String.format("%s=%s", key, value));
            }
        }

        pairs.add(String.format("%s=%d", "limit", limit));
        pairs.add(String.format("%s=%d", "page", page));

        return String.format("%s?%s", baseURL, String.join("&", pairs));
    }
    public PaginatedResults<Movie> filterMovies(
            MovieFilterParams filterParams,
            MovieSortParams sortParams,
            PaginationParams pageParams
    ) throws SQLException {
        var start = System.currentTimeMillis();
        int limit = pageParams.getLimit();
        int page = pageParams.getPage();

        // add one to the limit so that we can easily see if a page is the last page or not

        // change the page params thingy
        List<Movie> movies = movieRepository.filterMovies(filterParams, sortParams, pageParams);

        // determine if it is the first or last page
        boolean isFirstPage = page == 1;

        boolean isLastPage = movies.size() < limit + 1;


        // we should hoist the logic up here. should request one more page.
        // parameters for repository should be changed to be limit offset for more granularity by the caller


        ObjectMapper mapper = new ObjectMapper();
        HashMap<String, Object> params = new HashMap<>();
        Map<String, Object> filterMap = mapper.convertValue(filterParams, Map.class);
        Map<String, Object> sortMap = mapper.convertValue(sortParams, Map.class);
        params.putAll(filterMap);
        params.putAll(sortMap);

        // create the links
        // set the links

        var baseUrl = "/movies";



        String nextLink = null;
        String prevLink = null;
        String selfLink = null;

        if (!isFirstPage) {
            prevLink = createURL(baseUrl, params, limit, page-1);
        }
        if (!isLastPage) {
            nextLink = createURL(baseUrl, params, limit, page+1);
        }

        selfLink = createURL(baseUrl, params, limit, page);



        var results = new PaginatedResults<>(
                page,
                limit,
                movies
        );
        results.setPrevLink(prevLink);
        results.setSelfLink(selfLink);
        results.setNextLink(nextLink);

        log.info(String.format("MovieService filterMovies response time (ms): %d", System.currentTimeMillis() - start));

        return results;
    }




}
