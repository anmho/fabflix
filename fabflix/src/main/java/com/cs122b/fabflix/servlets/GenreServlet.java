package com.cs122b.fabflix.servlets;

import java.io.*;
import java.sql.Array;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import com.cs122b.fabflix.ResponseBuilder;
import com.cs122b.fabflix.models.Genre;
import com.cs122b.fabflix.repository.Database;
import jakarta.servlet.http.*;
import jakarta.servlet.annotation.*;

@WebServlet(name = "genreServlet", value = "/genres")
public class GenreServlet extends HttpServlet {
    private Database db;

    public void init() {
        db = Database.getInstance();
    }


    public void doGet(HttpServletRequest request, HttpServletResponse response) {

        try {
            var conn = db.getConnection();
            var stmt = conn.prepareStatement("SELECT * FROM genres;");

            ResultSet rs = stmt.executeQuery();
            List<Genre> genres = new ArrayList<>();

            while (rs.next()) {
                int id = rs.getInt("id");
                String name = rs.getString("name");

                Genre genre = new Genre(id, name);
                genres.add(genre);
            }

            ResponseBuilder.json(response, genres, 200);

        } catch (SQLException e) {
            throw new RuntimeException(e);
        }

    }

    public void destroy() {
    }
}