import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Test from './Test.tsx';
import LayOut from './LayOut.tsx';
import Login from './Login.tsx';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LayOut />}>
          <Route index element={<Test />} />
          <Route path="/Test" element={<LayOut />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;