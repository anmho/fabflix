package com.cs122b.fabflix;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

public class AppConfig {
    private static final Properties properties;

    static {
        properties = new Properties();

        try {
            FileInputStream fileInputStream = new FileInputStream("src/main/resources/application.properties");

            properties.load(fileInputStream);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static String getProperty(String key) {
        return properties.getProperty(key);
    }
}
