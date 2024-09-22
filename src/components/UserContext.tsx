import React, { useContext, ReactNode, useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';

interface User {
    userId: number;
    displayName: string;
}

interface ContextType {
    user: User | null;
    login: (userId: number, displayName: string) => void;
    logout: () => void;
}

const UserContext = React.createContext<ContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [cookie] = useCookies(["PHPSESSID"]);

    // ユーザー情報を維持するためにローカルストレージ一時保存
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (cookie.PHPSESSID && storedUser) {
            setUser(JSON.parse(storedUser));
        } else if (!cookie.PHPSESSID) {
            setUser(null);
            localStorage.removeItem('user');
        }
    }, [cookie.PHPSESSID]);

    const login = (userId:number, displayName:string) => {
        const newUser = { userId, displayName };
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
    }

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    );
}

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};