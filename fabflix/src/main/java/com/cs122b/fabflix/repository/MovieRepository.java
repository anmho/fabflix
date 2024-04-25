package com.cs122b.fabflix.repository;


import com.cs122b.fabflix.models.Genre;
import com.cs122b.fabflix.models.Movie;
import com.cs122b.fabflix.models.Star;
import com.cs122b.fabflix.params.*;
import com.cs122b.fabflix.services.MovieService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.sql.*;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;


public class MovieRepository {
    private static final Logger log = LogManager.getLogger(MovieService.class.getName());




    public Movie getMovieById(String movieId) throws SQLException {
//        log.("Called getMovieById");

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

//        Connection conn = Database.getConnection();

        Database db = Database.getInstance();
        Connection conn = db.getConnection();

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

    public List<Movie> getMoviesWithStar(String starId) throws SQLException {

        String query = "SELECT\n" +
                "    m.id,\n" +
                "    m.title,\n" +
                "    m.year,\n" +
                "    m.director,\n" +
                "    r.rating,\n" +
                "    (\n" +
                "        SELECT GROUP_CONCAT(CONCAT(g.id, ':', g.name) SEPARATOR ';')\n" +
                "        FROM genres g\n" +
                "        JOIN genres_in_movies gim ON g.id = gim.genreId\n" +
                "        WHERE gim.movieId = m.id\n" +
                "    ) AS genres,\n" +
                "    (\n" +
                "        SELECT GROUP_CONCAT(CONCAT(s.id, ':', s.name, ':', COALESCE(s.birthYear, 'N/A'), ':', nmsi.numMovies) SEPARATOR ';')\n" +
                "        FROM stars s\n" +
                "        JOIN stars_in_movies sim ON s.id = sim.starId\n" +
                "        JOIN num_movies_starred_in nmsi ON s.id = nmsi.starId\n" +
                "        WHERE sim.movieId = m.id\n" +
                "    ) AS stars\n" +
                "FROM\n" +
                "    movies m\n" +
                "JOIN\n" +
                "    ratings r ON m.id = r.movieId\n" +
                "WHERE\n" +
                "    m.id IN (SELECT movieId FROM stars_in_movies WHERE starId = ?)\n" +
                "ORDER BY\n" +
                "    r.rating DESC;\n";

        Database db = Database.getInstance();
        Connection conn = db.getConnection();

        try (PreparedStatement stmt = conn.prepareStatement(query)) {
            stmt.setString(1, starId);
            log.info("Star id " + starId);
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
            MovieFilterParams filters,
            MovieSortParams sortParams,
            PaginationParams pageParams
        ) throws SQLException {
        var start = System.currentTimeMillis();

        Database db = Database.getInstance();

        try (Connection conn = db.getConnection()) {
            Query query = createFilterMoviesQuery(conn, filters, sortParams, pageParams);
            try (PreparedStatement stmt = query.getStatement()) {

                var queryStart = System.currentTimeMillis();
                ResultSet rs = stmt.executeQuery();
                log.info(String.format("Time to execute filter movies query: %d", System.currentTimeMillis() - queryStart));

                List<Movie> movies = new ArrayList<>();

                var parseStart = System.currentTimeMillis();
                // parse the result set row
                while (rs.next()) {
                    Movie movie = parseMovieRow(rs);
                    movies.add(movie);
                }

                log.info(String.format("Time to parse %d rows: %d", movies.size(), System.currentTimeMillis() - parseStart));

                log.info(String.format("Execute and parse filter movies query: %d", System.currentTimeMillis() - start));
                return movies;
            }
        }

    }


    Query createFilterMoviesQuery(
            Connection conn,
            MovieFilterParams filters,
            MovieSortParams sortParams,
            PaginationParams pageParams
    ) throws SQLException {
        Query.Builder queryBuilder = new Query.Builder(conn);
        queryBuilder.select("SELECT DISTINCT " +
                "m.id, " +
                "m.title, " +
                "m.year, " +
                "m.director, " +
                "m.price, " +
                "r.rating, " +
                "(" +
                "   SELECT GROUP_CONCAT(CONCAT(g.id, ':', g.name) SEPARATOR ';') " +
                "   FROM genres g JOIN genres_in_movies gim ON g.id = gim.genreId " +
                "   WHERE gim.movieId = m.id) AS genres, " +
                "(" +
                "   SELECT GROUP_CONCAT(CONCAT(s.id, ':', s.name, ':', COALESCE(s.birthYear, 'N/A'), ':', nmsi.numMovies) SEPARATOR ';')\n" +
                "   FROM stars s " +
                "   JOIN stars_in_movies sim ON s.id = sim.starId " +
                "   JOIN num_movies_starred_in nmsi ON s.id = nmsi.starId " +
                "   WHERE sim.movieId = m.id\n" +
                ") AS stars");




        queryBuilder.from("movies m");
        queryBuilder.join("ratings r", "m.id=r.movieId");

        if (filters != null) {
            if (filters.getTitle() != null) {
                // fix this
                String pattern = String.format("%%%s%%", filters.getTitle());
                queryBuilder.where("title", "LIKE", pattern);
            }

            if (filters.getYear() != null) {
                queryBuilder.where("year", "=", filters.getYear());
            }

            if (filters.getDirector() != null) {
                String pattern = String.format("%%%s%%", filters.getDirector());
                queryBuilder.where("director", "LIKE", pattern); // unsafe potentially
            }

            if (filters.getStartsWith() != null) {
                if (filters.getStartsWith().equals("*")) {
                    queryBuilder.where("title", "NOT RLIKE", "^[A-Za-z0-9]+");
                } else {
                    log.debug("startswith: " + filters.getStartsWith());
                    String pattern = String.format("%s%%", filters.getStartsWith()); // unsafe potentially

                    log.debug("LIKE pattern string: " + pattern);
                    queryBuilder.where("title", "LIKE", pattern);
                }
            }


            // need to change the query since it will include anyone but the star
            if (filters.getStar() != null) {
                String pattern = String.format("%%%s%%", filters.getStar()); // THIS IS UNSAFE. MUST FIX
                // "JOIN stars_in_movies sim ON m.id = sim.movieId " +
                // "JOIN stars s ON s.id = sim.starId " +
                queryBuilder.join("stars_in_movies sim", "m.id = sim.movieId");
                queryBuilder.join("stars s", "s.id = sim.starId");
                queryBuilder.where("s.name", "LIKE", pattern);

            }

            if (filters.getGenre() != null) {
                // "JOIN genres_in_movies gim ON m.id = gim.movieId " +
                // "JOIN genres g ON gim.genreId = g.id ";
                queryBuilder.join("genres_in_movies gim", "m.id = gim.movieId");
                queryBuilder.join("genres g", "gim.genreId = g.id");
                queryBuilder.where("g.name", "=", filters.getGenre());
            }
        }

        if (sortParams != null) {
            var dimensions = sortParams.getDimensions();
            if (dimensions != null) {
                for (var dimension : dimensions) {
                    queryBuilder.orderBy(dimension.getFieldName(), dimension.getSortOrder());
                }

            }

        }

        int limit = pageParams.getLimit();
        int page = pageParams.getPage();
        int offset = Math.max(limit * (page-1), 0);

//        log.("offset:" + offset);
        queryBuilder.setLimit(limit+1);
        queryBuilder.setOffset(offset);

        return queryBuilder.build();
    }



    private Movie parseMovieRow(ResultSet rs) throws SQLException {
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

        return movie;
    }


    private List<Star> parseStars(String starsString) {
        if (starsString == null) {
            throw new IllegalStateException("null starsString");
        }
        String[] starPairs = starsString.split(";");
        List<Star> stars = new ArrayList<>();
        for (String pair : starPairs) {
            String[] parts = pair.split(":");
            log.info("Star piece: " + Arrays.toString(parts));

            if (parts.length != 4) {
                throw new IllegalStateException("expected 4 parts returned from star string (id, First Last, DOB, num_movies");
            }

            String starId = parts[0];
            String starName = parts[1];
            Integer birthYear;
            int numMovies;
            try {
                birthYear = Integer.parseInt(parts[2]);
            } catch (NumberFormatException e) {
                birthYear = null;
            }
            try {
                numMovies = Integer.parseInt(parts[3]);
            }  catch (NumberFormatException e) {
                throw new IllegalStateException(String.format("unexpected database state for numMovies %s\n", parts[3]));
            }

            stars.add(new Star(starId, starName, birthYear, numMovies));
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