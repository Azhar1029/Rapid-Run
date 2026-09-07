FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

COPY pom.xml ./pom.xml
COPY auth-service/pom.xml ./auth-service/pom.xml
COPY project-service/pom.xml ./project-service/pom.xml
COPY execution-service/pom.xml ./execution-service/pom.xml
COPY api-gateway/pom.xml ./api-gateway/pom.xml

COPY project-service/src ./project-service/src

RUN mvn -pl project-service clean package -DskipTests

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/project-service/target/project-service-1.0.0.jar app.jar
EXPOSE 8082
ENTRYPOINT ["java", "-jar", "app.jar"]