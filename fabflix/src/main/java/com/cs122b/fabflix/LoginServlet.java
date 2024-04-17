package com.cs122b.fabflix;

import com.cs122b.fabflix.models.Customer;
import com.cs122b.fabflix.utils.PasswordUtils;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

@WebServlet(name = "LoginServlet", urlPatterns = "/login")
public class LoginServlet extends HttpServlet {

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {

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


                    if (providedEmail.equals(storedEmail) && providedPassword.equals(storedPassword)) { // bad practice. should never store actual password in the db.
                        Customer customer = new Customer(
                                rs.getInt("id"),
                                rs.getString("firstName"),
                                rs.getString("lastName"),
                                rs.getString("address"),
                                rs.getString("email"),
                                rs.getString("ccId"),
                                null
                        );

                        request.getSession().setAttribute("customer", customer);
                        ResponseBuilder.json(response, customer, HttpServletResponse.SC_OK);
                    } else {
                        ResponseBuilder.error(response, HttpServletResponse.SC_UNAUTHORIZED, "Incorrect email or password.");
                    }
                } else {
                    ResponseBuilder.error(response, HttpServletResponse.SC_UNAUTHORIZED, "Incorrect email or password.");
                }
            }
        } catch (Exception e) {
            ResponseBuilder.error(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "An error occurred processing your request.");
        }
    }

}
