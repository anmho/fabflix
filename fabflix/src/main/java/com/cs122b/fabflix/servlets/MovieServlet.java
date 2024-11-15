package com.cs122b.fabflix.servlets;

import com.cs122b.fabflix.ResponseBuilder;
import com.cs122b.fabflix.models.Movie;
import com.cs122b.fabflix.params.CreateMovieParams;
import com.cs122b.fabflix.repository.Database;
import com.cs122b.fabflix.repository.MovieRepository;
import com.cs122b.fabflix.params.MovieFilterParams;
import com.cs122b.fabflix.params.MovieSortParams;
import com.cs122b.fabflix.params.PaginationParams;
import com.cs122b.fabflix.services.MovieService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@WebServlet(name = "movieServlet", value="/movies")
public class MovieServlet extends HttpServlet {

    private MovieService movieService;
    private final Logger log = LogManager.getLogger(MovieServlet.class.getName());

    public void init() {
        movieService = new MovieService(new MovieRepository());
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) {
        var start = System.currentTimeMillis();


        String starId = req.getParameter("starId");

        MovieFilterParams filterParams;
        MovieSortParams sortParams;
        PaginationParams pageParams;

        try {
            filterParams = MovieFilterParams.parse(req);
            sortParams = MovieSortParams.parse(req);
            pageParams = PaginationParams.parse(req);
        } catch (IllegalArgumentException e) {
            log.error(e.getStackTrace());
            ResponseBuilder.error(resp, 400, "invalid query params");
            return;
        }

        // sub endpoints to route from here
        try {
            if (filterParams.getId() != null) {
                log.debug("Getting movie by id");
                Movie movie = movieService.findMovieById(filterParams.getId());
                if (movie == null) {
                    ResponseBuilder.error(resp, 404, "movie not found");

                }
                ResponseBuilder.json(resp, movie, 200);
            } else if (starId != null) { // should update the method
                log.debug("getting movies featuring star: " + starId);
                List<Movie> movies = movieService.getMoviesWithStar(starId);
                ResponseBuilder.json(resp, movies, 200);

            } else {
                // filter many movies
                log.debug("Getting movies with filters");
                var results = movieService.filterMovies(filterParams, sortParams, pageParams);
                ResponseBuilder.json(resp, results, 200);
            }
        } catch (SQLException e) {
            e.printStackTrace();
            ResponseBuilder.error(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, e.getMessage());
        }

        log.info(String.format("/movies response time (ms): %d", System.currentTimeMillis() - start));
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse res) {


        var mapper = new ObjectMapper();
        try {
            CreateMovieParams movieParams = mapper.readValue(req.getInputStream(), CreateMovieParams.class);
            String movieId = movieService.createMovie(movieParams);
            log.debug("MovieParams: " + movieParams);

            Map<String, Object> data = new HashMap<>();
            data.put("id", movieId);
            ResponseBuilder.json(res, data, 200);

        } catch (IOException e) {
            log.error(e);
            ResponseBuilder.error(res, HttpServletResponse.SC_BAD_REQUEST, e.getMessage());
        } catch (SQLException e) {
            log.error(e);

            if (e.getSQLState().equals("02000") || e.getSQLState().equals("23000")) {
                ResponseBuilder.error(res, HttpServletResponse.SC_BAD_REQUEST, e.getMessage());
                return;
            }
            ResponseBuilder.error(res, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, e.getMessage());
        }
    }
    public void destroy() {

    }
}
