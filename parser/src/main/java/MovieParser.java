import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathFactory;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class MovieParser {
    private final DocumentBuilder builder;
    public MovieParser() throws ParserConfigurationException, IOException, SAXException {
        var factory = DocumentBuilderFactory.newInstance();
        builder = factory.newDocumentBuilder();
    }


    public List<Movie> parse(String filename) throws IOException, SAXException {
        Document doc = builder.parse(this.getClass().getClassLoader().getResourceAsStream(filename));

        var root = doc.getDocumentElement();

        List<Movie> movies = new ArrayList<>();

        var directorFilms = root.getElementsByTagName("directorfilms");
        for (int i = 0; i < directorFilms.getLength(); i++) {
            Node directorFilmNode = directorFilms.item(i);
            String director = null;
            if (directorFilmNode.getNodeType() == Node.ELEMENT_NODE) {
                Element directorFilmElement = (Element) directorFilmNode;
                Element directorElement = (Element)directorFilmElement.getElementsByTagName("director").item(0);
                Node dirnameNode = directorElement.getElementsByTagName("dirname").item(0);
//                if (dirnameNode != null) {
//                    System.out.println(dirnameNode.getTextContent());
//                }
                Node dirnNode = directorElement.getElementsByTagName("dirn").item(0);
//                if (dirnNode != null) {
//                    System.out.println(dirnNode.getTextContent());
//                }

                if (dirnameNode != null) {
                    director = dirnameNode.getTextContent();
                } else if (dirnNode != null) {
                    director = dirnNode.getTextContent();
                }

//                System.out.println("director: " + director);
                Element filmsElement = ((Element)((Element)directorFilmNode).getElementsByTagName("films").item(0));
                NodeList filmsList = filmsElement.getElementsByTagName("film");
                for (int j = 0; j < filmsList.getLength(); j++) {
                    Node filmNode = filmsList.item(j);
                    if (filmNode.getNodeType() == Node.ELEMENT_NODE) {
                        Element film = (Element)filmNode;

                        var filmId = film.getElementsByTagName("fid").item(0);
                        if (filmId == null) {
                            filmId = film.getElementsByTagName("filmed").item(0);
                        }

                        String movieId = filmId.getTextContent();

//                        System.out.println("filmId: " + movieId);

                        var titleNode = film.getElementsByTagName("t").item(0);
                        String title = titleNode.getTextContent();

//                        System.out.println("title: " + title);
                        int year = 0;

                        var yearNode = film.getElementsByTagName("year").item(0);
                        try {
                            year = Integer.parseInt(yearNode.getTextContent());
                        } catch (NumberFormatException e) {
                            year = 0;
                        }
//                        System.out.println("year: " + year);
                        Movie movie = new Movie();
                        movie.setId(movieId);
                        movie.setTitle(title);
                        movie.setDirector(director);
                        movie.setYear(year);
                        movies.add(movie);
                    }
                }
            }
        }
        return movies;
    }
}