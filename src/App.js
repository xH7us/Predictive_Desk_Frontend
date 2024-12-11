import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store, { persistor } from './appRedux/store';
import DashboardLayout from './views/dashboard/layout';
import Login from './views/authentication/login';
import PrivateRoute from './components/privateRoutes';
import { PersistGate } from 'redux-persist/integration/react';
import { useNavigate } from 'react-router-dom';

function AuthChecker() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const { exp } = JSON.parse(atob(token.split('.')[1]));
      if (Date.now() >= exp * 1000) {
        localStorage.clear();
        navigate('/');
      }
    }
  }, [navigate]);

  return null;
}

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <AuthChecker />
            <Routes>
              <Route path="/" element={<Login />} />
              <Route
                path="/home"
                element={
                  <PrivateRoute>
                    <DashboardLayout />
                  </PrivateRoute>
                }
              />
            </Routes>
        </Router>
      </PersistGate>
    </Provider>
  );
}

export default App;