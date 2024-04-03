package com.cs122b.fabflix;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class Database {
    public static Connection connection;

    Connection getConnection() {
        if (connection == null) {
            String connString = AppConfig.getProperty("db.url");
            if (connString == null) {
                throw new IllegalStateException("db.url must be defined");
            }

            try {
                connection = DriverManager.getConnection(connString);
            } catch (SQLException e) {
                e.printStackTrace();
                System.exit(1);
            }

        }
        return connection;
    }
}
