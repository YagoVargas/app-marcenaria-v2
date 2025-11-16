'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Logo } from '@/components/custom/logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { supabase } from '@/lib/supabase'
import { Tratamento, UnidadeMedida } from '@/lib/types'
import { Loader2, ChevronRight, ChevronLeft } from 'lucide-react'

const MATERIAIS_OPCOES = [
  'MDF',
  'MDP',
  'Compensado',
  'Madeira Maciça',
  'Laminado',
  'Fórmica',
  'Vidro',
  'Aço',
  'Alumínio'
]

export default function QuizPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [profileId, setProfileId] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    nome_profissional: '',
    tratamento: 'Sr.' as Tratamento,
    nome_marcenaria: '',
    endereco: '',
    telefone: '',
    materiais_usados: [] as string[],
    unidade_medida: 'cm' as UnidadeMedida,
    estilo_trabalho: '',
    logo_url: ''
  })

  useEffect(() => {
    const id = localStorage.getItem('profileId')
    if (!id) {
      router.push('/')
      return
    }
    setProfileId(id)
  }, [router])

  const handleMaterialToggle = (material: string) => {
    setFormData(prev => ({
      ...prev,
      materiais_usados: prev.materiais_usados.includes(material)
        ? prev.materiais_usados.filter(m => m !== material)
        : [...prev.materiais_usados, material]
    }))
  }

  const handleSubmit = async () => {
    if (!profileId) return

    setLoading(true)

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          ...formData,
          first_access: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', profileId)

      if (error) {
        console.error('Erro ao atualizar perfil:', error)
        setLoading(false)
        return
      }

      router.push('/dashboard')
    } catch (err) {
      console.error('Erro ao salvar quiz:', err)
      setLoading(false)
    }
  }

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.nome_profissional.trim() !== '' && formData.tratamento !== ''
      case 2:
        return formData.nome_marcenaria.trim() !== ''
      case 3:
        return true // Contato é opcional
      case 4:
        return formData.materiais_usados.length > 0
      case 5:
        return true // Todos opcionais
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-pink-50 p-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Logo className="h-16 w-16 mx-auto mb-4" />
          <h1 className="text-2xl sm:text-3xl font-bold text-amber-900">
            Configuração Inicial
          </h1>
          <p className="text-amber-700 mt-2">
            Passo {step} de 5
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="h-2 bg-amber-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-600 to-pink-600 transition-all duration-300"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 border border-amber-100">
          {/* Step 1 - Dados Pessoais */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-amber-900 mb-2">
                  Dados Pessoais
                </h2>
                <p className="text-sm text-amber-700">
                  Como você gostaria de ser chamado(a)?
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="nome">Nome Completo *</Label>
                  <Input
                    id="nome"
                    value={formData.nome_profissional}
                    onChange={(e) => setFormData({ ...formData, nome_profissional: e.target.value })}
                    placeholder="Ex: Maria Silva"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Tratamento *</Label>
                  <div className="flex gap-4 mt-2">
                    {(['Sr.', 'Sra.', 'Outro'] as Tratamento[]).map((t) => (
                      <button
                        key={t}
                        onClick={() => setFormData({ ...formData, tratamento: t })}
                        className={`px-6 py-3 rounded-xl font-medium transition-all ${
                          formData.tratamento === t
                            ? 'bg-gradient-to-r from-amber-600 to-pink-600 text-white shadow-lg'
                            : 'bg-amber-50 text-amber-900 hover:bg-amber-100'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2 - Marcenaria */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-amber-900 mb-2">
                  Sua Marcenaria
                </h2>
                <p className="text-sm text-amber-700">
                  Informações do seu negócio
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="marcenaria">Nome da Marcenaria *</Label>
                  <Input
                    id="marcenaria"
                    value={formData.nome_marcenaria}
                    onChange={(e) => setFormData({ ...formData, nome_marcenaria: e.target.value })}
                    placeholder="Ex: Marcenaria Silva"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="endereco">Endereço Completo</Label>
                  <Input
                    id="endereco"
                    value={formData.endereco}
                    onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                    placeholder="Rua, número, bairro, cidade"
                    className="mt-2"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3 - Contato */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-amber-900 mb-2">
                  Contato
                </h2>
                <p className="text-sm text-amber-700">
                  Como seus clientes podem te encontrar?
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="telefone">Telefone / WhatsApp</Label>
                  <Input
                    id="telefone"
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                    placeholder="(00) 00000-0000"
                    className="mt-2"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4 - Materiais */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-amber-900 mb-2">
                  Materiais de Trabalho
                </h2>
                <p className="text-sm text-amber-700">
                  Selecione os materiais que você costuma usar *
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {MATERIAIS_OPCOES.map((material) => (
                  <div
                    key={material}
                    onClick={() => handleMaterialToggle(material)}
                    className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all ${
                      formData.materiais_usados.includes(material)
                        ? 'bg-gradient-to-r from-amber-100 to-pink-100 border-2 border-amber-600'
                        : 'bg-amber-50 border-2 border-transparent hover:border-amber-300'
                    }`}
                  >
                    <Checkbox
                      checked={formData.materiais_usados.includes(material)}
                      onCheckedChange={() => handleMaterialToggle(material)}
                    />
                    <span className="text-sm font-medium text-amber-900">
                      {material}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 5 - Preferências */}
          {step === 5 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-amber-900 mb-2">
                  Preferências
                </h2>
                <p className="text-sm text-amber-700">
                  Configurações finais
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Unidade de Medida Principal *</Label>
                  <div className="flex gap-4 mt-2">
                    {(['m', 'cm', 'mm'] as UnidadeMedida[]).map((u) => (
                      <button
                        key={u}
                        onClick={() => setFormData({ ...formData, unidade_medida: u })}
                        className={`px-8 py-3 rounded-xl font-medium transition-all ${
                          formData.unidade_medida === u
                            ? 'bg-gradient-to-r from-amber-600 to-pink-600 text-white shadow-lg'
                            : 'bg-amber-50 text-amber-900 hover:bg-amber-100'
                        }`}
                      >
                        {u}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="estilo">Estilo que Mais Trabalha (opcional)</Label>
                  <Input
                    id="estilo"
                    value={formData.estilo_trabalho}
                    onChange={(e) => setFormData({ ...formData, estilo_trabalho: e.target.value })}
                    placeholder="Ex: Moderno, Clássico, Rústico"
                    className="mt-2"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-8">
            {step > 1 && (
              <Button
                onClick={() => setStep(step - 1)}
                variant="outline"
                className="flex-1 h-12 border-amber-300 text-amber-900 hover:bg-amber-50"
              >
                <ChevronLeft className="mr-2 h-5 w-5" />
                Voltar
              </Button>
            )}

            {step < 5 ? (
              <Button
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
                className="flex-1 h-12 bg-gradient-to-r from-amber-600 to-pink-600 hover:from-amber-700 hover:to-pink-700 text-white"
              >
                Próximo
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={loading || !canProceed()}
                className="flex-1 h-12 bg-gradient-to-r from-amber-600 to-pink-600 hover:from-amber-700 hover:to-pink-700 text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  'Concluir'
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
