
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './App.css';
import { LillyDocumentDetect } from './components/LillyDocumentDetect/LillyDocumentDetect.tsx';

function App() {


  return (
    <Router>
      <Routes>
        <Route path="/lilly-documentDetect" element={<LillyDocumentDetect />} />
      </Routes>
    </Router>
  );
}

export default App;
