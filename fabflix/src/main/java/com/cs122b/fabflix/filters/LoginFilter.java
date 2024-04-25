package com.cs122b.fabflix.filters;

import jakarta.servlet.*;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.io.IOException;
import java.util.ArrayList;


@WebFilter(filterName = "LoginFilter", urlPatterns = "/*")
public class LoginFilter implements Filter {
    private final ArrayList<String> allowedURIs = new ArrayList<>();
    private Logger log = LogManager.getLogger(LoginFilter.class.getName());

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

        log.debug("LoginFilter: " + requestURI);
        HttpSession session = httpRequest.getSession();
        log.debug("session.getId==> " + session.getId() );
        log.debug("session.getAttribute(\"customer\")==> " + session.getAttribute("customer") );

        if (isUrlAllowedWithoutLogin(requestURI) || session.getAttribute("customer") != null) {
            log.debug("allowed URI || session hit");
            log.debug("requestURI => " + requestURI);

            log.debug("isUrlAllowedWithoutLogin(requestURI) => " + isUrlAllowedWithoutLogin(requestURI));
            chain.doFilter(request, response);
        } else {
            log.debug("requestURI NOT Allowed: " + requestURI);
            log.debug("isUrlAllowedWithoutLogin(requestURI) => " + isUrlAllowedWithoutLogin(requestURI));
            log.debug("httpRequest.getSession().getAttribute('customer') ==> " + httpRequest.getSession().getAttribute("customer") );

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
