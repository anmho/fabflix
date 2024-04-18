package com.cs122b.fabflix.servlets;

import com.cs122b.fabflix.ResponseBuilder;
import com.cs122b.fabflix.models.Star;
import com.cs122b.fabflix.repository.StarRepository;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import javax.xml.crypto.Data;
import java.sql.Connection;

@WebServlet(name = "starServlet", value="/stars")
public class StarServlet extends HttpServlet {

    private StarRepository starRepository;

    public void init() {
        starRepository = new StarRepository();
    }

    public void doGet(HttpServletRequest req, HttpServletResponse resp) {
        String starId = req.getParameter("id");
        System.out.println(starId);

        if (starId != null) {
            Star star = starRepository.getStarById(starId);
            ResponseBuilder.json(resp, star, 200);
        } else {
            ResponseBuilder.error(resp, 404, "invalid");
        }
    }

    public void destroy() {

    }
}


