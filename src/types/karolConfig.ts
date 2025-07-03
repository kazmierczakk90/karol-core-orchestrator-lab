
export interface KarolConfig {
  id: string;
  config_key: string;
  config_value: any;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PlatformConfig {
  platform_version: string;
  edict_config: {
    enabled: boolean;
    mode: string;
    max_iterations: number;
  };
  xdgpt_config: {
    enabled: boolean;
    models: string[];
    max_file_size: number;
  };
  xds_config: {
    enabled: boolean;
    research_depth: number;
    max_queries: number;
  };
  agents_config: {
    count: number;
    active: boolean;
    auto_select: boolean;
  };
}
