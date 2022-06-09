import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Feed from './pages/Feed';
import Login from './pages/Login';
import Signup from './pages/Signup';

import 'bootstrap/dist/css/bootstrap.min.css';

function App(props) {
    return (
        <div className='App'>
            <BrowserRouter>
                <Routes>
                    <Route exact path='/' element={<Feed />} />
                    <Route exact path='/login' element={<Login />} />
                    <Route exact path='/signup' element={<Signup />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;