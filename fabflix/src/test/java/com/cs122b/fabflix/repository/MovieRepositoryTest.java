package com.cs122b.fabflix.repository;

import org.junit.jupiter.api.BeforeEach;

import java.sql.Connection;

public class MovieRepositoryTest {
    Connection conn;

    @BeforeEach
    public void setUp() {
        conn = Database.getConnection();
    }

}
