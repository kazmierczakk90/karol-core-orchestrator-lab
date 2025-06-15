
export type ConnectionType = 'api' | 'database' | 'service' | 'webhook' | 'integration';
export type ConnectionStatus = 'connected' | 'disconnected' | 'error' | 'testing';

export interface SystemConnection {
  id: string;
  name: string;
  description: string | null;
  type: ConnectionType;
  status: ConnectionStatus;
  endpoint: string;
  last_ping: string;
  response_time: number;
  uptime: number;
  requests: number;
  errors: number;
  created_at: string;
}
