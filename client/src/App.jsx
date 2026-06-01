import EditorPage from "./pages/EditorPage"
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import AuthPage from './pages/AuthPage'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
       <Routes>
        <Route path="/auth" element={<AuthPage />} />

          <Route path="/" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } 
        />
          <Route path="/editor/:roomId" element={
            <ProtectedRoute>
              <EditorPage />
            </ProtectedRoute>
          }
       />
       </Routes>
    </BrowserRouter>
  )
}

export default App
