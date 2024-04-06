package com.cs122b.fabflix.repository;

import com.cs122b.fabflix.Database;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import javax.xml.crypto.Data;
import java.sql.Connection;

public class MovieRepositoryTest {
    Connection conn;

    @BeforeEach
    public void setUp() {
        conn = Database.getConnection();
    }

}
