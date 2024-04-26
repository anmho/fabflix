package com.cs122b.fabflix.servlets;

import com.cs122b.fabflix.ResponseBuilder;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@WebServlet(name = "logoutServlet", value="/logout")
public class LogoutServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        var session = req.getSession();
        session.invalidate();

        Map<String, Object> data = new HashMap<>();
        data.put("success", true);
        data.put("message", "logout successful");


        ResponseBuilder.json(resp, data, 200);
    }
}
