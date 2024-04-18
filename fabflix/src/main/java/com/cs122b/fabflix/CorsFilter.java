package com.cs122b.fabflix;

import jakarta.servlet.*;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebFilter("/*")
public class CorsFilter implements Filter {

   public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) throws IOException, ServletException {
       HttpServletResponse response = (HttpServletResponse) res;
       HttpServletRequest request = (HttpServletRequest) req;
       System.out.println("CorsFilter");
       response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000"); // Frontend URL
       response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
       response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
       response.setHeader("Access-Control-Allow-Credentials", "true");

       if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
           System.out.println("CorsFilter line 22");
           response.setStatus(HttpServletResponse.SC_OK);
       } else {
           System.out.println("CorsFilter line 25");
           chain.doFilter(req, res);
       }
   }



   public void init(FilterConfig filterConfig) {}

   public void destroy() {}

}
