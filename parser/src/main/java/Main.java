
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

        var cp = new CastParser();
        var starsInMovies = cp.parse("casts124.xml");
        cp.writeFile(starsInMovies);
        cp.printSummary(starsInMovies);

        var sp = new StarParser();
        var stars = sp.parse("actors63.xml");
        sp.writeFile(stars);
        sp.printSummary(stars);
    }
}
