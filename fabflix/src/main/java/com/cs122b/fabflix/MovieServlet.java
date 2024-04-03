package com.cs122b.fabflix;

import com.cs122b.fabflix.models.Movie;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.io.PrintWriter;

@WebServlet(name = "movieServlet", value="/movies")
public class MovieServlet extends HttpServlet {


    public void init() {

    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("application/json");

        PrintWriter out = resp.getWriter();

        Movie movie = new Movie("1", "1", 2, "joe");

        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(movie);
        System.out.println(json);
        out.println(json);
    }

    public void destroy() {

    }
}
