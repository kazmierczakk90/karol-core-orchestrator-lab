
export interface MiniAI {
  id: string;
  name: string;
  type: string;
  description: string | null;
  category: string | null;
  is_active: boolean | null;
  is_pinned: boolean | null;
  created_at: string | null;
  updated_at: string | null;
  config: { [key: string]: any } | null;
  author: string | null;
  is_public: boolean | null;
}

export interface CreateMiniAIData {
  name: string;
  type: string;
  description?: string;
  category?: string;
  config?: { [key: string]: any };
}
