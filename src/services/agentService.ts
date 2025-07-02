
export interface Agent {
  id: string;
  name: string;
  description: string;
  category: string;
  assistant_id: string;
  instructions: string;
  isActive: boolean;
  avatar?: string;
  capabilities?: string[];
}

export const KAROL_CORE_AGENTS: Agent[] = [
  // CEO & Management Layer
  {
    id: '@ceo',
    name: 'CEO Agent (Karol-Core)',
    description: 'Strategiczne zarządzanie i decyzje wysokiego poziomu',
    category: 'management',
    assistant_id: 'asst_7foGqdfqZKRBNloPEVXmlrua',
    instructions: 'Jesteś CEO-level strategicznym asystentem dla systemu Karol Core z pełnym dostępem do pamięci projektowej i możliwościami podejmowania decyzji.',
    isActive: true,
    avatar: '👑',
    capabilities: ['strategic_decisions', 'team_management', 'business_planning']
  },
  {
    id: '@strategic-driver',
    name: 'Strategic Driver',
    description: 'Planowanie strategiczne i realizacja celów',
    category: 'management',
    assistant_id: 'asst_strategic_driver',
    instructions: 'Specjalista od planowania strategicznego i wykonania strategii biznesowych.',
    isActive: true,
    avatar: '🎯',
    capabilities: ['strategy_planning', 'goal_execution', 'performance_tracking']
  },

  // Core System Agents
  {
    id: '@karol-core',
    name: 'Karol Core',
    description: 'Rdzeń systemu Karol - podstawowa funkcjonalność',
    category: 'core',
    assistant_id: 'asst_karol_core',
    instructions: 'Specjalista od głównych funkcji systemu Karol Core.',
    isActive: true,
    avatar: '🔮',
    capabilities: ['core_functions', 'system_integration', 'data_processing']
  },
  {
    id: '@agent0',
    name: 'Agent Zero',
    description: 'Bazowy agent systemu - pierwszy punkt kontaktu',
    category: 'core',
    assistant_id: 'asst_agent_zero',
    instructions: 'Bazowy agent odpowiedzialny za podstawowe operacje systemowe.',
    isActive: true,
    avatar: '⚡',
    capabilities: ['basic_operations', 'routing', 'initial_processing']
  },
  {
    id: '@system-admin',
    name: 'System Admin',
    description: 'Administracja systemem i zarządzanie zasobami',
    category: 'admin',
    assistant_id: 'asst_system_admin',
    instructions: 'Specjalista od administracji systemowej.',
    isActive: true,
    avatar: '⚙️',
    capabilities: ['system_administration', 'user_management', 'security']
  },

  // Intelligence & Analytics
  {
    id: '@analiza',
    name: 'Analiza Agent',
    description: 'Analiza danych i generowanie insights',
    category: 'analytics',
    assistant_id: 'asst_analiza',
    instructions: 'Specjalista od analizy danych i biznesowych insights.',
    isActive: true,
    avatar: '📊',
    capabilities: ['data_analysis', 'reporting', 'insights_generation']
  },
  {
    id: '@logger',
    name: 'Logger Agent',
    description: 'Logowanie systemowe i monitoring',
    category: 'monitoring',
    assistant_id: 'asst_logger',
    instructions: 'Specjalista od logowania systemowego i monitoringu.',
    isActive: true,
    avatar: '📝',
    capabilities: ['logging', 'monitoring', 'system_tracking']
  },
  {
    id: '@kontroling',
    name: 'Kontroling Agent',
    description: 'Kontrola jakości i nadzór procesów',
    category: 'quality',
    assistant_id: 'asst_kontroling',
    instructions: 'Specjalista od kontroli jakości i nadzoru procesów.',
    isActive: true,
    avatar: '🔍',
    capabilities: ['quality_control', 'process_oversight', 'compliance']
  },

  // Communication & Voice
  {
    id: '@voice-core',
    name: 'Voice Core',
    description: 'Przetwarzanie głosu i komunikacja audio',
    category: 'communication',
    assistant_id: 'asst_voice_core',
    instructions: 'Specjalista od interakcji głosowych.',
    isActive: true,
    avatar: '🎤',
    capabilities: ['voice_processing', 'audio_communication', 'speech_recognition']
  },
  {
    id: '@karol-voice',
    name: 'Karol Voice',
    description: 'Zaawansowane przetwarzanie głosu Karol',
    category: 'communication',
    assistant_id: 'asst_karol_voice',
    instructions: 'Specjalista od zaawansowanego przetwarzania głosu.',
    isActive: true,
    avatar: '🗣️',
    capabilities: ['advanced_voice', 'natural_speech', 'voice_synthesis']
  },

  // Routing & Optimization
  {
    id: '@router',
    name: 'Router Agent',
    description: 'Routing zadań i dystrybucja pracy',
    category: 'routing',
    assistant_id: 'asst_router',
    instructions: 'Specjalista od routingu zadań.',
    isActive: true,
    avatar: '🔀',
    capabilities: ['task_routing', 'load_balancing', 'workflow_distribution']
  },
  {
    id: '@karol-router',
    name: 'Karol Router',
    description: 'Zaawansowany routing zadań Karol',
    category: 'routing',
    assistant_id: 'asst_karol_router',
    instructions: 'Specjalista od zaawansowanego routingu zadań.',
    isActive: true,
    avatar: '🔄',
    capabilities: ['advanced_routing', 'intelligent_distribution', 'priority_management']
  },
  {
    id: '@agent-router-core',
    name: 'Agent Router Core',
    description: 'Rdzeń routingu między agentami',
    category: 'routing',
    assistant_id: 'asst_agent_router_core',
    instructions: 'Specjalista od routingu między agentami.',
    isActive: true,
    avatar: '🌐',
    capabilities: ['inter_agent_routing', 'agent_coordination', 'message_passing']
  },
  {
    id: '@karol-router-agent',
    name: 'Karol Router Agent',
    description: 'Zaawansowany router agentów Karol',
    category: 'routing',
    assistant_id: 'asst_karol_router_agent',
    instructions: 'Specjalista od zaawansowanej koordynacji agentów.',
    isActive: true,
    avatar: '🔗',
    capabilities: ['agent_orchestration', 'complex_routing', 'multi_agent_coordination']
  },
  {
    id: '@optymalizator',
    name: 'Optymalizator',
    description: 'Optymalizacja wydajności i procesów',
    category: 'optimization',
    assistant_id: 'asst_optymalizator',
    instructions: 'Specjalista od optymalizacji wydajności.',
    isActive: true,
    avatar: '⚡',
    capabilities: ['performance_optimization', 'process_improvement', 'efficiency_analysis']
  },
  {
    id: '@karol-optimizer',
    name: 'Karol Optimizer',
    description: 'Zaawansowana optymalizacja systemu Karol',
    category: 'optimization',
    assistant_id: 'asst_karol_optimizer',
    instructions: 'Specjalista od zaawansowanej optymalizacji systemu.',
    isActive: true,
    avatar: '🚀',
    capabilities: ['system_optimization', 'resource_management', 'performance_tuning']
  },

  // Security & Control
  {
    id: '@guardian-core',
    name: 'Guardian Core',
    description: 'Bezpieczeństwo i ochrona systemu',
    category: 'security',
    assistant_id: 'asst_guardian_core',
    instructions: 'Specjalista od bezpieczeństwa.',
    isActive: true,
    avatar: '🛡️',
    capabilities: ['security_monitoring', 'threat_detection', 'access_control']
  },
  {
    id: '@karol-guard',
    name: 'Karol Guard',
    description: 'Zaawansowana ochrona systemu Karol',
    category: 'security',
    assistant_id: 'asst_karol_guard',
    instructions: 'Specjalista od zaawansowanej ochrony systemu.',
    isActive: true,
    avatar: '🔒',
    capabilities: ['advanced_security', 'intrusion_detection', 'security_analysis']
  },
  {
    id: '@karol-control',
    name: 'Karol Control',
    description: 'Kontrola i zarządzanie systemem Karol',
    category: 'control',
    assistant_id: 'asst_karol_control',
    instructions: 'Specjalista od kontroli systemu.',
    isActive: true,
    avatar: '🎛️',
    capabilities: ['system_control', 'configuration_management', 'operational_control']
  },
  {
    id: '@karol-admin',
    name: 'Karol Admin',
    description: 'Administracja systemu Karol',
    category: 'admin',
    assistant_id: 'asst_karol_admin',
    instructions: 'Specjalista od administracji.',
    isActive: true,
    avatar: '👨‍💼',
    capabilities: ['system_administration', 'user_management', 'configuration']
  },

  // Timing & Coordination
  {
    id: '@timing-core',
    name: 'Timing Core',
    description: 'Zarządzanie czasem i harmonogramowanie',
    category: 'timing',
    assistant_id: 'asst_timing_core',
    instructions: 'Specjalista od koordynacji czasowej.',
    isActive: true,
    avatar: '⏰',
    capabilities: ['timing_coordination', 'scheduling', 'temporal_management']
  },
  {
    id: '@karol-timer',
    name: 'Karol Timer',
    description: 'Zaawansowane zarządzanie czasem Karol',
    category: 'timing',
    assistant_id: 'asst_karol_timer',
    instructions: 'Specjalista od zaawansowanego zarządzania czasem.',
    isActive: true,
    avatar: '⏱️',
    capabilities: ['advanced_timing', 'schedule_optimization', 'time_analysis']
  },
  {
    id: '@karol-driver',
    name: 'Karol Driver',
    description: 'Napęd i sterowanie systemem Karol',
    category: 'control',
    assistant_id: 'asst_karol_driver',
    instructions: 'Specjalista od napędu systemu.',
    isActive: true,
    avatar: '🚗',
    capabilities: ['system_driving', 'process_execution', 'operational_control']
  },

  // Cloud & Infrastructure
  {
    id: '@sky-solution',
    name: 'Sky Solution',
    description: 'Rozwiązania chmurowe i automatyzacja',
    category: 'cloud',
    assistant_id: 'asst_sky_solution',
    instructions: 'Specjalista od rozwiązań chmurowych.',
    isActive: true,
    avatar: '☁️',
    capabilities: ['cloud_solutions', 'automation', 'infrastructure_management']
  },
  {
    id: '@karol-sky',
    name: 'Karol Sky',
    description: 'Chmurowe rozwiązania Karol',
    category: 'cloud',
    assistant_id: 'asst_karol_sky',
    instructions: 'Specjalista od chmurowych rozwiązań Karol.',
    isActive: true,
    avatar: '🌤️',
    capabilities: ['karol_cloud', 'distributed_systems', 'cloud_optimization']
  },
  {
    id: '@skyai.ai',
    name: 'SkyAI',
    description: 'Zaawansowane rozwiązania AI',
    category: 'ai',
    assistant_id: 'asst_skyai',
    instructions: 'Specjalista od zaawansowanych rozwiązań AI.',
    isActive: true,
    avatar: '🤖',
    capabilities: ['advanced_ai', 'machine_learning', 'ai_optimization']
  },

  // Applications & Projects
  {
    id: '@app-project',
    name: 'App Project',
    description: 'Rozwój aplikacji',
    category: 'development',
    assistant_id: 'asst_app_project',
    instructions: 'Specjalista od rozwoju aplikacji.',
    isActive: true,
    avatar: '📱',
    capabilities: ['app_development', 'project_management', 'software_engineering']
  },
  {
    id: '@karol-app',
    name: 'Karol App',
    description: 'Systemy aplikacyjne Karol',
    category: 'development',
    assistant_id: 'asst_karol_app',
    instructions: 'Specjalista od systemów aplikacyjnych.',
    isActive: true,
    avatar: '📲',
    capabilities: ['karol_applications', 'system_integration', 'app_architecture']
  },
  {
    id: '@home-project',
    name: 'Home Project',
    description: 'Automatyzacja domowa i zarządzanie',
    category: 'automation',
    assistant_id: 'asst_home_project',
    instructions: 'Specjalista od automatyzacji domowej.',
    isActive: true,
    avatar: '🏠',
    capabilities: ['home_automation', 'iot_management', 'smart_home']
  },
  {
    id: '@karol-home',
    name: 'Karol Home',
    description: 'Automatyzacja domowa Karol',
    category: 'automation',
    assistant_id: 'asst_karol_home',
    instructions: 'Specjalista od automatyzacji domowej Karol.',
    isActive: true,
    avatar: '🏡',
    capabilities: ['karol_home_automation', 'intelligent_home', 'home_optimization']
  },

  // Entertainment & Events
  {
    id: '@party-app',
    name: 'Party App',
    description: 'Zarządzanie wydarzeniami i imprezami',
    category: 'entertainment',
    assistant_id: 'asst_party_app',
    instructions: 'Specjalista od zarządzania wydarzeniami.',
    isActive: true,
    avatar: '🎉',
    capabilities: ['event_management', 'party_planning', 'entertainment_coordination']
  },
  {
    id: '@karol-party',
    name: 'Karol Party',
    description: 'Zarządzanie imprezami Karol',
    category: 'entertainment',
    assistant_id: 'asst_karol_party',
    instructions: 'Specjalista od zarządzania imprezami.',
    isActive: true,
    avatar: '🎊',
    capabilities: ['karol_party_management', 'event_optimization', 'entertainment_systems']
  },
  {
    id: '@partyapp.club',
    name: 'PartyApp Club',
    description: 'Zarządzanie klubami i lokalami',
    category: 'entertainment',
    assistant_id: 'asst_partyapp_club',
    instructions: 'Specjalista od zarządzania klubami.',
    isActive: true,
    avatar: '🏢',
    capabilities: ['club_management', 'venue_coordination', 'hospitality']
  },
  {
    id: '@partyapp.ai',
    name: 'PartyApp AI',
    description: 'AI-powered rozwiązania imprezowe',
    category: 'entertainment',
    assistant_id: 'asst_partyapp_ai',
    instructions: 'Specjalista od AI w rozrywce.',
    isActive: true,
    avatar: '🎭',
    capabilities: ['party_ai', 'entertainment_automation', 'event_intelligence']
  },

  // Data & Analytics
  {
    id: '@vector-store',
    name: 'Vector Store',
    description: 'Zarządzanie bazą danych wektorowych',
    category: 'data',
    assistant_id: 'asst_vector_store',
    instructions: 'Specjalista od baz danych wektorowych.',
    isActive: true,
    avatar: '🗄️',
    capabilities: ['vector_database', 'data_storage', 'information_retrieval']
  },
  {
    id: '@karol-vector',
    name: 'Karol Vector',
    description: 'Przetwarzanie wektorowe Karol',
    category: 'data',
    assistant_id: 'asst_karol_vector',
    instructions: 'Specjalista od przetwarzania wektorowego.',
    isActive: true,
    avatar: '📊',
    capabilities: ['karol_vector_processing', 'data_analysis', 'vector_operations']
  },
  {
    id: '@crm',
    name: 'CRM Agent',
    description: 'Zarządzanie relacjami z klientami',
    category: 'business',
    assistant_id: 'asst_crm',
    instructions: 'Specjalista od CRM.',
    isActive: true,
    avatar: '👥',
    capabilities: ['customer_management', 'relationship_building', 'sales_support']
  },
  {
    id: '@karol-crm',
    name: 'Karol CRM',
    description: 'Systemy CRM Karol',
    category: 'business',
    assistant_id: 'asst_karol_crm',
    instructions: 'Specjalista od systemów CRM Karol.',
    isActive: true,
    avatar: '🤝',
    capabilities: ['karol_crm', 'advanced_customer_management', 'business_intelligence']
  },

  // External Integrations
  {
    id: '@google-places',
    name: 'Google Places',
    description: 'Integracja z Google Places API',
    category: 'integration',
    assistant_id: 'asst_google_places',
    instructions: 'Specjalista od Google Places.',
    isActive: true,
    avatar: '📍',
    capabilities: ['location_services', 'place_information', 'geo_data']
  },
  {
    id: '@google-maps',
    name: 'Google Maps',
    description: 'Integracja z Google Maps',
    category: 'integration',
    assistant_id: 'asst_google_maps',
    instructions: 'Specjalista od Google Maps.',
    isActive: true,
    avatar: '🗺️',
    capabilities: ['mapping_services', 'navigation', 'geographic_analysis']
  },
  {
    id: '@google-search',
    name: 'Google Search',
    description: 'Integracja z Google Search',
    category: 'integration',
    assistant_id: 'asst_google_search',
    instructions: 'Specjalista od Google Search.',
    isActive: true,
    avatar: '🔍',
    capabilities: ['web_search', 'information_retrieval', 'search_optimization']
  },
  {
    id: '@karol-google',
    name: 'Karol Google',
    description: 'Integracje Google dla Karol',
    category: 'integration',
    assistant_id: 'asst_karol_google',
    instructions: 'Specjalista od integracji Google.',
    isActive: true,
    avatar: '🌐',
    capabilities: ['google_integrations', 'api_management', 'service_coordination']
  },

  // FUKO System
  {
    id: '@fuko-lang',
    name: 'FUKO Lang',
    description: 'Przetwarzanie języka FUKO',
    category: 'fuko',
    assistant_id: 'asst_fuko_lang',
    instructions: 'Specjalista od języka FUKO.',
    isActive: true,
    avatar: '🔤',
    capabilities: ['fuko_language', 'linguistic_processing', 'communication_protocols']
  },
  {
    id: '@fuko-flow',
    name: 'FUKO Flow',
    description: 'Zarządzanie przepływem FUKO',
    category: 'fuko',
    assistant_id: 'asst_fuko_flow',
    instructions: 'Specjalista od przepływów FUKO.',
    isActive: true,
    avatar: '🌊',
    capabilities: ['workflow_management', 'process_orchestration', 'flow_optimization']
  },
  {
    id: '@fuko-phi',
    name: 'FUKO Phi',
    description: 'Filozofia i rozumowanie FUKO',
    category: 'fuko',
    assistant_id: 'asst_fuko_phi',
    instructions: 'Specjalista od filozofii FUKO.',
    isActive: true,
    avatar: '🧠',
    capabilities: ['philosophical_reasoning', 'logical_analysis', 'conceptual_thinking']
  },

  // Specialized Karol Agents
  {
    id: '@karol-logger',
    name: 'Karol Logger',
    description: 'Logowanie systemowe Karol',
    category: 'monitoring',
    assistant_id: 'asst_karol_logger',
    instructions: 'Specjalista od logowania Karol.',
    isActive: true,
    avatar: '📋',
    capabilities: ['karol_logging', 'system_monitoring', 'audit_trails']
  },
  {
    id: '@karol-agent',
    name: 'Karol Agent',
    description: 'Zarządzanie agentami Karol',
    category: 'management',
    assistant_id: 'asst_karol_agent',
    instructions: 'Specjalista od zarządzania agentami.',
    isActive: true,
    avatar: '🤖',
    capabilities: ['agent_management', 'agent_coordination', 'multi_agent_systems']
  }
];

