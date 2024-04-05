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

@WebServlet(name = "singleMovieServlet", value="/singleMovie")
public class SingleMovieServlet extends HttpServlet {

    private Connection conn;
    private MovieRepository movieRepository;

    public void init() {
        conn = Database.getConnection();
        movieRepository = new MovieRepository(conn);
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("application/json");
        String movieId = req.getParameter("movieID");
        if (movieId == null || movieId.trim().isEmpty()) {
            ResponseBuilder.error(resp, 400, "Movie ID is required");
            return;
        }
        try {
            Movie movie = movieRepository.getMovieById(movieId);
            if (movie != null) {
                ResponseBuilder.json(resp, movie, 200);
            } else {
                ResponseBuilder.error(resp, 404, "Movie not found");
            }
        } catch (SQLException e) {
            ResponseBuilder.error(resp, 500, "Internal server error");
            e.printStackTrace();
        }
    }

    public void destroy() {

    }
}
