import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import Inicio from '../componetes/principal.jsx'
import Login from '../componetes/Login.jsx'
import Registro from '../componetes/registro.jsx'
import Olvido from '../componetes/olvido.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
   
    <Router>
      <Routes>
        <Route path='/app' element={<App/>}></Route>
        <Route path='/' element={<Inicio/>}></Route>
        <Route path='/Login' element={<Login/>}></Route>
        <Route path="/registro" element={< Registro/>} />
        <Route path="/olvide" element={<Olvido/>} />
      </Routes>
    </Router>
  </StrictMode>,
)
