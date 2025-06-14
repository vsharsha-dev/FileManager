# File Manager Application (Dropbox Clone)

A full-stack file management application built with Spring Boot and React. This application allows users to upload, download, preview, and manage files with a modern web interface.

## Prerequisites
- Java 17 or higher
- Node.js 16 or higher
- Docker and Docker Compose
- Maven
- Git

## Project Structure

```
FileManager/
├── frontend/           # React frontend application
├── src/               # Spring Boot backend application
├── docker-compose.yml # Docker configuration for database
└── README.md
```

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/vsharsha-dev/FileManager.git
cd FileManager
```

### 2. Build the Backend

1. Build the Spring Boot application:
```bash
./mvnw clean package (or "mvnw.cmd clean package" for Windows)
```

This will create the JAR file in the `target` directory that Docker needs.

### 3. Start the Database and Backend

The application uses PostgreSQL as its database. Start both the database and backend using Docker Compose:

```bash
docker-compose up -d
```

This will:
- Start PostgreSQL in a Docker container
- Build and start the Spring Boot application
- The database will be accessible at:
  - Host: localhost
  - Port: 5432
  - Database: filemanager
  - Username: user
  - Password: password

### 4. Set Up the Frontend

1. Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend application will start on `http://localhost:3000`

## Using the Application

1. Open your web browser and navigate to `http://localhost:3000`
2. You'll see the main interface with two navigation options:
   - Files: View and manage your uploaded files
   - Upload: Upload new files

### Features

- **File Upload**: 
  - Drag and drop or click to select files
  - Supports text files, PDFs, images (jpg, jpeg, png), and JSON files
  - Automatic handling of duplicate filenames

- **File Management**:
  - View list of uploaded files
  - Preview files (text and images)
  - Download files
  - Delete files

- **File Preview**:
  - Text files: View content directly in the browser
  - Images: View in the browser

## Stopping the Application

To stop the application:

1. Stop the frontend (Vite) development server:
   - Press `Ctrl+C` in the frontend terminal

2. Stop the backend and database:
```bash
docker-compose down
```

To completely clean up (including database data):
```bash
docker-compose down -v
```

## Troubleshooting

### Common Issues

1. **Port Conflicts**
   - If port 8080 is in use, you can change the backend port in `application.properties`
   - If port 3000 is in use, Vite will automatically suggest an alternative port

2. **Database Connection Issues**
   - Ensure Docker is running
  - Check if PostgreSQL container is running: `docker ps`
  - Verify database credentials in `application.properties`

3. **File Upload Issues**
   - Check if the uploads directory exists and has proper permissions
   - Verify file size limits in `application.properties`

4. **Docker Build Issues**
   - Make sure you've built the Spring Boot application with `./mvnw clean package` before running `docker-compose up`
   - Check if the JAR file exists in the `target` directory


## Development

### Backend Development

- Main application class: `FileManagerApplication.java`
- Controllers: `src/main/java/com/example/filemanager/controller/`
- Services: `src/main/java/com/example/filemanager/service/`
- Models: `src/main/java/com/example/filemanager/model/`

### Frontend Development

- Main component: `frontend/src/App.tsx`
- Components: `frontend/src/components/`
- Services: `frontend/src/services/`
- Types: `frontend/src/types/`
