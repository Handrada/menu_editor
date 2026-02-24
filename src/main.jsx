import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { MenuProvider } from './context/MenuContext' // <--- IMPORTANTE

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MenuProvider> {/* <--- ESTA LINEA DEBE ENVOLVER A APP */}
      <App />
    </MenuProvider>
  </React.StrictMode>,
)