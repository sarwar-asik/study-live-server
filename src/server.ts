import 'colors';
import { Server } from 'http';
// import app from './app';
import config from './config';
// import { errorlogger } from './shared/logger';
import httpServer from './socket';

async function main() {
  const server: Server = httpServer.listen(config.port, () => {
    console.log(
      `Server running on port http://localhost:${config.port}`.green.underline
        .bold
    );
  });
  const exitHandler = (error?: unknown) => {
    if (server) {
      server.close(() => {
        if (error) {
          logError(error);
        }
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  };

  const logError = (error: unknown) => {
    if (config.env === 'production') {
      // errorlogger.error(error);
        console.error('Error:', error);
    } else {
      console.error('Error:', error);
    }
  };

  const unexpectedErrorHandler = (error: unknown) => {
    console.error('Unexpected error detected:', error);
    logError(error);
    exitHandler(error);
  };

  process.on('uncaughtException', unexpectedErrorHandler);
  process.on('unhandledRejection', unexpectedErrorHandler);

  process.on('SIGTERM', () => {
    console.log('SIGTERM received');
    if (server) {
      server.close();
    }
  });
}

main();
