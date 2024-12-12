import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import Invoice1 from './Invoice1.jsx'
import App1 from './Invoice1'
import './index.css'
// import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <>
      <App1/>
    {/* <App /> */}

    </>
  </StrictMode>,
)
