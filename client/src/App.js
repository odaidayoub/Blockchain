import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'

import Footer from './components/Footer'

import Container from 'react-bootstrap/Container'

const App = () => {
  return (
    <Router>
      <main className='py-3'>
        <Container>
          <Routes>
            {/* HomePage Route */}
            <Route path='/' index element={<HomePage />} />
          </Routes>
        </Container>
      </main>
      <Footer />
    </Router>
  )
}

export default App
