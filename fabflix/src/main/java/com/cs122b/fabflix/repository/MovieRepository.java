package com.cs122b.fabflix.repository;

import com.cs122b.fabflix.models.Movie;

import java.sql.*;
import java.util.ArrayList;

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
