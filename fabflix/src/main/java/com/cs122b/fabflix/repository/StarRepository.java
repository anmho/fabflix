package com.cs122b.fabflix.repository;

import com.cs122b.fabflix.models.Genre;
import com.cs122b.fabflix.models.Movie;
import com.cs122b.fabflix.models.Star;
import com.cs122b.fabflix.repository.params.MovieFilterParams;
import com.cs122b.fabflix.repository.params.MovieSortParams;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class StarRepository extends Repository {

    public StarRepository(Connection conn) {
        super(conn);
    }

    public Star getStarById(String id) {
        String query = "SELECT id, name, birthYear " +
                "FROM stars " +
                "WHERE id = ?;"
                ;

        Connection conn = getConnection();

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

