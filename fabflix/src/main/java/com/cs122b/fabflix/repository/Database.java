package com.cs122b.fabflix.repository;

import java.sql.Connection;
import java.sql.SQLException;

import com.cs122b.fabflix.AppConfig;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.tomcat.jdbc.pool.DataSource;
import org.apache.tomcat.jdbc.pool.PoolProperties;


public class Database {
    private static Connection connection;
    private static final Logger dbLogger = LogManager.getLogger(Database.class.getName());
    private final Logger log = LogManager.getLogger(Database.class.getName());
    private final DataSource dataSource;

    private static Database writeInstance;
    private static Database readInstance;

    private Database(String url, String username, String password) {
        log.info(String.format("mysql url %s", url));
        log.info(String.format("username: %s", username));
        log.info(String.format("password: %s", password));

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }

        PoolProperties poolProperties = new PoolProperties();

        poolProperties.setUrl(url);
        poolProperties.setUsername(username);
        poolProperties.setPassword(password);



        // Properties
        poolProperties.setDriverClassName("com.mysql.cj.jdbc.Driver");
        poolProperties.setJmxEnabled(true);
        poolProperties.setTestWhileIdle(false);
        poolProperties.setTestOnBorrow(true);
        poolProperties.setValidationQuery("SELECT 1");
        poolProperties.setValidationInterval(30000);
        poolProperties.setInitialSize(200);
        poolProperties.setMaxWait(10000);
        poolProperties.setLogAbandoned(true);

        poolProperties.setJdbcInterceptors(
                "org.apache.tomcat.jdbc.pool.interceptor.ConnectionState;"+
                "org.apache.tomcat.jdbc.pool.interceptor.StatementFinalizer;" +
                "org.apache.tomcat.jdbc.pool.interceptor.StatementCache"
        );
        dataSource = new DataSource();
        dataSource.setPoolProperties(poolProperties);

    }


    public static Database getReadInstance() {
        dbLogger.info("getting read instance");
        if (readInstance == null) {
            String url = AppConfig.getProperty("db.secondary_url");
            String username = AppConfig.getProperty("db.secondary_username");
            String password = AppConfig.getProperty("db.secondary_password");

            readInstance = new Database(url, username, password);
        }
        return readInstance;

    }
    public static Database getWriteInstance() {
        dbLogger.info("getting write instance");
        if (writeInstance == null) {
            String url = AppConfig.getProperty("db.primary_url");
            String username = AppConfig.getProperty("db.primary_username");
            String password = AppConfig.getProperty("db.primary_password");

            writeInstance = new Database(url, username, password);
        }
        return writeInstance;
    }

    public Connection getConnection() throws SQLException {
        return dataSource.getConnection();
    }
}
