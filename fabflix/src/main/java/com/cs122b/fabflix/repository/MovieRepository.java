package com.cs122b.fabflix.repository;


import com.cs122b.fabflix.models.Genre;
import com.cs122b.fabflix.models.Movie;
import com.cs122b.fabflix.models.MovieCompletion;
import com.cs122b.fabflix.models.Star;
import com.cs122b.fabflix.params.*;
import com.cs122b.fabflix.services.MovieService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.sql.*;
import java.util.*;


public class MovieRepository {
    private static final Logger log = LogManager.getLogger(MovieService.class.getName());


    public Movie getMovieById(String movieId) throws SQLException {
        Movie movie = null;

        String query =
                         "SELECT\n" +
                         "m.id, " +
                         "m.title, " +
                         "m.year, " +
                         "m.director, " +
                         "m.price, " +
                         "r.rating, " +
                         "    (\n" +
                         "        SELECT GROUP_CONCAT(CONCAT(g.id, '#', g.name) SEPARATOR ';')\n" +
                         "        FROM genres g\n" +
                         "        JOIN genres_in_movies gim ON g.id = gim.genreId\n" +
                         "        WHERE gim.movieId = m.id\n" +
                         "    ) AS genres,\n" +
                         "(" +
                         "   SELECT GROUP_CONCAT(CONCAT(s.id, '#', s.name, '#', COALESCE(s.birthYear, 'N/A'), '#', nmsi.numMovies) SEPARATOR ';')\n" +
                         "   FROM stars s " +
                         "   JOIN stars_in_movies sim ON s.id = sim.starId " +
                         "   JOIN num_movies_starred_in nmsi ON s.id = nmsi.starId " +
                         "   WHERE sim.movieId = m.id\n" +
                         ") AS stars\n" +
                         "FROM\n" +
                         "    movies m\n" +
                         "LEFT JOIN ratings r ON m.id = r.movieId\n" +
                         "WHERE\n" +
                         "    m.id = ?\n" +
                         "LIMIT 1;\n";
        Database db = Database.getReadInstance();
        try (Connection conn = db.getConnection()) {
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

        }


        return movie;
    }

