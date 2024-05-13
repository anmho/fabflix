
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

        List<Thread> threads = new ArrayList<>();

        var movieParser = new MovieParser();
        var starParser = new StarParser();

        Thread movieThread = new Thread(movieParser);
        threads.add(movieThread);
        movieThread.start();

        Thread starThread = new Thread(starParser);
        threads.add(starThread);
        starThread.start();


        for (var thread : threads) {
            try {
                thread.join();
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
        }

//        movieParser.getMovies();
//        starParser.getStars();
        var castParser = new CastParser();
        castParser.run();
    }
}
