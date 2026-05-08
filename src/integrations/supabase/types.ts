export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      agent_owners: {
        Row: {
          contact_email: string | null
          created_at: string
          id: string
          max_agents: number
          name: string
          organization: string | null
          tier: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          contact_email?: string | null
          created_at?: string
          id?: string
          max_agents?: number
          name: string
          organization?: string | null
          tier?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          contact_email?: string | null
          created_at?: string
          id?: string
          max_agents?: number
          name?: string
          organization?: string | null
          tier?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      agent_passports: {
        Row: {
          agent_id: string
          capabilities: Json | null
          created_at: string
          display_name: string
          expires_at: string | null
          id: string
          identity_hash: string
          issued_at: string
          last_verified_at: string | null
          metadata: Json | null
          owner_id: string | null
          passport_number: string
          signature: string | null
          status: string
          trust_score: number | null
          updated_at: string
        }
        Insert: {
          agent_id: string
          capabilities?: Json | null
          created_at?: string
          display_name: string
          expires_at?: string | null
          id?: string
          identity_hash: string
          issued_at?: string
          last_verified_at?: string | null
          metadata?: Json | null
          owner_id?: string | null
          passport_number: string
          signature?: string | null
          status?: string
          trust_score?: number | null
          updated_at?: string
        }
        Update: {
          agent_id?: string
          capabilities?: Json | null
          created_at?: string
          display_name?: string
          expires_at?: string | null
          id?: string
          identity_hash?: string
          issued_at?: string
          last_verified_at?: string | null
          metadata?: Json | null
          owner_id?: string | null
          passport_number?: string
          signature?: string | null
          status?: string
          trust_score?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_passports_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "agent_owners"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_versions: {
        Row: {
          agent_id: string
          capabilities: Json | null
          changelog: string | null
          created_at: string
          id: string
          released_at: string
          status: string
          version: string
        }
        Insert: {
          agent_id: string
          capabilities?: Json | null
          changelog?: string | null
          created_at?: string
          id?: string
          released_at?: string
          status?: string
          version: string
        }
        Update: {
          agent_id?: string
          capabilities?: Json | null
          changelog?: string | null
          created_at?: string
          id?: string
          released_at?: string
          status?: string
          version?: string
        }
        Relationships: []
      }
      compliance_records: {
        Row: {
          agent_id: string
          check_type: string
          checked_at: string
          created_at: string
          details: Json | null
          expires_at: string | null
          id: string
          passport_id: string | null
          result: string
        }
        Insert: {
          agent_id: string
          check_type: string
          checked_at?: string
          created_at?: string
          details?: Json | null
          expires_at?: string | null
          id?: string
          passport_id?: string | null
          result: string
        }
        Update: {
          agent_id?: string
          check_type?: string
          checked_at?: string
          created_at?: string
          details?: Json | null
          expires_at?: string | null
          id?: string
          passport_id?: string | null
          result?: string
        }
        Relationships: [
          {
            foreignKeyName: "compliance_records_passport_id_fkey"
            columns: ["passport_id"]
            isOneToOne: false
            referencedRelation: "agent_passports"
            referencedColumns: ["id"]
          },
        ]
      }
      idfc_bindings: {
        Row: {
          bound_at: string
          descriptor_id: string
          id: string
          instance_id: string
          weight: number
        }
        Insert: {
          bound_at?: string
          descriptor_id: string
          id?: string
          instance_id: string
          weight?: number
        }
        Update: {
          bound_at?: string
          descriptor_id?: string
          id?: string
          instance_id?: string
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "idfc_bindings_descriptor_id_fkey"
            columns: ["descriptor_id"]
            isOneToOne: false
            referencedRelation: "idfc_descriptors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "idfc_bindings_instance_id_fkey"
            columns: ["instance_id"]
            isOneToOne: false
            referencedRelation: "idfc_instances"
            referencedColumns: ["id"]
          },
        ]
      }
      idfc_descriptors: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          key: string
          value: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          id?: string
          key: string
          value: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          key?: string
          value?: string
        }
        Relationships: []
      }
      idfc_instances: {
        Row: {
          created_at: string
          fuko_module: string
          id: string
          metadata: Json | null
          owner_id: string | null
          started_at: string
          status: string
          stopped_at: string | null
          ttl_seconds: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          fuko_module: string
          id?: string
          metadata?: Json | null
          owner_id?: string | null
          started_at?: string
          status?: string
          stopped_at?: string | null
          ttl_seconds?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          fuko_module?: string
          id?: string
          metadata?: Json | null
          owner_id?: string | null
          started_at?: string
          status?: string
          stopped_at?: string | null
          ttl_seconds?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      idfc_provenance: {
        Row: {
          action: string
          descriptor_snapshot: Json | null
          id: string
          instance_id: string | null
          payload: Json | null
          ts: string
        }
        Insert: {
          action: string
          descriptor_snapshot?: Json | null
          id?: string
          instance_id?: string | null
          payload?: Json | null
          ts?: string
        }
        Update: {
          action?: string
          descriptor_snapshot?: Json | null
          id?: string
          instance_id?: string | null
          payload?: Json | null
          ts?: string
        }
        Relationships: [
          {
            foreignKeyName: "idfc_provenance_instance_id_fkey"
            columns: ["instance_id"]
            isOneToOne: false
            referencedRelation: "idfc_instances"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
