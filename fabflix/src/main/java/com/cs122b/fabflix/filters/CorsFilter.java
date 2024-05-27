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

@WebFilter("/*")
public class CorsFilter implements Filter {
    private final Logger log = LogManager.getLogger(CorsFilter.class.getName());

   public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) throws IOException, ServletException {
       HttpServletResponse response = (HttpServletResponse) res;
       HttpServletRequest request = (HttpServletRequest) req;

       var allowedOrigins = Arrays.asList(AppConfig.getProperty("app.client_url"), "https://usefabflix.com", "https://gcp.usefabflix.com", "http://13.52.113.32:3000/", "http://13.57.128.187:3000");
       String allowedOrigin = null;
       var referer = request.getHeader("Referer");
       log.debug(referer);
       if (referer != null) {
           for (var origin : allowedOrigins) {
               var match = referer.equals(origin) || referer.equals(origin.substring(0, origin.length()-1)) || origin.equals(referer.substring(0, referer.length()-1));
               log.debug("{}, {}", origin, referer);
               if (match) {
                   allowedOrigin = origin;
                   break;
               }
           }
       }
       log.debug(allowedOrigin);

       response.setHeader("Access-Control-Allow-Origin", allowedOrigin); // Frontend URL
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
