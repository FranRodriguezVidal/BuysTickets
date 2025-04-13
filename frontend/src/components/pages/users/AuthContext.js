import React, { createContext, useEffect, useState } from 'react';

// Crear el contexto
export const AuthContext = createContext();

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('usuario'));
        if (storedUser) {
            setUser(storedUser);
        }
    }, []);

    const logOut = () => {
        localStorage.removeItem('usuario');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, logOut }}>
            {children}
        </AuthContext.Provider>
    );
};
