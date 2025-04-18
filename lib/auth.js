// Helper functions for JWT handling and authentication

// Parse JWT without using external libraries
export function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null
  }
}

// Check if token is expired
export function isTokenExpired(token) {
  const decodedToken = parseJwt(token)
  if (!decodedToken) return true

  // Check if token has expiration claim
  if (!decodedToken.exp) return false

  // Get current time in seconds
  const currentTime = Math.floor(Date.now() / 1000)

  // Return true if token is expired
  return decodedToken.exp < currentTime
}

// Get user info from token
export function getUserFromToken(token) {
  if (!token) return null

  try {
    const decoded = parseJwt(token)
    return decoded
  } catch (error) {
    console.error("Failed to decode token:", error)
    return null
  }
}
