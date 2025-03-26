// for tracking user login or logout status

import { createContext } from 'react';

export const AuthContext = createContext(null);

export const AuthContextProvider = ({ children }) => {
    return (
        <AuthContext.Provider value={{ user: null }}>
            {children}
        </AuthContext.Provider>
    );
};
