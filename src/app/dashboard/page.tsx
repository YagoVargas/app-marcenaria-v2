'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Logo } from '@/components/custom/logo'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'
import { Profile, Client } from '@/lib/types'
import { 
  Plus, 
  FolderOpen, 
  Calendar, 
  Settings, 
  Bell,
  Loader2,
  LogOut
} from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [upcomingVisits, setUpcomingVisits] = useState<Client[]>([])

  useEffect(() => {
    loadDashboard()
  }, [])

  const loadDashboard = async () => {
    const profileId = localStorage.getItem('profileId')
    if (!profileId) {
      router.push('/')
      return
    }

    try {
      // Carregar perfil
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', profileId)
        .single()

      if (profileError) {
        console.error('Erro ao carregar perfil:', profileError)
        router.push('/')
        return
      }

      setProfile(profileData)

      // Carregar visitas próximas (próximos 7 dias)
      const today = new Date()
      const nextWeek = new Date()
      nextWeek.setDate(today.getDate() + 7)

      const { data: visitsData, error: visitsError } = await supabase
        .from('clients')
        .select('*')
        .eq('profile_id', profileId)
        .gte('data_visita', today.toISOString())
        .lte('data_visita', nextWeek.toISOString())
        .order('data_visita', { ascending: true })

      if (!visitsError && visitsData) {
        setUpcomingVisits(visitsData)
      }

      setLoading(false)
    } catch (err) {
      console.error('Erro ao carregar dashboard:', err)
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('userId')
    localStorage.removeItem('profileId')
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-pink-50 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-amber-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-pink-50">
      {/* Header */}
      <header className="bg-white border-b border-amber-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Logo className="h-12 w-12" />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-amber-900">
                  {profile?.nome_marcenaria}
                </h1>
                <p className="text-sm text-amber-700">
                  {profile?.tratamento} {profile?.nome_profissional}
                </p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="icon"
              className="text-amber-700 hover:text-amber-900 hover:bg-amber-100"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Alertas de Visitas */}
        {upcomingVisits.length > 0 && (
          <Card className="mb-8 p-6 bg-gradient-to-r from-amber-100 to-pink-100 border-amber-300">
            <div className="flex items-start gap-4">
              <Bell className="h-6 w-6 text-amber-700 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="font-bold text-amber-900 mb-2">
                  Visitas Agendadas nos Próximos Dias
                </h3>
                <div className="space-y-2">
                  {upcomingVisits.map((visit) => (
                    <div
                      key={visit.id}
                      className="bg-white/60 rounded-lg p-3 text-sm"
                    >
                      <p className="font-semibold text-amber-900">
                        {visit.nome}
                      </p>
                      <p className="text-amber-700">
                        {new Date(visit.data_visita!).toLocaleDateString('pt-BR', {
                          weekday: 'long',
                          day: '2-digit',
                          month: 'long',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      {visit.tipo_ambiente && (
                        <p className="text-amber-600 text-xs mt-1">
                          {visit.tipo_ambiente}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Menu Principal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {/* Criar Projeto */}
          <Card
            onClick={() => router.push('/projects/new')}
            className="p-8 cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-amber-500 to-amber-600 border-0 text-white"
          >
            <div className="flex flex-col items-center text-center gap-4">
              <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center">
                <Plus className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1">Criar Projeto</h3>
                <p className="text-sm text-amber-100">
                  Iniciar novo briefing e medição
                </p>
              </div>
            </div>
          </Card>

          {/* Projetos Salvos */}
          <Card
            onClick={() => router.push('/projects')}
            className="p-8 cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-pink-500 to-pink-600 border-0 text-white"
          >
            <div className="flex flex-col items-center text-center gap-4">
              <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center">
                <FolderOpen className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1">Projetos Salvos</h3>
                <p className="text-sm text-pink-100">
                  Ver todos os projetos
                </p>
              </div>
            </div>
          </Card>

          {/* Agenda */}
          <Card
            onClick={() => router.push('/clients/schedule')}
            className="p-8 cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white border-2 border-amber-200"
          >
            <div className="flex flex-col items-center text-center gap-4">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-amber-100 to-pink-100 flex items-center justify-center">
                <Calendar className="h-8 w-8 text-amber-700" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-amber-900 mb-1">Agenda</h3>
                <p className="text-sm text-amber-700">
                  Gerenciar clientes e visitas
                </p>
              </div>
            </div>
          </Card>

          {/* Configurações */}
          <Card
            onClick={() => router.push('/settings')}
            className="p-8 cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white border-2 border-amber-200"
          >
            <div className="flex flex-col items-center text-center gap-4">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-amber-100 to-pink-100 flex items-center justify-center">
                <Settings className="h-8 w-8 text-amber-700" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-amber-900 mb-1">Configurações</h3>
                <p className="text-sm text-amber-700">
                  Editar perfil e preferências
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Informações Rápidas */}
        <Card className="mt-8 p-6 bg-white border border-amber-200">
          <h3 className="font-bold text-amber-900 mb-4">Informações do Perfil</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-amber-600 font-medium">Unidade de Medida</p>
              <p className="text-amber-900">{profile?.unidade_medida}</p>
            </div>
            {profile?.telefone && (
              <div>
                <p className="text-amber-600 font-medium">Telefone</p>
                <p className="text-amber-900">{profile.telefone}</p>
              </div>
            )}
            {profile?.endereco && (
              <div className="sm:col-span-2">
                <p className="text-amber-600 font-medium">Endereço</p>
                <p className="text-amber-900">{profile.endereco}</p>
              </div>
            )}
            {profile?.materiais_usados && profile.materiais_usados.length > 0 && (
              <div className="sm:col-span-2">
                <p className="text-amber-600 font-medium mb-2">Materiais</p>
                <div className="flex flex-wrap gap-2">
                  {profile.materiais_usados.map((material) => (
                    <span
                      key={material}
                      className="px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-medium"
                    >
                      {material}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      </main>
    </div>
  )
}
