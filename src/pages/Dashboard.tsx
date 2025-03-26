import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ListaOS from '../components/ListaOS';
import Header from '../components/Header';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleCriarOS = () => {
    navigate('/os');
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <Header userName="Maria Oliveira" userImage="https://i.pravatar.cc/150?img=3" />
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-center gap-4 mb-6">
          <Button variant="default" className="bg-orange hover:bg-orange/80">
            Cadastrar Técnico
          </Button>
          <Button variant="default" className="bg-orange hover:bg-orange/80">
            Cadastrar Clientes
          </Button>
          <Button variant="default" className="bg-orange hover:bg-orange/80">
            Cadastrar Serviços
          </Button>
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
