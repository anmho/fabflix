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
    private Logger log = LogManager.getLogger(Database.class.getName());
    private static DataSource dataSource;

    private static Database database;


    private Database() {
        String url = AppConfig.getProperty("db.url");
        String username = AppConfig.getProperty("db.username");
        String password = AppConfig.getProperty("db.password");

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
//                poolProperties.setTestOnReturn(false);
        poolProperties.setValidationInterval(30000);
        poolProperties.setInitialSize(10);
        poolProperties.setMaxWait(10000);
        poolProperties.setLogAbandoned(true);

        poolProperties.setJdbcInterceptors(
                "org.apache.tomcat.jdbc.pool.interceptor.ConnectionState;"+
                        "org.apache.tomcat.jdbc.pool.interceptor.StatementFinalizer");
        dataSource = new DataSource();
        dataSource.setPoolProperties(poolProperties);

    }


    public static Database getInstance() {
        if (database == null) {
            database = new Database();
        }
        return database;
    }

    public Connection getConnection() throws SQLException {
        return dataSource.getConnection();
    }
}
