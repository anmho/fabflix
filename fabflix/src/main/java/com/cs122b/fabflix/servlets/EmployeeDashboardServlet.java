package com.cs122b.fabflix.servlets;

import com.cs122b.fabflix.ResponseBuilder;
import com.cs122b.fabflix.filters.LoginFilter;
import com.cs122b.fabflix.models.Star;
import com.cs122b.fabflix.models.User;
import com.cs122b.fabflix.repository.Database;
import com.cs122b.fabflix.repository.StarRepository;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ThreadLocalRandom;
import java.sql.*;
@WebServlet(name = "EmployeeDashboardServlet", value = {"/addStar", "/getDatabaseSchema"})
public class EmployeeDashboardServlet extends HttpServlet {
    private final Logger log = LogManager.getLogger(LoginFilter.class.getName());

    private StarRepository starRepository;

    public void init() {
        starRepository = new StarRepository();
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) {

        if (!this.isAuthorized(request, response)) {
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
            Star existingStar = starRepository.getStarByNameAndYear(starName, birthYear);
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

    protected void doGet(HttpServletRequest request, HttpServletResponse response) {
        if (!this.isAuthorized(request, response)) {
            ResponseBuilder.error(response, HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized access");
            return;
        }


        String path = request.getServletPath();
        if ("/getDatabaseSchema".equals(path)) {
            log.debug("/getDatabaseSchema" );
            getDatabaseSchema(request, response);
        }
    }


    private boolean isAuthorized (HttpServletRequest request, HttpServletResponse response) {
        HttpSession session = request.getSession(false);
        User user = (User) session.getAttribute("user");
        if (user == null || !"employee".equals(user.getUserType())) {
            return false;
        }
        return true;
    }
    private void getDatabaseSchema(HttpServletRequest request, HttpServletResponse response) {
        Database db = Database.getWriteInstance();
        List<Map<String, Object>> schemaList = new ArrayList<>();

        try (Connection conn = db.getConnection(); Statement stmt = conn.createStatement()) {
            List<String> tableNames = new ArrayList<>();
            ResultSet tables = stmt.executeQuery("SHOW TABLES");

            while (tables.next()) {
                String tableName = tables.getString(1);
                tableNames.add(tableName);
            }

            for (String tableName : tableNames) {
                Map<String, Object> tableMap = new HashMap<>();
                tableMap.put("name", tableName);
                List<Map<String, String>> attributes = new ArrayList<>();

                try (PreparedStatement describeStmt = conn.prepareStatement("DESCRIBE " + tableName)) {
                    ResultSet columns = describeStmt.executeQuery();
                    while (columns.next()) {
                        Map<String, String> columnMap = new HashMap<>();
                        columnMap.put("name", columns.getString("Field"));
                        columnMap.put("type", columns.getString("Type"));

                        attributes.add(columnMap);
                    }
                }

                tableMap.put("attributes", attributes);
                schemaList.add(tableMap);
            }

            ResponseBuilder.json(response, schemaList, HttpServletResponse.SC_OK);
        } catch (SQLException e) {
            log.error("Database error in /getDatabaseSchema", e);
            ResponseBuilder.error(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "A database error occurred");
        }
    }


    private String generateStarId() {
        long currentTimeMillis = System.currentTimeMillis();
        int randomNum = ThreadLocalRandom.current().nextInt(100, 1000);
        return Long.toString(currentTimeMillis).substring(7) + randomNum;
    }
}