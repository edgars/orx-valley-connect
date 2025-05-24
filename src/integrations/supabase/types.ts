export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      account_types: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          interest_rate: number | null
          minimum_balance: number | null
          monthly_fee: number | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          interest_rate?: number | null
          minimum_balance?: number | null
          monthly_fee?: number | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          interest_rate?: number | null
          minimum_balance?: number | null
          monthly_fee?: number | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      accounts: {
        Row: {
          account_number: string
          account_type_id: string
          available_balance: number | null
          balance: number | null
          created_at: string | null
          currency: string | null
          customer_id: string
          iban: string | null
          id: string
          status: Database["public"]["Enums"]["account_status"] | null
          updated_at: string | null
        }
        Insert: {
          account_number: string
          account_type_id: string
          available_balance?: number | null
          balance?: number | null
          created_at?: string | null
          currency?: string | null
          customer_id: string
          iban?: string | null
          id?: string
          status?: Database["public"]["Enums"]["account_status"] | null
          updated_at?: string | null
        }
        Update: {
          account_number?: string
          account_type_id?: string
          available_balance?: number | null
          balance?: number | null
          created_at?: string | null
          currency?: string | null
          customer_id?: string
          iban?: string | null
          id?: string
          status?: Database["public"]["Enums"]["account_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "accounts_account_type_id_fkey"
            columns: ["account_type_id"]
            isOneToOne: false
            referencedRelation: "account_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accounts_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers_legacy"
            referencedColumns: ["id"]
          },
        ]
      }
      alunos: {
        Row: {
          aceita_termos: boolean
          cidade: string
          data_atualizacao: string
          data_criacao: string
          email: string
          id: number
          nome: string
          telefone: string
        }
        Insert: {
          aceita_termos?: boolean
          cidade: string
          data_atualizacao?: string
          data_criacao?: string
          email: string
          id?: number
          nome: string
          telefone: string
        }
        Update: {
          aceita_termos?: boolean
          cidade?: string
          data_atualizacao?: string
          data_criacao?: string
          email?: string
          id?: number
          nome?: string
          telefone?: string
        }
        Relationships: []
      }
      alunos_musica: {
        Row: {
          cidade: string | null
          created_at: string
          email: string | null
          id: string
          nome: string | null
          termos: string | null
        }
        Insert: {
          cidade?: string | null
          created_at?: string
          email?: string | null
          id?: string
          nome?: string | null
          termos?: string | null
        }
        Update: {
          cidade?: string | null
          created_at?: string
          email?: string | null
          id?: string
          nome?: string | null
          termos?: string | null
        }
        Relationships: []
      }
      beneficiaries: {
        Row: {
          account_number: string
          bank_code: string | null
          bank_name: string | null
          created_at: string | null
          customer_id: string
          iban: string | null
          id: string
          is_verified: boolean | null
          name: string
          reference_note: string | null
          updated_at: string | null
        }
        Insert: {
          account_number: string
          bank_code?: string | null
          bank_name?: string | null
          created_at?: string | null
          customer_id: string
          iban?: string | null
          id?: string
          is_verified?: boolean | null
          name: string
          reference_note?: string | null
          updated_at?: string | null
        }
        Update: {
          account_number?: string
          bank_code?: string | null
          bank_name?: string | null
          created_at?: string | null
          customer_id?: string
          iban?: string | null
          id?: string
          is_verified?: boolean | null
          name?: string
          reference_note?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "beneficiaries_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers_legacy"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          active: boolean | null
          app: string | null
          bot_message: string | null
          conversation_id: string | null
          created_at: string
          id: number
          message_type: string | null
          phone: string | null
          user_id: string | null
          user_message: string | null
          user_name: string | null
        }
        Insert: {
          active?: boolean | null
          app?: string | null
          bot_message?: string | null
          conversation_id?: string | null
          created_at?: string
          id?: number
          message_type?: string | null
          phone?: string | null
          user_id?: string | null
          user_message?: string | null
          user_name?: string | null
        }
        Update: {
          active?: boolean | null
          app?: string | null
          bot_message?: string | null
          conversation_id?: string | null
          created_at?: string
          id?: number
          message_type?: string | null
          phone?: string | null
          user_id?: string | null
          user_message?: string | null
          user_name?: string | null
        }
        Relationships: []
      }
      chats: {
        Row: {
          app: string | null
          conversation_id: string | null
          created_at: string
          id: number
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          app?: string | null
          conversation_id?: string | null
          created_at?: string
          id?: number
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          app?: string | null
          conversation_id?: string | null
          created_at?: string
          id?: number
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      contracts: {
        Row: {
          amparo_legal: string | null
          content: string | null
          contratada: string | null
          contratada_cpf_cnpj: string | null
          contratante: string | null
          contratante_cpf_cnpj: string | null
          created_at: string | null
          data_assinatura: string | null
          data_celebracao: string | null
          data_final_vigencia: string | null
          data_inicio_vigencia: string | null
          data_publicacao: string | null
          embedding: string | null
          fiscal: string | null
          id: number
          licitacao_origem: string | null
          local_objeto: string | null
          metadata: Json | null
          numero: string | null
          objeto: string | null
          orgao: string | null
          responsavel_contratada: string | null
          responsavel_contratante: string | null
          situacao: string | null
          titulo_completo: string | null
          updated_at: string | null
          url: string | null
          valor: number | null
          valor_global: number | null
          vigencia: string | null
        }
        Insert: {
          amparo_legal?: string | null
          content?: string | null
          contratada?: string | null
          contratada_cpf_cnpj?: string | null
          contratante?: string | null
          contratante_cpf_cnpj?: string | null
          created_at?: string | null
          data_assinatura?: string | null
          data_celebracao?: string | null
          data_final_vigencia?: string | null
          data_inicio_vigencia?: string | null
          data_publicacao?: string | null
          embedding?: string | null
          fiscal?: string | null
          id: number
          licitacao_origem?: string | null
          local_objeto?: string | null
          metadata?: Json | null
          numero?: string | null
          objeto?: string | null
          orgao?: string | null
          responsavel_contratada?: string | null
          responsavel_contratante?: string | null
          situacao?: string | null
          titulo_completo?: string | null
          updated_at?: string | null
          url?: string | null
          valor?: number | null
          valor_global?: number | null
          vigencia?: string | null
        }
        Update: {
          amparo_legal?: string | null
          content?: string | null
          contratada?: string | null
          contratada_cpf_cnpj?: string | null
          contratante?: string | null
          contratante_cpf_cnpj?: string | null
          created_at?: string | null
          data_assinatura?: string | null
          data_celebracao?: string | null
          data_final_vigencia?: string | null
          data_inicio_vigencia?: string | null
          data_publicacao?: string | null
          embedding?: string | null
          fiscal?: string | null
          id?: number
          licitacao_origem?: string | null
          local_objeto?: string | null
          metadata?: Json | null
          numero?: string | null
          objeto?: string | null
          orgao?: string | null
          responsavel_contratada?: string | null
          responsavel_contratante?: string | null
          situacao?: string | null
          titulo_completo?: string | null
          updated_at?: string | null
          url?: string | null
          valor?: number | null
          valor_global?: number | null
          vigencia?: string | null
        }
        Relationships: []
      }
      contracts_vector: {
        Row: {
          client: string | null
          client_cnpj: string | null
          content: string | null
          contractor: string | null
          contractor_cnpj: string | null
          created_at: string | null
          embedding: string | null
          id: number
          link: string | null
          metadata: string | null
          number: string | null
          raw: Json | null
          situation: string | null
          summary: string | null
          title: string | null
          value_global: number | null
        }
        Insert: {
          client?: string | null
          client_cnpj?: string | null
          content?: string | null
          contractor?: string | null
          contractor_cnpj?: string | null
          created_at?: string | null
          embedding?: string | null
          id: number
          link?: string | null
          metadata?: string | null
          number?: string | null
          raw?: Json | null
          situation?: string | null
          summary?: string | null
          title?: string | null
          value_global?: number | null
        }
        Update: {
          client?: string | null
          client_cnpj?: string | null
          content?: string | null
          contractor?: string | null
          contractor_cnpj?: string | null
          created_at?: string | null
          embedding?: string | null
          id?: number
          link?: string | null
          metadata?: string | null
          number?: string | null
          raw?: Json | null
          situation?: string | null
          summary?: string | null
          title?: string | null
          value_global?: number | null
        }
        Relationships: []
      }
      contratos: {
        Row: {
          content: string
          created_at: string | null
          embedding: string | null
          id: string
          metadata: Json | null
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          embedding?: string | null
          id?: string
          metadata?: Json | null
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          embedding?: string | null
          id?: string
          metadata?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      customers: {
        Row: {
          active: boolean | null
          app: string | null
          cliente_name: string | null
          created_at: string
          distance: string | null
          email: string | null
          id: number
          lat: string | null
          location: string | null
          long: string | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          app?: string | null
          cliente_name?: string | null
          created_at?: string
          distance?: string | null
          email?: string | null
          id?: number
          lat?: string | null
          location?: string | null
          long?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          app?: string | null
          cliente_name?: string | null
          created_at?: string
          distance?: string | null
          email?: string | null
          id?: number
          lat?: string | null
          location?: string | null
          long?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      customers_legacy: {
        Row: {
          address: string | null
          city: string | null
          country: string | null
          created_at: string | null
          date_of_birth: string | null
          email: string
          first_name: string
          id: string
          kyc_verified: boolean | null
          last_name: string
          phone: string | null
          postal_code: string | null
          status: Database["public"]["Enums"]["customer_status"] | null
          tax_id: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email: string
          first_name: string
          id?: string
          kyc_verified?: boolean | null
          last_name: string
          phone?: string | null
          postal_code?: string | null
          status?: Database["public"]["Enums"]["customer_status"] | null
          tax_id?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string
          first_name?: string
          id?: string
          kyc_verified?: boolean | null
          last_name?: string
          phone?: string | null
          postal_code?: string | null
          status?: Database["public"]["Enums"]["customer_status"] | null
          tax_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      document_embeddings: {
        Row: {
          created_at: string | null
          document_id: string | null
          embedding: string | null
          id: string
        }
        Insert: {
          created_at?: string | null
          document_id?: string | null
          embedding?: string | null
          id?: string
        }
        Update: {
          created_at?: string | null
          document_id?: string | null
          embedding?: string | null
          id?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          content: string | null
          embedding: string | null
          id: number
          metadata: Json | null
        }
        Insert: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Update: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Relationships: []
      }
      documents_contracts: {
        Row: {
          embedding: string | null
          id: string
          metadata: Json | null
          text: string | null
        }
        Insert: {
          embedding?: string | null
          id?: string
          metadata?: Json | null
          text?: string | null
        }
        Update: {
          embedding?: string | null
          id?: string
          metadata?: Json | null
          text?: string | null
        }
        Relationships: []
      }
      leads: {
        Row: {
          data_atualizacao: string | null
          data_criacao: string | null
          email: string
          id: string
          nome: string
          observacoes: string | null
        }
        Insert: {
          data_atualizacao?: string | null
          data_criacao?: string | null
          email: string
          id?: string
          nome: string
          observacoes?: string | null
        }
        Update: {
          data_atualizacao?: string | null
          data_criacao?: string | null
          email?: string
          id?: string
          nome?: string
          observacoes?: string | null
        }
        Relationships: []
      }
      licitacoes: {
        Row: {
          created_at: string | null
          data_realizacao: string
          dotacao_orcamentaria: string | null
          id: string
          local_url: string
          modalidade: string
          numero: string
          objeto: string
          orgao: string
          processo_numero: string | null
          situacao: Database["public"]["Enums"]["situacao_licitacao"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          data_realizacao: string
          dotacao_orcamentaria?: string | null
          id?: string
          local_url: string
          modalidade: string
          numero: string
          objeto: string
          orgao: string
          processo_numero?: string | null
          situacao: Database["public"]["Enums"]["situacao_licitacao"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          data_realizacao?: string
          dotacao_orcamentaria?: string | null
          id?: string
          local_url?: string
          modalidade?: string
          numero?: string
          objeto?: string
          orgao?: string
          processo_numero?: string | null
          situacao?: Database["public"]["Enums"]["situacao_licitacao"]
          updated_at?: string | null
        }
        Relationships: []
      }
      n8n_chat_histories: {
        Row: {
          id: number
          message: Json
          session_id: string
        }
        Insert: {
          id?: number
          message: Json
          session_id: string
        }
        Update: {
          id?: number
          message?: Json
          session_id?: string
        }
        Relationships: []
      }
      n8n_fila_mensagens: {
        Row: {
          id: number
          id_mensagem: string
          mensagem: string
          telefone: string
          timestamp: string
        }
        Insert: {
          id?: number
          id_mensagem: string
          mensagem: string
          telefone: string
          timestamp: string
        }
        Update: {
          id?: number
          id_mensagem?: string
          mensagem?: string
          telefone?: string
          timestamp?: string
        }
        Relationships: []
      }
      n8n_historico_mensagens: {
        Row: {
          created_at: string
          id: number
          message: Json
          session_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          message: Json
          session_id: string
        }
        Update: {
          created_at?: string
          id?: number
          message?: Json
          session_id?: string
        }
        Relationships: []
      }
      operation_types: {
        Row: {
          created_at: string | null
          daily_limit: number | null
          description: string | null
          id: string
          name: string
          requires_approval: boolean | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          daily_limit?: number | null
          description?: string | null
          id?: string
          name: string
          requires_approval?: boolean | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          daily_limit?: number | null
          description?: string | null
          id?: string
          name?: string
          requires_approval?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      professionals: {
        Row: {
          active: boolean | null
          created_at: string
          email: string | null
          iCalUID: string | null
          id: number
          name: string | null
          phone: string | null
          resumo: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          email?: string | null
          iCalUID?: string | null
          id?: number
          name?: string | null
          phone?: string | null
          resumo?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string
          email?: string | null
          iCalUID?: string | null
          id?: number
          name?: string | null
          phone?: string | null
          resumo?: string | null
        }
        Relationships: []
      }
      site_documents: {
        Row: {
          content: string | null
          created_at: string | null
          embedding: string | null
          id: string
          metadata: string | null
          summary: string | null
          title: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          embedding?: string | null
          id?: string
          metadata?: string | null
          summary?: string | null
          title?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          embedding?: string | null
          id?: string
          metadata?: string | null
          summary?: string | null
          title?: string | null
        }
        Relationships: []
      }
      transaction_categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          parent_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          parent_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          parent_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transaction_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "transaction_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          account_id: string
          amount: number
          beneficiary_id: string | null
          category_id: string | null
          created_at: string | null
          currency: string | null
          description: string | null
          id: string
          operation_type_id: string
          reference: string | null
          status: Database["public"]["Enums"]["transaction_status"] | null
          updated_at: string | null
        }
        Insert: {
          account_id: string
          amount: number
          beneficiary_id?: string | null
          category_id?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          operation_type_id: string
          reference?: string | null
          status?: Database["public"]["Enums"]["transaction_status"] | null
          updated_at?: string | null
        }
        Update: {
          account_id?: string
          amount?: number
          beneficiary_id?: string | null
          category_id?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          operation_type_id?: string
          reference?: string | null
          status?: Database["public"]["Enums"]["transaction_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_beneficiary_id_fkey"
            columns: ["beneficiary_id"]
            isOneToOne: false
            referencedRelation: "beneficiaries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "transaction_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_operation_type_id_fkey"
            columns: ["operation_type_id"]
            isOneToOne: false
            referencedRelation: "operation_types"
            referencedColumns: ["id"]
          },
        ]
      }
      website_content: {
        Row: {
          chunk_index: number | null
          content: string
          created_at: string | null
          embedding: string | null
          id: number
          title: string | null
          total_chunks: number | null
          url: string
        }
        Insert: {
          chunk_index?: number | null
          content: string
          created_at?: string | null
          embedding?: string | null
          id?: number
          title?: string | null
          total_chunks?: number | null
          url: string
        }
        Update: {
          chunk_index?: number | null
          content?: string
          created_at?: string | null
          embedding?: string | null
          id?: number
          title?: string | null
          total_chunks?: number | null
          url?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      buscar_licitacoes: {
        Args: {
          termo_busca: string
          situacao_filtro?: Database["public"]["Enums"]["situacao_licitacao"]
          data_inicio?: string
          data_fim?: string
        }
        Returns: {
          id: string
          modalidade: string
          numero: string
          processo_numero: string
          objeto: string
          orgao: string
          dotacao_orcamentaria: string
          situacao: Database["public"]["Enums"]["situacao_licitacao"]
          data_realizacao: string
          local_url: string
          relevancia: number
        }[]
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      inserir_licitacao: {
        Args: {
          p_modalidade: string
          p_numero: string
          p_processo_numero: string
          p_objeto: string
          p_orgao: string
          p_dotacao_orcamentaria: string
          p_situacao: Database["public"]["Enums"]["situacao_licitacao"]
          p_data_realizacao: string
          p_local_url: string
        }
        Returns: string
      }
      insert_contrato: {
        Args: { p_content: string; p_embedding: string; p_metadata?: Json }
        Returns: string
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: unknown
      }
      match_contracts: {
        Args: {
          query_embedding: string
          match_threshold?: number
          match_count?: number
        }
        Returns: {
          id: number
          content: string
          metadata: Json
          similarity: number
        }[]
      }
      match_contratos: {
        Args: {
          query_embedding: string
          match_threshold?: number
          match_count?: number
        }
        Returns: {
          id: string
          content: string
          metadata: Json
          similarity: number
        }[]
      }
      match_documents: {
        Args:
          | { query_embedding: string; match_count?: number; filter?: Json }
          | {
              query_embedding: string
              match_threshold: number
              match_count: number
            }
        Returns: {
          id: number
          content: string
          metadata: Json
          similarity: number
        }[]
      }
      match_documents_contracts: {
        Args: { query_embedding: string; match_count?: number; filter?: Json }
        Returns: {
          id: number
          content: string
          metadata: Json
          similarity: number
        }[]
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      upsert_contract: {
        Args: {
          p_id: number
          p_content: string
          p_embedding: string
          p_metadata: Json
          p_contract_data: Json
        }
        Returns: number
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
    }
    Enums: {
      account_status: "active" | "inactive" | "blocked" | "closed"
      customer_status: "active" | "inactive" | "suspended"
      situacao_licitacao: "Aberta" | "Finalizada"
      transaction_status: "pending" | "completed" | "failed" | "cancelled"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      account_status: ["active", "inactive", "blocked", "closed"],
      customer_status: ["active", "inactive", "suspended"],
      situacao_licitacao: ["Aberta", "Finalizada"],
      transaction_status: ["pending", "completed", "failed", "cancelled"],
    },
  },
} as const
