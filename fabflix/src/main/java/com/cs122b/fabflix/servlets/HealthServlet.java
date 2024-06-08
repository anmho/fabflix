package com.cs122b.fabflix.servlets;

import com.cs122b.fabflix.ResponseBuilder;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.HashMap;

@WebServlet(name="healthServlet", urlPatterns = "/health")
public class HealthServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        ResponseBuilder.json(resp, new HashMap<>(), HttpServletResponse.SC_OK);
    }
}
