
import java.io.FileWriter;
import java.io.IOException;
import java.io.StringWriter;
import java.io.Writer;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import javax.xml.parsers.ParserConfigurationException;
import javax.xml.parsers.SAXParserFactory;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;
import org.xml.sax.Attributes;
import org.xml.sax.SAXException;


public class Main {
    public static void main(String[] args) throws ParserConfigurationException, IOException, SAXException {
        var mp = new MovieParser();
        List<Movie> movies = mp.parse("mains243.xml");

        String moviesFilePath = "movies.csv";

        String[] HEADERS = { "id", "title", "director", "year" };

        try (Writer writer = new FileWriter(moviesFilePath)) {
            CSVFormat csvFormat = CSVFormat.DEFAULT.builder()
                    .setDelimiter(',')
                    .setHeader(HEADERS)
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
    }
}
