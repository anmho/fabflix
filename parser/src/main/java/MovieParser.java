import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVPrinter;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import java.io.*;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Types;
import java.util.*;

public class MovieParser {
    private final DocumentBuilder builder;
    public MovieParser() throws ParserConfigurationException  {
        var factory = DocumentBuilderFactory.newInstance();
        builder = factory.newDocumentBuilder();
    }

    public void printSummary(List<Movie> movies) {

        var genres = new HashSet<>();
        for (var movie : movies) {
            genres.addAll(movie.getGenres());
        }


        System.out.println("Movie summary:");
        System.out.println("Parsed " + movies.size() + " movies");
        System.out.println("All genres: " + genres);
    }

    public void run() throws IOException, SAXException, SQLException {
        Map<String, Movie> movieLookupTable = new HashMap<>();
        Reader reader = new FileReader("current_movies.csv");
        CSVParser csvParser = new CSVParser(reader, CSVFormat.Builder.create().setHeader().build());

        for (var row : csvParser) {
            var movie = new Movie();

            String title = row.get("title");
            String director = row.get("director");
            String year = row.get("year");


            String key = String.format("%s,%s", title.trim(), director.trim());
            movie.setTitle(title.trim());
            movie.setDirector(director);
            movie.setYear(Integer.parseInt(year));

            movieLookupTable.put(key, movie);
        }


        List<Movie> movies = parse("mains243.xml", movieLookupTable);
        writeFile("new_movies.csv", movies);
        printSummary(movies);


        var db = Database.getInstance();
        var conn = db.getConnection();
        insertMovies(conn, movies);
    }

    public List<Movie> parse(String filename, Map<String, Movie> moviesLookupTable) throws IOException, SAXException {
        Document doc = builder.parse(this.getClass().getClassLoader().getResourceAsStream(filename));

        var root = doc.getDocumentElement();

        List<Movie> movies = new ArrayList<>();
        Set<String> dupSet = new HashSet<>();

        var directorFilms = root.getElementsByTagName("directorfilms");
        for (int i = 0; i < directorFilms.getLength(); i++) {
            Node directorFilmNode = directorFilms.item(i);
            String director = null;
            if (directorFilmNode.getNodeType() == Node.ELEMENT_NODE) {
                Element directorFilmElement = (Element) directorFilmNode;
                Element directorElement = (Element)directorFilmElement.getElementsByTagName("director").item(0);
                Node dirnameNode = directorElement.getElementsByTagName("dirname").item(0);

                Node dirnNode = directorElement.getElementsByTagName("dirn").item(0);

                if (dirnameNode != null) {
                    director = dirnameNode.getTextContent();
                } else if (dirnNode != null) {
                    director = dirnNode.getTextContent();
                }

                Element filmsElement = ((Element)((Element)directorFilmNode).getElementsByTagName("films").item(0));
                NodeList filmsList = filmsElement.getElementsByTagName("film");
                for (int j = 0; j < filmsList.getLength(); j++) {
                    Node filmNode = filmsList.item(j);
                    if (filmNode.getNodeType() == Node.ELEMENT_NODE) {
                        Element film = (Element)filmNode;

                        var filmId = film.getElementsByTagName("fid").item(0);
                        if (filmId == null) {
                            filmId = film.getElementsByTagName("filmed").item(0);
                        }

                        String movieId = filmId.getTextContent();

                        var titleNode = film.getElementsByTagName("t").item(0);
                        String title = titleNode.getTextContent().trim();


                        Integer year = null;

                        var yearNode = film.getElementsByTagName("year").item(0);
                        try {
                            year = Integer.parseInt(yearNode.getChildNodes().item(0).getTextContent().trim());
                        } catch (NumberFormatException e) {
                            System.out.println(title + " -- invalid year " + yearNode.getChildNodes().item(0).getTextContent());
                        }
                        var catsNode = film.getElementsByTagName("cats").item(0);
                        List<String> categories = new ArrayList<>();
                        if (catsNode != null) {
                            NodeList catNodes = catsNode.getChildNodes();

                            for (int k = 0; k < catNodes.getLength(); k++) {
                                Node catNode = catNodes.item(k);
                                String category = catNode.getTextContent();
                                categories.add(category);
                            }
                        }

                        List<String> genres = new ArrayList<>();
                        for (var cat : categories) {
                            genres.addAll(translateGenre(cat));
                        }
                        categories = genres;


                        String key = String.format("%s,%s", title, director);
                        if (moviesLookupTable.containsKey(key)) {
                            System.out.println(key);
                            System.out.println("found duplicate movie" + title + " " + director + " " + year);
                            System.out.println(key);
                            System.out.println(moviesLookupTable.get(key));

                            continue; // already in the tables, lets skip
                        }

                        Movie movie = new Movie();
                        if (dupSet.contains(movieId)) {
                            movieId = UUID.randomUUID().toString();
                        }
                        movie.setId(movieId);
                        movie.setTitle(title);
                        movie.setDirector(director);
                        movie.setYear(year);
                        movie.setGenres(categories);
                        String dupkey = String.format("%s,%s", title, director);

                        // can't have screwed up movie, maybe we can add later by cleaning
                        if (!dupSet.contains(dupkey) && movie.getTitle() != null && movie.getYear() != null) {
                            dupSet.add(dupkey);
                            dupSet.add(movieId);
                            movies.add(movie);
                        } else {
                            System.out.println("found duplicate cast " + dupkey);
                        }
                    }
                }
            }
        }
        return movies;
    }


