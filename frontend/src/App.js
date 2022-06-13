import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Feed from './pages/Feed';
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