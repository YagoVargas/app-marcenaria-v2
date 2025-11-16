'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  FolderOpen, 
  Calendar, 
  Settings, 
  AlertCircle,
  Clock,
  CheckCircle2
} from 'lucide-react'
import Logo from '@/components/custom/logo'

interface Alert {
  id: string
  cliente: string
  data: string
  tipo: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [nomeMarcenaria, setNomeMarcenaria] = useState('A Marceneira')
  const [alerts, setAlerts] = useState<Alert[]>([])

  useEffect(() => {
    // TODO: Buscar dados do Supabase
    // Simulando alertas
    setAlerts([
      {
        id: '1',
        cliente: 'João Silva',
        data: 'Amanhã, 14:00',
        tipo: 'visita'
      },
      {
        id: '2',
        cliente: 'Maria Santos',
        data: 'Sexta-feira, 10:00',
        tipo: 'visita'
      }
    ])
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-amber-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-amber-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo className="w-10 h-10" />
            <div>
              <h1 className="text-xl font-bold text-amber-900">{nomeMarcenaria}</h1>
              <p className="text-sm text-amber-600">Dashboard</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/configuracoes')}
            className="text-amber-700 hover:bg-amber-100"
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Alertas de Visitas */}
        {alerts.length > 0 && (
          <Card className="border-amber-300 bg-amber-50/50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                <CardTitle className="text-amber-900">Visitas Agendadas</CardTitle>
              </div>
              <CardDescription className="text-amber-700">
                Você tem {alerts.length} visita(s) nos próximos dias
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between p-3 bg-white rounded-lg border border-amber-200"
                >
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-amber-600" />
                    <div>
                      <p className="font-medium text-amber-900">{alert.cliente}</p>
                      <p className="text-sm text-amber-600">{alert.data}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="border-amber-400 text-amber-700">
                    Agendada
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Ações Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Criar Projeto */}
          <Card 
            className="cursor-pointer hover:shadow-xl transition-all border-amber-200 hover:border-amber-400"
            onClick={() => router.push('/projects/new')}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-amber-500 to-rose-500 rounded-lg">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-amber-900">Criar Projeto</CardTitle>
                  <CardDescription className="text-amber-600">
                    Iniciar novo projeto de marcenaria
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Projetos Salvos */}
          <Card 
            className="cursor-pointer hover:shadow-xl transition-all border-amber-200 hover:border-amber-400"
            onClick={() => router.push('/projects')}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
                  <FolderOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-amber-900">Projetos Salvos</CardTitle>
                  <CardDescription className="text-amber-600">
                    Ver todos os projetos
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Agenda */}
          <Card 
            className="cursor-pointer hover:shadow-xl transition-all border-amber-200 hover:border-amber-400"
            onClick={() => router.push('/clients/schedule')}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-amber-900">Agenda</CardTitle>
                  <CardDescription className="text-amber-600">
                    Gerenciar clientes e visitas
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Configurações */}
          <Card 
            className="cursor-pointer hover:shadow-xl transition-all border-amber-200 hover:border-amber-400"
            onClick={() => router.push('/configuracoes')}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-gray-500 to-slate-600 rounded-lg">
                  <Settings className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-amber-900">Configurações</CardTitle>
                  <CardDescription className="text-amber-600">
                    Ajustar preferências do sistema
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Status Rápido */}
        <Card className="border-amber-200">
          <CardHeader>
            <CardTitle className="text-amber-900">Status Rápido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-amber-50 rounded-lg border border-amber-200">
                <p className="text-3xl font-bold text-amber-900">0</p>
                <p className="text-sm text-amber-600 mt-1">Projetos Ativos</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-3xl font-bold text-blue-900">0</p>
                <p className="text-sm text-blue-600 mt-1">Em Medição</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-3xl font-bold text-green-900">0</p>
                <p className="text-sm text-green-600 mt-1">Finalizados</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
