package com.cs122b.fabflix.servlets;

import com.cs122b.fabflix.ResponseBuilder;
import com.cs122b.fabflix.models.Movie;
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

import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;

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

    public void destroy() {

    }
}
