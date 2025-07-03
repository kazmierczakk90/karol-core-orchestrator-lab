
import { supabase } from '@/integrations/supabase/client';
import type { XdGPTModel, XdGPTFile, XdGPTMacro, ModelComparison, ModelResult } from '@/types/xdgpt';

class XdGPTService {
  async getModels(): Promise<XdGPTModel[]> {
    const { data, error } = await supabase
      .from('xdgpt_models')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) {
      console.error('Error fetching xdGPT models:', error);
      return [];
    }

    return data as XdGPTModel[];
  }

  async compareModels(models: string[], prompt: string): Promise<ModelComparison> {
    const results: ModelResult[] = [];

    for (const modelName of models) {
      try {
        const startTime = Date.now();
        
        // W rzeczywistości byłoby to wywołanie różnych API
        const response = await this.callModel(modelName, prompt);
        const endTime = Date.now();

        results.push({
          model: modelName,
          response: response.content,
          tokens_used: response.tokens,
          response_time: endTime - startTime
        });
      } catch (error) {
        results.push({
          model: modelName,
          response: '',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return {
      models,
      prompt,
      results
    };
  }

  private async callModel(model: string, prompt: string): Promise<{content: string, tokens: number}> {
    // Symulacja wywołania różnych modeli - w rzeczywistości byłoby to połączenie z OpenAI/Claude/etc
    const responses = [
      `Response from ${model}: This is a comprehensive analysis of your request...`,
      `${model} suggests: Based on the context provided, I recommend...`,
      `From ${model} perspective: The optimal approach would be...`
    ];
    
    return {
      content: responses[Math.floor(Math.random() * responses.length)],
      tokens: Math.floor(Math.random() * 1000) + 100
    };
  }

  async createMacro(macroData: { name: string; command_template: string; description?: string; parameters?: any[]; user_id?: string }): Promise<XdGPTMacro | null> {
    const { data, error } = await supabase
      .from('xdgpt_macros')
      .insert({
        name: macroData.name,
        command_template: macroData.command_template,
        description: macroData.description || null,
        parameters: macroData.parameters || [],
        user_id: macroData.user_id || null,
        is_active: true
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating macro:', error);
      return null;
    }

    return data as XdGPTMacro;
  }

  async getMacros(): Promise<XdGPTMacro[]> {
    const { data, error } = await supabase
      .from('xdgpt_macros')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) {
      console.error('Error fetching macros:', error);
      return [];
    }

    return data as XdGPTMacro[];
  }

  async executeMacro(macroId: string, parameters: any = {}): Promise<string> {
    const { data: macro } = await supabase
      .from('xdgpt_macros')
      .select('*')
      .eq('id', macroId)
      .single();

    if (!macro) {
      throw new Error('Macro not found');
    }

    // Zastąp parametry w template
    let command = macro.command_template;
    Object.entries(parameters).forEach(([key, value]) => {
      command = command.replace(new RegExp(`\\$\\{${key}\\}`, 'g'), String(value));
    });

    // W rzeczywistości byłoby to bezpieczne wykonanie w sandboxie
    return `Executing macro "${macro.name}": ${command}`;
  }

  async uploadFile(file: File, userId?: string): Promise<XdGPTFile | null> {
    try {
      // W rzeczywistości upload do Supabase Storage
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
          user_id: userId || null
        })
        .select()
        .single();

      if (error) {
        console.error('Error uploading file:', error);
        return null;
      }

      return data as XdGPTFile;
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

    if (error) {
      console.error('Error fetching files:', error);
      return [];
    }

    return data as XdGPTFile[];
  }
}

export const xdgptService = new XdGPTService();
