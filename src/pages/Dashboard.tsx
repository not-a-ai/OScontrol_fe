import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ListaOS from '../components/ListaOS';
import Header from '../components/Header';
import { useEffect, useState } from 'react';
import GenericModal from '@/components/ModalGeneric';
import axios from 'axios';

interface User {
  id: string;
  nome: string;
  tipo: 'tecnico' | 'admin'; // ou os tipos que tiver
}

const Dashboard = () => {
  const navigate = useNavigate();
  // Estados para controlar a abertura dos modais
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [fields, setFields] = useState<{ label: string; type: string; name: string }[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  const [submitData, setSubmitData] = useState<Function>(() => () => {});
  const [dataList, setDataList] = useState<Array<string>>([]);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
    }

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate('/');
    }
  }, [navigate]);

  if (!user) {
    return <div>Carregando...</div>;
  }

  const handleCriarOS = () => {
    navigate('/os');
  };

  const openModal = async (
    title: string,
    modalFields: { label: string; type: string; name: string }[],
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    onSubmit: Function,
    tipo: string,
  ) => {
    setModalTitle(title);
    setFields(modalFields);
    setSubmitData(() => onSubmit);
    setIsModalOpen(true);
    await fetchDataList(tipo);
  };
  const fetchDataList = async (tipo: string) => {
    try {
      let url = 'http://localhost:3000';
      if (tipo === 'cliente') url += '/clientes';
      if (tipo === 'tecnico') url += '/usuario/tecnicos';
      if (tipo === 'servico') url += '/servico';

      const token = localStorage.getItem('token');

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setDataList(response.data);
    } catch (err) {
      console.error('Erro ao buscar dados:', err);
    }
  };

  // Funções de submissão para cada tipo
  const handleSubmitTécnico = async (data: Record<string, string>) => {
    try {
      const token = localStorage.getItem('token');

      data = { ...data, tipo: 'tecnico', senha: '123' };

      await axios.post('http://localhost:3000/usuario', data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Criou tecnico com sucesso!');
      await fetchDataList('tecnico');
    } catch (e) {
      console.error(e);
      alert('Ocorreu um erro.');
    }
  };

  const handleSubmitServiço = async (data: Record<string, string>) => {
    try {
      const token = localStorage.getItem('token');

      await axios.post('http://localhost:3000/servico', data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Criou serviço com sucesso!');
    } catch (e) {
      console.error(e);
      alert('Ocorreu um erro.');
    }
  };

  const handleSubmitCliente = async (data: Record<string, string>) => {
    try {
      const token = localStorage.getItem('token');

      await axios.post('http://localhost:3000/clientes', data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Criou cliente com sucesso!');
    } catch (e) {
      console.error(e);
      alert('Ocorreu um erro.');
    }
  };

  const isTecnico = user?.tipo === 'tecnico';

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <Header />
      <div className="container mx-auto py-8 px-4">
        {!isTecnico && (
          <div className="flex justify-center gap-4 mb-6">
            {/* Botões para abrir os modais */}
            <Button
              variant="secondary"
              onClick={() =>
                openModal(
                  'Cadastrar Técnico',
                  [
                    { label: 'Nome', type: 'text', name: 'nome' },
                    { label: 'E-mail', type: 'email', name: 'email' },
                  ],
                  handleSubmitTécnico,
                  'tecnico',
                )
              }
            >
              Cadastrar Técnico
            </Button>

            <Button
              variant="secondary"
              onClick={() =>
                openModal(
                  'Cadastrar Serviço',
                  [
                    { label: 'Nome', type: 'text', name: 'nome' },
                    { label: 'Descrição', type: 'text', name: 'descricao' },
                    { label: 'Preço Base', type: 'number', name: 'precoBase' },
                  ],
                  handleSubmitServiço,
                  'servico',
                )
              }
            >
              Cadastrar Serviço
            </Button>

            <Button
              variant="secondary"
              onClick={() =>
                openModal(
                  'Cadastrar Cliente',
                  [
                    { label: 'Nome', type: 'text', name: 'nome' },
                    { label: 'Telefone', type: 'text', name: 'telefone' },
                    { label: 'E-mail', type: 'email', name: 'email' },
                    { label: 'Endereço', type: 'text', name: 'endereco' },
                  ],
                  handleSubmitCliente,
                  'cliente',
                )
              }
            >
              Cadastrar Cliente
            </Button>

            {/* Modal Genérico */}
            <GenericModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              title={modalTitle}
              fields={fields}
              onSubmit={(data) => submitData(data)}
              dataList={dataList}
            />
          </div>
        )}

        <Card className="p-4">
          <ListaOS />
        </Card>
        {!isTecnico && (
          <Button
            onClick={handleCriarOS}
            className="fixed bottom-6 right-6 bg-orange hover:bg-orange/80 rounded-full p-4 shadow-lg"
          >
            <Plus className="w-6 h-6" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
