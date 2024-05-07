
import java.io.FileReader;
import java.io.IOException;
import java.io.Reader;
import java.util.*;

import javax.xml.parsers.ParserConfigurationException;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.xml.sax.SAXException;


public class Main {
    public static void main(String[] args) throws ParserConfigurationException, IOException, SAXException {
        var mp = new MovieParser();

        // only title-year-director key is unique
        // Movie Lookup table

        Map<String, Movie> movieLookupTable = new HashMap<>();
        Reader reader = new FileReader("current_movies.csv");
        CSVParser csvParser = new CSVParser(reader, CSVFormat.Builder.create().setHeader().build());

        for (var row : csvParser) {
            var movie = new Movie();

            String title = row.get("title");
            String director = row.get("director");
            String year = row.get("year");


            String key = String.format("%s,%s", title.trim(), director.trim());
            movie.setTitle(title);
            movie.setDirector(director);
            movie.setYear(Integer.parseInt(year));

            movieLookupTable.put(key, movie);
        }



        // create a stars_in_movies lookup table
        Map<String, Star> starLookupTable = new HashMap<>();
        reader = new FileReader("current_stars.csv");
        csvParser = new CSVParser(reader, CSVFormat.Builder.create().setHeader().build());

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

        List<Movie> movies = mp.parse("mains243.xml", movieLookupTable);
        mp.writeFile("new_movies.csv", movies);
        mp.printSummary(movies);

        var cp = new CastParser();

        Set<String> castLookupTable = new HashSet<>();
        reader = new FileReader("current_stars_in_movies.csv");
        csvParser = new CSVParser(reader, CSVFormat.Builder.create().setHeader().build());

        for (var row : csvParser) {

            String name = row.get("name");
            String title = row.get("title");

            System.out.println("csv: " + name);
            String key = String.format("%s,%s", title.trim(), name.trim());
            castLookupTable.add(key);
        }



        // Actor lookup table
        var starsInMovies = cp.parse("casts124.xml", castLookupTable);
        cp.writeFile("new_stars_in_movies.csv", starsInMovies);
        cp.printSummary(starsInMovies);

        // Cast lookup table
        // at this point we have found out there are no duplicate movies compared to our current_movies

        // we need a lookup table for newMovieId -> Movie
        // using this we can check

        // need a name -> id lookup table
        // we will just assume that acturso have unique names (which is also what the dataset assumes)





        var sp = new StarParser();
        var stars = sp.parse("actors63.xml", starLookupTable);
        sp.writeFile("new_stars", stars);
        sp.printSummary(stars);

        Map<String, String> starNameIdLookupTable = new HashMap<>();
        for (var star : stars) {
            starNameIdLookupTable.put(star.getStagename(), star.getId());
        }
        // will use later


    }
}