    public void writeFile(String outFilename, List<Movie> movies ) throws IOException {
        String[] MOVIE_HEADERS = { "id", "title", "director", "year" };

        try (Writer writer = new FileWriter(outFilename)) {
            CSVFormat csvFormat = CSVFormat.DEFAULT.builder()
                    .setDelimiter(',')
                    .setHeader(MOVIE_HEADERS)
                    .build();
            try (final CSVPrinter printer = new CSVPrinter(writer, csvFormat)) {
                movies.forEach((movie) -> {
                    try {
                        printer.printRecord(movie.getId(), movie.getTitle(), movie.getDirector(), movie.getYear());
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                });
            }
        }

        String genresInMoviesFilePath = "new_genres_in_movies.csv";

        String[] GENRE_HEADERS = { "movieId", "genre" };

        try (Writer writer = new FileWriter(genresInMoviesFilePath)) {
            CSVFormat csvFormat = CSVFormat.DEFAULT.builder()
                    .setDelimiter(',')
                    .setHeader(GENRE_HEADERS)
                    .build();
            try (final CSVPrinter printer = new CSVPrinter(writer, csvFormat)) {
                movies.forEach((movie) -> {
                    movie.getGenres().forEach(genre -> {
                        try {
                            printer.printRecord(movie.getId(), genre);
                        } catch (IOException e) {
                            e.printStackTrace();
                        }
                    });

                });
            }

        }
    }

    private List<String> translateGenre(String cat) {

        cat = cat.toLowerCase().trim();
        List<String> genres = new ArrayList<>();
        if (cat.equals("avga") || cat.equals("avante garde") || cat.equals("avant garde")) {
            genres.add("Avant Garde");
        }
        if (cat.contains("fant")) {
            genres.add("Fantasy");
        }
        if (cat.contains("myst")) {
            genres.add("Mystery");
        }
        if (cat.startsWith("bio")) {
            genres.add("Biography");
        }
        if (cat.contains("dram") || cat.contains("draam")) {
            genres.add("Drama");
        }
        if (cat.contains("romt") || cat.contains("ront")) {
            genres.add("Romance");
        }
        if (cat.contains("myst")) {
            genres.add("Mystery");
        }
        if (cat.contains("sati")) {
            genres.add("Satire");
        }

        if (cat.contains("susp")) {
            genres.add("Suspense");
        }
        if (cat.contains("cart")) {
            genres.add("Cartoon");
        }
        if (cat.contains("west")) {
            genres.add("Western");
        }
        if (cat.contains("docu") || cat.contains("dicu") || cat.contains("duco") || cat.contains("ducu"))  {
            genres.add("Documentary");
        }
        if (cat.contains("expm")) {
            genres.add("Experimental");
        }

        if (cat.contains("hist")) {
            genres.add("History");
        }
        if (cat.contains("epic")) {
            genres.add("Epic");
        }

        if (cat.equals("act") || cat.contains("actn") || cat.contains("adct") || cat.contains("advt") || cat.contains("axtn") || cat.contains("ctn")) {
            genres.add("Action");
        }

        if (cat.contains("noir")) {
            genres.add("Noir");
        }
        if (cat.contains("comd") || cat.contains("cond")) {
            genres.add("Comedy");
        }
        if (cat.contains("por") || cat.contains("porn")) {
            genres.add("Adult");
        }
        if (cat.contains("scfi") || cat.contains("scif") || cat.contains("sxfi") || cat.contains("s.f.") || cat.contains("ca")) {
            genres.add("Sci-Fi");
        }

        if (cat.contains("horr") || cat.contains("hor")) {
            genres.add("Horror");
        }
        if (cat.contains("surr") || cat.contains("surl")) {
            genres.add("Surreal");
        }
        if (cat.equals("cnr") || cat.equals("cmr")) {
            genres.add("Comedy");
            genres.add("Romance");
        }

        if (cat.contains("disa")) {
            genres.add("Disaster");
        }
        if (cat.contains("faml")) {
            genres.add("Family");
        }

        if (cat.contains("musc") || cat.contains("muscl") || cat.contains("muusc")) {
            genres.add("Musical");
        }

        if (cat.contains("homo")) {
            genres.add("Homoerotic");
        }
        if (cat.contains("cnrb") || cat.contains("crim")) { // for some reason most are crime?
            genres.add("Crime");
        }
        if (cat.contains("natu")) {
            genres.add("Nature");
        }
        if (cat.contains("psyc")) {
            genres.add("Psychological");
        }

        if (genres.isEmpty() && !cat.isEmpty()) {
//            genres.add(cat.substring(0, 1).toUpperCase() + cat.substring(1));
            genres.add("Unknown");
        }



        // direct mappings
        return genres;
    }


    public void insertMovies(Connection conn, List<Movie> movies) throws SQLException {

        // insert into the db

        System.out.printf("Batch inserting %d new movies: \n", movies.size());




        Movie recentMovie = null;
        try {
        conn.setAutoCommit(false);
            var stmt = conn.prepareStatement(
                "INSERT INTO movies " +
                "(id, title, year, director, price)" +
                "VALUES (?, ?, ?, ?, ?);"
            );

            for (var movie : movies) {
                recentMovie = movie;

                stmt.setString(1, movie.getId());
                stmt.setString(2, movie.getTitle());
                if (movie.getYear() != null) {
                    stmt.setInt(3, movie.getYear());
                } else {
                    stmt.setNull(3, Types.INTEGER);
                }
                stmt.setString(4, movie.getDirector());
                stmt.setFloat(5, 5.0f);
                stmt.addBatch();
            }
            stmt.executeLargeBatch();
            var q = conn.createStatement();
            var rs2 = q.executeQuery("SELECT COUNT(id) as count FROM movies");
            while (rs2.next()) {
                System.out.println("new count: " + rs2.getInt("count"));
            }

            // insert new genres

            Set<String> genres = new HashSet<>();
            for (var movie : movies) {
                genres.addAll(movie.getGenres());
            }

            stmt = conn.prepareStatement("INSERT IGNORE INTO genres (name) VALUES (?)");

            for (var genre : genres) {
                stmt.setString(1, genre);
                stmt.addBatch();
            }
            System.out.println("inserting new genres");
            stmt.executeBatch();

            // create the lookup table

            q = conn.createStatement();
            System.out.println("getting all genres");
            var rs = q.executeQuery("SELECT id, name FROM genres");

            // lookup genre by name to id
            Map<String, String> genreLookupTable = new HashMap<>();
            while (rs.next()) {
                var id = rs.getString("id");
                var name = rs.getString("name");
                genreLookupTable.put(name, id);
            }

            // insert into genres in movies

            stmt = conn.prepareStatement(
                    "INSERT INTO genres_in_movies (genreId, movieId)" +
                        "VALUES (?, ?)"
            );

            for (var movie : movies) {
                for (var genre : genres) {
                    var genreId = genreLookupTable.get(genre);
                    stmt.setString(1, genreId);
                    stmt.setString(2, movie.getId());
                    stmt.addBatch();
                }
            }


            System.out.println("inserting new genres_in_movies");
            stmt.executeBatch();
        } catch (SQLException e) {
//            System.out.println(e.getStackTrace());
            e.printStackTrace();
            System.out.println(recentMovie);
            conn.rollback();
            throw e;
        }
        conn.close();
//        conn.commit();
    }
}
