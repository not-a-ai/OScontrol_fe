import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import axios from 'axios';
import Header from '@/components/Header';

interface OrdemServico {
  id: number;
  descricao: string;
  status: string;
  data_abertura: string;
  data_fechamento: string | null;
  valor_final: number | null;
  cliente: {
    nome: string;
    email?: string;
    telefone?: string;
  };
  servico: {
    nome: string;
    descricao?: string;
    precoBase?: number;
  };
  tecnico?: {
    nome: string;
    email?: string;
  };
}

export const Atendimento = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [osData, setOsData] = useState<OrdemServico | null>(null);
  const [diagnostico, setDiagnostico] = useState('');
  const [solucao, setSolucao] = useState('');
  const [observacao, setObservacao] = useState('');

  const token = localStorage.getItem('token');

  const dataAtual = new Date().toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  });

  useEffect(() => {
    const fetchOS = async () => {
      const response = await axios.get(`http://localhost:3000/os/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      setOsData(response.data);
    };

    fetchOS();
  }, [id, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const atendimento = {
      diagnostico,
      solucao,
      observacao,
      ordem_servico_id: Number(id),
    };

    await axios.post(
      `http://localhost:3000/atendimentos/${atendimento.ordem_servico_id}`,
      atendimento,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );

    navigate('/dashboard');
  };

  if (!osData) return <p className="p-4">Carregando dados da OS...</p>;

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <Header />
      <div className="container mx-auto py-8 px-4">
        <Card className="max-w-2xl mx-auto p-6 space-y-6">
          <h2 className="text-2xl font-semibold">Registrar Atendimento para OS #{id}</h2>

          {/* Informações do cliente */}
          <div className="text-sm text-gray-600">
            <strong>Data do atendimento:</strong> {dataAtual}
            <p>
              <strong>Descrição da OS: </strong>
              {osData.descricao}
            </p>
            <p>
              <strong>Cliente:</strong> {osData.cliente?.nome}
            </p>
            {osData.servico ? (
              <p>
                <strong>Serviço:</strong> {osData.servico?.nome}
              </p>
            ) : null}
            <p>
              <strong>Status:</strong> {osData.status}
            </p>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              placeholder="Diagnóstico"
              value={diagnostico}
              onChange={(e) => setDiagnostico(e.target.value)}
              required
            />
            <Textarea
              placeholder="Solução aplicada"
              value={solucao}
              onChange={(e) => setSolucao(e.target.value)}
              required
            />
            <Textarea
              placeholder="Observação"
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
            />

            <div className="flex justify-end gap-4">
              <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
                Cancelar
              </Button>
              <Button type="submit">Salvar Atendimento</Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};
