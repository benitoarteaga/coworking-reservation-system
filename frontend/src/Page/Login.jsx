import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate(); // para redirección

  useEffect(() => {
    setShowForm(true);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:4000/api/auth/login', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
      .then(res => {
        if (!res.ok) throw new Error('Credenciales inválidas');
        return res.json();
      })
      .then(data => {
        onLoginSuccess(data.user);
      })
      .catch(err => {
        setError(err.message);
      });
  };

  const handleRegistro = () => {
    navigate('/registro-cliente'); // cambia la ruta según tu configuración
  };

  return (
    <div className="login-background">
      <form
        onSubmit={handleSubmit}
        className="login-form-container"
        style={{
          opacity: showForm ? 1 : 0,
          transform: showForm ? 'translateY(0)' : 'translateY(20px)',
        }}
      >
        <h3>Iniciar Sesión</h3>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <div className="mb-3">
          <label htmlFor="username">Usuario</label>
          <input
            id="username"
            type="text"
            className="form-control"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            className="form-control"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-login">
          Entrar
        </button>

        <div className="mt-3 text-center">
          <span>¿No tienes cuenta? </span>
          <button
            type="button"
            className="btn btn-link"
            onClick={handleRegistro}
          >
            Registrarse
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
