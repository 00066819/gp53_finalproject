import React, { useState, useEffect, useMemo, useRef, useReducer } from "react";
import {TOKEN_KEY, getToken} from 'utils';
import {login, verifyToken} from 'services/auth';

const UserContext = React.createContext();

const rolePermissions = {
    user: new Set(['post:read']),
    admin: new Set(['post:read', 'admin:read', 'post:create', 'post:update', 'admin:update', 'post:delete']),
}

export const UserProvider = (props) => {
    // If a token is saved, wait for the useEffect to set the user.
    const [token, setToken] = useReducer(tokenReducer, getToken());
    const [user, setUser] = useState(getToken() ? 'loading' : null);

    // If already signed in (AKA, has a token saved in LocalStorage), verify that token and set the user value.
    useEffect(
        _ => {
            if (!token || token === 'loading') { return; }

            const verifyTokenAsync = async _ => {
                if (token) {
                    try {
                        const user = await verifyToken();
                        setUser(user);
                    }
                    catch (e) {
                        process.env.NODE_ENV === 'development' && console.log(e);
                        setUser(null);
                        setToken(null);
                    }
                }
            }

            verifyTokenAsync();
        },
        [token]
    );

    const refLogin = useRef(async (username, password) => {
        let status = false;
        try {
            const { token } = await login(username, password);

            if (token) {
                setToken(token);
                status = true;
            }
        }
        catch (error) {
            console.error(error);
            console.error("Error in login");
        }
        finally {
            return status;
        }
    });

    const refLogout = useRef(_ => {
        setUser(undefined);
        setToken(undefined);
    });

    const value = useMemo(
        _ => ({
            token,
            user,
            login: refLogin.current,
            logout: refLogout.current,
            permissions: user?.role ? rolePermissions[user.role] : null,
        }),
        [token, user]
    );
   
    return <UserContext.Provider {...{value}} {...props}/>;
}

export const useUserContext = _ => {
    const context = React.useContext(UserContext);

    if (!context) {
        throw new Error("useUserContext() must be inside of UserProvider");
    }

    return context;
}

function tokenReducer(token, newToken) {
    localStorage.setItem(TOKEN_KEY, JSON.stringify({token: newToken}));
    return newToken;
};
