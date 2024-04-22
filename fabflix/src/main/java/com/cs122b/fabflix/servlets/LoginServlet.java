package com.cs122b.fabflix.servlets;

import com.cs122b.fabflix.ResponseBuilder;
import com.cs122b.fabflix.models.Cart;
import com.cs122b.fabflix.models.Customer;
import com.cs122b.fabflix.repository.Database;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import javax.xml.crypto.Data;
import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

@WebServlet(name = "LoginServlet", urlPatterns = {"/login", "/isLoggedIn"})
public class LoginServlet extends HttpServlet {

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String providedEmail = request.getParameter("email");
        String providedPassword = request.getParameter("password");

        Database db = Database.getInstance();

        try (Connection conn = db.getConnection()) {
            String sql = "SELECT * FROM customers WHERE email = ?";
            try (PreparedStatement statement = conn.prepareStatement(sql)) {
                statement.setString(1, providedEmail);

                ResultSet rs = statement.executeQuery();
                if (rs.next()) {
                    String storedPassword = rs.getString("password");

                    if (providedPassword.equals(storedPassword)) {
                        Customer customer = new Customer(
                                rs.getInt("id"),
                                rs.getString("firstName"),
                                rs.getString("lastName"),
                                rs.getString("address"),
                                rs.getString("email"),
                                rs.getString("ccId"),
                                null
                        );

                        HttpSession session = request.getSession();
                        session.setMaxInactiveInterval(30 * 60); // Session timeout set to 30 minutes
                        session.setAttribute("customer", customer);

                        Cart cart = (Cart) session.getAttribute("cart");
                        if (cart == null) {
                            cart = new Cart();
                            session.setAttribute("cart", cart);
                        }

                        ResponseBuilder.json(response, customer, HttpServletResponse.SC_OK);
                    } else {
                        ResponseBuilder.error(response, HttpServletResponse.SC_UNAUTHORIZED, "Incorrect password.");
                    }
                } else {
                    ResponseBuilder.error(response, HttpServletResponse.SC_UNAUTHORIZED, "Account does not exist.");
                }
            }
        } catch (Exception e) {
            ResponseBuilder.error(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "An error occurred processing your request.");
        }
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        HttpSession session = request.getSession(false); // do not create a session if one does not exist
        boolean isLoggedIn = false;

        if (session != null) {
            Customer customer = (Customer) session.getAttribute("customer");
            if (customer != null) {
                isLoggedIn = true;
            }
        }
        System.out.println("Is logged: " + isLoggedIn);
        ResponseBuilder.json(response, isLoggedIn, HttpServletResponse.SC_OK);
    }
}
