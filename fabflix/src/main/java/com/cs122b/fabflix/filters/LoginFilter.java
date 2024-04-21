package com.cs122b.fabflix.filters;

import jakarta.servlet.*;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.util.ArrayList;


@WebFilter(filterName = "LoginFilter", urlPatterns = "/*")
public class LoginFilter implements Filter {
    private final ArrayList<String> allowedURIs = new ArrayList<>();

    @Override
    public void init(FilterConfig fConfig) throws ServletException {
        allowedURIs.add("/index.tsx");
        allowedURIs.add("/login.tsx");
        allowedURIs.add("/api/login");
        allowedURIs.add("/api/isLoggedIn");
        allowedURIs.add("/_next/static/");
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;


        String requestURI = httpRequest.getRequestURI();

        System.out.println("LoginFilter: " + requestURI);
        HttpSession session = httpRequest.getSession();
        System.out.println("session.getId==> " + session.getId() );
        System.out.println("session.getAttribute(\"customer\")==> " + session.getAttribute("customer") );

        if (isUrlAllowedWithoutLogin(requestURI) || session.getAttribute("customer") != null) {
            System.out.println("allowed URI || session hit");
            System.out.println("requestURI => " + requestURI);

            System.out.println("isUrlAllowedWithoutLogin(requestURI) => " + isUrlAllowedWithoutLogin(requestURI));
            chain.doFilter(request, response);
        } else {
            System.out.println("requestURI NOT Allowed: " + requestURI);
            System.out.println("isUrlAllowedWithoutLogin(requestURI) => " + isUrlAllowedWithoutLogin(requestURI));
            System.out.println("httpRequest.getSession().getAttribute('customer') ==> " + httpRequest.getSession().getAttribute("customer") );

            httpResponse.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            httpResponse.getWriter().write("Access Denied: User is not logged in.");
        }
    }


    private boolean isUrlAllowedWithoutLogin(String requestURI) {
        String normalizedUri = requestURI.toLowerCase();

        for (String uri : allowedURIs) {
            if (normalizedUri.contains(uri.toLowerCase())) {
                return true;
            }
        }
        return false;
    }

    @Override
    public void destroy() {
    }
}
