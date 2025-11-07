
import { supabase } from '@/integrations/supabase/client';
import type { XdSResearch, XdSContent, ResearchPipeline } from '@/types/xds';

class XdSService {
  async createResearch(query: string): Promise<XdSResearch | null> {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from('xds_research')
      .insert({
        query,
        user_id: user?.id,
        status: 'pending',
        pipeline_stage: 0
      })
      .select()
      .single();

    if (error) throw error;
    return data as XdSResearch;
  }

  async processResearch(researchId: string): Promise<boolean> {
    const { data, error } = await supabase.functions.invoke('xds-process-research', {
      body: { researchId }
    });

    if (error) throw error;
    return data?.success || false;
  }

  async getResearches(): Promise<XdSResearch[]> {
    const { data, error } = await supabase
      .from('xds_research')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as XdSResearch[];
  }

  async extractContent(url: string, type: 'web' | 'pdf' | 'document', researchId?: string): Promise<XdSContent | null> {
    try {
      const mockContent = `Extracted content from ${url}`;
      
      const { data, error } = await supabase
        .from('xds_content')
        .insert({
          research_id: researchId || null,
          source_url: url,
          content_type: type,
          raw_content: mockContent,
          processed_content: mockContent,
          segments: [
            { type: 'header', content: 'Main heading' },
            { type: 'paragraph', content: 'Content paragraph' }
          ],
          extraction_metadata: {
            extractedAt: new Date().toISOString(),
            method: 'automated',
            confidence: 0.95
          }
        })
        .select()
        .single();

      if (error) throw error;
      return data as XdSContent;
    } catch (error) {
      console.error('Error extracting content:', error);
      return null;
    }
  }

  getResearchPipeline(): ResearchPipeline[] {
    return [
      { stage: 1, name: 'Intention Analysis', description: 'Analyzing user query intention', status: 'pending' },
      { stage: 2, name: 'Query Generation', description: 'Generating research queries', status: 'pending' },
      { stage: 3, name: 'Content Extraction', description: 'Extracting relevant content', status: 'pending' },
      { stage: 4, name: 'Data Processing', description: 'Processing and analyzing data', status: 'pending' },
      { stage: 5, name: 'Synthesis', description: 'Synthesizing final results', status: 'pending' }
    ];
  }
}

export const xdsService = new XdSService();
