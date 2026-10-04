const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim()

if (!configuredBaseUrl) {
  throw new Error('VITE_API_BASE_URL is not configured. Add it to the frontend .env file.')
}

export const BACKEND_BASE_URL = configuredBaseUrl.replace(/\/+$/, '')
export const API_BASE_URL = `${BACKEND_BASE_URL}/api`
