import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import java.io.FileWriter;
import java.io.IOException;
import java.io.Writer;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

public class CastParser {
    private final DocumentBuilder builder;
    public CastParser() throws ParserConfigurationException {
        var factory = DocumentBuilderFactory.newInstance();
        builder = factory.newDocumentBuilder();
    }

    public void printSummary(List<StarredInRow> sir) {
        System.out.println("Cast Parser summary:");
        System.out.println("movies starred in :" + sir.size());
//        for (var row : sir) {
//            row.get
//
//        }


    }


    public List<StarredInRow> parse(String filename, Set<String> castLookupTable) throws IOException, SAXException {
        Document doc = builder.parse(this.getClass().getClassLoader().getResourceAsStream(filename));

        var root = doc.getDocumentElement();

        List<StarredInRow> stars_in_movies = new ArrayList<>();

        NodeList movieCastNodes = root.getElementsByTagName("m");
        for (int i = 0; i < movieCastNodes.getLength(); i++) {
            var movieCastNode = movieCastNodes.item(i);
            if (movieCastNode.getNodeType() == Node.ELEMENT_NODE) {
                var movieCastElement = (Element)movieCastNode;
                String movieId = movieCastElement.getElementsByTagName("f").item(0).getTextContent();
                String title = movieCastElement.getElementsByTagName("t").item(0).getTextContent();
                String stagename = movieCastElement.getElementsByTagName("a").item(0).getTextContent();

                System.out.println("movieId: " + movieId + " title: " + title + " starName: " + stagename);



                var star = new StarredInRow();
                star.setStagename(stagename);
                star.setMovieId(movieId);

                String key = String.format("%s,%s", title.trim(), stagename.trim());
                if (castLookupTable.contains(key)) {
                    System.out.println("duplicate cast member found: " + key);
                    continue;
                }
                stars_in_movies.add(star);
            }
        }

        return stars_in_movies;
    }


    public void writeFile(List<StarredInRow> starsInMovies) throws IOException {
        String starsInMoviesFilename = "stars_in_movies.csv";

        String[] HEADERS = { "movieId", "starName" };

        try (Writer writer = new FileWriter(starsInMoviesFilename)) {
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


    public void insertDB(String csvFile) {

    }
}
