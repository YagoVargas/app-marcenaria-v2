'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, ArrowRight, Plus } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface Client {
  id: string
  name: string
  phone: string
}

export default function NewProjectPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [clients, setClients] = useState<Client[]>([])
  const [loadingClients, setLoadingClients] = useState(true)
  
  const [formData, setFormData] = useState({
    name: '',
    client_id: '',
    status: 'draft'
  })

  // Carregar clientes do Supabase
  useEffect(() => {
    loadClients()
  }, [])

  const loadClients = async () => {
    try {
      // TODO: Filtrar por user_id quando tiver autenticação
      const { data, error } = await supabase
        .from('clients')
        .select('id, name, phone')
        .order('name')

      if (error) throw error

      setClients(data || [])
    } catch (error: any) {
      console.error('Erro ao carregar clientes:', error)
      toast.error('Erro ao carregar clientes')
    } finally {
      setLoadingClients(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const generateProjectCode = async (userId: string): Promise<string> => {
    try {
      // Buscar último código do usuário
      const { data, error } = await supabase
        .from('projects')
        .select('code')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)

      if (error) throw error

      if (data && data.length > 0) {
        // Extrair número do último código (PRJ-0001 -> 1)
        const lastCode = data[0].code
        const lastNumber = parseInt(lastCode.split('-')[1])
        const newNumber = lastNumber + 1
        return `PRJ-${String(newNumber).padStart(4, '0')}`
      } else {
        // Primeiro projeto do usuário
        return 'PRJ-0001'
      }
    } catch (error) {
      console.error('Erro ao gerar código:', error)
      // Fallback: usar timestamp
      return `PRJ-${Date.now().toString().slice(-4)}`
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.client_id) {
      toast.error('Preencha os campos obrigatórios: Nome do Projeto e Cliente')
      return
    }

    setLoading(true)

    try {
      // TODO: Pegar user_id real da sessão
      const userId = '00000000-0000-0000-0000-000000000000' // Temporário

      // Gerar código automático
      const projectCode = await generateProjectCode(userId)

      const { data, error } = await supabase
        .from('projects')
        .insert([
          {
            user_id: userId,
            client_id: formData.client_id,
            name: formData.name,
            code: projectCode,
            status: formData.status
          }
        ])
        .select()

      if (error) throw error

      toast.success(`Projeto ${projectCode} criado com sucesso!`)
      
      // Redirecionar para briefing
      if (data && data[0]) {
        router.push(`/projects/${data[0].id}/briefing`)
      }
    } catch (error: any) {
      console.error('Erro ao criar projeto:', error)
      toast.error('Erro ao criar projeto: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-amber-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-amber-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="text-amber-700 hover:bg-amber-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-amber-900">Novo Projeto</h1>
            <p className="text-sm text-amber-600">Criar projeto de marcenaria</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit}>
          <Card className="border-amber-200">
            <CardHeader>
              <CardTitle className="text-amber-900">Informações do Projeto</CardTitle>
              <CardDescription className="text-amber-600">
                Preencha os dados básicos do projeto
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Nome do Projeto */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-amber-900">
                  Nome do Projeto <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="Ex: Cozinha Planejada - Apartamento 101"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="border-amber-200 focus:border-amber-400"
                  required
                />
                <p className="text-xs text-amber-600">
                  O código do projeto será gerado automaticamente (PRJ-XXXX)
                </p>
              </div>

              {/* Cliente Associado */}
              <div className="space-y-2">
                <Label htmlFor="client_id" className="text-amber-900">
                  Cliente <span className="text-red-500">*</span>
                </Label>
                {loadingClients ? (
                  <div className="text-sm text-amber-600">Carregando clientes...</div>
                ) : clients.length === 0 ? (
                  <div className="space-y-2">
                    <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-200">
                      Nenhum cliente cadastrado ainda.
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.push('/clients/new')}
                      className="w-full border-amber-300 text-amber-700 hover:bg-amber-50"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Cadastrar Novo Cliente
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Select
                      value={formData.client_id}
                      onValueChange={(value) => handleInputChange('client_id', value)}
                      required
                    >
                      <SelectTrigger className="border-amber-200 focus:border-amber-400">
                        <SelectValue placeholder="Selecione o cliente" />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.name} - {client.phone}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push('/clients/new')}
                      className="text-amber-700 hover:bg-amber-50"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Cadastrar novo cliente
                    </Button>
                  </div>
                )}
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label htmlFor="status" className="text-amber-900">
                  Status Inicial
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleInputChange('status', value)}
                >
                  <SelectTrigger className="border-amber-200 focus:border-amber-400">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="border-gray-400 text-gray-700">
                          Rascunho
                        </Badge>
                      </div>
                    </SelectItem>
                    <SelectItem value="briefing">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="border-blue-400 text-blue-700">
                          Briefing
                        </Badge>
                      </div>
                    </SelectItem>
                    <SelectItem value="measuring">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="border-amber-400 text-amber-700">
                          Medindo
                        </Badge>
                      </div>
                    </SelectItem>
                    <SelectItem value="completed">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="border-green-400 text-green-700">
                          Finalizado
                        </Badge>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-amber-600">
                  Você pode alterar o status a qualquer momento
                </p>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900 font-medium">
                  📋 Próximos passos
                </p>
                <p className="text-sm text-blue-700 mt-1">
                  Após criar o projeto, você será direcionado para a tela de Briefing, 
                  onde poderá adicionar ambientes, módulos e preferências do cliente.
                </p>
              </div>

              {/* Botões */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="flex-1 border-amber-300 text-amber-700 hover:bg-amber-50"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={loading || clients.length === 0}
                  className="flex-1 bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-700 hover:to-rose-700 text-white"
                >
                  {loading ? 'Criando...' : 'Criar e Avançar'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </main>
    </div>
  )
}
