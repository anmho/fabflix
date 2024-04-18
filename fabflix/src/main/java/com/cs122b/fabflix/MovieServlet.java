package com.cs122b.fabflix;

import com.cs122b.fabflix.models.Movie;
import com.cs122b.fabflix.repository.MovieRepository;
import com.cs122b.fabflix.repository.params.MovieFilterParams;
import com.cs122b.fabflix.repository.params.MovieSortParams;
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
        movieRepository = new MovieRepository(conn);
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) {
        // So far we just have very basic filtering. Only one filter at a time
        String movieId = req.getParameter("id");
        String starId = req.getParameter("starId");
        System.out.println("starId");
        System.out.println(starId);
        


        try {
            MovieFilterParams filterParams = MovieFilterParams.parse(req);
            MovieSortParams sortParams = MovieSortParams.parse(req);

        } catch (Exception e) {
            e.printStackTrace();
            ResponseBuilder.error(resp, 400, "invalid query params");
            return;
        }









        if (movieId != null) { // get a single movie
            // Get Top 20 movies
            System.out.println("Get Top 20 movies");

            try {

                // should return null if the movie does not exist
                System.out.println("should return null if the movie does not exist");
                Movie movie = movieRepository.getMovieById(movieId);
                ResponseBuilder.json(resp, movie, 200);
            } catch (SQLException e) {
                System.out.println("Line 42");
                System.out.println(e.getMessage());
                ResponseBuilder.error(resp, 500, e.getMessage());
            }
        } else if (starId != null) {
            try {
                System.out.println("Line 48");
                List<Movie> movies = movieRepository.getMoviesWithStar(starId);
                ResponseBuilder.json(resp, movies, 200);
            } catch( SQLException e) {
                System.out.println("Line 52");
                System.out.println(e.getMessage());
                ResponseBuilder.error(resp, 500, null);
            }
        } else{
            System.out.println("Line 57");
            try {
                List<Movie> movies = movieRepository.getTopRatedMovies(20);

                if (movies != null) {
                    System.out.println("Line 62");
                    ResponseBuilder.json(resp, movies, 200);
                } else {
                    System.out.println("Line 65");
                    ResponseBuilder.error(resp, 404, "movie not found");
                }

            } catch (SQLException e) {
                System.out.println("Line 70");
                System.out.println(e.getMessage());
                ResponseBuilder.error(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, null);
            }
        }
    }

    public void destroy() {

    }
}
