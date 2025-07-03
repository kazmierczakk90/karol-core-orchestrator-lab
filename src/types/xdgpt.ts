
export interface XdGPTModel {
  id: string;
  name: string;
  provider: string;
  api_endpoint?: string;
  is_active: boolean;
  configuration: any;
  created_at: string;
}

export interface XdGPTFile {
  id: string;
  user_id?: string;
  filename: string;
  file_path: string;
  file_size?: number;
  file_type?: string;
  version: number;
  is_encrypted: boolean;
  metadata: any;
  created_at: string;
  updated_at: string;
}

export interface XdGPTMacro {
  id: string;
  user_id?: string;
  name: string;
  command_template: string;
  description?: string;
  parameters: any[];
  is_active: boolean;
  created_at: string;
}

export interface ModelComparison {
  models: string[];
  prompt: string;
  results: ModelResult[];
}

export interface ModelResult {
  model: string;
  response: string;
  tokens_used?: number;
  response_time?: number;
  error?: string;
}
