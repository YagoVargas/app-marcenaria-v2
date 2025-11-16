'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Progress } from '@/components/ui/progress'
import { ChevronLeft, ChevronRight, Check } from 'lucide-react'
import Logo from '@/components/custom/logo'

const TOTAL_STEPS = 5

const materiaisOpcoes = [
  'MDF',
  'MDP',
  'Compensado',
  'Madeira Maciça',
  'Laminado',
  'Fórmica',
  'Acrílico',
  'Vidro'
]

export default function QuizPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)

  // Estados do formulário
  const [tratamento, setTratamento] = useState<'Sr.' | 'Sra.' | 'Outro'>('Sr.')
  const [nomeProfissional, setNomeProfissional] = useState('')
  const [nomeMarcenaria, setNomeMarcenaria] = useState('')
  const [endereco, setEndereco] = useState('')
  const [telefone, setTelefone] = useState('')
  const [materiaisUsados, setMateriaisUsados] = useState<string[]>([])
  const [unidadeMedida, setUnidadeMedida] = useState<'m' | 'cm' | 'mm'>('cm')
  const [estiloTrabalho, setEstiloTrabalho] = useState('')
  const [logoUrl, setLogoUrl] = useState('')

  const progress = (step / TOTAL_STEPS) * 100

  const handleMaterialToggle = (material: string) => {
    setMateriaisUsados(prev =>
      prev.includes(material)
        ? prev.filter(m => m !== material)
        : [...prev, material]
    )
  }

  const handleNext = () => {
    if (step < TOTAL_STEPS) {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)

    // TODO: Salvar no Supabase
    const profileData = {
      tratamento,
      nome_profissional: nomeProfissional,
      nome_marcenaria: nomeMarcenaria,
      endereco,
      telefone,
      materiais_usados: materiaisUsados,
      unidade_medida: unidadeMedida,
      estilo_trabalho: estiloTrabalho,
      logo_url: logoUrl,
      first_access: false
    }

    console.log('Dados do perfil:', profileData)

    // Simular salvamento
    setTimeout(() => {
      router.push('/dashboard')
    }, 1000)
  }

  const canProceed = () => {
    switch (step) {
      case 1:
        return nomeProfissional.trim() !== ''
      case 2:
        return nomeMarcenaria.trim() !== '' && telefone.trim() !== ''
      case 3:
        return materiaisUsados.length > 0
      case 4:
        return true
      case 5:
        return true
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-amber-100 p-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Logo className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-amber-900 mb-2">
            Configuração Inicial
          </h1>
          <p className="text-amber-700">
            Etapa {step} de {TOTAL_STEPS}
          </p>
        </div>

        {/* Progress Bar */}
        <Progress value={progress} className="mb-8 h-2" />

        {/* Card do Step */}
        <Card className="shadow-2xl border-amber-200">
          <CardHeader>
            <CardTitle className="text-2xl text-amber-900">
              {step === 1 && 'Informações Pessoais'}
              {step === 2 && 'Dados da Marcenaria'}
              {step === 3 && 'Materiais e Medidas'}
              {step === 4 && 'Estilo de Trabalho'}
              {step === 5 && 'Logo da Marcenaria'}
            </CardTitle>
            <CardDescription>
              {step === 1 && 'Como você gostaria de ser chamado?'}
              {step === 2 && 'Informações sobre sua marcenaria'}
              {step === 3 && 'Quais materiais você costuma usar?'}
              {step === 4 && 'Qual estilo você mais trabalha? (opcional)'}
              {step === 5 && 'Adicione o logo da sua marcenaria (opcional)'}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Step 1: Informações Pessoais */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Tratamento</Label>
                  <RadioGroup value={tratamento} onValueChange={(v) => setTratamento(v as any)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Sr." id="sr" />
                      <Label htmlFor="sr" className="cursor-pointer">Sr.</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Sra." id="sra" />
                      <Label htmlFor="sra" className="cursor-pointer">Sra.</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Outro" id="outro" />
                      <Label htmlFor="outro" className="cursor-pointer">Outro</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nome">Nome Completo *</Label>
                  <Input
                    id="nome"
                    placeholder="Digite seu nome"
                    value={nomeProfissional}
                    onChange={(e) => setNomeProfissional(e.target.value)}
                    className="border-amber-200 focus:border-amber-400"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Dados da Marcenaria */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="marcenaria">Nome da Marcenaria *</Label>
                  <Input
                    id="marcenaria"
                    placeholder="Ex: Marcenaria Silva"
                    value={nomeMarcenaria}
                    onChange={(e) => setNomeMarcenaria(e.target.value)}
                    className="border-amber-200 focus:border-amber-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone *</Label>
                  <Input
                    id="telefone"
                    placeholder="(00) 00000-0000"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    className="border-amber-200 focus:border-amber-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endereco">Endereço</Label>
                  <Input
                    id="endereco"
                    placeholder="Rua, número, bairro, cidade"
                    value={endereco}
                    onChange={(e) => setEndereco(e.target.value)}
                    className="border-amber-200 focus:border-amber-400"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Materiais e Medidas */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label>Materiais que você costuma usar *</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {materiaisOpcoes.map((material) => (
                      <div key={material} className="flex items-center space-x-2">
                        <Checkbox
                          id={material}
                          checked={materiaisUsados.includes(material)}
                          onCheckedChange={() => handleMaterialToggle(material)}
                        />
                        <Label htmlFor={material} className="cursor-pointer text-sm">
                          {material}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Unidade de medida principal</Label>
                  <RadioGroup value={unidadeMedida} onValueChange={(v) => setUnidadeMedida(v as any)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="m" id="m" />
                      <Label htmlFor="m" className="cursor-pointer">Metros (m)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="cm" id="cm" />
                      <Label htmlFor="cm" className="cursor-pointer">Centímetros (cm)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="mm" id="mm" />
                      <Label htmlFor="mm" className="cursor-pointer">Milímetros (mm)</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            )}

            {/* Step 4: Estilo de Trabalho */}
            {step === 4 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="estilo">Estilo de trabalho (opcional)</Label>
                  <Input
                    id="estilo"
                    placeholder="Ex: Moderno, Clássico, Rústico..."
                    value={estiloTrabalho}
                    onChange={(e) => setEstiloTrabalho(e.target.value)}
                    className="border-amber-200 focus:border-amber-400"
                  />
                  <p className="text-xs text-amber-600">
                    Descreva o estilo predominante dos seus trabalhos
                  </p>
                </div>
              </div>
            )}

            {/* Step 5: Logo */}
            {step === 5 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="logo">URL do Logo (opcional)</Label>
                  <Input
                    id="logo"
                    placeholder="https://exemplo.com/logo.png"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    className="border-amber-200 focus:border-amber-400"
                  />
                  <p className="text-xs text-amber-600">
                    Cole o link da imagem do seu logo
                  </p>
                </div>

                {logoUrl && (
                  <div className="border-2 border-dashed border-amber-300 rounded-lg p-4 bg-amber-50">
                    <p className="text-sm text-amber-700 mb-2">Preview:</p>
                    <img
                      src={logoUrl}
                      alt="Logo preview"
                      className="max-w-xs mx-auto"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Botões de Navegação */}
            <div className="flex justify-between pt-6 border-t border-amber-200">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={step === 1}
                className="border-amber-300 text-amber-700 hover:bg-amber-50"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>

              {step < TOTAL_STEPS ? (
                <Button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-700 hover:to-rose-700 text-white"
                >
                  Próximo
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                >
                  {loading ? 'Salvando...' : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Finalizar
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
