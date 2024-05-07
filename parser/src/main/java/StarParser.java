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
import java.util.UUID;

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


    public List<Star> parse(String filename, Map<String, Star> starLookupTable) throws IOException, SAXException {
        Document doc = builder.parse(this.getClass().getClassLoader().getResourceAsStream(filename));

        var root = doc.getDocumentElement();

        List<Star> stars = new ArrayList<>();

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
        // maybe refactor later
        return null;
    }

    public void writeFile(List<Star> stars ) throws IOException {
        String starsInMoviesFilename = "stars.csv";

        String[] HEADERS = { "id", "name", "birthYear" };

        try (Writer writer = new FileWriter(starsInMoviesFilename)) {
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


    public void insertDB(String csvFile) {

    }
}
