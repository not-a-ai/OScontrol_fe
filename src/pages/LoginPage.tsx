import React, { useState } from 'react';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login feito com:', email, password);
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
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="w-full p-2 bg-orange-400 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}

export default Login;
