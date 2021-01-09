require("whatwg-fetch");

import { server } from "./src/mocks/server.js";

jest.setTimeout(30000);

// Establish API mocking before all tests.
beforeAll(() => server.listen({ onUnhandledRequest: "error", quit: true }));

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished.
afterAll(() => server.close());
