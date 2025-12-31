import { useState } from 'react' 
import PdfUpload from './components/PdfUpload'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <PdfUpload></PdfUpload>
    </>
  )
}

export default App
