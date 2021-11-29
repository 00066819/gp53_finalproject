import get from 'lodash/fp/get';

const BASE_URL = 'https://posts-pw2021.herokuapp.com/api/v1';
export const TOKEN_KEY = "token";

export function isSuperset(set, subset) {
    for (let elem of subset) {
        if (!set.has(elem)) {
            return false;
        }
    }
    return true;
}

export const getToken = _ => {
    try {
        return JSON.parse(localStorage.getItem(TOKEN_KEY))?.token || null;
    }
    catch (e) {
        return null;
    }
}

export const request = async (method, path, body, useToken = true) => {
    const token = getToken();

    if (useToken && !token) { throw new Error('Expected token.'); }

    try {
        const request = {
            method: method.toUpperCase(),
            headers: {
                "Content-type": 'application/json',
                ...useToken && {"Authorization": `Bearer ${token}`},
            },
            ...body && Object.keys(body).length && {body: JSON.stringify(body)}
        };

        const response = await fetch(`${BASE_URL}${path}`, request);

        const data = await response.json();

        if (response.ok) {
            return data;
        }
        else {
            throw new Error('An error has occurred', {cause: data});
        }
    }
    catch (e) {
        console.error(e);
        throw new Error('An error has occurred', {cause: e?.cause || e});
    }
};

export const getFrom = (object) => (key) => get(key)(object);

export function classes(...classes) {
  return {className: classes.map((x) => x?.toString?.()).filter(Boolean).join(' ')};
}

classes.children = (list) => {
  return list.split(' ').map((x) => 'children:' + x).join(' ');
}