    public List<Movie> getMoviesWithStar(String starId) throws SQLException {

        String query = "" +
                "SELECT\n" +
                "    m.id,\n" +
                "    m.title,\n" +
                "    m.year,\n" +
                "    m.director,\n" +
                "    r.rating,\n" +
                "    (\n" +
                "        SELECT GROUP_CONCAT(CONCAT(g.id, '#', g.name) SEPARATOR ';')\n" +
                "        FROM genres g\n" +
                "        JOIN genres_in_movies gim ON g.id = gim.genreId\n" +
                "        WHERE gim.movieId = m.id\n" +
                "    ) AS genres,\n" +
                "    (\n" +
                "        SELECT GROUP_CONCAT(CONCAT(s.id, '#', s.name, '#', COALESCE(s.birthYear, 'N/A'), '#', nmsi.numMovies) SEPARATOR ';')\n" +
                "        FROM stars s\n" +
                "        JOIN stars_in_movies sim ON s.id = sim.starId\n" +
                "        JOIN num_movies_starred_in nmsi ON s.id = nmsi.starId\n" +
                "        WHERE sim.movieId = m.id\n" +
                "    ) AS stars\n" +
                "FROM\n" +
                "    movies m\n" +
                "LEFT JOIN\n" +
                "    ratings r ON m.id = r.movieId\n" +
                "WHERE\n" +
                "    m.id IN (SELECT movieId FROM stars_in_movies WHERE starId = ?)\n" +
                "ORDER BY\n" +
                "    r.rating DESC;\n";

        Database db = Database.getReadInstance();
        try (Connection conn = db.getConnection()) {
            try (PreparedStatement stmt = conn.prepareStatement(query)) {
                stmt.setString(1, starId);
                log.debug("Star id " + starId);
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


    }



    // Creates a new movie with a single star which starred in it
    public String createMovie(CreateMovieParams movie) throws SQLException {
        if (movie.getGenres().size() != 1) {
            throw new IllegalArgumentException("only 1 genre supported");
        }

        StarParams star = movie.getStars().get(0);

        try (var conn = Database.getWriteInstance().getConnection()) {
            CallableStatement proc = conn.prepareCall("{CALL add_movie(" +
                    "?,?,?,?,?,?,?,?,?)}");
            proc.setString(1, movie.getTitle());
            proc.setString(2, movie.getDirector());
            proc.setString(3, movie.getGenres().get(0).getName());
            proc.setFloat(4, (float)movie.getPrice());
            proc.setInt(5, movie.getYear());

            if (star.getId() == null) {
                proc.setNull(6, Types.VARCHAR);
                // insert null as the arg
            } else {
                proc.setString(6, star.getId());
            }
            proc.setString(7, star.getName());
            log.debug("star birth year: %d{}", star.getBirthYear());
            proc.setInt(8, star.getBirthYear());
            proc.registerOutParameter(9, Types.VARCHAR);
            proc.execute();
            return proc.getString(9);
        }
    }

    public List<Movie> filterMovies(
            MovieFilterParams filters,
            MovieSortParams sortParams,
            PaginationParams pageParams
        ) throws SQLException {
        var start = System.currentTimeMillis();

        Database db = Database.getReadInstance();

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


    private Query createFilterMoviesQuery(
            Connection conn,
            MovieFilterParams filters,
            MovieSortParams sortParams,
            PaginationParams pageParams
    ) throws SQLException {
//        Query.Builder queryBuilder = new Query.Builder(conn);
//        queryBuilder.select(
//                "SELECT DISTINCT " +
//                "m.id, " +
//                "m.title, " +
//                "m.year, " +
//                "m.director, " +
//                "m.price, " +
//                "r.rating, " +
//                "(" +
//                "   SELECT GROUP_CONCAT(CONCAT(g.id, '#', g.name) SEPARATOR ';') " +
//                "   FROM genres g JOIN genres_in_movies gim ON g.id = gim.genreId " +
//                "   WHERE gim.movieId = m.id) AS genres, " +
//                "(" +
//                "   SELECT GROUP_CONCAT(CONCAT(s.id, '#', s.name, '#', COALESCE(s.birthYear, 'N/A'), '#', nmsi.numMovies) SEPARATOR ';')\n" +
//                "   FROM stars s " +
//                "   LEFT JOIN stars_in_movies sim ON s.id = sim.starId " +
//                "   LEFT JOIN num_movies_starred_in nmsi ON s.id = nmsi.starId " +
//                "   WHERE sim.movieId = m.id\n" +
//                ") AS stars");

        Query.Builder queryBuilder = new Query.Builder(conn);
        queryBuilder
            .select("SELECT m.id, m.title, m.year, m.director, m.price, r.rating, " +
                "GROUP_CONCAT(CONCAT(g.id, '#', g.name) SEPARATOR ';') AS genres, " +
                "GROUP_CONCAT(CONCAT(s.id, '#', s.name, '#', COALESCE(s.birthYear, 'N/A'), '#', nmsi.numMovies) SEPARATOR ';') AS stars")
            .from("movies m")
            .join("LEFT", "ratings r", "m.id = r.movieId")
            .join("LEFT", "genres_in_movies gim", "m.id = gim.movieId")
            .join("LEFT", "genres g", "gim.genreId = g.id")
            .join("LEFT", "stars_in_movies sim", "m.id = sim.movieId" )
            .join("LEFT", "stars s", "sim.starId = s.id" )
            .join("LEFT", "num_movies_starred_in nmsi", "s.id = nmsi.starId")
            ;
//                "WHERE MATCH(title) AGAINST ('+Batman* ' IN BOOLEAN MODE) " +
//                "GROUP BY m.id" +


        if (filters != null) {
            if (filters.getTitle() != null) {
                // fix this
//                String pattern = String.format("%%%s%%", filters.getTitle());
                String[] tokens = filters.getTitle().split("[,-.\\s]");
                Set<String> stops = new HashSet<>();

                stops.add("a");
                stops.add("about");
                stops.add("an");
                stops.add("are");
                stops.add("as");
                stops.add("at");
                stops.add("be");
                stops.add("by");
                stops.add("com");
                stops.add("de");
                stops.add("en");
                stops.add("for");
                stops.add("from");
                stops.add("how");
                stops.add("i");
                stops.add("in");
                stops.add("is");
                stops.add("it");
                stops.add("la");
                stops.add("of");
                stops.add("on");
                stops.add("or");
                stops.add("that");
                stops.add("the");
                stops.add("this");
                stops.add("to");
                stops.add("was");
                stops.add("what");
                stops.add("when");
                stops.add("where");
                stops.add("who");
                stops.add("will");
                stops.add("with");
                stops.add("und");
                stops.add("www");

                StringBuilder sb = new StringBuilder();
                for (String token : tokens) {
                    if (!stops.contains(token)) {
                        sb.append("+");
                        sb.append(token);
                        sb.append("*");
                        sb.append(" ");
                    }
                }

                String match = sb.toString();

                queryBuilder.where("title", "MATCH", match);
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
//                queryBuilder.join("", "stars_in_movies sim", "m.id = sim.movieId");
//                queryBuilder.join("", "stars s", "s.id = sim.starId");
                queryBuilder.where("s.name", "LIKE", pattern);

            }

            if (filters.getGenre() != null) {
                // "JOIN genres_in_movies gim ON m.id = gim.movieId " +
                // "JOIN genres g ON gim.genreId = g.id ";
//                queryBuilder.join("", "genres_in_movies gim", "m.id = gim.movieId");
//                queryBuilder.join("", "genres g", "gim.genreId = g.id");
                queryBuilder.where("g.name", "=", filters.getGenre());
            }
        }
        queryBuilder.groupBy("m.id");
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
            return new ArrayList<>();
        }
        String[] starPairs = starsString.split(";");
        List<Star> stars = new ArrayList<>();
        for (String pair : starPairs) {
            String[] parts = pair.split("#");
            log.debug("Star piece: " + Arrays.toString(parts));

            if (parts.length != 4) {
                throw new IllegalStateException("expected 4 parts returned from star string (id, First Last, DOB, num_movies: " + Arrays.toString(parts));
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
            return new ArrayList<>();
        }
        String[] genrePairs = genresString.split(";");
        List<Genre> genres = new ArrayList<>();
        for (String pair : genrePairs) {
            String[] parts = pair.split("#");
            if (parts.length == 2) {
                int genreId = Integer.parseInt(parts[0]);
                String genreName = parts[1];
                genres.add(new Genre(genreId, genreName));
            }
        }
        return genres;
    }
}