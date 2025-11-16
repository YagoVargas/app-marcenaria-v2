'use client'

import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, FileText } from 'lucide-react'

export default function BriefingPage() {
  const router = useRouter()
  const params = useParams()
  const projectId = params.id as string

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-amber-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-amber-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/dashboard')}
            className="text-amber-700 hover:bg-amber-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-amber-900">Briefing do Projeto</h1>
            <p className="text-sm text-amber-600">Adicionar ambientes e preferências</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Card className="border-amber-200">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <FileText className="w-16 h-16 text-amber-400" />
            </div>
            <CardTitle className="text-2xl text-amber-900">
              Tela de Briefing em Desenvolvimento
            </CardTitle>
            <CardDescription className="text-amber-600">
              Esta funcionalidade será implementada na próxima etapa
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900 font-medium mb-2">
                📋 Funcionalidades Planejadas:
              </p>
              <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                <li>Adicionar múltiplos ambientes ao projeto</li>
                <li>Selecionar módulos comuns para cada ambiente</li>
                <li>Inserção manual de módulos customizados</li>
                <li>Configurar portas (quantidade e tipo)</li>
                <li>Configurar gavetas (quantidade)</li>
                <li>Adicionar preferências do cliente</li>
                <li>Selecionar ferragens necessárias</li>
                <li>Detalhes de módulos suspensos</li>
              </ul>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                onClick={() => router.push('/dashboard')}
                className="flex-1 bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-700 hover:to-rose-700 text-white"
              >
                Voltar ao Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
