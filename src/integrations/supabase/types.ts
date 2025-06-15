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
      agents: {
        Row: {
          capabilities: string[] | null
          created_at: string | null
          description: string | null
          id: string
          identifier: string | null
          is_active: boolean | null
          last_used: string | null
          name: string
          owner_id: string | null
          performance: number | null
          status: string | null
          tasks_completed: number | null
          type: string | null
          version: string | null
        }
        Insert: {
          capabilities?: string[] | null
          created_at?: string | null
          description?: string | null
          id?: string
          identifier?: string | null
          is_active?: boolean | null
          last_used?: string | null
          name: string
          owner_id?: string | null
          performance?: number | null
          status?: string | null
          tasks_completed?: number | null
          type?: string | null
          version?: string | null
        }
        Update: {
          capabilities?: string[] | null
          created_at?: string | null
          description?: string | null
          id?: string
          identifier?: string | null
          is_active?: boolean | null
          last_used?: string | null
          name?: string
          owner_id?: string | null
          performance?: number | null
          status?: string | null
          tasks_completed?: number | null
          type?: string | null
          version?: string | null
        }
        Relationships: []
      }
      analytics: {
        Row: {
          agent_id: string | null
          context: string | null
          created_at: string | null
          description: string | null
          event_type: string
          id: string
          user_id: string | null
          value: number | null
        }
        Insert: {
          agent_id?: string | null
          context?: string | null
          created_at?: string | null
          description?: string | null
          event_type: string
          id?: string
          user_id?: string | null
          value?: number | null
        }
        Update: {
          agent_id?: string | null
          context?: string | null
          created_at?: string | null
          description?: string | null
          event_type?: string
          id?: string
          user_id?: string | null
          value?: number | null
        }
        Relationships: []
      }
      employees: {
        Row: {
          created_at: string | null
          department: string | null
          email: string | null
          id: number
          name: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          department?: string | null
          email?: string | null
          id?: never
          name: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          department?: string | null
          email?: string | null
          id?: never
          name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      improvement_events: {
        Row: {
          agent_id: string | null
          context: string | null
          created_at: string | null
          details: Json | null
          event_type: string
          id: string
          impact: string | null
          user_id: string | null
        }
        Insert: {
          agent_id?: string | null
          context?: string | null
          created_at?: string | null
          details?: Json | null
          event_type: string
          id?: string
          impact?: string | null
          user_id?: string | null
        }
        Update: {
          agent_id?: string | null
          context?: string | null
          created_at?: string | null
          details?: Json | null
          event_type?: string
          id?: string
          impact?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      keyboard_actions: {
        Row: {
          action_type: string
          context: string | null
          error_message: string | null
          id: string
          key_combo: string
          status: string | null
          timestamp: string | null
          user_id: string | null
        }
        Insert: {
          action_type: string
          context?: string | null
          error_message?: string | null
          id?: string
          key_combo: string
          status?: string | null
          timestamp?: string | null
          user_id?: string | null
        }
        Update: {
          action_type?: string
          context?: string | null
          error_message?: string | null
          id?: string
          key_combo?: string
          status?: string | null
          timestamp?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      logs: {
        Row: {
          agent_id: string | null
          created_at: string | null
          details: Json | null
          id: string
          log_type: string
          message: string | null
          user_id: string | null
        }
        Insert: {
          agent_id?: string | null
          created_at?: string | null
          details?: Json | null
          id?: string
          log_type: string
          message?: string | null
          user_id?: string | null
        }
        Update: {
          agent_id?: string | null
          created_at?: string | null
          details?: Json | null
          id?: string
          log_type?: string
          message?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      memory_entries: {
        Row: {
          agent_id: string | null
          content: string
          context: string | null
          expires_at: string | null
          id: string
          importance: number | null
          memory_type: string | null
          timestamp: string | null
          trigger_rules: string[] | null
        }
        Insert: {
          agent_id?: string | null
          content: string
          context?: string | null
          expires_at?: string | null
          id?: string
          importance?: number | null
          memory_type?: string | null
          timestamp?: string | null
          trigger_rules?: string[] | null
        }
        Update: {
          agent_id?: string | null
          content?: string
          context?: string | null
          expires_at?: string | null
          id?: string
          importance?: number | null
          memory_type?: string | null
          timestamp?: string | null
          trigger_rules?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "memory_entries_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      mini_ai: {
        Row: {
          author: string | null
          category: string | null
          config: Json | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          is_pinned: boolean | null
          is_public: boolean | null
          name: string
          type: string
          updated_at: string | null
        }
        Insert: {
          author?: string | null
          category?: string | null
          config?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_pinned?: boolean | null
          is_public?: boolean | null
          name: string
          type: string
          updated_at?: string | null
        }
        Update: {
          author?: string | null
          category?: string | null
          config?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_pinned?: boolean | null
          is_public?: boolean | null
          name?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      POSTS: {
        Row: {
          CONTENT: string | null
          created_at: string
          id: number
        }
        Insert: {
          CONTENT?: string | null
          created_at?: string
          id?: number
        }
        Update: {
          CONTENT?: string | null
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      system_connections: {
        Row: {
          created_at: string | null
          description: string | null
          endpoint: string
          errors: number | null
          id: string
          last_ping: string | null
          name: string
          requests: number | null
          response_time: number | null
          status: string
          type: string
          uptime: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          endpoint: string
          errors?: number | null
          id?: string
          last_ping?: string | null
          name: string
          requests?: number | null
          response_time?: number | null
          status: string
          type: string
          uptime?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          endpoint?: string
          errors?: number | null
          id?: string
          last_ping?: string | null
          name?: string
          requests?: number | null
          response_time?: number | null
          status?: string
          type?: string
          uptime?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      custom_access_token_hook: {
        Args: { event: Json }
        Returns: Json
      }
      get_employee_by_id: {
        Args: { emp_id: number }
        Returns: {
          id: number
          name: string
          email: string
          created_at: string
          department: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
