'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ArrowLeft, Plus, Calendar, Phone, MapPin, Edit, Trash2 } from 'lucide-react'

interface Client {
  id: string
  nome: string
  telefone: string
  endereco: string
  tipo_ambiente: string
  data_visita: string
  observacoes: string
}

export default function SchedulePage() {
  const router = useRouter()
  const [clients, setClients] = useState<Client[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  
  // Form states
  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [endereco, setEndereco] = useState('')
  const [tipoAmbiente, setTipoAmbiente] = useState('')
  const [dataVisita, setDataVisita] = useState('')
  const [observacoes, setObservacoes] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // TODO: Salvar no Supabase
    const newClient: Client = {
      id: Date.now().toString(),
      nome,
      telefone,
      endereco,
      tipo_ambiente: tipoAmbiente,
      data_visita: dataVisita,
      observacoes
    }

    setClients([...clients, newClient])
    
    // Limpar form
    setNome('')
    setTelefone('')
    setEndereco('')
    setTipoAmbiente('')
    setDataVisita('')
    setObservacoes('')
    setIsDialogOpen(false)
  }

  const handleDelete = (id: string) => {
    setClients(clients.filter(c => c.id !== id))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-amber-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-amber-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/dashboard')}
              className="text-amber-700 hover:bg-amber-100"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-amber-900">Agenda</h1>
              <p className="text-sm text-amber-600">Gerenciar clientes e visitas</p>
            </div>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-700 hover:to-rose-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Novo Cliente
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Cadastrar Cliente</DialogTitle>
                <DialogDescription>
                  Preencha os dados do cliente e agende a visita
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome do Cliente *</Label>
                  <Input
                    id="nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                    placeholder="Nome completo"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone *</Label>
                    <Input
                      id="telefone"
                      value={telefone}
                      onChange={(e) => setTelefone(e.target.value)}
                      required
                      placeholder="(00) 00000-0000"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tipo">Tipo de Ambiente</Label>
                    <Input
                      id="tipo"
                      value={tipoAmbiente}
                      onChange={(e) => setTipoAmbiente(e.target.value)}
                      placeholder="Ex: Cozinha, Closet..."
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endereco">Endereço *</Label>
                  <Input
                    id="endereco"
                    value={endereco}
                    onChange={(e) => setEndereco(e.target.value)}
                    required
                    placeholder="Rua, número, bairro, cidade"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="data">Data da Visita *</Label>
                  <Input
                    id="data"
                    type="datetime-local"
                    value={dataVisita}
                    onChange={(e) => setDataVisita(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="obs">Observações</Label>
                  <Textarea
                    id="obs"
                    value={observacoes}
                    onChange={(e) => setObservacoes(e.target.value)}
                    placeholder="Anotações rápidas sobre o cliente ou projeto"
                    rows={3}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-700 hover:to-rose-700 text-white"
                  >
                    Salvar Cliente
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {clients.length === 0 ? (
          <Card className="border-amber-200">
            <CardContent className="py-12 text-center">
              <Calendar className="w-16 h-16 text-amber-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-amber-900 mb-2">
                Nenhum cliente cadastrado
              </h3>
              <p className="text-amber-600 mb-6">
                Comece adicionando seu primeiro cliente
              </p>
              <Button
                onClick={() => setIsDialogOpen(true)}
                className="bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-700 hover:to-rose-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Cliente
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clients.map((client) => (
              <Card key={client.id} className="border-amber-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-amber-900">{client.nome}</CardTitle>
                  {client.tipo_ambiente && (
                    <CardDescription className="text-amber-600">
                      {client.tipo_ambiente}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-amber-700">
                    <Phone className="w-4 h-4" />
                    <span>{client.telefone}</span>
                  </div>

                  <div className="flex items-start gap-2 text-sm text-amber-700">
                    <MapPin className="w-4 h-4 mt-0.5" />
                    <span>{client.endereco}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-amber-700">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(client.data_visita).toLocaleString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>

                  {client.observacoes && (
                    <p className="text-sm text-amber-600 bg-amber-50 p-2 rounded border border-amber-200">
                      {client.observacoes}
                    </p>
                  )}

                  <div className="flex gap-2 pt-3 border-t border-amber-200">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-amber-300 text-amber-700 hover:bg-amber-50"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(client.id)}
                      className="border-red-300 text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
