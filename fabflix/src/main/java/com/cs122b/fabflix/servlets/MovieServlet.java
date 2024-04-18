package com.cs122b.fabflix.servlets;

import com.cs122b.fabflix.ResponseBuilder;
import com.cs122b.fabflix.models.Movie;
import com.cs122b.fabflix.repository.Database;
import com.cs122b.fabflix.repository.MovieRepository;
import com.cs122b.fabflix.params.MovieFilterParams;
import com.cs122b.fabflix.params.MovieSortParams;
import com.cs122b.fabflix.params.PaginationParams;
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

    private MovieRepository movieRepository;

    public void init() {
        Connection conn = Database.getConnection();
        movieRepository = new MovieRepository();
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) {
        // So far we just have very basic filtering. Only one filter at a time
        String movieId = req.getParameter("id");
        String starId = req.getParameter("starId");


        // sub endpoints to route from here

        //


        MovieFilterParams filterParams;
        MovieSortParams sortParams;
        PaginationParams paginationParams;

        try {
            filterParams = MovieFilterParams.parse(req);
            sortParams = MovieSortParams.parse(req);
            paginationParams = PaginationParams.parse(req);

            ObjectMapper mapper = new ObjectMapper();

            System.out.println(mapper.writeValueAsString(filterParams));
            System.out.println(sortParams);
            System.out.println(paginationParams);

        } catch (IllegalArgumentException | JsonProcessingException e) {
            e.printStackTrace();
            ResponseBuilder.error(resp, 400, "invalid query params");
        }

        try {

            if (movieId != null) {

            }


            if (movieId != null) { // get a single movie
                // Get Top 20 movies
                // should return null if the movie does not exist
                Movie movie = movieRepository.getMovieById(movieId);
                ResponseBuilder.json(resp, movie, 200);
            } else if (starId != null) {
                List<Movie> movies = movieRepository.getMoviesByStarId(starId);
                ResponseBuilder.json(resp, movies, 200);
            } else{

                List<Movie> movies = movieRepository.getTopRatedMovies(20);

                if (movies != null) {
                    ResponseBuilder.json(resp, movies, 200);
                } else {
                    ResponseBuilder.error(resp, 404, "movie not found");
                }

            }


        } catch (SQLException e) {
            e.printStackTrace();
            ResponseBuilder.error(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, e.getMessage());
        }


    }

    public void destroy() {

    }
}
