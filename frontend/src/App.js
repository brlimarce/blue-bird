import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Feed from './pages/Feed';
import Search from './pages/Search';

import Login from './pages/Login';
import Signup from './pages/Signup';

function App() {
    return (
        <div className='App'>
            <BrowserRouter>
                <Routes>
                    {/* TODO: Route for Search */}

                    {/* Feed */}
                    <Route
                        exact
                        path='/'
                        element={<Feed />}
                    />

                    {/* Search */}
                    <Route
                        exact
                        path='/search'
                        element={<Search />}
                    />

                    {/* Log in */}
                    <Route
                        exact
                        path='/login'
                        element={<Login />}
                    />

                    {/* Sign up */}
                    <Route
                        exact
                        path='/signup'
                        element={<Signup />}
                    />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;