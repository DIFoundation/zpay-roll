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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      employees: {
        Row: {
          base_salary: number
          created_at: string
          created_by: string | null
          currency: Database["public"]["Enums"]["currency_type"]
          deleted_at: string | null
          department: string | null
          email: string | null
          employee_code: string
          first_name: string
          id: string
          last_name: string
          middle_name: string | null
          organization_id: string
          position: string | null
          status: Database["public"]["Enums"]["employee_status"]
          updated_at: string
          wallet_address: string
        }
        Insert: {
          base_salary: number
          created_at?: string
          created_by?: string | null
          currency?: Database["public"]["Enums"]["currency_type"]
          deleted_at?: string | null
          department?: string | null
          email?: string | null
          employee_code: string
          first_name: string
          id?: string
          last_name: string
          middle_name?: string | null
          organization_id: string
          position?: string | null
          status?: Database["public"]["Enums"]["employee_status"]
          updated_at?: string
          wallet_address: string
        }
        Update: {
          base_salary?: number
          created_at?: string
          created_by?: string | null
          currency?: Database["public"]["Enums"]["currency_type"]
          deleted_at?: string | null
          department?: string | null
          email?: string | null
          employee_code?: string
          first_name?: string
          id?: string
          last_name?: string
          middle_name?: string | null
          organization_id?: string
          position?: string | null
          status?: Database["public"]["Enums"]["employee_status"]
          updated_at?: string
          wallet_address?: string
        }
        Relationships: [
          {
            foreignKeyName: "employees_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employees_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_members: {
        Row: {
          created_at: string
          id: string
          organization_id: string
          profile_id: string
          role: Database["public"]["Enums"]["member_role"]
        }
        Insert: {
          created_at?: string
          id?: string
          organization_id: string
          profile_id: string
          role?: Database["public"]["Enums"]["member_role"]
        }
        Update: {
          created_at?: string
          id?: string
          organization_id?: string
          profile_id?: string
          role?: Database["public"]["Enums"]["member_role"]
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_members_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          created_by: string
          id: string
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      payroll_batches: {
        Row: {
          created_at: string
          created_by: string
          deleted_at: string | null
          employee_count: number
          id: string
          organization_id: string
          pay_period: string
          status: Database["public"]["Enums"]["payroll_batch_status"]
          title: string
          total_amount: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          deleted_at?: string | null
          employee_count?: number
          id?: string
          organization_id: string
          pay_period: string
          status?: Database["public"]["Enums"]["payroll_batch_status"]
          title: string
          total_amount?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          deleted_at?: string | null
          employee_count?: number
          id?: string
          organization_id?: string
          pay_period?: string
          status?: Database["public"]["Enums"]["payroll_batch_status"]
          title?: string
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payroll_batches_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payroll_batches_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      payroll_items: {
        Row: {
          amount: number
          batch_id: string
          created_at: string
          employee_id: string
          id: string
          status: Database["public"]["Enums"]["payroll_item_status"]
          updated_at: string
          wallet_address: string
        }
        Insert: {
          amount: number
          batch_id: string
          created_at?: string
          employee_id: string
          id?: string
          status?: Database["public"]["Enums"]["payroll_item_status"]
          updated_at?: string
          wallet_address: string
        }
        Update: {
          amount?: number
          batch_id?: string
          created_at?: string
          employee_id?: string
          id?: string
          status?: Database["public"]["Enums"]["payroll_item_status"]
          updated_at?: string
          wallet_address?: string
        }
        Relationships: [
          {
            foreignKeyName: "payroll_items_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "payroll_batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payroll_items_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name: string
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          created_at: string
          id: string
          payroll_item_id: string
          status: Database["public"]["Enums"]["transaction_status"]
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          payroll_item_id: string
          status?: Database["public"]["Enums"]["transaction_status"]
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          payroll_item_id?: string
          status?: Database["public"]["Enums"]["transaction_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_payroll_item_id_fkey"
            columns: ["payroll_item_id"]
            isOneToOne: false
            referencedRelation: "payroll_items"
            referencedColumns: ["id"]
          },
        ]
      }
      wallet_transactions: {
        Row: {
          confirmations: number
          created_at: string
          id: string
          network: Database["public"]["Enums"]["blockchain_network"]
          network_fee: number | null
          status: Database["public"]["Enums"]["transaction_status"]
          transaction_id: string
          tx_hash: string | null
          updated_at: string
        }
        Insert: {
          confirmations?: number
          created_at?: string
          id?: string
          network?: Database["public"]["Enums"]["blockchain_network"]
          network_fee?: number | null
          status?: Database["public"]["Enums"]["transaction_status"]
          transaction_id: string
          tx_hash?: string | null
          updated_at?: string
        }
        Update: {
          confirmations?: number
          created_at?: string
          id?: string
          network?: Database["public"]["Enums"]["blockchain_network"]
          network_fee?: number | null
          status?: Database["public"]["Enums"]["transaction_status"]
          transaction_id?: string
          tx_hash?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "wallet_transactions_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      wallets: {
        Row: {
          address: string
          created_at: string
          created_by: string | null
          id: string
          last_synced_at: string | null
          network: Database["public"]["Enums"]["blockchain_network"]
          organization_id: string
          status: Database["public"]["Enums"]["wallet_status"]
          updated_at: string
        }
        Insert: {
          address: string
          created_at?: string
          created_by?: string | null
          id?: string
          last_synced_at?: string | null
          network?: Database["public"]["Enums"]["blockchain_network"]
          organization_id: string
          status?: Database["public"]["Enums"]["wallet_status"]
          updated_at?: string
        }
        Update: {
          address?: string
          created_at?: string
          created_by?: string | null
          id?: string
          last_synced_at?: string | null
          network?: Database["public"]["Enums"]["blockchain_network"]
          organization_id?: string
          status?: Database["public"]["Enums"]["wallet_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "wallets_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wallets_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_organization_admin: { Args: { org_id: string }; Returns: boolean }
      is_organization_member: { Args: { org_id: string }; Returns: boolean }
    }
    Enums: {
      blockchain_network: "zcash_mainnet" | "zcash_testnet"
      currency_type: "ZEC" | "USD" | "NGN"
      employee_status: "active" | "inactive" | "suspended"
      member_role: "owner" | "admin" | "finance" | "hr" | "employee"
      payroll_batch_status:
        | "draft"
        | "ready"
        | "processing"
        | "completed"
        | "failed"
      payroll_item_status: "pending" | "paid" | "failed"
      transaction_status: "pending" | "broadcasting" | "confirmed" | "failed"
      wallet_status: "connected" | "disconnected" | "syncing"
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
    Enums: {
      blockchain_network: ["zcash_mainnet", "zcash_testnet"],
      currency_type: ["ZEC", "USD", "NGN"],
      employee_status: ["active", "inactive", "suspended"],
      member_role: ["owner", "admin", "finance", "hr", "employee"],
      payroll_batch_status: [
        "draft",
        "ready",
        "processing",
        "completed",
        "failed",
      ],
      payroll_item_status: ["pending", "paid", "failed"],
      transaction_status: ["pending", "broadcasting", "confirmed", "failed"],
      wallet_status: ["connected", "disconnected", "syncing"],
    },
  },
} as const
