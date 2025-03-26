import { useState } from 'react';
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

interface ServiceOrder {
  id: number;
  title: string;
  description: string;
}

const ListaOS = () => {
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<ServiceOrder | null>(null);
  const [orders, setOrders] = useState<ServiceOrder[]>([
    { id: 1, title: 'Ordem 1', description: 'Descrição da ordem 1' },
    { id: 2, title: 'Ordem 2', description: 'Descrição da ordem 2' },
    { id: 3, title: 'Ordem 3', description: 'Descrição da ordem 3' },
  ]);

  // Estados para armazenar as informações da OS
  const [client, setClient] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [totalValue, setTotalValue] = useState<number>(0);
  const [tecnico, setTecnico] = useState<string>('');

  // Exemplo de uma OS selecionada para demonstrar o preenchimento dos dados
  const selectedOrderData = {
    client: 'João Silva',
    status: 'Em andamento',
    totalValue: 150.5,
    technician: 'Carlos Pereira',
  };

  // Função que preenche os dados da OS no modal
  const handleSelectOrder = (order: ServiceOrder) => {
    setClient(selectedOrderData.client);
    setStatus(selectedOrderData.status);
    setTotalValue(selectedOrderData.totalValue);
    setTecnico(selectedOrderData.technician);
    setSelectedOrder(order); // Atualiza a OS selecionada
  };

  // Filtra as ordens de serviço com base na pesquisa
  const filteredOrders = orders.filter((order) =>
    order.title.toLowerCase().includes(search.toLowerCase()),
  );

  // Função para deletar a ordem de serviço
  const handleDelete = () => {
    if (selectedOrder) {
      setOrders(orders.filter((order) => order.id !== selectedOrder.id));
      setSelectedOrder(null); // Fecha o modal após a exclusão
    }
  };

  // Função para selecionar a ordem para edição
  const handleEditOrder = () => {
    if (selectedOrder) {
      // Lógica para editar a ordem de serviço
      console.log('Editando a ordem:', selectedOrder);
      // Aqui, você pode abrir um formulário de edição ou algo semelhante
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
      <Card className="p-4">
        {filteredOrders.length > 0 ? (
          <ul className="space-y-2">
            {filteredOrders.map((order) => (
              <li
                key={order.id}
                className="border-b p-2 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSelectOrder(order)}
              >
                <p className="font-medium">{order.title}</p>
                <p className="text-gray-500 text-sm">{order.description}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center p-4">Nenhuma ordem encontrada</p>
        )}
      </Card>

      {/* Modal de Detalhes da OS */}
      {selectedOrder && (
        <Dialog open={selectedOrder !== null} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedOrder.title}</DialogTitle>
            </DialogHeader>

            {/* Descrição da OS */}
            <p>{selectedOrder.description}</p>

            {/* Informações adicionais */}
            <div className="mt-4">
              <h3 className="font-medium">Cliente:</h3>
              <p>{client}</p>

              <h3 className="font-medium mt-2">Status:</h3>
              <p>{status}</p>

              <h3 className="font-medium mt-2">Valor Final:</h3>
              <p>R${totalValue.toFixed(2)}</p>

              <h3 className="font-medium mt-2">Técnico Responsável:</h3>
              <p>{tecnico}</p>
            </div>

            <DialogFooter>
              <Button variant="destructive" onClick={handleDelete}>
                Deletar
              </Button>
              <Button variant="default" onClick={handleEditOrder}>
                Editar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ListaOS;
