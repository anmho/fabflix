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
        resp.setContentType("application/json");
        try {
            List<Movie> movies = movieRepository.getTopRatedMovies();

            ResponseBuilder.json(resp, movies, 200);
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    public void destroy() {

    }
}
