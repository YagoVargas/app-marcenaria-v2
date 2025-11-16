'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon, ArrowLeft, Save } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'

export default function NewClientPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [visitDate, setVisitDate] = useState<Date>()
  const [rescheduleDate, setRescheduleDate] = useState<Date>()
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    environment_type: '',
    notes: ''
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.phone || !visitDate) {
      toast.error('Preencha os campos obrigatórios: Nome, Telefone e Data da Visita')
      return
    }

    setLoading(true)

    try {
      // TODO: Pegar user_id real da sessão
      const userId = '00000000-0000-0000-0000-000000000000' // Temporário

      const { data, error } = await supabase
        .from('clients')
        .insert([
          {
            user_id: userId,
            name: formData.name,
            phone: formData.phone,
            address: formData.address || null,
            environment_type: formData.environment_type || null,
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

              {/* Tipo de Ambiente */}
              <div className="space-y-2">
                <Label htmlFor="environment_type" className="text-amber-900">
                  Tipo de Ambiente
                </Label>
                <Select
                  value={formData.environment_type}
                  onValueChange={(value) => handleInputChange('environment_type', value)}
                >
                  <SelectTrigger className="border-amber-200 focus:border-amber-400">
                    <SelectValue placeholder="Selecione o tipo de ambiente" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cozinha">Cozinha</SelectItem>
                    <SelectItem value="banheiro">Banheiro</SelectItem>
                    <SelectItem value="quarto">Quarto</SelectItem>
                    <SelectItem value="sala">Sala</SelectItem>
                    <SelectItem value="escritorio">Escritório</SelectItem>
                    <SelectItem value="lavanderia">Lavanderia</SelectItem>
                    <SelectItem value="closet">Closet</SelectItem>
                    <SelectItem value="area_gourmet">Área Gourmet</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
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
                        format(visitDate, "PPP 'às' HH:mm", { locale: ptBR })
                      ) : (
                        <span>Selecione a data e hora</span>
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
                        format(rescheduleDate, "PPP 'às' HH:mm", { locale: ptBR })
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
