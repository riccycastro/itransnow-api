const TOKEN = 'token'

/**
 * @param {string} token
 */
export const setToken = (token) => localStorage.setItem(TOKEN, token)
export const getToken = () => localStorage.getItem(TOKEN)
