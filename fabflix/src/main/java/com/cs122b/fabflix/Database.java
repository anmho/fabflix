package com.cs122b.fabflix;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

import org.apache.tomcat.jdbc.pool.DataSource;
import org.apache.tomcat.jdbc.pool.PoolProperties;


public class Database {
    private static Connection connection;
    private static DataSource dataSource;

    public static Connection getConnection() {
        try {
            if (dataSource == null) {
                String url = AppConfig.getProperty("db.url");
                String username = AppConfig.getProperty("db.username");
                String password = AppConfig.getProperty("db.password");

                System.out.println(url);
                System.out.println(username);
                System.out.println(password);


                try {
                    Class.forName("com.mysql.cj.jdbc.Driver");
                } catch (ClassNotFoundException e) {
                    e.printStackTrace();
                    throw new RuntimeException(e);
                }

                PoolProperties poolProperties = new PoolProperties();


                System.out.println(url);
                poolProperties.setUrl(url);
                poolProperties.setUsername(username);
                poolProperties.setPassword(password);



                // Properties
                poolProperties.setDriverClassName("com.mysql.cj.jdbc.Driver");
                poolProperties.setJmxEnabled(true);
                poolProperties.setTestWhileIdle(false);
                poolProperties.setTestOnBorrow(true);
                poolProperties.setValidationQuery("SELECT 1");
                poolProperties.setTestOnReturn(false);
                poolProperties.setValidationInterval(30000);
                poolProperties.setTimeBetweenEvictionRunsMillis(30000);
                poolProperties.setMaxActive(100);
                poolProperties.setInitialSize(10);
                poolProperties.setMaxWait(10000);
                poolProperties.setMinEvictableIdleTimeMillis(30000);
                poolProperties.setMinIdle(10);
                poolProperties.setLogAbandoned(true);
                poolProperties.setRemoveAbandoned(true);

                poolProperties.setJdbcInterceptors(
                        "org.apache.tomcat.jdbc.pool.interceptor.ConnectionState;"+
                                "org.apache.tomcat.jdbc.pool.interceptor.StatementFinalizer");
                dataSource = new DataSource();
                dataSource.setPoolProperties(poolProperties);


            }
            return dataSource.getConnection();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }

    }
}
