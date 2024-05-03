package com.cs122b.fabflix.servlets;

import com.cs122b.fabflix.ResponseBuilder;
import com.cs122b.fabflix.models.Cart;
import com.cs122b.fabflix.models.Customer;
import com.cs122b.fabflix.models.User;
import com.cs122b.fabflix.models.Employee;
import com.cs122b.fabflix.repository.Database;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.HashMap;
import java.util.Map;

@WebServlet(name = "LoginServlet", urlPatterns = {"/login", "/employeeLogin", "/isLoggedIn"})
public class LoginServlet extends HttpServlet {

    private final Logger log = LogManager.getLogger(LoginServlet.class.getName());

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String path = request.getServletPath();
        switch (path) {
            case "/login":
                handleCustomerLogin(request, response);
                break;
            case "/employeeLogin":
                handleEmployeeLogin(request, response);
                break;
            default:
                response.sendError(HttpServletResponse.SC_NOT_FOUND, "Endpoint not supported.");
        }
    }

    private void handleCustomerLogin(HttpServletRequest request, HttpServletResponse response) throws IOException {
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
                                rs.getString("email")
                        );
                        User user = new User(
                                rs.getInt("id"),
                                "customer",
                                rs.getString("email")
                        );

                        HttpSession session = request.getSession();
                        session.setMaxInactiveInterval(30 * 60); // Session timeout set to 30 minutes
                        session.setAttribute("customer", customer);
                        session.setAttribute("user", user);

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
            log.error("Error processing customer login", e);
            ResponseBuilder.error(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "An error occurred processing your request.");
        }
    }

    private void handleEmployeeLogin(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String providedEmail = request.getParameter("email");
        String providedPassword = request.getParameter("password");

        Database db = Database.getInstance();
        try (Connection conn = db.getConnection()) {
            String sql = "SELECT * FROM employees WHERE email = ?";
            try (PreparedStatement statement = conn.prepareStatement(sql)) {
                statement.setString(1, providedEmail);
                ResultSet rs = statement.executeQuery();
                if (rs.next()) {
                    String storedPassword = rs.getString("password");
                    if (providedPassword.equals(storedPassword)) {
                        Employee employee = new Employee(
                                rs.getString("email"),
                                rs.getString("fullname")
                        );
                        User user = new User(
                                -1, // no id for employee : (
                                "employee",
                                rs.getString("email")
                        );

                        HttpSession session = request.getSession();
                        session.setMaxInactiveInterval(30 * 60); // Session timeout set to 30 minutes
                        session.setAttribute("employee", employee);
                        session.setAttribute("user", user);

                        ResponseBuilder.json(response, employee, HttpServletResponse.SC_OK);
                    } else {
                        ResponseBuilder.error(response, HttpServletResponse.SC_UNAUTHORIZED, "Incorrect password.");
                    }
                } else {
                    ResponseBuilder.error(response, HttpServletResponse.SC_UNAUTHORIZED, "Employee account does not exist.");
                }
            }
        } catch (Exception e) {
            log.error("Error processing employee login", e);
            ResponseBuilder.error(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "An error occurred processing your request.");
        }
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        HttpSession session = request.getSession(false); // do not create a session if one does not exist
        boolean isLoggedIn = false;
        String userType = null;

        if (session != null) {
            User user = (User) session.getAttribute("user");
            if (user != null) {
                isLoggedIn = true;
                userType = user.getUserType(); // customer or employee
            }
        }

        Map<String, Object> loginStatus = new HashMap<>();
        loginStatus.put("isLoggedIn", isLoggedIn);
        loginStatus.put("userType", userType);

        ResponseBuilder.json(response, loginStatus, HttpServletResponse.SC_OK);
    }

}
