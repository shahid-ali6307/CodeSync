import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'

function ProtectedRoute({ children }) {
    const { user } = useAuth()
    const token = localStorage.getItem('codesync_token')

    if(!user && !token) return <Navigate to="/auth" replace />
    return children
}

export default ProtectedRoute