package com.cs122b.fabflix.repository;

import com.cs122b.fabflix.params.*;
import org.apache.logging.log4j.core.util.Assert;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;



import java.sql.Connection;
import java.util.ArrayList;
import java.util.List;

public class MovieRepositoryTest {
    Connection conn;

    @BeforeEach
    public void setUp() {
        conn = Database.getConnection();
    }



    @Test
    public void testCreateFilterString() {
        MovieRepository repository = new MovieRepository();


        MovieFilterParams params = new MovieFilterParams(
            null,
            "a",
            "term",
            "steven",
            2008
        );

        String whereClause = repository.createWhereClause(params);
        System.out.println(whereClause);

        params = new MovieFilterParams(
                null,
                null,
                "term",
                null,
                null
        );

        whereClause = repository.createWhereClause(params);
        Assertions.assertFalse(whereClause.contains("AND"));
        System.out.println(whereClause);
    }

    @Test
    public void testCreateOrderByClause() {
        MovieRepository repository = new MovieRepository();


        List<MovieSortField> fields = new ArrayList<>();
        fields.add(MovieSortField.RATING);
        fields.add(MovieSortField.TITLE);

        MovieSortParams params = new MovieSortParams(
                fields,
                SortOrder.DESCENDING
        );
        String clause = repository.createOrderByClause(params);
        System.out.println(clause);

        Assertions.assertTrue(clause.contains("rating, title"));
    }

    @Test
    public void testCreatePaginationString() {
        MovieRepository repository = new MovieRepository();

        PaginationParams params = new PaginationParams(0, 20);

        String clause = repository.createPaginationString(params);
        System.out.println("Pagination clausea");
        System.out.println(clause);
    }
}
