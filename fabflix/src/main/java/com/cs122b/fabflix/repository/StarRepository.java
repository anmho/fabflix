package com.cs122b.fabflix.repository;

import com.cs122b.fabflix.models.Star;

import javax.xml.crypto.Data;
import java.sql.*;

public class StarRepository {
    public Star getStarById(String id) throws SQLException {
        String query = "SELECT id, name, birthYear " +
                "FROM stars s " +
                "JOIN num_movies_starred_in nmsi ON id = nmsi.starId "  +
                "WHERE s.id = ?;"
                ;

        Database db = Database.getInstance();

        Connection conn = db.getConnection();

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
   }


}