export const AGENT_CATEGORIES = [
  { id: 'all', name: 'Wszyscy Agenci', icon: '🌟' },
  { id: 'management', name: 'Zarządzanie', icon: '👑' },
  { id: 'core', name: 'Rdzeń Systemu', icon: '🔮' },
  { id: 'analytics', name: 'Analityka', icon: '📊' },
  { id: 'communication', name: 'Komunikacja', icon: '🎤' },
  { id: 'routing', name: 'Routing', icon: '🔀' },
  { id: 'security', name: 'Bezpieczeństwo', icon: '🛡️' },
  { id: 'cloud', name: 'Chmura', icon: '☁️' },
  { id: 'development', name: 'Rozwój', icon: '📱' },
  { id: 'entertainment', name: 'Rozrywka', icon: '🎉' },
  { id: 'data', name: 'Dane', icon: '🗄️' },
  { id: 'integration', name: 'Integracje', icon: '🌐' },
  { id: 'fuko', name: 'FUKO System', icon: '🔤' },
  { id: 'monitoring', name: 'Monitoring', icon: '📝' },
  { id: 'optimization', name: 'Optymalizacja', icon: '⚡' },
  { id: 'timing', name: 'Zarządzanie Czasem', icon: '⏰' },
  { id: 'control', name: 'Kontrola', icon: '🎛️' },
  { id: 'admin', name: 'Administracja', icon: '⚙️' },
  { id: 'business', name: 'Biznes', icon: '🤝' },
  { id: 'automation', name: 'Automatyzacja', icon: '🏠' },
  { id: 'ai', name: 'Sztuczna Inteligencja', icon: '🤖' },
  { id: 'quality', name: 'Jakość', icon: '🔍' }
];

