FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Copy parent pom
COPY pom.xml ./pom.xml

# Copy all module pom.xml files (parent needs them)
COPY auth-service/pom.xml ./auth-service/pom.xml
COPY project-service/pom.xml ./project-service/pom.xml
COPY execution-service/pom.xml ./execution-service/pom.xml
COPY api-gateway/pom.xml ./api-gateway/pom.xml

# Copy only auth-service source
COPY auth-service/src ./auth-service/src

# Build only auth-service
RUN mvn -pl auth-service clean package -DskipTests

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/auth-service/target/auth-service-1.0.0.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]