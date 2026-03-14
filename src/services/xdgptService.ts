
import { supabase } from '@/integrations/supabase/db';
import type { XdGPTModel, XdGPTFile, XdGPTMacro, ModelComparison } from '@/types/xdgpt';

class XdGPTService {
  async getModels(): Promise<XdGPTModel[]> {
    const { data, error } = await supabase
      .from('xdgpt_models')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async compareModels(modelIds: string[], prompt: string): Promise<ModelComparison | null> {
    const { data, error } = await supabase.functions.invoke('xdgpt-compare-models', {
      body: { modelIds, prompt }
    });

    if (error) throw error;
    return data;
  }

  async uploadFile(file: File): Promise<XdGPTFile | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const filePath = `xdgpt-files/${Date.now()}-${file.name}`;
      
      const { data, error } = await supabase
        .from('xdgpt_files')
        .insert({
          filename: file.name,
          file_path: filePath,
          file_size: file.size,
          file_type: file.type,
          version: 1,
          is_encrypted: false,
          metadata: {
            originalName: file.name,
            uploadedAt: new Date().toISOString()
          },
          user_id: user?.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error uploading file:', error);
      return null;
    }
  }

  async getFiles(): Promise<XdGPTFile[]> {
    const { data, error } = await supabase
      .from('xdgpt_files')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async createMacro(macroData: { name: string; command_template: string; description?: string; parameters?: any[] }): Promise<XdGPTMacro | null> {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from('xdgpt_macros')
      .insert({
        name: macroData.name,
        command_template: macroData.command_template,
        description: macroData.description || null,
        parameters: macroData.parameters || [],
        user_id: user?.id,
        is_active: true
      })
      .select()
      .single();

    if (error) throw error;
    return data as XdGPTMacro;
  }

  async getMacros(): Promise<XdGPTMacro[]> {
    const { data, error } = await supabase
      .from('xdgpt_macros')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as XdGPTMacro[];
  }

  async executeMacro(macroId: string, parameters: any = {}): Promise<string> {
    const { data: macro, error } = await supabase
      .from('xdgpt_macros')
      .select('*')
      .eq('id', macroId)
      .single();

    if (error || !macro) {
      throw new Error('Macro not found');
    }

    let command = macro.command_template;
    Object.entries(parameters).forEach(([key, value]) => {
      command = command.replace(new RegExp(`\\$\\{${key}\\}`, 'g'), String(value));
    });

    return `Executing macro "${macro.name}": ${command}`;
  }
}

export const xdgptService = new XdGPTService();
