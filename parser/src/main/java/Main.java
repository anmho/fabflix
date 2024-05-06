
import java.io.IOException;
import java.util.List;

import javax.xml.parsers.ParserConfigurationException;

import org.xml.sax.SAXException;


public class Main {
    public static void main(String[] args) throws ParserConfigurationException, IOException, SAXException {
        var mp = new MovieParser();
        List<Movie> movies = mp.parse("mains243.xml");
        mp.writeMovies(movies);
        mp.printSummary(movies);

        var cp = new StarParser();
        var starsInMovies = cp.parse("casts124.xml");
        cp.writeFile(starsInMovies);
        cp.printSummary(starsInMovies);
    }
}
