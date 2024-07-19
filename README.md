## Backend Service

[![codecov](https://codecov.io/gh/mango-habanero/jp-backend/graph/badge.svg?token=w3PT7bqHHg)](https://codecov.io/gh/mango-habanero/jp-backend)

A sample backend express js application to showcase fullstack abilities for the jungopharm interview process.

### Pre-requisites

- Docker (Tested on v27.0.3)
- Docker Compose (Tested on v2.3.3)
- Node.js (Tested on v20.12.0)
- npm (Tested on v10.7.0)

### Installation

1. **Clone the repository**
    ```shell
    git clone  git@github.com:mango-habanero/jp-backend.git
    ```

2. **Install dependencies**

    ```shell
    cd jp-backend
    npm install
    ```

3. **Set up environment variables**

    ```shell
    cp .env.example .env
    ```

    Update the `.env` file with the required environment variables.

### Running the application

1. **Start the application**

    if running in development mode:
    ```shell
    npm run dev
    ```
    if running in production mode:
    ```shell
    npm build
    npm start
    ```
   if running in docker:
   create a network:
   ```shell
    docker network create jp_network
   ```
   run the docker services:
    ```shell
    docker-compose up -f docker/docker-compose.yml
    ```
   
### Running tests

1. **Run tests**

    ```shell
    npm test
    ```