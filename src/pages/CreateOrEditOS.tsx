import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import Header from '../components/Header';

// Exemplos de dados pré-cadastrados
const services = [
  { id: 1, name: 'Serviço A' },
  { id: 2, name: 'Serviço B' },
  { id: 3, name: 'Serviço C' },
];

const clients = [
  { id: 1, name: 'Cliente X' },
  { id: 2, name: 'Cliente Y' },
  { id: 3, name: 'Cliente Z' },
];

const CreateOrEditOS = () => {
  const navigate = useNavigate();

  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('');
  const [openingDate, setOpeningDate] = useState<Date | undefined>(undefined);
  const [closingDate, setClosingDate] = useState<Date | undefined>(undefined);
  const [finalValue, setFinalValue] = useState<number | ''>('');
  const [client, setClient] = useState<number | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredServices, setFilteredServices] = useState(services);
  const [servicesList, setServicesList] = useState<
    {
      serviceId: number;
      id: number;
      quantity: number;
    }[]
  >([]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    setFilteredServices(
      services.filter((service) => service.name.toLowerCase().includes(term.toLowerCase())),
    );
  };

  const handleSelectService = (service: { id: number }) => {
    setServicesList((prev) => {
      const existingService = prev.find((s) => s.serviceId === service.id);

      if (existingService) {
        // Atualiza a quantidade caso o serviço já exista
        return prev.map((s) =>
          s.serviceId === service.id ? { ...s, quantity: s.quantity + 1 } : s,
        );
      }

      // Adiciona o serviço com quantidade inicial 1
      return [...prev, { serviceId: service.id, id: service.id, quantity: 1 }];
    });
  };

  const handleRemoveService = (serviceId: number) => {
    setServicesList(
      (prev) => prev.filter((service) => service.id !== serviceId), // Remove da lista
    );
  };

  const handleUpdateQuantity = (serviceId: number, newQuantity: number) => {
    setServicesList(
      (prev) =>
        prev
          .map((service) =>
            service.id === serviceId
              ? { ...service, quantity: newQuantity } // Atualiza a quantidade
              : service,
          )
          .filter((service) => service.quantity > 0), // Remove serviços com quantidade 0
    );
  };

  const handleSubmit = () => {
    const orderData = {
      description,
      status,
      openingDate,
      closingDate,
      finalValue,
      client,
    };
    console.log('Ordem de serviço cadastrada/atualizada', orderData);
    // Aqui você pode realizar a lógica de salvar ou editar a ordem de serviço no backend
    navigate('/dashboard');
  };

  const handleCancel = () => {
    navigate('/dashboard'); // Redireciona para o dashboard ao cancelar
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <Header userName="Maria Oliveira" userImage="https://i.pravatar.cc/150?img=3" />

      {/* Conteúdo Principal */}
      <div className="container mx-auto py-8 px-4">
        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">Cadastrar/Editar Ordem de Serviço</h2>

          {/* Descrição */}
          <div className="mb-4">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrição da ordem de serviço"
            />
          </div>

          {/* Status */}
          <div className="mb-4">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                <SelectItem value="Concluída">Concluída</SelectItem>
                <SelectItem value="Pendente">Pendente</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Data de Abertura */}
          <div className="mb-4">
            <Label htmlFor="openingDate">Data de Abertura</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className="w-[280px] justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {openingDate ? format(openingDate, 'PPP') : <span>Escolher data</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={openingDate}
                  onSelect={setOpeningDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Data de Fechamento */}
          <div className="mb-4">
            <Label htmlFor="closingDate">Data de Fechamento</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className="w-[280px] justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {closingDate ? format(closingDate, 'PPP') : <span>Escolher data</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={closingDate}
                  onSelect={setClosingDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Serviços Prestados */}
          <div className="mb-4">
            <Label htmlFor="service-search">Buscar Serviço</Label>
            <Input
              id="service-search"
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Digite o nome do serviço"
            />

            <div className="mt-2 grid grid-cols-2 gap-2">
              {filteredServices.map((service) => (
                <Button
                  key={service.id}
                  onClick={() => handleSelectService(service)}
                  className="flex items-center justify-center p-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-all duration-200 shadow-md"
                >
                  {service.name}
                </Button>
              ))}
            </div>

            {/* Lista de serviços selecionados */}
            <div className="mt-4">
              {servicesList.length > 0 && (
                <div>
                  <h2 className="text-lg font-bold mb-2">Serviços Selecionados</h2>

                  {servicesList.map((service) => (
                    <div key={service.id} className="flex items-center gap-4 p-2 border-b">
                      {/* Nome do serviço */}
                      <span className="flex-1">
                        {services.find((s) => s.id === service.id)?.name}
                      </span>

                      {/* Botão de diminuir quantidade */}
                      <button
                        onClick={() => handleUpdateQuantity(service.id, service.quantity - 1)}
                        disabled={service.quantity <= 1}
                        className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
                      >
                        -
                      </button>

                      {/* Campo de entrada para editar quantidade */}
                      <input
                        type="number"
                        min="1"
                        value={service.quantity}
                        onChange={(e) => handleUpdateQuantity(service.id, Number(e.target.value))}
                        className="w-12 text-center border"
                      />

                      {/* Botão de aumentar quantidade */}
                      <button
                        onClick={() => handleUpdateQuantity(service.id, service.quantity + 1)}
                        className="px-2 py-1 bg-gray-200 rounded"
                      >
                        +
                      </button>

                      {/* Botão de remover serviço */}
                      <button
                        onClick={() => handleRemoveService(service.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded"
                      >
                        Remover
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Cliente */}
          <div className="mb-4">
            <Label htmlFor="client">Cliente</Label>
            <Select value={client?.toString()} onValueChange={(value) => setClient(Number(value))}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione o cliente" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id.toString()}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Valor Final */}
          <div className="mb-4">
            <Label htmlFor="finalValue">Valor Final</Label>
            <Input
              type="number"
              id="finalValue"
              value={finalValue}
              onChange={(e) => setFinalValue(Number(e.target.value))}
              placeholder="Valor final da ordem de serviço"
            />
          </div>

          {/* Botão de Submit */}
          <Button onClick={handleSubmit} className="w-full mt-4 bg-orange">
            Salvar Ordem de Serviço
          </Button>
        </Card>
        {/* Botão de Cancelar (X) */}
        <Button
          onClick={handleCancel}
          className="fixed top-24 right-6 bg-red-600 hover:bg-red-700 rounded-full p-4 shadow-lg z-10"
        >
          <X className="w-6 h-6 text-white" />
        </Button>
      </div>
    </div>
  );
};

export default CreateOrEditOS;
