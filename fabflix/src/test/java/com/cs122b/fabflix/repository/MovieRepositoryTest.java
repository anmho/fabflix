package com.cs122b.fabflix.repository;

import com.cs122b.fabflix.params.*;
import org.apache.logging.log4j.core.util.Assert;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;



import java.sql.Connection;
import java.util.ArrayList;
import java.util.List;

public class MovieRepositoryTest {
    Connection conn;

    @BeforeEach
    public void setUp() {
        conn = Database.getConnection();
    }


}
