
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
      devices: {
        Row: {
          id: number
          first_ts: string | null
          last_ts: string | null
          available_duration: number | null
          plug_name: string | null
          appliance_category: string | null
          comment: string | null
          files_names: string | null
          power_max: number | null
          status?: string
          priority?: 'low' | 'medium' | 'high'
          location?: string
          last_active?: string
        }
        Insert: {
          id: number
          first_ts?: string | null
          last_ts?: string | null
          available_duration?: number | null
          plug_name?: string | null
          appliance_category?: string | null
          comment?: string | null
          files_names?: string | null
          power_max?: number | null
          status?: string
          priority?: 'low' | 'medium' | 'high'
          location?: string
          last_active?: string
        }
        Update: {
          id?: number
          first_ts?: string | null
          last_ts?: string | null
          available_duration?: number | null
          plug_name?: string | null
          appliance_category?: string | null
          comment?: string | null
          files_names?: string | null
          power_max?: number | null
          status?: string
          priority?: 'low' | 'medium' | 'high'
          location?: string
          last_active?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          name: string | null
          role: string
          created_at?: string
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          role?: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          role?: string
          created_at?: string
        }
      }
    }
  }
}
