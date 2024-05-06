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

public class StarParser {
    private final DocumentBuilder builder;
    public StarParser() throws ParserConfigurationException {
        var factory = DocumentBuilderFactory.newInstance();
        builder = factory.newDocumentBuilder();
    }

    public void printSummary(List<Star> stars) {
        System.out.println("Cast Parser summary:");
        System.out.println("Stars parsed: " + stars.size());
    }


    public List<Star> parse(String filename) throws IOException, SAXException {
        Document doc = builder.parse(this.getClass().getClassLoader().getResourceAsStream(filename));

        var root = doc.getDocumentElement();

        List<Star> stars = new ArrayList<>();

        NodeList actorNodes = root.getElementsByTagName("actor");
        for (int i = 0; i < actorNodes.getLength(); i++) {
            var actorNode = actorNodes.item(i);
            if (actorNode.getNodeType() == Node.ELEMENT_NODE) {
                var actorElement = (Element) actorNode;
                String stagename = null;
                String dateOfBirth = null;

                var stagenameNode = actorElement.getElementsByTagName("stagename").item(0);
                if (stagenameNode != null) {
                    stagename = stagenameNode.getTextContent();
                }

                var dobNode = actorElement.getElementsByTagName("dob").item(0);
                if (dobNode != null) {
                    dateOfBirth = dobNode.getTextContent();
                }

                System.out.println("Stagename: " + stagename);
                System.out.println("Date of birth: " + dateOfBirth);
                var star = new Star();
                star.setStagename(stagename);
                star.setDateOfBirth(dateOfBirth);
                stars.add(star);
            }
        }

        return stars;
    }


    public void writeFile(List<Star> stars ) throws IOException {
        String starsInMoviesFilename = "stars.csv";

        String[] HEADERS = { "stagename", "dateOfBirth" };

        try (Writer writer = new FileWriter(starsInMoviesFilename)) {
            CSVFormat csvFormat = CSVFormat.DEFAULT.builder()
                    .setDelimiter(',')
                    .setHeader(HEADERS)
                    .build();
            try (final CSVPrinter printer = new CSVPrinter(writer, csvFormat)) {
                stars.forEach((star) -> {
                    try {
                        printer.printRecord(star.getStagename(), star.getDateOfBirth());
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
