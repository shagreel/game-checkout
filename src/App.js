import './App.css';
import {Routes, Route} from "react-router-dom";
import { List } from './components/list';
import { Admin } from './components/admin';

function App() {
  return (
      <Routes>
          <Route path="/" element={<List />} />
          <Route path="/borrowed" element={<Admin/>} />
      </Routes>
  );
}

export default App;
