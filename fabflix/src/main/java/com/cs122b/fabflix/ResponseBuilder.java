package com.cs122b.fabflix;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Map;

public class ResponseBuilder {
    private static final ObjectMapper mapper;

    static {
        mapper = new ObjectMapper();
    }
    public static void json(HttpServletResponse response, Object data, int status){
        try {
            response.setStatus(status);
            response.setContentType("application/json");
            String content = mapper.writeValueAsString(data);
            PrintWriter out = response.getWriter();
            out.println(content);

        } catch (IOException e) {
            e.printStackTrace();
            // send an error instead
            error(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "error occurred");
        }
    }

    public static void error(HttpServletResponse response, int status, String message) {
        if (message == null) {
            message = "an unknown error occurred";
        }
        response.setContentType("application/json");
        Map<String, Object> data = new HashMap<>();
        data.put("status", status);
        data.put("message", message);
        response.setStatus(status);
        try {
            String content = mapper.writeValueAsString(data);
            PrintWriter out = response.getWriter();
            out.println(content);
        } catch (IOException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            e.printStackTrace();
        }
    }
}
