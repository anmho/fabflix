# FROM amazoncorretto:11.0.22 AS builder
# WORKDIR /app

# COPY . .

# RUN ./mvnw install
# RUN ./mvnw clean package
# RUN yum update
# RUN yum install -y util-linux
# RUN ./mvnw clean package | grep SNAPSHOT.war | rev | cut -d/ -f1 | rev > /app/war_name.txt > /app/war_name.txt
# RUN mv /app/target/$(cat /app/war_name.txt) /app/target/api.war



# # Image step
# FROM --platform=linux/amd64 tomcat:10.1.20-jdk11

# RUN mv webapps webapps.bk
# RUN mv webapps.dist/ webapps
# COPY --from=builder /app/target/api.war /usr/local/tomcat/webapps/api.war

# COPY docker/tomcat/conf/tomcat-users.xml /usr/local/tomcat/conf/tomcat-users.xml
# COPY docker/tomcat/conf/context.xml /usr/local/tomcat/webapps/manager/META-INF/

# CMD ["catalina.sh", "run"]
# Use a base image with Tomcat
# Image step
# Use a base image with Tomcat
# Use a base image with Tomcat
# Stage 1: Build the application
FROM amazoncorretto:11.0.22 AS builder
WORKDIR /app

# Copy the project files to the build context
COPY . .

# Install dependencies and build the application
RUN ./mvnw install
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

# Set environment variables for database credentials
ENV DB_PRIMARY_URL=jdbc:mysql://host.docker.internal:3306/moviedb
ENV DB_PRIMARY_USER=admin
ENV DB_PRIMARY_PASS=admin
ENV DB_SECONDARY_URL=jdbc:mysql://host.docker.internal:3306/moviedb
ENV DB_SECONDARY_USER=admin
ENV DB_SECONDARY_PASS=admin

# Expose the necessary port
EXPOSE 8080

# Start Tomcat
CMD ["catalina.sh", "run"]
