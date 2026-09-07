FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

COPY pom.xml ./pom.xml
COPY auth-service/pom.xml ./auth-service/pom.xml
COPY project-service/pom.xml ./project-service/pom.xml
COPY execution-service/pom.xml ./execution-service/pom.xml
COPY api-gateway/pom.xml ./api-gateway/pom.xml

COPY api-gateway/src ./api-gateway/src

RUN mvn -pl api-gateway clean package -DskipTests

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/api-gateway/target/api-gateway-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]