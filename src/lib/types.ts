export type Tratamento = 'Sr.' | 'Sra.' | 'Outro'
export type UnidadeMedida = 'm' | 'cm' | 'mm'
export type StatusProjeto = 'draft' | 'briefing' | 'medindo' | 'finalizado'
export type TipoAbertura = 'porta' | 'janela' | 'passagem' | 'vidro fixo'
export type TipoPontoHidraulico = 'entrada' | 'saida' | 'esgoto'
export type CategoriaFoto = 'visao geral' | 'detalhes' | 'pontos importantes'

export interface Profile {
  id: string
  user_id: string
  nome_profissional: string
  tratamento: Tratamento
  nome_marcenaria: string
  endereco?: string
  telefone?: string
  materiais_usados?: string[]
  unidade_medida: UnidadeMedida
  estilo_trabalho?: string
  logo_url?: string
  first_access: boolean
  created_at: string
  updated_at: string
}

export interface Client {
  id: string
  profile_id: string
  nome: string
  telefone?: string
  endereco?: string
  tipo_ambiente?: string
  data_visita?: string
  reagendamento?: string
  observacoes?: string
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  profile_id: string
  client_id?: string
  nome: string
  codigo: string
  status: StatusProjeto
  created_at: string
  updated_at: string
  client?: Client
}

export interface Ambiente {
  id: string
  project_id: string
  nome: string
  ordem: number
  created_at: string
}

export interface Modulo {
  id: string
  ambiente_id: string
  tipo: string
  portas_quantidade: number
  portas_tipo?: string
  gavetas_quantidade: number
  tampo_cima: boolean
  ferragens?: {
    dobradica?: boolean
    amortecida?: boolean
    corredica_telescopica?: boolean
    corredica_oculta?: boolean
    cantoneiras?: boolean
  }
  puxadores?: string
  created_at: string
}

export interface Parede {
  id: string
  project_id: string
  nome: string
  foto_url?: string
  altura?: number
  comprimento?: number
  croqui_data?: string
  created_at: string
}

export interface Abertura {
  id: string
  parede_id: string
  tipo: TipoAbertura
  largura?: number
  altura?: number
  altura_piso?: number
  moldura_interna: boolean
  moldura_externa: boolean
  medida_lateral_esq?: number
  medida_lateral_dir?: number
  lado_medicao?: 'esquerda' | 'direita'
  created_at: string
}

export interface PontoHidraulico {
  id: string
  parede_id: string
  tipo: TipoPontoHidraulico
  diametro?: string
  altura?: number
  distancia_lateral?: number
  created_at: string
}

export interface PontoEletrico {
  id: string
  parede_id: string
  nome: string
  tipo: string
  subtipo?: string
  tamanho_disjuntor?: string
  altura?: number
  distancia_lateral?: number
  created_at: string
}

export interface Foto {
  id: string
  project_id: string
  url: string
  categoria: CategoriaFoto
  created_at: string
}

export interface Observacao {
  id: string
  project_id: string
  conteudo?: string
  created_at: string
  updated_at: string
}
