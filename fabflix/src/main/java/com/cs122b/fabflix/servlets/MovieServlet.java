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

import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;

@WebServlet(name = "movieServlet", value="/movies")
public class MovieServlet extends HttpServlet {

    private MovieService movieService;

    public void init() {
        Connection conn = Database.getConnection();
        movieService = new MovieService(new MovieRepository());

    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) {
        // So far we just have very basic filtering. Only one filter at a time
        String movieId = req.getParameter("id");
        String starId = req.getParameter("starId");




        MovieFilterParams filterParams;
        MovieSortParams sortParams;
        PaginationParams pageParams;

        try {
            filterParams = MovieFilterParams.parse(req);
            sortParams = MovieSortParams.parse(req);
            pageParams = PaginationParams.parse(req);


        } catch (IllegalArgumentException e) {
            e.printStackTrace();
            ResponseBuilder.error(resp, 400, "invalid query params");
            return;
        }


        // sub endpoints to route from here
        try {
            if (filterParams.getId() != null) {
                Movie movie = movieService.findMovieById(filterParams.getId());
                ResponseBuilder.json(resp, movie, 200);
                return;
            } else if (starId != null) { // should update the method

                List<Movie> movies = movieService.getMoviesWithStar(starId);
                ResponseBuilder.json(resp, movies, 200);
                return;

            } else {
                // filter many movies
                var results = movieService.filterMovies(filterParams, sortParams, pageParams);
                ResponseBuilder.json(resp, results, 200);
                return;
            }

        } catch (SQLException e) {
            e.printStackTrace();
            ResponseBuilder.error(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, e.getMessage());
        }


    }

    public void destroy() {

    }
}
