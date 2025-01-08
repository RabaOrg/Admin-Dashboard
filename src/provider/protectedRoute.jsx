import React from 'react'
import { useAuthStore } from '../../store/store'
import { Navigate } from 'react-router-dom'



function ProtectedRoute({ children }) {

    const { isLoggedIn } = useAuthStore()
    if (!isLoggedIn) {
        return <Navigate to={"/login"} replace />
    }
    return children


}

export default ProtectedRoute
