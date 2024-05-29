import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import "primereact/resources/themes/lara-light-cyan/theme.css";


// Import Pages
import Register from './pages/Register.jsx'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import BuktiBayar from './pages/BuktiBayar.jsx'
import BeritaAcara from './pages/BeritaAcara.jsx'

import Invoice from './pages/Invoice.jsx';
import InvoiceDetail from './pages/Invoice-detail.jsx';

import SetTitle from './utils/setTitle.jsx'
import Setting from './pages/Setting.jsx';
import ForbiddenPage from './pages/Forbidden.jsx';





const App = () =>{


  return (
    <Router> 
      <Routes>
        <Route path='/' element={<>
          <SetTitle title="Dashboard" />
          <Dashboard />
        </>} />
        <Route path='/invoice' element={<>
          <SetTitle title="Invoice" />
          <Invoice />
        </>} />
        <Route path='/login' element={<>
          <SetTitle title="Login" />
          <Login />
        </>} />
        <Route path='/register' element={<>
          <SetTitle title="Register" />
          <Register />
        </>} />
        <Route path='/berita-acara' element={<>
          <SetTitle title="Berita Acara" />
          <BeritaAcara />
        </>} />
        <Route path='/berita-acara/:id' element={<>
          <SetTitle title="Berita Acara" />
          <BeritaAcara />
        </>} />
        <Route path='/bukti-bayar' element={<>
          <SetTitle title="Bukti Bayar" />
          <BuktiBayar />
        </>} />
        <Route path='/bukti-bayar/:id' element={<>
          <SetTitle title="Bukti Bayar" />
          <BuktiBayar />
        </>} />
        <Route path='/invoice/new' element={<>
          <SetTitle title="New Invoice" />
          <InvoiceDetail />
        </>} />
        <Route path='/invoice/:id' element={<>
          <SetTitle title="Detail Invoice" />
          <InvoiceDetail />
        </>} />
        <Route path='/setting' element={<>
          <SetTitle title="Setting" />
          <Setting /> 
        </>} />
        <Route path='/forbidden' element={<>
          <SetTitle title="Forbidden" />
          <ForbiddenPage />
        </>} />
      </Routes>
    </Router>
  );
}


export default App