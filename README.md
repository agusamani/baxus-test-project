# Baxus Test Project

## Prerequisites

To use these files, you must first have the following installed:

- [Docker](https://docs.docker.com/engine/installation/)
- [docker-compose](https://docs.docker.com/compose/install/)

Use Node version 16+:

- Install Node 16:
  - Mac: `brew install node@16`
  - Other: [nodejs.org/en/download/](https://nodejs.org/en/download/)
- Or use a Node version manager: [`fnm`](https://github.com/Schniz/fnm#readme)

### Running this Project

1. `docker-compose up` to start [Temporal Server](https://github.com/temporalio/cli/#installation).
1. `npm install` to install dependencies.
1. `npm run start.watch` to start the Worker.
1. `npm run server.watch` to start the expense HTTP server.
