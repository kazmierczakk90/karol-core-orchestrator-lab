
export interface XdSResearch {
  id: string;
  user_id?: string;
  query: string;
  intention_analysis?: any;
  generated_queries?: any;
  research_results?: any;
  synthesis_result?: string;
  pipeline_stage: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
  completed_at?: string;
}

export interface XdSContent {
  id: string;
  research_id: string;
  source_url?: string;
  content_type: 'web' | 'pdf' | 'document';
  raw_content?: string;
  processed_content?: string;
  segments: any[];
  extraction_metadata: any;
  created_at: string;
}

export interface ResearchPipeline {
  stage: number;
  name: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  result?: any;
}
