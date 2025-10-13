
export interface KarolConfig {
  id: string;
  config_key: string;
  config_value: any;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ModuleConfig {
  agentId: string;
  enabled: boolean;
  [key: string]: any;
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
  modules?: {
    reflexEngine?: ModuleConfig & {
      frequency_minutes: number;
      last_run: string | null;
    };
    snapshotDaemon?: ModuleConfig & {
      interval_minutes: number;
      backup_path: string;
      retain_last: number;
    };
    guardianCore?: ModuleConfig & {
      drift_threshold: number;
      auto_fix: boolean;
      check_interval_minutes: number;
    };
    intentAttribution?: ModuleConfig;
    impactTracker?: ModuleConfig;
    narrativeBuilder?: ModuleConfig & {
      daily_report_hour_utc: number;
    };
    agentUptimeMonitor?: ModuleConfig & {
      heartbeat_interval_seconds: number;
    };
    priorityEngine?: ModuleConfig;
  };
}
