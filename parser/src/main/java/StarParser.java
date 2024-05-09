import com.sun.source.tree.ArrayAccessTree;
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

public class StarParser implements Runnable {
    private final DocumentBuilder builder;
    List<Star> stars;
    public StarParser() throws ParserConfigurationException {
        var factory = DocumentBuilderFactory.newInstance();
        builder = factory.newDocumentBuilder();
        stars = new ArrayList<>();
    }

    public List<Star> getStars() {
        return stars;
    }

    public void printSummary(List<Star> stars) {
        System.out.println("Cast Parser summary:");
        System.out.println("Stars parsed: " + stars.size());
    }

    @Override
    public void run() throws RuntimeException {
        // create a stars_in_movies lookup table
        Map<String, Star> starLookupTable = new HashMap<>();
        FileReader reader = null;
        try {
            reader = new FileReader("current_stars.csv");
        } catch (FileNotFoundException e) {
            throw new RuntimeException(e);
        }
        CSVParser csvParser = null;
        try {
            csvParser = new CSVParser(reader, CSVFormat.Builder.create().setHeader().build());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }


        // this should be a select statement for all the inserted stars by name
        // will assume their name is unique like the dataset does
//        Map<String, String>
        for (var row : csvParser) {
            var star = new Star();

            String id = row.get("id");
            String name = row.get("name");
            String birthYear = row.get("birthYear");

            System.out.println("csv: " + name);
            star.setStagename(name);
            star.setId(id);
            try {
                star.setDateOfBirth(Integer.parseInt(birthYear));
            } catch (NumberFormatException e) {
                System.out.printf("Invalid birthyear: " + birthYear);
            }
            String key = String.format("%s,%s", name, birthYear);

            starLookupTable.put(key, star);
        }









        // Cast lookup table
        // at this point we have found out there are no duplicate movies compared to our current_movies

        // we need a lookup table for newMovieId -> Movie
        // using this we can check

        // need a name -> id lookup table
        // we will just assume that acturso have unique names (which is also what the dataset assumes)

//        var sp = new StarParser();
        List<Star> stars = null;
        try {
            stars = parse("actors63.xml", starLookupTable);
        } catch (IOException e) {
            throw new RuntimeException(e);
        } catch (SAXException e) {
            throw new RuntimeException(e);
        }
        try {
            writeFile("new_stars.csv", stars);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        printSummary(stars);

        try (var conn = Database.getInstance().getConnection()) {
            insertDB(conn, stars);
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }


    public List<Star> parse(String filename, Map<String, Star> starLookupTable) throws IOException, SAXException {
        Document doc = builder.parse(this.getClass().getClassLoader().getResourceAsStream(filename));

        var root = doc.getDocumentElement();

        NodeList actorNodes = root.getElementsByTagName("actor");
        for (int i = 0; i < actorNodes.getLength(); i++) {
            var actorNode = actorNodes.item(i);
            if (actorNode.getNodeType() == Node.ELEMENT_NODE) {
                var actorElement = (Element) actorNode;
                String stagename = null;
                Integer dateOfBirth = null;

                var stagenameNode = actorElement.getElementsByTagName("stagename").item(0);
                if (stagenameNode != null) {
                    stagename = stagenameNode.getTextContent().trim();
                    String[] parts = stagename.split("~");
                    if (parts.length > 1) {
                        String postfix = parts[parts.length-1];

                        if (postfix.equalsIgnoreCase("jr.") || postfix.equalsIgnoreCase("sr.") || postfix.equalsIgnoreCase("sr") || postfix.equalsIgnoreCase("jr"  )) {
                            parts[parts.length-1] = postfix.substring(0, 1).toUpperCase() + postfix.substring(1);
                        }
                        String prefix = parts[0];
                        parts[0] = prefix.substring(0, 1).toUpperCase() + prefix.substring(1);
                        stagename = String.join(" ", parts);
                        System.out.println(stagename);
                    }
                }

                var dobNode = actorElement.getElementsByTagName("dob").item(0);
                if (dobNode != null) {
                    if (dobNode.getTextContent() != null && !dobNode.getTextContent().isEmpty()) {
                        try {
                            dateOfBirth = Integer.parseInt(dobNode.getTextContent().trim());
                        } catch (NumberFormatException e) {
                            System.out.println(stagename + " -- invalid year: " + dobNode.getTextContent());
                        }

                    }
                }

                var star = new Star();
                star.setStagename(stagename);
                System.out.println(stagename);



                if (dateOfBirth != null) {
                    star.setDateOfBirth(dateOfBirth);
                }

                star.setId(UUID.randomUUID().toString());

                // lookup in the table to attempt to assign an id
                String key = String.format("%s,%s", stagename, dateOfBirth);
                if (starLookupTable.containsKey(key)) {
                    System.out.println("found duplicate star: " + starLookupTable.get(key).toString() + " " + star.toString());
                    // lets skip the movie if we already have it
                    // non duplicates we can
                    // we should create a map of the newId -> original id  or we could just lookup by name
                    continue;
                }
                stars.add(star);
            }
        }

        return stars;
    }


    public List<Star> transform(List<Star> stars) {
        return null;
    }

    public void writeFile(String outFilename, List<Star> stars ) throws IOException {
//        String starsInMoviesFilename = "stars.csv";

        String[] HEADERS = { "id", "name", "birthYear" };

        try (Writer writer = new FileWriter(outFilename)) {
            CSVFormat csvFormat = CSVFormat.DEFAULT.builder()
                    .setDelimiter(',')
                    .setHeader(HEADERS)
                    .build();
            try (final CSVPrinter printer = new CSVPrinter(writer, csvFormat)) {
                stars.forEach((star) -> {
                    try {
                        printer.printRecord(star.getId(), star.getStagename(), star.getDateOfBirth());
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                });
            }
        }

    }


    public void insertDB(Connection conn, List<Star> stars) throws SQLException {
        conn.setAutoCommit(false);

        Star recentStar = null;

        try {
            var stmt = conn.prepareStatement(
                    "INSERT INTO stars " +
                            "(id, name, birthYear)" +
                            "VALUES "+
                            "(?, ?, ?)"
            );

            for (var star : stars) {
                recentStar = star;
                stmt.setString(1, star.getId());
                stmt.setString(2, star.getStagename());
                if (star.getDateOfBirth() != null) {
                    stmt.setInt(3, star.getDateOfBirth());
                } else {
                    stmt.setNull(3, Types.INTEGER);
                }

                stmt.addBatch();
            }

            stmt.executeBatch();

            var q = conn.createStatement();
            var rs = q.executeQuery("SELECT COUNT(*) as count FROM stars");
            while (rs.next()) {
                var count = rs.getInt("count");
                System.out.println("new star count: " + count);
            }


        } catch (SQLException e) {
            System.out.println(recentStar);
            conn.rollback();
            throw new RuntimeException(e);
        }
        conn.commit();
    }
}
