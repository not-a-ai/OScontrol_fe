type LoginResponse = {
  token: string;
  user: {
    id: number;
    nome: string;
    email: string;
    tipo: string;
  };
};

import axios from 'axios';

export const login = async (email: string, senha: string): Promise<LoginResponse> => {
  const response = await axios.post('http://localhost:3000/auth/login', {
    email,
    senha,
  });
  console.log(response);

  return response.data;
};
