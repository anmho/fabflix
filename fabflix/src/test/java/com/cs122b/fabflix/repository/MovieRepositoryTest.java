package com.cs122b.fabflix.repository;

import com.cs122b.fabflix.params.MovieFilterParams;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.sql.Connection;

public class MovieRepositoryTest {
    Connection conn;

    @BeforeEach
    public void setUp() {
        conn = Database.getConnection();
    }



    @Test
    public void testCreateFilterString() {
        MovieRepository repository = new MovieRepository();
//        private String id;
//        private String startsWith;
//
//        private String title; // Substring match
//        private String director;
//        private Integer year;



        MovieFilterParams params = new MovieFilterParams(
            null,
            "a",
            "term",
            "steven",
            2008
        );

        String whereClause = repository.createWhereClause(params);
        System.out.println(whereClause);
        System.out.println();

        params = new MovieFilterParams(
                null,
                null,
                "term",
                null,
                null
        );

        whereClause = repository.createWhereClause(params);
        System.out.println(whereClause);
    }

//    @Test
//    public void testCreate
}
