import React, { useEffect, useState } from 'react';
import Login from './Page/Login';
import Home from './Page/Home';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('http://localhost:4000/api/auth/session', {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        if (data.loggedIn) {
          setUser(data.user);
        }
      });
  }, []);

  const handleLogout = () => {
    fetch('http://localhost:4000/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    }).then(() => setUser(null));
  };

  return user ? (
    <Home user={user} onLogout={handleLogout} />
  ) : (
    <Login onLoginSuccess={setUser} />
  );
}

export default App;
