
import { supabase } from '@/integrations/supabase/db';
import type { KarolConfig, PlatformConfig } from '@/types/karolConfig';

class KarolConfigService {
  async getConfig(): Promise<PlatformConfig | null> {
    const { data, error } = await supabase
      .from('karol_config')
      .select('*')
      .eq('is_active', true);

    if (error) {
      console.error('Error fetching config:', error);
      return null;
    }

    // Konwersja z array do object
    const configObject: any = {};
    data.forEach((item: KarolConfig) => {
      configObject[item.config_key] = item.config_value;
    });

    return configObject as PlatformConfig;
  }

  async updateConfig(key: string, value: any): Promise<boolean> {
    const { error } = await supabase
      .from('karol_config')
      .update({
        config_value: value,
        updated_at: new Date().toISOString()
      })
      .eq('config_key', key);

    if (error) {
      console.error('Error updating config:', error);
      return false;
    }

    return true;
  }

  async createBackup(): Promise<string> {
    const config = await this.getConfig();
    if (!config) return '';

    const backup = {
      timestamp: new Date().toISOString(),
      version: config.platform_version,
      config: config
    };

    // W rzeczywistości zapisałbym to do storage lub osobnej tabeli
    return JSON.stringify(backup, null, 2);
  }

  async exportConfig(): Promise<string> {
    const config = await this.getConfig();
    if (!config) return '{}';

    return JSON.stringify(config, null, 2);
  }

  getDefaultConfig(): PlatformConfig {
    return {
      platform_version: "3.0-extended",
      edict_config: {
        enabled: true,
        mode: "hybrid",
        max_iterations: 5
      },
      xdgpt_config: {
        enabled: true,
        models: ["gpt-4o-mini"],
        max_file_size: 104857600
      },
      xds_config: {
        enabled: true,
        research_depth: 12,
        max_queries: 128
      },
      agents_config: {
        count: 47,
        active: true,
        auto_select: true
      }
    };
  }
}

export const karolConfigService = new KarolConfigService();
