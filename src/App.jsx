import { BrowserRouter, Routes, Route } from "react-router-dom"
import Auth from './pages/auth';
import Home from './pages/home';
import Create from "./pages/create";
import NotFound from "./pages/notFound";
import './App.css'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/login" element={<Auth />}></Route>
        <Route path="/create" element={<Create />}></Route>
        <Route path='*' element={<NotFound />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
