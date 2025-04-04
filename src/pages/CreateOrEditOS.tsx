import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
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
import axios from 'axios';

interface Cliente {
  id: number;
  nome: string;
  email: string;
}

// interface Servico {
//   nome: string;
//   id: number;
//   quantidade: number;
// }

interface Tecnico {
  id: number;
  nome: string;
  email: string;
}

// interface SelectedService {
//   id: number;
//   nome: string;
//   quantidade: number;
// }

const CreateOrEditOS = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  const { id } = useParams();

  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('');
  const [openingDate, setOpeningDate] = useState<Date | undefined>(undefined);
  const [closingDate, setClosingDate] = useState<Date | undefined>(undefined);
  const [finalValue, setFinalValue] = useState<number | ''>('');
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [clienteSelecionado, setClienteSelecionado] = useState('');
  const [tecnico, setTecnico] = useState<number | null>(null);
  const [tecnicos, setTecnicos] = useState<Tecnico[]>([]);
  // const [searchTerm, setSearchTerm] = useState('');
  // const [services, setServices] = useState<Servico[]>([]);
  // const [filteredServices, setFilteredServices] = useState<Servico[]>([]);
  // const [servicesList, setServicesList] = useState<SelectedService[]>([
  //   { id: 1, nome: 'Serviço A', quantidade: 0 },
  //   { id: 2, nome: 'Serviço B', quantidade: 0 },
  //   { id: 3, nome: 'Serviço C', quantidade: 0 },
  // ]);
  const [loading, setLoading] = useState(true);

  // Buscar serviços
  // const fetchServices = async () => {
  //   try {
  //     const response = await axios.get('http://localhost:3000/servicos', {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     setServices(response.data);
  //     setFilteredServices(response.data);
  //   } catch (error) {
  //     console.error('Erro ao buscar serviços:', error);
  //   }
  // };

  // Buscar técnicos
  const fetchTecnicos = async () => {
    try {
      const response = await axios.get('http://localhost:3000/usuario/tecnicos', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTecnicos(response.data);
    } catch (error) {
      console.error('Erro ao buscar técnicos:', error);
    }
  };

  // const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const term = e.target.value;
  //   setSearchTerm(term);
  //   setFilteredServices(
  //     services.filter((service) => service.nome.toLowerCase().includes(term.toLowerCase())),
  //   );
  // };

  // const handleSelectService = (service: Servico) => {
  //   setServicesList((prev) => {
  //     const existingService = prev.find((s) => s.id === service.id);

  //     if (existingService) {
  //       return prev.map((s) => (s.id === service.id ? { ...s, quantidade: s.quantidade + 1 } : s));
  //     }

  //     return [...prev, { serviceId: service.id, id: service.id, quantidade: 1 }];
  //   });
  // };

  // const handleRemoveService = (serviceId: number) => {
  //   setServicesList(
  //     (prev) => prev.filter((service) => service.id !== serviceId), // Remove da lista
  //   );
  // };

  // const handleUpdateQuantity = (serviceId: number, newQuantity: number) => {
  //   setServicesList(
  //     (prev) =>
  //       prev
  //         .map((service) =>
  //           service.id === serviceId
  //             ? { ...service, quantidade: newQuantity } // Atualiza a quantidade
  //             : service,
  //         )
  //         .filter((service) => service.quantidade > 0), // Remove serviços com quantidade 0
  //   );
  // };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user?.id;

    const ordemDeServico = {
      descricao: description,
      client_id: clienteSelecionado,
      gestor_id: userId,
      tecnico_id: tecnico,
      status: status,
      data_abertura: openingDate ? new Date(openingDate).toISOString() : null,
      data_fechamento: closingDate ? new Date(closingDate).toISOString() : null,
      valor_final: finalValue ? Number(finalValue) : null,
    };

    try {
      if (id) {
        // Edição
        await axios.patch(`http://localhost:3000/os/${id}`, ordemDeServico, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        alert('Ordem de serviço atualizada com sucesso!');
      } else {
        // Criação
        await axios.post('http://localhost:3000/os', ordemDeServico, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        alert('Ordem de serviço criada com sucesso!');
      }
      navigate('/dashboard');
    } catch (error) {
      console.error('Erro ao salvar OS:', error);
      alert(`Não foi possível ${id ? 'atualizar' : 'criar'} sua OS.`);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Buscar clientes
        const clientesResponse = await axios.get('http://localhost:3000/clientes', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setClientes(clientesResponse.data);

        // Buscar serviços
        // await fetchServices();

        // Buscar técnicos
        await fetchTecnicos();

        // Se for edição, buscar os dados da OS
        if (id) {
          const osResponse = await axios.get(`http://localhost:3000/os/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const osData = osResponse.data;

          setDescription(osData.descricao || '');
          setClienteSelecionado(osData.client_id?.toString() || '');
          setTecnico(osData.tecnico_id || null);
          setStatus(osData.status || '');
          setOpeningDate(osData.data_abertura ? new Date(osData.data_abertura) : undefined);
          setClosingDate(osData.data_fechamento ? new Date(osData.data_fechamento) : undefined);
          setFinalValue(osData.valor_final || '');

          // Carregar serviços da OS
          // if (osData.servicos && osData.servicos.length > 0) {
          //   setServicesList(
          //     osData.servicos.map((s: Servico) => ({
          //       id: s.id,
          //       quantity: s.quantidade,
          //     })),
          //   );
          // }
        }
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, token]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <Header />

      {/* Conteúdo Principal */}
      <div className="container mx-auto py-8 px-4">
        <Card className="p-4">
          <div className="flex justify-between">
            <h2 className="text-xl font-semibold mb-4">Cadastrar/Editar Ordem de Serviço</h2>

            {/* Botão de Cancelar (X) */}
            <Button
              onClick={handleCancel}
              className=" bg-red-600 hover:bg-red-700 rounded-full p-4 shadow-lg"
            >
              <X className="w-6 h-6 text-white" />
            </Button>
          </div>
          {/* Descrição */}
          <div className="mb-4">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={description || 'Descrição da ordem de serviço'}
            />
          </div>
          {/* Status */}
          <div className="mb-4">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={status || 'Selecione o status'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="aberta">Aberta</SelectItem>
                <SelectItem value="em_andamento">Em Andamento</SelectItem>
                <SelectItem value="concluida">Concluída</SelectItem>
                <SelectItem value="cancelada">Cancelada</SelectItem>
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
          {/* Serviços Prestados
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
                  {service.nome}
                </Button>
              ))}
            </div>

            {/* Lista de serviços selecionados */}
          {/* <div className="mt-4">
              {servicesList.length > 0 && (
                <div>
                  <h2 className="text-lg font-bold mb-2">Serviços Selecionados</h2>

                  {servicesList.map((service) => (
                    <div key={service.id} className="flex items-center gap-4 p-2 border-b">
                      {/* Nome do serviço */}
          {/* <span className="flex-1">
                        {services.find((s) => s.id === service.id)?.nome}
                      </span> */}

          {/* Botão de diminuir quantidade */}
          {/* <button
                        onClick={() => handleUpdateQuantity(service.id, service.quantidade - 1)}
                        disabled={service.quantidade <= 1}
                        className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
                      >
                        -
                      </button>

                      Campo de entrada para editar quantidade */}
          {/* <input
                        type="number"
                        min="1"
                        value={service.quantidade}
                        onChange={(e) => handleUpdateQuantity(service.id, Number(e.target.value))}
                        className="w-12 text-center border"
                      />

                      {/* Botão de aumentar quantidade */}
          {/* <button
                        onClick={() => handleUpdateQuantity(service.id, service.quantidade + 1)}
                        className="px-2 py-1 bg-gray-200 rounded"
                      >
                        +
                      </button>

                      {/* Botão de remover serviço */}
          {/* <button
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
          </div> */}
          {/* Cliente */}
          <div className="mb-4">
            <Label htmlFor="client">Cliente</Label>
            <Select
              value={clienteSelecionado?.toString()}
              onValueChange={(value) => setClienteSelecionado(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={clienteSelecionado || 'Selecione o cliente'} />
              </SelectTrigger>
              <SelectContent>
                {clientes.map((cliente) => (
                  <SelectItem key={cliente.id} value={cliente.id.toString()}>
                    {cliente.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* tecnico */}
          <div className="mb-4">
            <Label htmlFor="client">Técnico responsável</Label>
            <Select
              value={tecnico ? String(tecnico) : ''}
              onValueChange={(value) => setTecnico(Number(value))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={tecnico || 'Selecione o Técnico'} />
              </SelectTrigger>
              <SelectContent>
                {tecnicos?.map((tecnico) => (
                  <SelectItem key={tecnico.id} value={tecnico.id.toString()}>
                    {tecnico.nome}
                  </SelectItem>
                )) || (
                  <SelectItem disabled value={''}>
                    Nenhum técnico disponível
                  </SelectItem>
                )}
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
      </div>
    </div>
  );
};

export default CreateOrEditOS;
