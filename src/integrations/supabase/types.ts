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
      agent_states: {
        Row: {
          agent_id: string
          current_status: string
          emotional_state: Json | null
          id: string
          identity_score: number | null
          last_decision_at: string | null
          load_level: number | null
          performance_score: number | null
          style_consistency: number | null
          updated_at: string
        }
        Insert: {
          agent_id: string
          current_status?: string
          emotional_state?: Json | null
          id?: string
          identity_score?: number | null
          last_decision_at?: string | null
          load_level?: number | null
          performance_score?: number | null
          style_consistency?: number | null
          updated_at?: string
        }
        Update: {
          agent_id?: string
          current_status?: string
          emotional_state?: Json | null
          id?: string
          identity_score?: number | null
          last_decision_at?: string | null
          load_level?: number | null
          performance_score?: number | null
          style_consistency?: number | null
          updated_at?: string
        }
        Relationships: []
      }
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
      api_search_results: {
        Row: {
          api_key_ref: string
          created_at: string
          id: string
          query: string
          result_count: number | null
          results: Json
          search_timestamp: string
          user_id: string | null
        }
        Insert: {
          api_key_ref: string
          created_at?: string
          id?: string
          query: string
          result_count?: number | null
          results: Json
          search_timestamp?: string
          user_id?: string | null
        }
        Update: {
          api_key_ref?: string
          created_at?: string
          id?: string
          query?: string
          result_count?: number | null
          results?: Json
          search_timestamp?: string
          user_id?: string | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          audit_type: string
          consistency_score: number | null
          created_at: string
          id: string
          issues_found: Json | null
          recommendations: Json | null
          resolved: boolean | null
          severity_level: string | null
          target_entity: string
          target_id: string
        }
        Insert: {
          audit_type: string
          consistency_score?: number | null
          created_at?: string
          id?: string
          issues_found?: Json | null
          recommendations?: Json | null
          resolved?: boolean | null
          severity_level?: string | null
          target_entity: string
          target_id: string
        }
        Update: {
          audit_type?: string
          consistency_score?: number | null
          created_at?: string
          id?: string
          issues_found?: Json | null
          recommendations?: Json | null
          resolved?: boolean | null
          severity_level?: string | null
          target_entity?: string
          target_id?: string
        }
        Relationships: []
      }
      browser_history: {
        Row: {
          created_at: string
          domain: string | null
          id: string
          search_engine: string | null
          search_query: string | null
          session_id: string | null
          title: string | null
          url: string
          user_id: string | null
          visited_at: string
        }
        Insert: {
          created_at?: string
          domain?: string | null
          id?: string
          search_engine?: string | null
          search_query?: string | null
          session_id?: string | null
          title?: string | null
          url: string
          user_id?: string | null
          visited_at?: string
        }
        Update: {
          created_at?: string
          domain?: string | null
          id?: string
          search_engine?: string | null
          search_query?: string | null
          session_id?: string | null
          title?: string | null
          url?: string
          user_id?: string | null
          visited_at?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          metadata: Json | null
          processing_time: number | null
          role: string
          session_id: string
          tokens_used: number | null
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          metadata?: Json | null
          processing_time?: number | null
          role: string
          session_id: string
          tokens_used?: number | null
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          processing_time?: number | null
          role?: string
          session_id?: string
          tokens_used?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_sessions: {
        Row: {
          agent_id: string
          created_at: string
          id: string
          last_message_at: string | null
          metadata: Json | null
          status: string
          title: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          agent_id: string
          created_at?: string
          id?: string
          last_message_at?: string | null
          metadata?: Json | null
          status?: string
          title?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          agent_id?: string
          created_at?: string
          id?: string
          last_message_at?: string | null
          metadata?: Json | null
          status?: string
          title?: string | null
          updated_at?: string
          user_id?: string | null
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
      fuko_agents: {
        Row: {
          capabilities: string[]
          category: string
          competency_score: number
          dependencies: string[] | null
          id: string
          last_update: string
          mode: string
          name: string
          performance: number
          status: string
        }
        Insert: {
          capabilities: string[]
          category: string
          competency_score?: number
          dependencies?: string[] | null
          id?: string
          last_update?: string
          mode: string
          name: string
          performance?: number
          status?: string
        }
        Update: {
          capabilities?: string[]
          category?: string
          competency_score?: number
          dependencies?: string[] | null
          id?: string
          last_update?: string
          mode?: string
          name?: string
          performance?: number
          status?: string
        }
        Relationships: []
      }
      fuko_identity: {
        Row: {
          agent_id: string
          behavioral_patterns: Json | null
          consistency_metrics: Json | null
          core_identity: Json
          created_at: string
          id: string
          identity_evolution: Json[] | null
          last_verification: string | null
          style_signature: string
        }
        Insert: {
          agent_id: string
          behavioral_patterns?: Json | null
          consistency_metrics?: Json | null
          core_identity: Json
          created_at?: string
          id?: string
          identity_evolution?: Json[] | null
          last_verification?: string | null
          style_signature: string
        }
        Update: {
          agent_id?: string
          behavioral_patterns?: Json | null
          consistency_metrics?: Json | null
          core_identity?: Json
          created_at?: string
          id?: string
          identity_evolution?: Json[] | null
          last_verification?: string | null
          style_signature?: string
        }
        Relationships: []
      }
      fuko_messages: {
        Row: {
          execution_result: string | null
          F: string
          id: string
          K: string
          K2: string
          O: string
          P: string
          priority: string
          source_agent: string
          status: string
          target_agent: string | null
          timestamp: string
          U: string
          Z: string
        }
        Insert: {
          execution_result?: string | null
          F: string
          id?: string
          K: string
          K2: string
          O: string
          P: string
          priority?: string
          source_agent: string
          status?: string
          target_agent?: string | null
          timestamp?: string
          U: string
          Z: string
        }
        Update: {
          execution_result?: string | null
          F?: string
          id?: string
          K?: string
          K2?: string
          O?: string
          P?: string
          priority?: string
          source_agent?: string
          status?: string
          target_agent?: string | null
          timestamp?: string
          U?: string
          Z?: string
        }
        Relationships: []
      }
      fuko_ram: {
        Row: {
          agent_id: string
          created_at: string
          decay_rate: number | null
          emotional_context: Json
          id: string
          intensity_level: number | null
          last_accessed: string | null
          memory_content: string
          memory_type: string
          trigger_conditions: Json | null
        }
        Insert: {
          agent_id: string
          created_at?: string
          decay_rate?: number | null
          emotional_context: Json
          id?: string
          intensity_level?: number | null
          last_accessed?: string | null
          memory_content: string
          memory_type: string
          trigger_conditions?: Json | null
        }
        Update: {
          agent_id?: string
          created_at?: string
          decay_rate?: number | null
          emotional_context?: Json
          id?: string
          intensity_level?: number | null
          last_accessed?: string | null
          memory_content?: string
          memory_type?: string
          trigger_conditions?: Json | null
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
      kpi_data: {
        Row: {
          id: string
          last_update: string
          name: string
          threshold: number
          trend: string
          value: number
        }
        Insert: {
          id?: string
          last_update?: string
          name: string
          threshold: number
          trend: string
          value: number
        }
        Update: {
          id?: string
          last_update?: string
          name?: string
          threshold?: number
          trend?: string
          value?: number
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
      meta_decisions: {
        Row: {
          completed_at: string | null
          context: Json | null
          created_at: string
          decision_type: string
          emotional_state: Json | null
          execution_result: Json | null
          id: string
          priority: number
          processed_at: string | null
          routing_score: number | null
          source_agent: string
          status: string
          style_fingerprint: string | null
          target_agent: string | null
        }
        Insert: {
          completed_at?: string | null
          context?: Json | null
          created_at?: string
          decision_type: string
          emotional_state?: Json | null
          execution_result?: Json | null
          id?: string
          priority?: number
          processed_at?: string | null
          routing_score?: number | null
          source_agent: string
          status?: string
          style_fingerprint?: string | null
          target_agent?: string | null
        }
        Update: {
          completed_at?: string | null
          context?: Json | null
          created_at?: string
          decision_type?: string
          emotional_state?: Json | null
          execution_result?: Json | null
          id?: string
          priority?: number
          processed_at?: string | null
          routing_score?: number | null
          source_agent?: string
          status?: string
          style_fingerprint?: string | null
          target_agent?: string | null
        }
        Relationships: []
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
      openai_agents: {
        Row: {
          assistant_id: string | null
          description: string
          id: string
          instructions: string | null
          is_active: boolean | null
          last_used: string | null
          name: string
        }
        Insert: {
          assistant_id?: string | null
          description: string
          id?: string
          instructions?: string | null
          is_active?: boolean | null
          last_used?: string | null
          name: string
        }
        Update: {
          assistant_id?: string | null
          description?: string
          id?: string
          instructions?: string | null
          is_active?: boolean | null
          last_used?: string | null
          name?: string
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
      priority_queue: {
        Row: {
          calculated_priority: number
          created_at: string
          decision_id: string | null
          dependencies: string[] | null
          estimated_duration: number | null
          id: string
          queue_position: number | null
          resource_requirements: Json | null
          scheduled_at: string | null
        }
        Insert: {
          calculated_priority: number
          created_at?: string
          decision_id?: string | null
          dependencies?: string[] | null
          estimated_duration?: number | null
          id?: string
          queue_position?: number | null
          resource_requirements?: Json | null
          scheduled_at?: string | null
        }
        Update: {
          calculated_priority?: number
          created_at?: string
          decision_id?: string | null
          dependencies?: string[] | null
          estimated_duration?: number | null
          id?: string
          queue_position?: number | null
          resource_requirements?: Json | null
          scheduled_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "priority_queue_decision_id_fkey"
            columns: ["decision_id"]
            isOneToOne: false
            referencedRelation: "meta_decisions"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          role: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          first_name?: string | null
          id: string
          last_name?: string | null
          role?: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      project_files: {
        Row: {
          id: string
          name: string
          openai_file_id: string | null
          project_id: string | null
          size: number
          type: string
          uploaded_at: string
        }
        Insert: {
          id?: string
          name: string
          openai_file_id?: string | null
          project_id?: string | null
          size: number
          type: string
          uploaded_at?: string
        }
        Update: {
          id?: string
          name?: string
          openai_file_id?: string | null
          project_id?: string | null
          size?: number
          type?: string
          uploaded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_files_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          agent_id: string | null
          created_at: string
          description: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          agent_id?: string | null
          created_at?: string
          description: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          agent_id?: string | null
          created_at?: string
          description?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      routing_rules: {
        Row: {
          actions: Json | null
          agent_pattern: string
          conditions: Json | null
          created_at: string
          decision_pattern: string
          id: string
          is_active: boolean | null
          priority_modifier: number | null
          rule_name: string
        }
        Insert: {
          actions?: Json | null
          agent_pattern: string
          conditions?: Json | null
          created_at?: string
          decision_pattern: string
          id?: string
          is_active?: boolean | null
          priority_modifier?: number | null
          rule_name: string
        }
        Update: {
          actions?: Json | null
          agent_pattern?: string
          conditions?: Json | null
          created_at?: string
          decision_pattern?: string
          id?: string
          is_active?: boolean | null
          priority_modifier?: number | null
          rule_name?: string
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
      calculate_decision_priority: {
        Args: { decision_id: string }
        Returns: number
      }
      calculate_routing_score: {
        Args: { decision_data: Json; agent_capabilities: string[] }
        Returns: number
      }
      custom_access_token_hook: {
        Args: { event: Json }
        Returns: Json
      }
      get_all_user_profiles: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          email: string
          first_name: string
          last_name: string
          role: string
          created_at: string
          last_sign_in_at: string
        }[]
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
      get_user_profile: {
        Args: { user_id: string }
        Returns: {
          id: string
          email: string
          first_name: string
          last_name: string
          role: string
          created_at: string
          updated_at: string
        }[]
      }
      update_user_profile: {
        Args: { user_id: string; profile_updates: Json }
        Returns: undefined
      }
      update_user_role: {
        Args: { user_email: string; new_role: string }
        Returns: undefined
      }
      update_user_role_by_id: {
        Args: { user_id: string; new_role: string }
        Returns: undefined
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
