import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Test from './Test.tsx';
import LayOut from './LayOut.tsx';
import Login from './Login.tsx';
import Signup from './Singup.tsx';
import StoreEdit from './StoreEdit.tsx';
import StoreRegister from './StoreRegister.tsx';
import StoreDetail from './StoreDetail.tsx';
import TableManagement from './TableManagement.tsx';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LayOut />}>
          <Route index element={<Test />} />
          <Route path="/Test" element={<Test />}/>
          <Route path="/Login" element={<Login />}/>
          <Route path="/Signup" element={<Signup />}/>
          <Route path="/StoreEdit/:storeId" element={<StoreEdit />} />
          <Route path="/StoreRegister" element={<StoreRegister />}/>
          <Route path="/Store/:storeId" element={<StoreDetail />} />
          <Route path="/TableManagement/:storeId" element={<TableManagement />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;