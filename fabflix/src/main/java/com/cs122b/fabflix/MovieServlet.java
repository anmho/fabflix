package com.cs122b.fabflix;

import com.cs122b.fabflix.models.Movie;
import com.cs122b.fabflix.repository.MovieRepository;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;

@WebServlet(name = "movieServlet", value="/movies")
public class MovieServlet extends HttpServlet {

    private Connection conn;
    private MovieRepository movieRepository;

    public void init() {
        conn = Database.getConnection();
        movieRepository = new MovieRepository(conn);
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String movieId = req.getParameter("id");
        if (movieId == null) {
            // Get Top 20 movies
            try {
                List<Movie> movies = movieRepository.getTopRatedMovies(20);

                ResponseBuilder.json(resp, movies, 200);
            } catch (SQLException e) {
                System.out.println(e.getMessage());
                ResponseBuilder.error(resp, 500, null);
            }
        } else {

            try {
                Movie movie = movieRepository.getMovieById(movieId);
                if (movie != null) {
                    ResponseBuilder.json(resp, movie, 200);
                } else {
                    ResponseBuilder.error(resp, 404, "movie not found");
                }

            } catch (SQLException e) {
                System.out.println(e.getMessage());
                ResponseBuilder.error(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, null);
            }
        }
    }

    public void destroy() {

    }
}
