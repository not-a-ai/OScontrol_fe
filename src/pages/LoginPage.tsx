import { useUser } from '@/services/UserContext';
import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type LoginResponse = {
  token: string;
  user: {
    id: number;
    nome: string;
    email: string;
    tipo: string;
  };
};

function Login() {
  const [email, setEmail] = useState<string>('');
  const [senha, setSenha] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { setUser } = useUser();

  const login = async (email: string, senha: string): Promise<LoginResponse> => {
    const response = await axios.post('http://localhost:3000/auth/login', {
      email,
      senha,
    });
    const { user, token } = response.data;
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    setUser(user);

    return response.data;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await login(email, senha);

      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);

      navigate('/dashboard');
    } catch (err) {
      setError('Erro ao realizar login. Verifique suas credenciais.');
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 w-full">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-100 flex flex-col gap-4"
      >
        <img src="/src/assets/logo.png" alt="Logo" className="w-48 mx-auto mb-4" />
        <h1 className="text-xl font-semibold text-center mb-2">Login</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="w-full p-2 bg-orange-400 text-white rounded hover:bg-amber-700 transition-colors"
        >
          {loading ? 'Carregando...' : 'Entrar'}
        </button>
        {error && <p className=" text-red-700 text-center">{error}</p>}
      </form>
    </div>
  );
}

export default Login;
