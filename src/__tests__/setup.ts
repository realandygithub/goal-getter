import "@testing-library/jest-dom";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// Automatically cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock the SpeechRecognition API
class MockSpeechRecognition {
  continuous = false;
  interimResults = false;
  onresult = null;
  onerror = null;
  onend = null;

  // These methods are intentionally empty as they're just mocks
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  start() {
    // Mock implementation - intentionally empty
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  stop() {
    // Mock implementation - intentionally empty
  }
}

// Mock the window.SpeechRecognition
Object.defineProperty(window, "SpeechRecognition", {
  writable: true,
  value: MockSpeechRecognition,
});

// Mock the window.webkitSpeechRecognition
Object.defineProperty(window, "webkitSpeechRecognition", {
  writable: true,
  value: MockSpeechRecognition,
});

// Mock the ResizeObserver
class ResizeObserverMock {
  // These methods are intentionally empty as they're just mocks
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  observe() {
    // Mock implementation - intentionally empty
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  unobserve() {
    // Mock implementation - intentionally empty
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  disconnect() {
    // Mock implementation - intentionally empty
  }
}

window.ResizeObserver = ResizeObserverMock;
