FROM amazoncorretto:11.0.22 AS builder
WORKDIR /app

# Install dependencies and build the application to cache dependencies
COPY mvnw mvnw
COPY .mvn .mvn
COPY pom.xml pom.xml
RUN ./mvnw install

# Copy rest of project files for build
COPY . .
RUN ./mvnw clean package

# Find and rename the generated WAR file
RUN mv $(find target -name '*.war') target/api.war

# Stage 2: Prepare the Tomcat image with the built application
FROM tomcat:10-jdk11-openjdk-slim

# Remove default webapps to clean up the image
RUN rm -rf /usr/local/tomcat/webapps/*

# Copy the WAR file from the builder stage to the Tomcat webapps directory
COPY --from=builder /app/target/api.war /usr/local/tomcat/webapps/api.war

# Copy Tomcat configuration files if needed
COPY docker/tomcat/conf/context.xml /usr/local/tomcat/conf/
COPY docker/tomcat/conf/tomcat-users.xml /usr/local/tomcat/conf/
COPY docker/tomcat/conf/web.xml /usr/local/tomcat/conf/

# Expose the necessary port (annotation)
EXPOSE 8080

# Start Tomcat
CMD ["catalina.sh", "run"]
