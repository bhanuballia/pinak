// frontend/services/websocketApi.js

export const websocketApi = {
  connect(url, onAlertReceived) {
    console.log(`Connecting to WebSocket server at ${url}...`);
    // Return a mock connection object with close method
    return {
      close() {
        console.log('WebSocket connection closed.');
      }
    };
  }
};
