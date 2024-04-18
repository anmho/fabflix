package com.cs122b.fabflix.repository;


import com.cs122b.fabflix.models.Genre;
import com.cs122b.fabflix.models.Movie;
import com.cs122b.fabflix.models.Star;
import com.cs122b.fabflix.params.*;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;



public class MovieRepository {



    public List<Movie> getTopRatedMovies(int topK) throws SQLException {
        List<Movie> movies = new ArrayList<>();
        String query = "SELECT " +
                "m.id, " +
                "m.title, " +
                "m.year, " +
                "m.director, " +
                "m.price, " +
                "r.rating, " +
                "(SELECT GROUP_CONCAT(CONCAT(g.id, ':', g.name) SEPARATOR ';') " +
                    "FROM genres g JOIN genres_in_movies gim ON g.id = gim.genreId " +
                    "WHERE gim.movieId = m.id) AS genres, " +
                "(SELECT GROUP_CONCAT(CONCAT(s.id, ':', s.name, ':', COALESCE(s.birthYear, 'N/A')) SEPARATOR ';') " +
                    "FROM stars s JOIN stars_in_movies sim ON s.id = sim.starId " +
                    "WHERE sim.movieId = m.id) AS stars " +
                "FROM movies m " +
                "JOIN ratings r ON m.id = r.movieId " +
                "ORDER BY r.rating DESC " +
                "LIMIT " + topK + ";";

        Connection conn = Database.getConnection();


        try (Statement stmt = conn.createStatement(); ResultSet rs = stmt.executeQuery(query)) {
            while (rs.next()) {
                Movie movie = new Movie(
                        rs.getString("id"),
                        rs.getString("title"),
                        rs.getInt("year"),
                        rs.getString("director"),
                        rs.getFloat("rating"),
                        rs.getDouble("price")
                );


                String genresString = rs.getString("genres");
                List<Genre> genres = parseGenres(genresString);

                String starsString = rs.getString("stars");
                List<Star> stars = parseStars(starsString);

                movie.setGenres(genres);
                movie.setStars(stars);

                movies.add(movie);
            }
        }
        return movies;

    }

