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
import java.sql.SQLException;
import java.util.*;
import java.util.stream.Collectors;

public class CastParser {
    private final DocumentBuilder builder;
    private final Map<String, String> starNameIdLookupTable;
    private final Set<String> movieIds;

    public List<StarredInRow> getStarredInMovies() {
        return starredInMovies;
    }

    private final List<StarredInRow> starredInMovies;

    public CastParser() throws ParserConfigurationException {
        var factory = DocumentBuilderFactory.newInstance();
        builder = factory.newDocumentBuilder();

        starNameIdLookupTable = new HashMap<>();
        movieIds = new HashSet<>();

        try (var conn = Database.getInstance().getConnection()) {
            var query = conn.prepareStatement("SELECT id FROM movies");
            var rs = query.executeQuery();
            while (rs.next()) {
                var movieId = rs.getString("id");
                movieIds.add(movieId);
            }

            query = conn.prepareStatement("SELECT id, name from stars");
            rs = query.executeQuery();
            while (rs.next()) {
                var starId = rs.getString("id");
                var name = rs.getString("name");
                starNameIdLookupTable.put(name, starId);
            }


        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        starredInMovies = new ArrayList<>();


    }



    public void run() throws IOException, SAXException, SQLException {
        Set<String> castLookupTable = new HashSet<>();
        var reader = new FileReader("current_stars_in_movies.csv");
        var csvParser = new CSVParser(reader, CSVFormat.Builder.create().setHeader().build());

        for (var row : csvParser) {
            String name = row.get("name");
            String title = row.get("title");

            String key = String.format("%s,%s", title.trim(), name.trim());
            castLookupTable.add(key);
        }

        // Actor lookup table
        var starsInMovies = parse("casts124.xml", castLookupTable, movieIds);
        writeFile("new_stars_in_movies.csv", starsInMovies);
        printSummary(starsInMovies);

        Database db = Database.getInstance();
        try (var conn = db.getConnection()) {
            insertCast(conn, movieIds, starNameIdLookupTable, starsInMovies);
        }

    }


    public List<StarredInRow> parse(String filename, Set<String> castMembers, Set<String> movieIds) throws IOException, SAXException {
        Document doc = builder.parse(this.getClass().getClassLoader().getResourceAsStream(filename));

        var root = doc.getDocumentElement();

        Set<String> visited = new HashSet<>();

        NodeList movieCastNodes = root.getElementsByTagName("m");
        for (int i = 0; i < movieCastNodes.getLength(); i++) {
            var movieCastNode = movieCastNodes.item(i);
            if (movieCastNode.getNodeType() == Node.ELEMENT_NODE) {
                var movieCastElement = (Element)movieCastNode;
                String movieId = movieCastElement.getElementsByTagName("f").item(0).getTextContent().trim();
                String title = movieCastElement.getElementsByTagName("t").item(0).getTextContent().trim();
                String stagename = movieCastElement.getElementsByTagName("a").item(0).getTextContent().trim();

                var star = new StarredInRow();
                star.setStagename(stagename.trim());
                star.setMovieId(movieId);

                String key = String.format("%s,%s", title.trim(), stagename.trim());
                if (castMembers.contains(key)) {
                    System.out.println("invalid cast member: duplicate cast member found: " + key);
                    continue;
                }
                if (!movieIds.contains(movieId)) {
                    System.out.println("invalid cast member: invalid movie id for cast member: " + movieId + " " + stagename);
                    continue;
                }

                String castKey = String.format("%s,%s", movieId, stagename.trim());
                if (visited.contains(castKey)) {
                    System.out.println("invalid cast member: duplicate cast member found: " + castKey);
                } else {
                    visited.add(castKey);
                    starredInMovies.add(star);
                }
            }
        }

        return starredInMovies;
    }


    public void writeFile(String outFilename, List<StarredInRow> starsInMovies) throws IOException {
//        String starsInMoviesFilename = "stars_in_movies.csv";

        String[] HEADERS = { "movieId", "starName" };

        try (Writer writer = new FileWriter(outFilename)) {
            CSVFormat csvFormat = CSVFormat.DEFAULT.builder()
                    .setDelimiter(',')
                    .setHeader(HEADERS)
                    .build();
            try (final CSVPrinter printer = new CSVPrinter(writer, csvFormat)) {
                starsInMovies.forEach((row) -> {
                    try {
                        printer.printRecord(row.getMovieId(), row.getStagename());
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                });
            }
        }

    }

    public void printSummary(List<StarredInRow> sir) {
        System.out.println("Cast Parser summary:");
        System.out.println("movies starred in :" + sir.size());
    }


    public void insertCast(Connection conn, Set<String> validMovieIds, Map<String, String> starNameIdLookupTable, List<StarredInRow> starredIn) throws SQLException {

        conn.setAutoCommit(false);

        try {
            System.out.printf("Inserting %d new stars_in_movies rows into database\n", starredIn.size());

            var stmt = conn.prepareStatement(
                    "INSERT INTO stars_in_movies " +
                            "(starId, movieId)" +
                            "VALUES (?, ?)"
            );

            for (var star : starredIn) {
                var movieId = star.getMovieId();
                if (!validMovieIds.contains(movieId)) {
                    System.out.println("invalid cast member: movie not found in list of valid stars: " + movieId);
                    continue;
                }
                var name = star.getStagename();
                var starId = starNameIdLookupTable.get(name);
                if (starId == null) {
                    System.out.println("invalid cast member: star not found in list of valid stars: " + name);
                    continue;
                }

                stmt.setString(1, starId);
                stmt.setString(2, movieId);

                stmt.addBatch();
            }
            stmt.executeBatch();

        } catch (SQLException e) {
            e.printStackTrace();
            conn.rollback();
        }
        conn.commit();
    }
}
