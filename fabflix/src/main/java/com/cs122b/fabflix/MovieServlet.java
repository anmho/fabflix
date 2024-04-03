package com.cs122b.fabflix;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

@WebServlet(name = "movieServlet", value="/movies")
public class MovieServlet extends HttpServlet {

    private Connection conn;

    public void init() {
        conn = Database.getConnection();
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
//        resp.setContentType("application/json");


        // get all the movies
        // we will use query parameter instead of path param for simplicity
//        PrintWriter out = resp.getWriter();

//        Movie movie = new Movie("1", "1", 2, "joe");

//        ObjectMapper mapper = new ObjectMapper();
//        String json = mapper.writeValueAsString(movie);
//        System.out.println(json);
//        out.println(json);

        try {
            Statement stmt = conn.createStatement();
            ResultSet rows = stmt.executeQuery("SELECT * FROM movies;");
            while (rows.next()) {

                System.out.println("movie id " + rows.getString("id"));
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }

    }

    public void destroy() {

    }
}
