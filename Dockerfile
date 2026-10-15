# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["Online Job Management System.csproj", "./"]
RUN dotnet restore "Online Job Management System.csproj"
COPY . .
WORKDIR "/src"
RUN dotnet build "Online Job Management System.csproj" -c Release -o /app/build

# Publish stage
FROM build AS publish
RUN dotnet publish "Online Job Management System.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

# Create non-root user
RUN adduser --disabled-password --gecos '' appuser && chown -R appuser /app
USER appuser

COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Online Job Management System.dll"]