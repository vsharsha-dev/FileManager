# File Manager Application

A full-stack file management application built with Spring Boot and React. This application allows users to upload, download, preview, and manage files with a modern web interface.

## Prerequisites

Before you begin, ensure you have the following installed:
- Java 17 or higher
- Node.js 16 or higher
- Docker and Docker Compose
- Maven
- Git

## Project Structure

```
filemanager/
├── frontend/           # React frontend application
├── src/               # Spring Boot backend application
├── docker-compose.yml # Docker configuration for database
└── README.md         # This file
```

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/filemanager.git
cd filemanager
```

### 2. Start the Database

The application uses PostgreSQL as its database. Start it using Docker Compose:

```bash
docker-compose up -d
```

This will start PostgreSQL in a Docker container. The database will be accessible at:
- Host: localhost
- Port: 5432
- Database: filemanager
- Username: postgres
- Password: postgres

### 3. Set Up the Backend

1. Navigate to the project root directory:
```bash
cd filemanager
```

2. Build the Spring Boot application:
```bash
./mvnw clean install
```

3. Run the Spring Boot application:
```bash
./mvnw spring-boot:run
```

The backend server will start on `http://localhost:8080`

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
  - Other file types: Download to view

## Stopping the Application

To stop the application:

1. Stop the frontend (Vite) development server:
   - Press `Ctrl+C` in the frontend terminal

2. Stop the Spring Boot backend:
   - Press `Ctrl+C` in the backend terminal

3. Stop the database:
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

### Logs

- Backend logs: Check the console where Spring Boot is running
- Frontend logs: Check the browser's developer console (F12)
- Database logs: `docker-compose logs db`

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

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 