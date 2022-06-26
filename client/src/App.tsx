import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from './components/Dashboard/Dashboard';
import SearchPage from './components/SearchPage/SearchPage'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPencil, faSearch, faGrip } from '@fortawesome/free-solid-svg-icons';

function App() {
  library.add(faSearch,faPencil, faGrip);
  return (
  <BrowserRouter>
  <Routes>
    <Route path="/search" element={<SearchPage/>} />
    <Route path="/" element={<Dashboard/>}/>
    </Routes>
  </BrowserRouter>  );
}

export default App;