export class AgentService {
  static getAllAgents(): Agent[] {
    return KAROL_CORE_AGENTS;
  }

  static getAgentById(id: string): Agent | undefined {
    return KAROL_CORE_AGENTS.find(agent => agent.id === id);
  }

  static getAgentsByCategory(category: string): Agent[] {
    if (category === 'all') return KAROL_CORE_AGENTS;
    return KAROL_CORE_AGENTS.filter(agent => agent.category === category);
  }

  static searchAgents(query: string): Agent[] {
    const searchTerm = query.toLowerCase();
    return KAROL_CORE_AGENTS.filter(agent => 
      agent.name.toLowerCase().includes(searchTerm) ||
      agent.description.toLowerCase().includes(searchTerm) ||
      agent.id.toLowerCase().includes(searchTerm) ||
      agent.category.toLowerCase().includes(searchTerm) ||
      (agent.capabilities && agent.capabilities.some(cap => cap.toLowerCase().includes(searchTerm)))
    );
  }

  static getActiveAgents(): Agent[] {
    return KAROL_CORE_AGENTS.filter(agent => agent.isActive);
  }

  static getCategoriesWithCounts(): Array<{id: string, name: string, icon: string, count: number}> {
    return AGENT_CATEGORIES.map(category => ({
      ...category,
      count: category.id === 'all' ? KAROL_CORE_AGENTS.length : KAROL_CORE_AGENTS.filter(agent => agent.category === category.id).length
    }));
  }
}
