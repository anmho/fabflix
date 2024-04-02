FROM amazoncorretto:11.0.22 AS builder
WORKDIR /app

COPY . .

RUN ./mvnw install
RUN ./mvnw clean package
RUN yum update
RUN yum install -y util-linux
RUN ./mvnw clean package | grep SNAPSHOT.war | rev | cut -d/ -f1 | rev > /app/war_name.txt > /app/war_name.txt
RUN mv /app/target/$(cat /app/war_name.txt) /app/target/api.war



# Image step
FROM tomcat:10.1.20-jdk11

RUN mv webapps webapps.bk
RUN mv webapps.dist/ webapps
COPY --from=builder /app/target/api.war /usr/local/tomcat/webapps/api.war


# COPY ./apache-tomcat-10.1.20/conf/tomcat-users.xml /usr/local/tomcat/conf/tomcat-users.xml
# COPY ./apache-tomcat-10.1.20/conf/ /usr/local/tomcat/conf/
# COPY ./apache-tomcat-10.1.20/conf/context.xml /usr/local/tomcat/webapps/manager/META-INF/

COPY docker/tomcat/conf/tomcat-users.xml /usr/local/tomcat/conf/tomcat-users.xml
COPY docker/tomcat/conf/context.xml /usr/local/tomcat/webapps/manager/META-INF/

CMD ["catalina.sh", "run"]