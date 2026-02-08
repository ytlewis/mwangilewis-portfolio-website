// Global test setup
process.env.NODE_ENV = 'test';

// Increase timeout for database operations
jest.setTimeout(60000);

// Global error handler for unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Suppress console.log during tests unless explicitly needed
if (process.env.VERBOSE !== 'true') {
  global.console = {
    ...console,
    log: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn()
  };
}