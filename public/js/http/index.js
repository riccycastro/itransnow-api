import { getToken } from '../store/auth_store.js';

const headers = {
  'Content-Type': 'application/json',
  Authorization: 'Bearer ' + getToken(),
};

/**
 * @param {string} uri
 * @returns {Promise<T | void>}
 */
export const get = (uri) => {
  return fetch(uri, {
    headers: headers,
  })
    .then((response) => response.json())
    .then((data) => data);
};

/**
 * @param {string} uri
 * @param {Object} data
 * @returns {Promise<T>}
 */
export const post = (uri, data) => {
  return fetch('/auth/login', {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => data);
};
