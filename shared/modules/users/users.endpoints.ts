export const USERS_BASE_PATH = 'users';

export const USERS_PATHS = {
  ME: 'me',
  GET_BY_ID: ':id',
  DELETE: ':id'
};

export const USERS_ENDPOINTS = {
  ME: `${USERS_BASE_PATH}/${USERS_PATHS.ME}`,
  GET_BY_ID: `${USERS_BASE_PATH}/${USERS_PATHS.GET_BY_ID}`,
  DELETE: `${USERS_BASE_PATH}/${USERS_PATHS.DELETE}`
};
