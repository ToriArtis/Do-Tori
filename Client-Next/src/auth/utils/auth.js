export const getToken = () => localStorage.getItem('ACCESS_TOKEN');
export const getUserId = () => localStorage.getItem('USER_ID');
export const isAuthenticated = () => !!getToken();