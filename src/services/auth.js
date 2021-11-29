import {request} from 'utils';

export const login = (username, password) => request('post', '/auth/signin', {username, password}, false); 
export const verifyToken = _ => request('get', '/auth/whoami');