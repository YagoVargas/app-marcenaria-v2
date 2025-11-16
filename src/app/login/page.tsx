'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Logo from '@/components/custom/logo'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setLoading(true)
    
    // Simular login temporário
    // TODO: Implementar autenticação real com Supabase
    
    // Verificar se é primeiro acesso
    const firstAccess = true // TODO: Buscar do Supabase
    
    setTimeout(() => {
      if (firstAccess) {
        router.push('/quiz')
      } else {
        router.push('/dashboard')
      }
    }, 500)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-rose-50 to-amber-100 p-4">
      <Card className="w-full max-w-md shadow-2xl border-amber-200">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <Logo className="w-24 h-24" />
          </div>
          <CardTitle className="text-3xl font-bold text-amber-900">
            A Marceneira
          </CardTitle>
          <CardDescription className="text-base text-amber-700">
            Sistema de briefing e medições para marcenaria
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center text-sm text-amber-600 bg-amber-50 p-4 rounded-lg border border-amber-200">
            <p className="font-medium">Bem-vindo ao sistema!</p>
            <p className="mt-1">Clique no botão abaixo para começar</p>
          </div>
          
          <Button 
            onClick={handleLogin}
            disabled={loading}
            className="w-full h-12 text-lg bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-700 hover:to-rose-700 text-white shadow-lg"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>

          <p className="text-xs text-center text-amber-600">
            Sistema em desenvolvimento • Versão MVP
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
