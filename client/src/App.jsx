import EditorPage from "./pages/EditorPage"
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './pages/Home'

function App() {
  return (
    <BrowserRouter>
       <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/editor/:roomId" element={<EditorPage />} />
       </Routes>
    </BrowserRouter>
  )
}

export default App
