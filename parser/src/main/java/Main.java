
import java.io.FileReader;
import java.io.IOException;
import java.io.Reader;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.*;

import javax.xml.parsers.ParserConfigurationException;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.xml.sax.SAXException;


public class Main {
    public static void main(String[] args) throws ParserConfigurationException, IOException, SAXException, ClassNotFoundException, SQLException {
        Database.getInstance(); // initialize for no race conditions


        var movieParser = new MovieParser();
        var starParser = new StarParser();

        movieParser.run();
        starParser.run();

//        var stars = starParser.getStars();
//        var castParser = new CastParser(stars);
//        castParser.run();



    }
}
