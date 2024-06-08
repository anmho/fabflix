package com.cs122b.fabflix.filters;

import com.cs122b.fabflix.AppConfig;
import jakarta.servlet.*;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.io.IOException;
import java.net.URL;
import java.util.Arrays;
@WebFilter(filterName="CorsFilter")
public class CorsFilter implements Filter {
    private final Logger log = LogManager.getLogger(CorsFilter.class.getName());

   public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) throws IOException, ServletException {
       HttpServletResponse response = (HttpServletResponse) res;
       HttpServletRequest request = (HttpServletRequest) req;


       log.debug("CLIENT_URL: {}", AppConfig.getProperty("app.client_url"));
       response.setHeader("Access-Control-Allow-Origin", AppConfig.getProperty("app.client_url")); // Frontend URL
       response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
       response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
       response.setHeader("Access-Control-Allow-Credentials", "true");

       if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
           response.setStatus(HttpServletResponse.SC_OK);
       } else {
           chain.doFilter(req, res);
       }
   }



   public void init(FilterConfig filterConfig) {}

   public void destroy() {}

}
