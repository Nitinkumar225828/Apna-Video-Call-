import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'

const PrivateRoute = ({ children }) => {
  const { user } = useAuth() // user comes from AuthContext

  if (!user) {
    return <Navigate to="/auth" /> // redirect if not logged in
  }

  return children
}

export default PrivateRoute
