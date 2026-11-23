import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Contact from './pages/Contact';
import Calculator from './components/PumpFlowCalculator';
import CalculatorResults from './components/PumpFlowCalculatorResult';
import TonnageCalculator from './components/TonnageCalculator';
import WeightCalculator from './components/PlateWeightCalculator';
import About from './pages/About';
import TieRod from './components/TieRod';
import TieRodResults from './components/TieRodResults';
import CylinderCalculations from './components/CylinderCalculations';
import MainCylinderCalculator from './components/MainCylinderCalculator';
import MainCylinderResultsPage from './components/MainCylinderResults';
import DieCushionCalculator from './components/DieCushionCalculator';
import DieCushionResultsPage from './components/DieCushionResults';


const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

// Placeholder components for future implementation
const NotFound = () => (
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>404 - Page Not Found</h1>
    <p>The page you are looking for does not exist.</p>
  </div>
);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Navbar />
          <main style={{ flex: 1, padding: '1rem' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/calculator" element={<Calculator />} />
              <Route path="/calculator/results" element={<CalculatorResults />} />
              <Route path="/tonnage" element={<TonnageCalculator />} />
              <Route path="/cylinder" element={<CylinderCalculations />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/about" element={<About />} />
              <Route path="/weight" element={<WeightCalculator />} />
              <Route path="/tierod" element={<TieRod />} />
              <Route path="/tierod/results" element={<TieRodResults />} />

              <Route path="/main-cylinder" element={<MainCylinderCalculator />} />
              <Route path="/main-cylinder-results" element={<MainCylinderResultsPage />} />
              <Route path="/die-cushion" element={<DieCushionCalculator />} />
              <Route path="/die-cushion-results" element={<DieCushionResultsPage />} />
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;