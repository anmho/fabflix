package com.cs122b.fabflix.repository;

import com.cs122b.fabflix.models.Star;

import java.sql.*;

public class StarRepository {
    public Star getStarById(String id) throws SQLException {
        String query = "SELECT id, name, birthYear, numMovies " +
                "FROM stars s " +
                "JOIN num_movies_starred_in nmsi ON id = nmsi.starId "  +
                "WHERE s.id = ?;"
                ;

        Database db = Database.getReadInstance();
        try (Connection conn = db.getConnection()) {{
            try {
                PreparedStatement stmt = conn.prepareStatement(query);
                stmt.setString(1, id);


                ResultSet rs = stmt.executeQuery();
                if (!rs.next()) {
                    return null;
                }

                String name = rs.getString("name");
                int birthYear = rs.getInt("birthYear");
                int numMovies = rs.getInt("numMovies");

                return new Star(id, name, birthYear, numMovies);
            } catch (SQLException e) {
                int code = e.getErrorCode();
                // do stuff based on the code,
                // 404 return null etc
                e.printStackTrace();
                return null;
            }
        }}

   }

    public Star getStarByNameAndYear(String name, Integer birthYear) throws SQLException {
        String query = "SELECT id, name, birthYear FROM stars WHERE name = ? AND (birthYear = ? OR (birthYear IS NULL AND ? IS NULL));";
        Database db = Database.getReadInstance();
        try (Connection conn = db.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {
            stmt.setString(1, name);
            if (birthYear != null) {
                stmt.setInt(2, birthYear);
                stmt.setNull(3, java.sql.Types.INTEGER);
            } else {
                stmt.setNull(2, java.sql.Types.INTEGER);
                stmt.setNull(3, java.sql.Types.INTEGER);
            }

            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                return new Star(rs.getString("id"), rs.getString("name"), rs.getInt("birthYear"), 0);
            }
            return null;
        }
    }


    public void addStar(Star star) throws SQLException {
        String query = "INSERT INTO stars (id, name, birthYear) VALUES (?, ?, ?);";
        Database db = Database.getWriteInstance();
        try (Connection conn = db.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {
            stmt.setString(1, star.getId());
            stmt.setString(2, star.getName());
            if (star.getBirthYear() == null) {
                stmt.setNull(3, Types.INTEGER); // Handle null birthYear
            } else {
                stmt.setInt(3, star.getBirthYear());
            }
            stmt.executeUpdate();
        }
    }


}

