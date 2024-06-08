package com.cs122b.fabflix.filters;

import com.cs122b.fabflix.AppConfig;
import com.cs122b.fabflix.models.User;
import jakarta.servlet.*;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.core.config.Order;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Set;

@WebFilter(filterName = "LoginFilter")
public class LoginFilter implements Filter {
    private final Set<String> allowedURIs = new HashSet<>();
    private  final Set<String> employeeOnlyURIs = new HashSet<>();
    private final Logger log = LogManager.getLogger(LoginFilter.class.getName());

    @Override
    public void init(FilterConfig fConfig) throws ServletException {
        allowedURIs.add("/index.tsx");
        allowedURIs.add("/login.tsx");
        allowedURIs.add("/api/login");
        allowedURIs.add("/api/isLoggedIn");
        allowedURIs.add("/api/employeeLogin");
        allowedURIs.add("/_next/static/");
        employeeOnlyURIs.add("/api/_dashboard");
        employeeOnlyURIs.add("/_dashboard/index.tsx");
    }

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
            throws IOException, ServletException {


        // for some reason loginfilter executes first in docker container
        HttpServletRequest request = (HttpServletRequest) req;
        HttpServletResponse response = (HttpServletResponse) res;
//        response.setHeader("Access-Control-Allow-Origin", AppConfig.getProperty("app.client_url")); // Frontend URL
//       response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
//       response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
//       response.setHeader("Access-Control-Allow-Credentials", "true");

//       if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
//           response.setStatus(HttpServletResponse.SC_OK);
//       } else {
//           chain.doFilter(request, response);
//       }

        String requestURI = request.getRequestURI();
        log.debug("LoginFilter: {}", requestURI);

        HttpSession session = request.getSession();
        User user = (User) session.getAttribute("user");
        log.debug("session.getId==> {}", session.getId());
        log.debug("user ==> {}", user != null ? user.toString() : "null");

        if (user != null && isEmployeeOnlyURIs(requestURI) && user.getUserType().equals("employee")) {
            log.debug("employee only URI. employee logged in. go ahead.");
            chain.doFilter(request, response);
        } else if (isUrlAllowedWithoutLogin(requestURI) || user != null) { // assuming employee can access pages that customers can bc of https://youtu.be/ZEyUdp5jVrg?si=qyoXi8NEtIAWC4eW&t=477
            log.debug("Allowed URI or session hit.");
            log.debug("requestURI => {}", requestURI);
            log.debug("isUrlAllowedWithoutLogin(requestURI) => " + isUrlAllowedWithoutLogin(requestURI));
            chain.doFilter(request, response);
        } else {
            log.debug("requestURI NOT Allowed: {}", requestURI);
            log.debug("isUrlAllowedWithoutLogin(requestURI) => " + isUrlAllowedWithoutLogin(requestURI));
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Access Denied: User is not logged in.");
        }
    }


    private boolean isUrlAllowedWithoutLogin(String requestURI) {
        String normalizedUri = requestURI.toLowerCase();
        return allowedURIs.stream().anyMatch(uri -> normalizedUri.contains(uri.toLowerCase()));
    }

    private boolean isEmployeeOnlyURIs(String requestURI) {
        String normalizedUri = requestURI.toLowerCase();
        return employeeOnlyURIs.stream().anyMatch(uri -> normalizedUri.contains(uri.toLowerCase()));
    }
    @Override
    public void destroy() {
    }
}
