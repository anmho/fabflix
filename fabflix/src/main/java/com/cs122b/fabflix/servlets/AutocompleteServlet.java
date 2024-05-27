package com.cs122b.fabflix.servlets;

import com.cs122b.fabflix.ResponseBuilder;
import com.cs122b.fabflix.repository.MovieRepository;
import com.cs122b.fabflix.services.MovieService;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.io.IOException;
import java.util.ArrayList;

@WebServlet(name = "AutocompleteServlet", urlPatterns = "/search")
public class AutocompleteServlet extends HttpServlet {
    private final Logger log = LogManager.getLogger(AutocompleteServlet.class.getName());
    private MovieService movieService;

    @Override
    public void init() throws ServletException {
        movieService = new MovieService(new MovieRepository());
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String searchQuery = req.getParameter("query");

        if (searchQuery == null || searchQuery.length() < 3) {
            log.warn("Search query too short: {}", searchQuery);
            ResponseBuilder.error(resp, HttpServletResponse.SC_BAD_REQUEST, "Query must be at least 3 characters long.");
            return;
        }

        log.info("searchQuery {}", searchQuery);
        var results = movieService.getSearchCompletions(searchQuery);

        log.info("Search query: {}", searchQuery);

        ResponseBuilder.json(resp, results, 200);
    }

}
