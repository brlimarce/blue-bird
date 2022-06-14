import { 
    BrowserRouter,
    Navigate,
    Routes, 
    Route
} from 'react-router-dom';
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
                    {/* Feed */}
                    <Route
                        exact
                        path='/feed'
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
                        path='/log-in'
                        element={<Login />}
                    />

                    {/* Sign up */}
                    <Route
                        exact
                        path='/sign-up'
                        element={<Signup />}
                    />

                    {/* Not Found */}
                    <Route
                        path='*'
                        exact
                        element={<Navigate to='/log-in' />}
                    />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;