    public Movie getMovieById(String movieId) throws SQLException {
        Movie movie = null;

        String query =
                "SELECT " +
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

        Connection conn = Database.getConnection();

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

                    String genresString = rs.getString("genres");
                    List<Genre> genres = parseGenres(genresString);

                    String starsString = rs.getString("stars");
                    List<Star> stars = parseStars(starsString);

                    movie.setGenres(genres);
                    movie.setStars(stars);
                }
            }
        }

        return movie;
    }

    public List<Movie> getMoviesByStarId(String starId) throws SQLException {
        String query = "SELECT m.id, m.title, m.year, m.director, r.rating, (SELECT GROUP_CONCAT(CONCAT(g.id, ':', g.name) SEPARATOR ';') FROM genres g JOIN genres_in_movies gim ON g.id = gim.genreId WHERE gim.movieId = m.id) AS genres, (SELECT GROUP_CONCAT(CONCAT(s.id, ':', s.name, ':', COALESCE(s.birthYear, 'N/A')) SEPARATOR ';') FROM stars s JOIN stars_in_movies sim ON s.id = sim.starId WHERE sim.movieId = m.id) AS stars FROM movies m JOIN ratings r ON m.id = r.movieId WHERE m.id IN (SELECT movieId FROM stars_in_movies WHERE starId = ?) ORDER BY r.rating DESC;";

        Connection conn = Database.getConnection();

        try (PreparedStatement stmt = conn.prepareStatement(query)) {
            stmt.setString(1, starId);
            System.out.println(starId);
            ResultSet rs = stmt.executeQuery();


            List<Movie> movies = new ArrayList<>();
            while (rs.next()) {
                Movie movie = new Movie();
                movie.setId(rs.getString("id"));
                movie.setTitle(rs.getString("title"));
                movie.setYear(rs.getInt("year"));
                movie.setDirector(rs.getString("director"));
                movie.setRating(rs.getFloat("rating"));


                String starsString = rs.getString("stars");
                List<Star> stars = parseStars(starsString);
                movie.setStars(stars);

                String genreString = rs.getString("genres");
                List<Genre> genres = parseGenres(genreString);
                movie.setGenres(genres);

                movies.add(movie);
            }
            return movies;
        }
    }


    public List<Movie> filterMovies(
            MovieFilterParams filterParams,
            MovieSortParams sortParams,
            PaginationParams paginationParams
        ) {




//        List<String> filters = new ArrayList();
//
//        // add filters
//        if (filterParams.getDirector() != null) {
//            filters.add("director = ?");
//        }
        return null;
    }


    PreparedStatement createFilterMoviesQuery(
            MovieFilterParams filterParams,
            MovieSortParams sortParams,
            PaginationParams paginationParams
    ) {

        String baseQuery =
            "SELECT " +
                "m.id, " +
                "m.title, " +
                "m.year, " +
                "m.director, " +
                "m.price, " +
                "r.rating, " +
                "(SELECT GROUP_CONCAT(CONCAT(g.id, ':', g.name) SEPARATOR ';') " +
                    "FROM genres g JOIN genres_in_movies gim ON g.id = gim.genreId " +
                    "WHERE gim.movieId = m.id) AS genres, " +
                "(SELECT GROUP_CONCAT(CONCAT(s.id, ':', s.name, ':', COALESCE(s.birthYear, 'N/A')) SEPARATOR ';') " +
                    "FROM stars s JOIN stars_in_movies sim ON s.id = sim.starId " +
                    "WHERE sim.movieId = m.id) AS stars " +
            "FROM movies m " +
            "JOIN ratings r ON m.id = r.movieId \n";

        StringBuilder sb = new StringBuilder();

        sb.append(baseQuery);

        String whereClause = createWhereClause(filterParams);
        sb.append(whereClause);
        String orderByClause = createOrderByClause(sortParams);
        sb.append(orderByClause);

//        return sb.toString();
        return null;
    }


    String createWhereClause(
        MovieFilterParams params
    ) {

        List<String> clauses = new ArrayList<>();

        // title
        if (params.getTitle() != null) {
            clauses.add("title LIKE %?%");
        }
        // startsWith
        if (params.getStartsWith() != null) {
            clauses.add("title LIKE ?%");
        }
        // director
        if (params.getDirector() != null) {
            clauses.add("director LIKE %?%");
        }
        // year
        if (params.getYear() != null) {
            clauses.add("year = ?");
        }
        return "WHERE \n" + String.join(" AND\n", clauses);
    }

    String createOrderByClause(
            MovieSortParams params
    ) {

        List<String> fields = new ArrayList<>();
        for (MovieSortField field : params.getSortFields()) {
            switch (field) {
                case RATING:
                    fields.add("rating");
                    break;
                case TITLE:
                    fields.add("title");
                    break;
                case YEAR:
                    fields.add("year");
                    break;
            }
        }

        String fieldString = String.join(", ", fields);


        String orderString = "DESC";
        SortOrder sortOrder = params.getSortOrder();
        if (sortOrder != null) {
            if (sortOrder == SortOrder.DESCENDING) {
                orderString = "DESC";
            } else if (sortOrder == SortOrder.ASCENDING) {
                orderString = "ASC";
            }
        }

        return String.format(
                "ORDER BY %s %s",
                fieldString,
                orderString
        );
    }


    String createPaginationString(
            PaginationParams params) {

        int limit = params.getLimit();
        int page = params.getPage();
        int offset = limit * page;

         return String.format(
        "LIMIT %d\n" +
                "OFFSET %d",
                limit,
                offset
        );
    }
    private List<Star> parseStars(String starsString) {
        if (starsString == null) {
            throw new IllegalStateException("null starsString");
        }
        String[] starPairs = starsString.split(";");
        List<Star> stars = new ArrayList<>();
        for (String pair : starPairs) {
            String[] parts = pair.split(":");
            if (parts.length == 3) {
                String starId = parts[0];
                String starName = parts[1];
                int birthYear;
                try {
                    birthYear = Integer.parseInt(parts[2]);
                } catch (NumberFormatException e) {
                    birthYear = 0;
                }
                stars.add(new Star(starId, starName, birthYear));
            }
        }

        return stars;
    }

    private List<Genre> parseGenres(String genresString) {
        if (genresString == null) {
            throw new IllegalStateException("null genresString");
        }
        String[] genrePairs = genresString.split(";");
        List<Genre> genres = new ArrayList<>();
        for (String pair : genrePairs) {
            String[] parts = pair.split(":");
            if (parts.length == 2) {
                int genreId = Integer.parseInt(parts[0]);
                String genreName = parts[1];
                genres.add(new Genre(genreId, genreName));
            }
        }
        return genres;
    }
}