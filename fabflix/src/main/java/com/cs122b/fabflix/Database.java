package com.cs122b.fabflix;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class Database {
    private static Connection connection;

    public static Connection getConnection() {
        try {
            if (connection == null || connection.isClosed()) {

                String url = AppConfig.getProperty("db.url");
                String username = AppConfig.getProperty("db.username");
                String password = AppConfig.getProperty("db.password");

                System.out.println(url);
                System.out.println(username);
                System.out.println(password);

                String connString = String.format("%s?autoReconnect=true&useSSL=false", url);
                System.out.println(connString);
                try {
                    Class.forName("com.mysql.cj.jdbc.Driver");
                } catch (ClassNotFoundException e) {
                    e.printStackTrace();
                    throw new RuntimeException(e);
                }

                if (connString == null) {
                    throw new IllegalStateException("db.url must be defined");
                }

                connection = DriverManager.getConnection(connString, username, password);
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return connection;
    }
}
