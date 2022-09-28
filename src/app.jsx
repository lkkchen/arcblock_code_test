import { BrowserRouter as Router } from 'react-router-dom';

import 'antd/dist/antd.css';
import './app.css';
import Transaction from './pages/transaction';


function App() {
  return (
    <div className="app">
      <Transaction />
    </div>
  );
}

export default function WrappedApp() {
  // While the blocklet is deploy to a sub path, this will be work properly.
  const basename = window?.blocklet?.prefix || '/';

  return (
    <Router basename={basename}>
      <App />
    </Router>
  );
}
