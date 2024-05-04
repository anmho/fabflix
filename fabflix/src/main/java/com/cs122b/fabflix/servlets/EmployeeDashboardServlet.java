package com.cs122b.fabflix.servlets;

import com.cs122b.fabflix.ResponseBuilder;
import com.cs122b.fabflix.filters.LoginFilter;
import com.cs122b.fabflix.models.Star;
import com.cs122b.fabflix.models.User;
import com.cs122b.fabflix.repository.StarRepository;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import java.sql.SQLException;
import java.util.concurrent.ThreadLocalRandom;

@WebServlet(name = "EmployeeDashboardServlet", value = "/addStar")
public class EmployeeDashboardServlet extends HttpServlet {
    private final Logger log = LogManager.getLogger(LoginFilter.class.getName());

    private StarRepository starRepository;

    public void init() {
        starRepository = new StarRepository();
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) {
        HttpSession session = request.getSession(false);
        User user = (User) session.getAttribute("user"); // Cast to User
        if (user == null || !"employee".equals(user.getUserType())) {
            ResponseBuilder.error(response, HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized access");
            return;
        }

        String starName = request.getParameter("name");
        String birthYearStr = request.getParameter("birthYear");
        Integer birthYear = null;
        log.debug("startName: " + starName + " birthYear: " + birthYearStr);

        if (birthYearStr != null && !birthYearStr.isEmpty()) {
            try {
                birthYear = Integer.parseInt(birthYearStr);
            } catch (NumberFormatException e) {
                ResponseBuilder.error(response, HttpServletResponse.SC_BAD_REQUEST, "Invalid birth year format");
                return;
            }
        }

        if (starName == null || starName.trim().isEmpty()) {
            ResponseBuilder.error(response, HttpServletResponse.SC_BAD_REQUEST, "Star name is required");
            return;
        }

        try {
            Star existingStar = starRepository.getStarByName(starName);
            if (existingStar != null) {
                ResponseBuilder.error(response, HttpServletResponse.SC_CONFLICT, "Star already exists");
                return;
            }

            String starId = generateStarId(); // Generate a suitable star ID
            Star newStar = new Star(starId, starName, birthYear, 0);
            starRepository.addStar(newStar);

            ResponseBuilder.json(response, newStar, HttpServletResponse.SC_CREATED);
        } catch (SQLException e) {
            e.printStackTrace();
            ResponseBuilder.error(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "A database error occurred");
        }
    }

    private String generateStarId() {
        long currentTimeMillis = System.currentTimeMillis();
        int randomNum = ThreadLocalRandom.current().nextInt(100, 1000);
        return Long.toString(currentTimeMillis).substring(7) + randomNum;
    }
}
