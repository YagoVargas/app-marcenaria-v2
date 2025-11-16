'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon, ArrowLeft, Save, Plus, X } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'

const AMBIENTES_OPCOES = [
  'Cozinha',
  'Banheiro',
  'Quarto',
  'Sala',
  'Escritório',
  'Lavanderia',
  'Closet',
  'Área Gourmet',
  'Outro'
]

export default function NewClientPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [visitDate, setVisitDate] = useState<Date>()
  const [rescheduleDate, setRescheduleDate] = useState<Date>()
  const [selectedAmbientes, setSelectedAmbientes] = useState<string[]>([])
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    notes: ''
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const toggleAmbiente = (ambiente: string) => {
    setSelectedAmbientes(prev => 
      prev.includes(ambiente) 
        ? prev.filter(a => a !== ambiente)
        : [...prev, ambiente]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.phone || !visitDate || selectedAmbientes.length === 0) {
      toast.error('Preencha os campos obrigatórios: Nome, Telefone, Data da Visita e pelo menos 1 Ambiente')
      return
    }

    setLoading(true)

    try {
      // NÃO enviar user_id - será gerado via trigger
      const { data, error } = await supabase
        .from('clients')
        .insert([
          {
            name: formData.name,
            phone: formData.phone,
            address: formData.address || null,
            ambientes: selectedAmbientes,
            visit_date: visitDate.toISOString(),
            reschedule_date: rescheduleDate?.toISOString() || null,
            notes: formData.notes || null
          }
        ])
        .select()

      if (error) throw error

      toast.success('Cliente cadastrado com sucesso!')
      router.push('/clients/schedule')
    } catch (error: any) {
      console.error('Erro ao cadastrar cliente:', error)
      toast.error('Erro ao cadastrar cliente: ' + error.message)
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
            <h1 className="text-xl font-bold text-amber-900">Novo Cliente</h1>
            <p className="text-sm text-amber-600">Agendar visita e cadastrar cliente</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit}>
          <Card className="border-amber-200">
            <CardHeader>
              <CardTitle className="text-amber-900">Informações do Cliente</CardTitle>
              <CardDescription className="text-amber-600">
                Preencha os dados para agendar uma visita
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Nome */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-amber-900">
                  Nome Completo <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="Ex: João Silva"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="border-amber-200 focus:border-amber-400"
                  required
                />
              </div>

              {/* Telefone */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-amber-900">
                  Telefone <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(00) 00000-0000"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="border-amber-200 focus:border-amber-400"
                  required
                />
              </div>

              {/* Endereço */}
              <div className="space-y-2">
                <Label htmlFor="address" className="text-amber-900">
                  Endereço
                </Label>
                <Input
                  id="address"
                  placeholder="Rua, número, bairro, cidade"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="border-amber-200 focus:border-amber-400"
                />
              </div>

              {/* Ambientes (múltipla escolha) */}
              <div className="space-y-2">
                <Label className="text-amber-900">
                  Ambientes <span className="text-red-500">*</span>
                </Label>
                <p className="text-xs text-amber-600">Selecione um ou mais ambientes</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                  {AMBIENTES_OPCOES.map((ambiente) => (
                    <div
                      key={ambiente}
                      className={`flex items-center space-x-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedAmbientes.includes(ambiente)
                          ? 'border-amber-500 bg-amber-50'
                          : 'border-amber-200 hover:border-amber-300'
                      }`}
                      onClick={() => toggleAmbiente(ambiente)}
                    >
                      <Checkbox
                        checked={selectedAmbientes.includes(ambiente)}
                        onCheckedChange={() => toggleAmbiente(ambiente)}
                      />
                      <label className="text-sm text-amber-900 cursor-pointer flex-1">
                        {ambiente}
                      </label>
                    </div>
                  ))}
                </div>
                {selectedAmbientes.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {selectedAmbientes.map((ambiente) => (
                      <div
                        key={ambiente}
                        className="flex items-center gap-1 bg-amber-100 text-amber-900 px-3 py-1 rounded-full text-sm"
                      >
                        {ambiente}
                        <button
                          type="button"
                          onClick={() => toggleAmbiente(ambiente)}
                          className="ml-1 hover:text-amber-700"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Data da Visita */}
              <div className="space-y-2">
                <Label className="text-amber-900">
                  Data da Visita <span className="text-red-500">*</span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal border-amber-200 hover:border-amber-400"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {visitDate ? (
                        format(visitDate, "PPP", { locale: ptBR })
                      ) : (
                        <span>Selecione a data</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={visitDate}
                      onSelect={setVisitDate}
                      initialFocus
                      locale={ptBR}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Campo de Reagendamento */}
              <div className="space-y-2">
                <Label className="text-amber-900">
                  Reagendamento (opcional)
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal border-amber-200 hover:border-amber-400"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {rescheduleDate ? (
                        format(rescheduleDate, "PPP", { locale: ptBR })
                      ) : (
                        <span>Selecione nova data (se necessário)</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={rescheduleDate}
                      onSelect={setRescheduleDate}
                      initialFocus
                      locale={ptBR}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Observações */}
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-amber-900">
                  Observações Rápidas
                </Label>
                <Textarea
                  id="notes"
                  placeholder="Anotações sobre o cliente ou projeto..."
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  className="border-amber-200 focus:border-amber-400 min-h-[100px]"
                />
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
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-700 hover:to-rose-700 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? 'Salvando...' : 'Salvar Cliente'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </main>
    </div>
  )
}
