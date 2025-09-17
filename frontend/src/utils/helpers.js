// Utility functions can go here
export function formatDate(date) {
  return new Date(date).toLocaleDateString();
}

export function formatTime(date) {
  return new Date(date).toLocaleTimeString();
}
