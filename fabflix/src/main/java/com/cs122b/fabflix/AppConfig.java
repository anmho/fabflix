package com.cs122b.fabflix;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

public class AppConfig {
    private static final Properties properties;

    static {
        properties = new Properties();

        try {
            InputStream input = AppConfig.class.getClassLoader().getResourceAsStream("application.properties");

            properties.load(input);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static String getProperty(String key) {
        return properties.getProperty(key);
    }
}
