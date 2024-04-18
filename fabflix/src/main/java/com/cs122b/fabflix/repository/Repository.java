package com.cs122b.fabflix.repository;

import java.sql.Connection;
// If we do this we can easily add connection pooling to all the repositories later
public class Repository {
    private final Connection conn;

    public Repository(Connection connection) {
        this.conn = connection;
    }
    public Connection getConnection() {
        return conn;
    }

    public enum Ordering {
        ASCENDING,
        DESCENDING
    }
}
