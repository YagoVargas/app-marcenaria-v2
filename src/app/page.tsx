'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Logo } from '@/components/custom/logo'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { Loader2 } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setLoading(true)
    
    // Login temporário sem autenticação real
    const userId = 'user-temp-001' // ID fixo temporário
    
    try {
      // Verificar se perfil existe
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao buscar perfil:', error)
        setLoading(false)
        return
      }

      // Se não existe perfil, criar um novo
      if (!profile) {
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            user_id: userId,
            nome_profissional: 'Novo Usuário',
            tratamento: 'Sr.',
            nome_marcenaria: 'Minha Marcenaria',
            unidade_medida: 'cm',
            first_access: true
          })
          .select()
          .single()

        if (createError) {
          console.error('Erro ao criar perfil:', createError)
          setLoading(false)
          return
        }

        // Primeiro acesso - redirecionar para quiz
        localStorage.setItem('userId', userId)
        localStorage.setItem('profileId', newProfile.id)
        router.push('/quiz')
      } else {
        // Perfil existe
        localStorage.setItem('userId', userId)
        localStorage.setItem('profileId', profile.id)

        // Verificar se é primeiro acesso
        if (profile.first_access) {
          router.push('/quiz')
        } else {
          router.push('/dashboard')
        }
      }
    } catch (err) {
      console.error('Erro no login:', err)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 border border-amber-100">
          {/* Logo e Título */}
          <div className="flex flex-col items-center mb-8">
            <Logo className="h-24 w-24 mb-4" />
            <h1 className="text-3xl sm:text-4xl font-bold text-amber-900 text-center">
              A Marceneira
            </h1>
            <p className="text-amber-700 text-center mt-2 text-sm sm:text-base">
              Sistema profissional de briefing e medições
            </p>
          </div>

          {/* Descrição */}
          <div className="bg-gradient-to-r from-amber-50 to-pink-50 rounded-2xl p-6 mb-8 border border-amber-200">
            <p className="text-amber-800 text-center text-sm leading-relaxed">
              Organize suas visitas técnicas, faça medições precisas e gere relatórios profissionais para seus clientes.
            </p>
          </div>

          {/* Botão de Login */}
          <Button
            onClick={handleLogin}
            disabled={loading}
            className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Entrando...
              </>
            ) : (
              'Entrar'
            )}
          </Button>

          {/* Rodapé */}
          <div className="mt-8 text-center">
            <p className="text-xs text-amber-600">
              Versão 1.0 - MVP
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
