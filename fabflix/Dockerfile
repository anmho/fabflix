# Build step


# Image step


# FROM tomcat:8.5.100-jdk8

# RUN mv webapps webapps.bk
# RUN mv webapps.dist/ webapps

# COPY docker/tomcat/conf/tomcat-users.xml /usr/local/tomcat/conf/tomcat-users.xml
# COPY docker/tomcat/conf/context.xml /usr/local/tomcat/webapps/manager/META-INF/

# CMD ["catalina.sh", "run"]

FROM ubuntu:20.04
RUN sudo apt update
RUN sudo apt install default-jdk
RUN sudo apt update
RUN sudo apt install mysql-server
RUN sudo mysql
RUN CREATE USER 'mytestuser'@'localhost' IDENTIFIED BY 'My6$Password';
RUN GRANT ALL PRIVILEGES ON * . * TO 'mytestuser'@'localhost';


