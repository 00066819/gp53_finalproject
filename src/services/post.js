import {request} from 'utils';

const PAGE_LIMIT = 15;

export const getAll = (i = 0) => request('get', `/post/all?limit=${PAGE_LIMIT}&page=${i}`);
export const get = (id) => request ('get', `/post/one/${id}`);

export const create = (title, description, image) => request('post', '/post/create', {title, description, image});
export const update = (id, title, description, image) => request('put', `/post/update/${id}`, {title, description, image});
export const toggleActive = (id) => request('patch', `/post/toggle/${id}`);
export const like = (id) => request ('patch', `/post/like/${id}`);
export const favorite = (id) => request('patch', `/post/fav/${id}`);
export const addComment = (id, description) => request('patch', `/post/comment/${id}`, {description});

export const getOwned = (i = 0) => request('get', `/post/owned?limit=${PAGE_LIMIT}&page=${i}`);
export const getFavorites = _ => request('get', '/post/fav');