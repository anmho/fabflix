package com.cs122b.fabflix.servlets;

import com.cs122b.fabflix.ResponseBuilder;
import com.cs122b.fabflix.models.Cart;
import com.cs122b.fabflix.models.Customer;
import com.cs122b.fabflix.models.Movie;
import com.cs122b.fabflix.repository.Database;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.sql.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@WebServlet(name = "CheckoutServlet", urlPatterns = "/checkout")
public class CheckoutServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        System.out.println("Checkout called");
        HttpSession session = request.getSession(false);
        Cart cart = (Cart) session.getAttribute("cart");
        Customer customer = (Customer) session.getAttribute("customer");

        if (cart == null || cart.getMovies().isEmpty() || customer == null) {
            ResponseBuilder.error(response, HttpServletResponse.SC_BAD_REQUEST, "Your cart is empty.");
            return;
        }

        String creditCardId = request.getParameter("creditCardId");
        String firstName = request.getParameter("firstName");
        String lastName = request.getParameter("lastName");
        String expirationDate = request.getParameter("expirationDate");

        System.out.println("Credit Card ID ==> " + creditCardId);
        System.out.println("First Name ==> " + firstName);
        System.out.println("Last Name ==> " + lastName);
        System.out.println("Expiration Date ==> " + expirationDate);

        try (Connection conn = Database.getConnection()) {
            if (!validateCreditCard(conn, creditCardId, firstName, lastName, expirationDate)) {
                ResponseBuilder.error(response, HttpServletResponse.SC_UNAUTHORIZED, "Invalid credit card details.");
                return;
            }
            System.out.println("Credit card looking good");

            conn.setAutoCommit(false);
            try {
                ArrayList<Movie> checkedOutMovies = new ArrayList<>(cart.getMovies());
                double totalCheckoutAmount = processSales(conn, cart, customer.getId());
                conn.commit();
                cart.clearMovies();
                session.setAttribute("cart", cart);
                System.out.println("Checkout done, sending response: " + totalCheckoutAmount);

                Map<String, Object> responseData = new HashMap<>();
                responseData.put("totalCheckoutAmount", totalCheckoutAmount);
                responseData.put("checkedOutItems", checkedOutMovies);

                ResponseBuilder.json(response, responseData, HttpServletResponse.SC_OK);
            } catch (Exception e) {
                System.out.println("A database error occurred while processing your request.");
                conn.rollback();
                ResponseBuilder.error(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "A database error occurred while processing your request.");
            }
        } catch (Exception e) {
            System.out.println("A database error occurred while processing your request.");
            ResponseBuilder.error(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "A database error occurred while processing your request.");
        }
    }

    private boolean validateCreditCard(Connection conn, String creditCardId, String firstName, String lastName, String expirationDate) throws SQLException {
        String sql = "SELECT * FROM creditcards WHERE id = ? AND firstName = ? AND lastName = ? AND expiration = ?";
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, creditCardId);
            stmt.setString(2, firstName);
            stmt.setString(3, lastName);
            stmt.setDate(4, java.sql.Date.valueOf(expirationDate));
            ResultSet rs = stmt.executeQuery();
            return rs.next();
        }
    }

    private double processSales(Connection conn, Cart cart, int customerId) throws SQLException {
        String sql = "INSERT INTO sales (customerId, movieId, saleDate, quantity, invoiceAmount) VALUES (?, ?, ?, ?, ?)";
        PreparedStatement stmt = conn.prepareStatement(sql);

        double totalAmount = 0;
        for (Movie movie : cart.getMovies()) {
            double invoiceAmount = movie.getPrice() * movie.getQuantity();
            totalAmount += invoiceAmount;

            stmt.setInt(1, customerId);
            stmt.setString(2, movie.getId());
            stmt.setTimestamp(3, new Timestamp(System.currentTimeMillis()));
            stmt.setInt(4, movie.getQuantity());
            stmt.setDouble(5, invoiceAmount);
            stmt.addBatch();
        }
        stmt.executeBatch();
        return totalAmount;
    }
}
