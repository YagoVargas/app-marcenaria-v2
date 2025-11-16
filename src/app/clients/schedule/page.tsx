'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Plus, Calendar, Phone, MapPin, Edit, Trash2 } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface Client {
  id: string
  name: string
  phone: string
  address: string
  ambientes: string[]
  visit_date: string
  reschedule_date?: string
  notes?: string
}

export default function SchedulePage() {
  const router = useRouter()
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadClients()
  }, [])

  const loadClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('visit_date', { ascending: true })

      if (error) throw error

      setClients(data || [])
    } catch (error: any) {
      console.error('Erro ao carregar clientes:', error)
      toast.error('Erro ao carregar clientes')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este cliente?')) return

    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast.success('Cliente excluído com sucesso')
      loadClients()
    } catch (error: any) {
      console.error('Erro ao excluir cliente:', error)
      toast.error('Erro ao excluir cliente')
    }
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

          <Button
            onClick={() => router.push('/clients/new')}
            className="bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-700 hover:to-rose-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Cliente
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <Card className="border-amber-200">
            <CardContent className="py-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
              <p className="text-amber-700">Carregando clientes...</p>
            </CardContent>
          </Card>
        ) : clients.length === 0 ? (
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
                onClick={() => router.push('/clients/new')}
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
                  <CardTitle className="text-amber-900">{client.name}</CardTitle>
                  {client.ambientes && client.ambientes.length > 0 && (
                    <CardDescription className="text-amber-600">
                      <div className="flex flex-wrap gap-1 mt-1">
                        {client.ambientes.map((ambiente, idx) => (
                          <Badge key={idx} variant="outline" className="border-amber-400 text-amber-700 text-xs">
                            {ambiente}
                          </Badge>
                        ))}
                      </div>
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-amber-700">
                    <Phone className="w-4 h-4" />
                    <span>{client.phone}</span>
                  </div>

                  {client.address && (
                    <div className="flex items-start gap-2 text-sm text-amber-700">
                      <MapPin className="w-4 h-4 mt-0.5" />
                      <span>{client.address}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-amber-700" />
                    <div>
                      <Badge variant="outline" className="border-amber-400 text-amber-700">
                        {new Date(client.visit_date).toLocaleString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })}
                      </Badge>
                    </div>
                  </div>

                  {client.reschedule_date && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-blue-700" />
                      <div>
                        <Badge variant="outline" className="border-blue-400 text-blue-700">
                          Reagendado: {new Date(client.reschedule_date).toLocaleString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                          })}
                        </Badge>
                      </div>
                    </div>
                  )}

                  {client.notes && (
                    <p className="text-sm text-amber-600 bg-amber-50 p-2 rounded border border-amber-200">
                      {client.notes}
                    </p>
                  )}

                  <div className="flex gap-2 pt-3 border-t border-amber-200">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-amber-300 text-amber-700 hover:bg-amber-50"
                      onClick={() => router.push(`/clients/${client.id}/edit`)}
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
