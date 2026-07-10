export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string | null
          name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          name?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      payroll_batches: {
        Row: {
          id: string
          user_id: string
          name: string
          sender_address: string
          memo: string | null
          status: 'draft' | 'broadcasting' | 'pending' | 'completed' | 'failed'
          total_zec: number
          recipient_count: number
          operation_id: string | null
          tx_ids: string[] | null
          broadcasted_at: string | null
          completed_at: string | null
          error_message: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          sender_address: string
          memo?: string | null
          status?: 'draft' | 'broadcasting' | 'pending' | 'completed' | 'failed'
          total_zec?: number
          recipient_count?: number
          operation_id?: string | null
          tx_ids?: string[] | null
          broadcasted_at?: string | null
          completed_at?: string | null
          error_message?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          sender_address?: string
          memo?: string | null
          status?: 'draft' | 'broadcasting' | 'pending' | 'completed' | 'failed'
          total_zec?: number
          recipient_count?: number
          operation_id?: string | null
          tx_ids?: string[] | null
          broadcasted_at?: string | null
          completed_at?: string | null
          error_message?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      payroll_recipients: {
        Row: {
          id: string
          batch_id: string
          name: string | null
          address: string
          amount: number
          memo: string | null
          status: 'pending' | 'confirmed' | 'failed'
          tx_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          batch_id: string
          name?: string | null
          address: string
          amount: number
          memo?: string | null
          status?: 'pending' | 'confirmed' | 'failed'
          tx_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          batch_id?: string
          name?: string | null
          address?: string
          amount?: number
          memo?: string | null
          status?: 'pending' | 'confirmed' | 'failed'
          tx_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
