FROM amazoncorretto:11.0.22 AS builder
WORKDIR /app

COPY . .

RUN ./mvnw install
RUN ./mvnw clean package
RUN yum update
RUN yum install -y util-linux
RUN WAR_NAME=$(./mvnw clean package | grep SNAPSHOT.war | rev | cut -d/ -f1 | rev)
ARG WAR_NAME



# Image step


FROM tomcat:10.1.20-jdk11

RUN mv webapps webapps.bk
RUN mv webapps.dist/ webapps

#COPY --from=builder /app/target/*.war /usr/local/tomcat/webapps/$WAR_NAME.war


#COPY ./apache-tomcat-10.1.20/conf/tomcat-users.xml /usr/local/tomcat/conf/tomcat-users.xml
COPY apache-tomcat-10.1.20/conf/ /usr/local/tomcat/conf/
COPY apache-tomcat-10.1.20/conf/context.xml /usr/local/tomcat/webapps/manager/META-INF/

CMD ["catalina.sh", "run"]