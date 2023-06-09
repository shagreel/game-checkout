import './App.css';
import { Router } from '@reach/router';
import { List } from './components/list';
import { Admin } from './components/admin';

function App() {
  return (
      <Router>
          <List path="/" />
          <Admin path="/admin" />
      </Router>
  );
}

export default App;
