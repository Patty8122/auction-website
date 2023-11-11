# topics-software
The repository for the Topics in Software auction site project.

## Overview
This project is set up using Docker Compose to simplify the development and deployment process.

## Services

### vite-client
- **Description**: This is the front-end client of the application, built with Vite. It interacts with the auction service.
- **Port**: The service is exposed on port 3000.

### auction-service
- **Description**: The auction service backend.
- **Port**: The service runs on port 3001.

### user-service
- **Description**: The user management service backend.
- **Port**: The service runs on port 3002.

## Running the Project

To run the project, execute the provided `run.sh` script. This script stops all running docker containers, then builds the project.

### Steps to Run:

1. Ensure Docker and Docker Compose are installed on your system.
2. Navigate to the project directory.
3. Run the script with the following command:
```
./run.sh
```
4. Access the Vite client application at `http://localhost:3000`.

## Additional Notes

- If modifications are made to the Docker configuration, re-run `./run.sh` to rebuild and restart the containers with the latest changes.
- The volumes defined for each service ensure that your development changes are reflected in the containers and that the `node_modules` directory is persisted across container rebuilds.
- If a container does not recognize a node module, try running `npm ci` in the service directory to rebuild the `node_modules` directory.
- In case of continued issues, try deleting all shared volumes and rerunning the build script.

