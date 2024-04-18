package com.cs122b.fabflix.repository;

import com.cs122b.fabflix.models.Star;

import java.sql.*;

public class StarRepository {


    public Star getStarById(String id) {
        String query = "SELECT id, name, birthYear " +
                "FROM stars " +
                "WHERE id = ?;"
                ;

        Connection conn = Database.getConnection();

        try {
            PreparedStatement stmt = conn.prepareStatement(query);
            stmt.setString(1, id);


            ResultSet rs = stmt.executeQuery();
            if (!rs.next()) {
                return null;
            }

            String name = rs.getString("name");
            int birthYear = rs.getInt("birthYear");

            Star star = new Star(id, name, birthYear);
            return star;
        } catch (SQLException e) {
            int code = e.getErrorCode();
            // do stuff based on the code,
            // 404 return null etc
            e.printStackTrace();
            return null;
        }
   }


}

