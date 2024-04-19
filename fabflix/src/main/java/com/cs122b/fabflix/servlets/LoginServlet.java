package com.cs122b.fabflix.servlets;

import com.cs122b.fabflix.ResponseBuilder;
import com.cs122b.fabflix.models.Cart;
import com.cs122b.fabflix.models.Customer;
import com.cs122b.fabflix.repository.Database;
import com.cs122b.fabflix.utils.PasswordUtils;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

@WebServlet(name = "LoginServlet", urlPatterns = "/login")
public class LoginServlet extends HttpServlet {

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        System.out.println("LoginServlet");
        String providedEmail = request.getParameter("email");
        String providedPassword = request.getParameter("password");

        try (Connection conn = Database.getConnection()) {
            String sql = "SELECT * FROM customers WHERE email = ?";
            try (PreparedStatement statement = conn.prepareStatement(sql)) {
                statement.setString(1, providedEmail);

                ResultSet rs = statement.executeQuery();
                if (rs.next()) {
                    String storedPassword = rs.getString("password");
                    String storedEmail = rs.getString("email");
                    System.out.println("clientEmail:" + providedEmail);
                    System.out.println("clientPassword:" + providedPassword);
                    System.out.println("DBEmail:" + storedEmail);
                    System.out.println("DBPassword:" + storedPassword);

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

                        System.out.println("AUTH success");

                        HttpSession session = request.getSession();
                        session.setMaxInactiveInterval(30*60);
                        session.setAttribute("customer", customer);
                        Cart cart = (Cart) session.getAttribute("cart");
                        if (cart == null) {
                            cart = new Cart();
                            session.setAttribute("cart", cart);
                        }
                        System.out.println("Session ID: " + session.getId());
                        System.out.println("Customer set in session: " + session.getAttribute("customer"));

                        ResponseBuilder.json(response, customer, HttpServletResponse.SC_OK);
                    } else {
                        System.out.println("Incorrect password." + providedPassword);
                        ResponseBuilder.error(response, HttpServletResponse.SC_UNAUTHORIZED, "Incorrect password.");
                    }
                } else {
                    System.out.println("Account does not exist." + providedEmail);
                    ResponseBuilder.error(response, HttpServletResponse.SC_UNAUTHORIZED, "Account does not exist.");
                }
            }
        } catch (Exception e) {
            ResponseBuilder.error(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "An error occurred processing your request.");
        }
    }

}



