package com.cs122b.fabflix.servlets;
import com.cs122b.fabflix.ResponseBuilder;
import com.cs122b.fabflix.models.Cart;
import com.cs122b.fabflix.models.Movie;
import com.cs122b.fabflix.repository.Database;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;

@WebServlet(name = "CartServlet", urlPatterns = "/cart")
public class CartServlet extends HttpServlet {

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        HttpSession session = request.getSession();

        Cart cart = (Cart) session.getAttribute("cart");
        if (cart == null) {
            cart = new Cart();
            session.setAttribute("cart", cart);
        }

        ArrayList<Movie> cartItems = cart.getMovies();
        ResponseBuilder.json(response, cartItems, HttpServletResponse.SC_OK);
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        RequestBody body = mapper.readValue(request.getReader(), RequestBody.class);

        String action = body.getAction();
        System.out.println("Action: " + action);
        if ("add".equals(action)) {
            addMovieToCart(request, response, body);
        } else if ("edit".equals(action)) {
            editCart(request, response, body);
        } else {
            ResponseBuilder.error(response, HttpServletResponse.SC_BAD_REQUEST, "Invalid action.");
        }
    }

    private void addMovieToCart(HttpServletRequest request, HttpServletResponse response, RequestBody body) throws IOException {
        String movieId = body.getMovieId();

        System.out.println("Add Movie ID: " + movieId);

        HttpSession session = request.getSession();
        Cart cart = (Cart) session.getAttribute("cart");
        if (cart == null) {
            cart = new Cart();
            session.setAttribute("cart", cart);
        }

        // Check if the movie already exists in the cart
        Movie existingMovie = cart.getMovies().stream()
                .filter(m -> m.getId().equals(movieId))
                .findFirst()
                .orElse(null);

        if (existingMovie != null) {
            // If movie is already in the cart, don't add it again, just return the current cart
            ResponseBuilder.json(response, cart.getMovies(), HttpServletResponse.SC_OK);
            return;
        }


        Database db = Database.getInstance();
        try (Connection conn = db.getConnection()) {
            String sql = "SELECT id, title, year, director, price FROM movies WHERE id = ?";
            try (PreparedStatement statement = conn.prepareStatement(sql)) {
                statement.setString(1, movieId);
                ResultSet rs = statement.executeQuery();
                if (rs.next()) {
                    Movie movie = new Movie(
                            rs.getString("id"),
                            rs.getString("title"),
                            rs.getInt("year"),
                            rs.getString("director"),
                            rs.getDouble("price"),
                            1
                    );
                    System.out.println("Adding movie to the cart");
                    cart.addMovie(movie);
                    session.setAttribute("cart", cart);
                    ResponseBuilder.json(response, cart.getMovies(), HttpServletResponse.SC_OK);
                } else {
                    ResponseBuilder.error(response, HttpServletResponse.SC_NOT_FOUND, "No movie found with the specified ID in the database.");
                }
            }
        } catch (Exception e) {
            ResponseBuilder.error(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "An error occurred while processing your request.");
        }
    }


    private void editCart(HttpServletRequest request, HttpServletResponse response, RequestBody body) throws IOException {
        String movieId = body.getMovieId();
        int quantity = body.getQuantity();

        HttpSession session = request.getSession();
        Cart cart = (Cart) session.getAttribute("cart");
        if (quantity <= 0) {
            cart.removeMovieById(movieId);
        } else {
            boolean found = cart.updateMovieQuantity(movieId, quantity);
            if (!found) {
                ResponseBuilder.error(response, HttpServletResponse.SC_NOT_FOUND, "Movie not found in the cart.");
                return;
            }
        }
        session.setAttribute("cart", cart);
        ResponseBuilder.json(response, cart.getMovies(), HttpServletResponse.SC_OK);
    }




    static class RequestBody {
        private String action;
        private String movieId;
        private int quantity;

        public String getAction() {
            return action;
        }

        public void setAction(String action) {
            this.action = action;
        }

        public String getMovieId() {
            return movieId;
        }

        public void setMovieId(String movieId) {
            this.movieId = movieId;
        }

        public int getQuantity() {
            return quantity;
        }

        public void setQuantity(int quantity) {
            this.quantity = quantity;
        }
    }
}