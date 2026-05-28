import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null)

export function AuthProvider({ children }){
    const[user, setUser] = useState(JSON.parse(localStorage.getItem('codesync_user')) || null )

    const[token, setToken] = useState(localStorage.getItem('codesync_token') || null )

function login(userData, tokenData) {
    setUser(userData)
    setToken(tokenData)
    localStorage.setItem('codesync_user', JSON.stringify(userData))
    localStorage.setItem('codesync_token', tokenData)
}

function logout() {
    setUser(null)
    setToken(null)
    localStorage.removeItem('codesync_user')
    localStorage.removeItem('codesync_token')
}

return (
    <AuthContext.Provider value= {{ user, token, login, logout }}>
        { children }
    </AuthContext.Provider>
        
)
}

export function useAuth() {
    return useContext(AuthContext)
}