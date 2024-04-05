package com.cs122b.fabflix.repository;

import com.cs122b.fabflix.models.Genre;
import com.cs122b.fabflix.models.Movie;
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


    public List<Movie> getTopRatedMovies() throws SQLException {
        List<Movie> movies = new ArrayList<>();
        String query = "SELECT " +
                "m.id, " +
                "m.title, " +
                "m.year, " +
                "m.director, " +
                "r.rating, " +
                "(SELECT GROUP_CONCAT(CONCAT(g.id, ':', g.name) SEPARATOR ';') " +
                "FROM genres g JOIN genres_in_movies gim ON g.id = gim.genreId " +
                "WHERE gim.movieId = m.id) AS genres, " +
                "(SELECT GROUP_CONCAT(CONCAT(s.id, ':', s.name) SEPARATOR ';') " +
                "FROM stars s JOIN stars_in_movies sim ON s.id = sim.starId " +
                "WHERE sim.movieId = m.id) AS stars " +
                "FROM movies m " +
                "JOIN ratings r ON m.id = r.movieId " +
                "ORDER BY r.rating DESC " +
                "LIMIT 20;";


        try (Statement stmt = conn.createStatement(); ResultSet rs = stmt.executeQuery(query)) {
            while (rs.next()) {
                Movie movie = new Movie(
                        rs.getString("id"),
                        rs.getString("title"),
                        rs.getInt("year"),
                        rs.getString("director"),
                        rs.getFloat("rating")
                );

                String[] genrePairs = rs.getString("genres").split(";");
                List<Genre> genres = new ArrayList<>();
                for (String pair : genrePairs) {
                    if (genres.size() >= 3) break;
                    String[] parts = pair.split(":");
                    if (parts.length == 2) {
                        int genreId = Integer.parseInt(parts[0]);
                        String genreName = parts[1];
                        genres.add(new Genre(genreId, genreName));
                    }
                }

                String[] starPairs = rs.getString("stars").split(";");
                List<Star> stars = new ArrayList<>();
                for (String pair : starPairs) {
                    if (stars.size() >= 3) break;
                    String[] parts = pair.split(":");
                    if (parts.length == 2) {
                        String starId = parts[0];
                        String starName = parts[1];
                        stars.add(new Star(starId, starName));
                    }
                }

                movie.setGenres(genres);
                movie.setStars(stars);

                movies.add(movie);
            }
        }
        return movies;

    }


    public Movie getMovieById(String movieId) throws SQLException {
        Movie movie = null;

        String query = "SELECT " +
                "m.id, " +
                "m.title, " +
                "m.year, " +
                "m.director, " +
                "r.rating, " +
                "(SELECT GROUP_CONCAT(CONCAT(g.id, ':', g.name) SEPARATOR ';') FROM genres g " +
                "JOIN genres_in_movies gim ON g.id = gim.genreId WHERE gim.movieId = m.id) AS genres, " +
                "(SELECT GROUP_CONCAT(CONCAT(s.id, ':', s.name, ':', COALESCE(s.birthYear, 'N/A')) SEPARATOR ';') FROM stars s " +
                "JOIN stars_in_movies sim ON s.id = sim.starId WHERE sim.movieId = m.id) AS stars " +
                "FROM movies m " +
                "LEFT JOIN ratings r ON m.id = r.movieId " +
                "WHERE m.id = ? " +
                "LIMIT 1;";

        try (PreparedStatement stmt = conn.prepareStatement(query)) {
            stmt.setString(1, movieId);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    movie = new Movie(
                            rs.getString("id"),
                            rs.getString("title"),
                            rs.getInt("year"),
                            rs.getString("director"),
                            rs.getFloat("rating")
                    );

                    String[] genrePairs = rs.getString("genres").split(";");
                    List<Genre> genres = new ArrayList<>();
                    for (String pair : genrePairs) {
                        String[] parts = pair.split(":");
                        if (parts.length == 2) {
                            int genreId = Integer.parseInt(parts[0]);
                            String genreName = parts[1];
                            genres.add(new Genre(genreId, genreName));
                        }
                    }

                    String[] starPairs = rs.getString("stars").split(";");
                    List<Star> stars = new ArrayList<>();
                    for (String pair : starPairs) {
                        String[] parts = pair.split(":");
                        if (parts.length == 3) {
                            String starId = parts[0];
                            String starName = parts[1];
                            String birthYearStr = parts[2];
                            int birthYear = birthYearStr.equals("N/A") ? 0 : Integer.parseInt(birthYearStr); // Convert "N/A" to a default value or parse as int
                            stars.add(new Star(starId, starName, birthYear));
                        }
                    }

                    movie.setGenres(genres);
                    movie.setStars(stars);
                }
            }
        }

        return movie;
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
