import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ListaOS from '../components/ListaOS';
import Header from '../components/Header';
import { useEffect, useState } from 'react';
import GenericModal from '@/components/ModalGeneric';
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();
  // Estados para controlar a abertura dos modais
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [fields, setFields] = useState<{ label: string; type: string; name: string }[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  const [submitData, setSubmitData] = useState<Function>(() => () => {});
  const [user, setUser] = useState<{ nome: string; email: string; tipo: string } | null>(null);

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

  // Função para abrir o modal com os campos e título certos
  const openModal = (
    title: string,
    modalFields: { label: string; type: string; name: string }[],
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    onSubmit: Function,
  ) => {
    setModalTitle(title);
    setFields(modalFields);
    setSubmitData(() => onSubmit);
    setIsModalOpen(true);
  };

  // Funções de submissão para cada tipo
  const handleSubmitTécnico = (data: Record<string, string>) => {
    console.log('Dados do Técnico:', data);
    // Aqui você pode fazer o envio dos dados para a API ou algo mais
    setIsModalOpen(false);
  };

  const handleSubmitServiço = (data: Record<string, string>) => {
    console.log('Dados do Serviço:', data);
    // Envio para a API ou lógica para o serviço
    setIsModalOpen(false);
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

    setIsModalOpen(false);
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <Header />
      <div className="container mx-auto py-8 px-4">
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
                  { label: 'Preço Base', type: 'number', name: 'preco' },
                ],
                handleSubmitServiço,
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
          />
        </div>

        <Card className="p-4">
          <ListaOS />
        </Card>

        <Button
          onClick={handleCriarOS}
          className="fixed bottom-6 right-6 bg-orange hover:bg-orange/80 rounded-full p-4 shadow-lg"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;
