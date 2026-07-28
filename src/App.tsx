import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import Home from './pages/Home';
import Surveys from './pages/Surveys';
import SurveyDetail from './pages/SurveyDetail';
import Analytics from './pages/Results';
import About from './pages/About';

function App() {
  return (
    <Router>
      <Toaster position="bottom-right" toastOptions={{ style: { background: '#0a0a1a', color: '#a78bfa', border: '1px solid #7c3aed' } }} />
      <ErrorBoundary>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/surveys" element={<Surveys />} />
            <Route path="/surveys/:id" element={<SurveyDetail />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </Layout>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
