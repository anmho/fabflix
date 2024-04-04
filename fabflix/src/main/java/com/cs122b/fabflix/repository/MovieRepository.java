package com.cs122b.fabflix.repository;

import com.cs122b.fabflix.models.Genre;
import com.cs122b.fabflix.models.Movie;
import com.cs122b.fabflix.models.MovieListItem;
import com.cs122b.fabflix.models.Star;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class MovieRepository {

    private final Connection conn;

    public MovieRepository(Connection connection) {
        this.conn = connection;
    }
    public Movie[] getMovies() throws SQLException {
        Statement stmt = conn.createStatement();
        ResultSet rs = stmt.executeQuery("SELECT * FROM movies;");

        ArrayList<Movie> movies = new ArrayList<>();

        while (rs.next()) {
            Movie movie = movieFromRow(rs);
            System.out.println(movie.getId());
            movies.add(movie);
        }
        return movies.toArray(new Movie[movies.size()]);
    }

    public List<MovieListItem> getTopRatedMovies() throws SQLException {
        List<MovieListItem> detailedMovies = new ArrayList<>();
        String query = "SELECT m.id, m.title, m.year, m.director, r.rating " +
                "FROM movies m " +
                "JOIN ratings r ON m.id = r.movieId " +
                "ORDER BY r.rating DESC LIMIT 20;";

        try (Statement stmt = conn.createStatement(); ResultSet rs = stmt.executeQuery(query)) {
            while (rs.next()) {
                Movie movie = new Movie(
                        rs.getString("id"),
                        rs.getString("title"),
                        rs.getInt("year"),
                        rs.getString("director")
                );

                MovieListItem movieListItem = new MovieListItem();
                movieListItem.setMovie(movie); // Set the Movie object
                movieListItem.setRating(rs.getFloat("rating"));
                movieListItem.setGenres(fetchGenresForMovie(movie.getId()));
                movieListItem.setStars(fetchStarsForMovie(movie.getId()));

                detailedMovies.add(movieListItem);
            }
        }
        return detailedMovies;
    }



    private List<Genre> fetchGenresForMovie(String movieId) throws SQLException {
        List<Genre> genres = new ArrayList<>();
        String query = "SELECT g.id, g.name FROM genres g " +
                "JOIN genres_in_movies gim ON g.id = gim.genreId " +
                "WHERE gim.movieId = ? LIMIT 3;";

        try (PreparedStatement stmt = conn.prepareStatement(query)) {
            stmt.setString(1, movieId);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    int id = rs.getInt("id");
                    String name = rs.getString("name");
                    Genre genre = new Genre(id, name); // Assuming you have a constructor like Genre(int id, String name)
                    genres.add(genre);
                }
            }
        }
        return genres;
    }

    private List<Star> fetchStarsForMovie(String movieId) throws SQLException {
        List<Star> stars = new ArrayList<>();
        String query = "SELECT s.id, s.name FROM stars s " +
                "JOIN stars_in_movies sim ON s.id = sim.starId " +
                "WHERE sim.movieId = ? LIMIT 3;";

        try (PreparedStatement stmt = conn.prepareStatement(query)) {
            stmt.setString(1, movieId);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    String id = rs.getString("id");
                    String name = rs.getString("name");
                    Star star = new Star(id, name);
                    stars.add(star);
                }
            }
        }
        return stars;
    }



    public Movie getMovie(String id) throws SQLException {
        PreparedStatement stmt = conn.prepareStatement("SELECT * FROM movies WHERE id = ?");
        stmt.setString(1, id);

        ResultSet rs = stmt.executeQuery();
        if (!rs.next()) {
            return null;
        }

        return movieFromRow(rs);
    }

    private Movie movieFromRow(ResultSet row) throws SQLException {
        if (row == null) {
            throw new IllegalStateException("row must not be null");
        }
        String id = row.getString("id");
        String title = row.getString("title");
        int year = row.getInt("year");
        String director = row.getString("director");
        return new Movie(id, title, year, director);
    }
}
