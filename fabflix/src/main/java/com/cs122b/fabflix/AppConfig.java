package com.cs122b.fabflix;

import org.apache.commons.configuration.Configuration;
import org.apache.commons.configuration.ConfigurationException;
import org.apache.commons.configuration.PropertiesConfiguration;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

public class AppConfig {
    private static final Configuration config;
    private static final Logger logger;

    static {
        logger = LogManager.getLogger(AppConfig.class);
        try {
            config = new PropertiesConfiguration("application.properties");

        } catch (ConfigurationException e) {
            throw new RuntimeException(e);
        }
    }

    public static String getProperty(String key) {
        logger.info("getting", key);
        return config.getString(key);
    }
}
