package com.cs122b.fabflix.repository;

import com.cs122b.fabflix.models.Star;

import java.sql.Connection;

public class StarRepository extends Repository {

    public StarRepository(Connection conn) {
        super(conn);
    }

    public Star getStarById(String id) {
        return null;
   }
}
