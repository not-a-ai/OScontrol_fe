import { useEffect, useState } from 'react';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Search, Filter } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';

interface ServiceOrder {
  id: number;
  descricao: string;
  status: string;
  data_abertura: string;
  data_fechamento: string | null;
  valor_final: number | null;
  cliente: Cliente;
  gestor: Usuario;
  tecnico: Usuario;
  atendimentos: Atendimento[];
}

interface Usuario {
  id: number;
  nome: string;
  email: string;
}

interface Cliente {
  id: number;
  nome: string;
  telefone: string;
  email: string;
  endereco: string;
}

interface Atendimento {
  id: number;
  diagnostico: string;
  solucao: string;
  observacao: string;
  createdAt: Date;
}

const ListaOS = () => {
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<ServiceOrder | null>(null);
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const handleSelectOrder = (order: ServiceOrder) => {
    setSelectedOrder(order);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('token');

      try {
        const orders = await axios.get<ServiceOrder[]>('http://localhost:3000/os', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (orders.status === 200 && orders.data.length === 0) {
          setError('Nenhuma ordem de serviço cadastrada.');
        } else {
          setOrders(Array.isArray(orders.data) ? orders.data : []);
        }
      } catch (err) {
        setError('Erro ao carregar as ordens de serviço');
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) =>
    order.descricao?.toLowerCase().includes(search.toLowerCase()),
  );

  const handleDelete = async () => {
    const token = localStorage.getItem('token');

    if (selectedOrder) {
      try {
        await axios.delete(`http://localhost:3000/os/${selectedOrder.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setOrders(orders.filter((order) => order.id !== selectedOrder.id));
        setSelectedOrder(null);
      } catch (err) {
        setError('Erro ao deletar a ordem de serviço');
        console.log(err);
      }
    }
  };

  const handleEditOrder = () => {
    if (selectedOrder) {
      navigate(`/os/${selectedOrder.id}`);
    }
  };

  const handleDeleteAtendimento = async (id: number) => {
    const token = localStorage.getItem('token');

    if (!selectedOrder) return;

    const confirmDelete = window.confirm('Tem certeza que deseja excluir este atendimento?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:3000/atendimentos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Atualiza a lista de atendimentos localmente
      setSelectedOrder({
        ...selectedOrder,
        atendimentos: selectedOrder.atendimentos.filter((a) => a.id !== id),
      });
    } catch (error) {
      console.error('Erro ao deletar atendimento:', error);
      alert('Erro ao deletar atendimento.');
    }
  };

  return (
    <div className="w-full p-6">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Ordens de Serviço</h2>

        {/* Barra de pesquisa */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 text-gray-500" size={16} />
            <Input
              type="text"
              placeholder="Pesquisar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>
          <Button variant="outline">
            <Filter size={16} className="mr-2" /> Filtrar
          </Button>
        </div>
      </div>

      {/* Lista de Ordens de Serviço */}
      {loading ? (
        <p className="text-center text-gray-500">Carregando...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : filteredOrders.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOrders.map((order) => (
            <Card
              key={order.id}
              className="p-4 border cursor-pointer hover:shadow-md transition"
              onClick={() => handleSelectOrder(order)}
            >
              <h3 className="font-medium text-lg">OS nº {order.id}</h3>
              <p className="text-gray-500 text-sm mt-1">{order.descricao}</p>
              <p className="text-sm mt-2">
                <strong>Cliente:</strong> {order.cliente.nome}
              </p>
              <p
                className={`text-sm mt-1 font-medium ${order.status === 'concluida' ? 'text-green-600' : 'text-yellow-600'}`}
              >
                <strong>Status:</strong> {order.status}
              </p>
              <p className="text-sm mt-1">
                <strong>Valor:</strong>{' '}
                {order.valor_final ? `R$${order.valor_final}` : 'Não definido'}
              </p>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center p-4">Nenhuma ordem encontrada</p>
      )}

      {/* Modal de Detalhes da OS */}
      {selectedOrder && (
        <Dialog open={selectedOrder !== null} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>OS n° {selectedOrder.id}</DialogTitle>
            </DialogHeader>

            {/* Descrição da OS */}
            <p>{selectedOrder.descricao}</p>

            {/* Informações adicionais */}
            <div className="mt-4 space-y-2">
              <p>
                <strong>Status:</strong> {selectedOrder.status}
              </p>
              <p>
                <strong>Data de Abertura:</strong>{' '}
                {new Date(selectedOrder.data_abertura).toLocaleDateString()}
              </p>
              <p>
                <strong>Data de Fechamento:</strong>{' '}
                {selectedOrder.data_fechamento
                  ? new Date(selectedOrder.data_fechamento).toLocaleDateString()
                  : 'Não concluída'}
              </p>
              <p>
                {/* buscar nome do técnico */}
                <strong>Técnico:</strong>{' '}
                {selectedOrder.tecnico ? `${selectedOrder.tecnico.nome}` : 'Não definido'}
              </p>
              <p>
                {}
                <strong>Valor Final:</strong>{' '}
                {selectedOrder.valor_final ? `R$${selectedOrder.valor_final}` : 'Não definido'}
              </p>
              {/* Lista de Atendimentos */}
              {selectedOrder.atendimentos.length ? (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold">Atendimentos</h3>
                  <ul className="mt-2 space-y-2">
                    {selectedOrder.atendimentos.map((atendimento: Atendimento, index: number) => (
                      <li key={index} className="border p-2 rounded">
                        <p>
                          <strong>Data:</strong> {new Date(atendimento.createdAt).toLocaleString()}
                        </p>
                        <p>
                          <strong>Diagnóstico:</strong> {atendimento.diagnostico}
                        </p>
                        <p>
                          <strong>Solução:</strong> {atendimento.solucao}
                        </p>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="mt-2"
                          onClick={() => handleDeleteAtendimento(atendimento.id)}
                        >
                          Excluir
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold">Atendimentos</h3>
                  <p>Nenhum atendimento registrado.</p>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="destructive" onClick={handleDelete}>
                Deletar
              </Button>
              <Button variant="default" onClick={handleEditOrder}>
                Editar
              </Button>
              <Button onClick={() => navigate(`/os/${selectedOrder.id}/atendimento`)}>
                Registrar Atendimento
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ListaOS;
