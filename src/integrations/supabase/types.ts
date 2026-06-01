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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      auction_bids: {
        Row: {
          bid_amount: number
          created_at: string
          id: string
          is_winning: boolean | null
          item_description: string | null
          item_image: string | null
          item_name: string
          seller_image: string | null
          seller_name: string | null
          stream_id: number
          user_id: string
        }
        Insert: {
          bid_amount: number
          created_at?: string
          id?: string
          is_winning?: boolean | null
          item_description?: string | null
          item_image?: string | null
          item_name: string
          seller_image?: string | null
          seller_name?: string | null
          stream_id: number
          user_id: string
        }
        Update: {
          bid_amount?: number
          created_at?: string
          id?: string
          is_winning?: boolean | null
          item_description?: string | null
          item_image?: string | null
          item_name?: string
          seller_image?: string | null
          seller_name?: string | null
          stream_id?: number
          user_id?: string
        }
        Relationships: []
      }
      auction_items: {
        Row: {
          auction_duration_seconds: number
          auction_ends_at: string | null
          auction_started_at: string | null
          created_at: string
          current_price: number
          id: string
          item_description: string | null
          item_image: string | null
          item_name: string
          item_order: number
          min_increment: number
          seller_image: string | null
          seller_name: string | null
          starting_price: number
          status: string
          stream_id: number
          updated_at: string
          winner_user_id: string | null
        }
        Insert: {
          auction_duration_seconds?: number
          auction_ends_at?: string | null
          auction_started_at?: string | null
          created_at?: string
          current_price?: number
          id?: string
          item_description?: string | null
          item_image?: string | null
          item_name: string
          item_order?: number
          min_increment?: number
          seller_image?: string | null
          seller_name?: string | null
          starting_price?: number
          status?: string
          stream_id: number
          updated_at?: string
          winner_user_id?: string | null
        }
        Update: {
          auction_duration_seconds?: number
          auction_ends_at?: string | null
          auction_started_at?: string | null
          created_at?: string
          current_price?: number
          id?: string
          item_description?: string | null
          item_image?: string | null
          item_name?: string
          item_order?: number
          min_increment?: number
          seller_image?: string | null
          seller_name?: string | null
          starting_price?: number
          status?: string
          stream_id?: number
          updated_at?: string
          winner_user_id?: string | null
        }
        Relationships: []
      }
      bid_history: {
        Row: {
          auction_item_id: string
          bid_amount: number
          created_at: string
          id: string
          user_id: string
          username: string | null
        }
        Insert: {
          auction_item_id: string
          bid_amount: number
          created_at?: string
          id?: string
          user_id: string
          username?: string | null
        }
        Update: {
          auction_item_id?: string
          bid_amount?: number
          created_at?: string
          id?: string
          user_id?: string
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bid_history_auction_item_id_fkey"
            columns: ["auction_item_id"]
            isOneToOne: false
            referencedRelation: "auction_items"
            referencedColumns: ["id"]
          },
        ]
      }
      cart_items: {
        Row: {
          created_at: string
          id: string
          product_currency: string
          product_image: string | null
          product_original_price: number | null
          product_price: number
          product_title: string
          quantity: number
          seller_name: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_currency?: string
          product_image?: string | null
          product_original_price?: number | null
          product_price: number
          product_title: string
          quantity?: number
          seller_name?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_currency?: string
          product_image?: string | null
          product_original_price?: number | null
          product_price?: number
          product_title?: string
          quantity?: number
          seller_name?: string | null
          user_id?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          admin_response: string | null
          created_at: string
          email: string
          id: string
          message: string
          name: string
          status: string
          subject: string
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_response?: string | null
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          status?: string
          subject: string
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_response?: string | null
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          status?: string
          subject?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      direct_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          read: boolean
          recipient_id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          read?: boolean
          recipient_id: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          read?: boolean
          recipient_id?: string
          sender_id?: string
        }
        Relationships: []
      }
      follows: {
        Row: {
          created_at: string
          follow_source: string
          id: string
          seller_name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          follow_source?: string
          id?: string
          seller_name: string
          user_id: string
        }
        Update: {
          created_at?: string
          follow_source?: string
          id?: string
          seller_name?: string
          user_id?: string
        }
        Relationships: []
      }
      live_comments: {
        Row: {
          created_at: string
          id: string
          message: string
          stream_id: string
          user_id: string
          username: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          stream_id: string
          user_id: string
          username?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          stream_id?: string
          user_id?: string
          username?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          link: string | null
          read: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          link?: string | null
          read?: boolean
          title: string
          type?: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          link?: string | null
          read?: boolean
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          cancelled_at: string | null
          created_at: string
          id: string
          payment_method: string | null
          product_currency: string
          product_image: string | null
          product_price: number
          product_title: string
          quantity: number
          seller_name: string | null
          shipping_address: string | null
          status: string
          total_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          cancelled_at?: string | null
          created_at?: string
          id?: string
          payment_method?: string | null
          product_currency?: string
          product_image?: string | null
          product_price: number
          product_title: string
          quantity?: number
          seller_name?: string | null
          shipping_address?: string | null
          status?: string
          total_amount: number
          updated_at?: string
          user_id: string
        }
        Update: {
          cancelled_at?: string | null
          created_at?: string
          id?: string
          payment_method?: string | null
          product_currency?: string
          product_image?: string | null
          product_price?: number
          product_title?: string
          quantity?: number
          seller_name?: string | null
          shipping_address?: string | null
          status?: string
          total_amount?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          id: string
          name: string | null
          updated_at: string
          user_id: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          id?: string
          name?: string | null
          updated_at?: string
          user_id: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          id?: string
          name?: string | null
          updated_at?: string
          user_id?: string
          username?: string | null
        }
        Relationships: []
      }
      seller_reviews: {
        Row: {
          created_at: string
          id: string
          rating: number
          review_text: string
          seller_name: string
          user_id: string
          username: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          rating: number
          review_text: string
          seller_name: string
          user_id: string
          username?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          rating?: number
          review_text?: string
          seller_name?: string
          user_id?: string
          username?: string | null
        }
        Relationships: []
      }
      user_credits: {
        Row: {
          balance: number
          created_at: string
          id: string
          updated_at: string
          user_id: string
          wallet_balance: number
        }
        Insert: {
          balance?: number
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
          wallet_balance?: number
        }
        Update: {
          balance?: number
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
          wallet_balance?: number
        }
        Relationships: []
      }
      user_reports: {
        Row: {
          admin_response: string | null
          category: string
          created_at: string
          description: string
          id: string
          related_order_id: string | null
          related_user: string | null
          status: string
          subject: string
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_response?: string | null
          category: string
          created_at?: string
          description: string
          id?: string
          related_order_id?: string | null
          related_user?: string | null
          status?: string
          subject: string
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_response?: string | null
          category?: string
          created_at?: string
          description?: string
          id?: string
          related_order_id?: string | null
          related_user?: string | null
          status?: string
          subject?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      wallet_transactions: {
        Row: {
          amount: number
          balance_after: number
          created_at: string
          description: string | null
          id: string
          payment_method: string | null
          reference: string | null
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          balance_after: number
          created_at?: string
          description?: string | null
          id?: string
          payment_method?: string | null
          reference?: string | null
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          balance_after?: number
          created_at?: string
          description?: string | null
          id?: string
          payment_method?: string | null
          reference?: string | null
          type?: string
          user_id?: string
        }
        Relationships: []
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
