
export type ConnectionType = 'api' | 'database' | 'service' | 'webhook' | 'integration';
export type ConnectionStatus = 'connected' | 'disconnected' | 'error' | 'testing';

export interface SystemConnection {
  id: string;
  name: string;
  type: ConnectionType;
  status: ConnectionStatus;
  endpoint: string;
  lastPing: Date;
  responseTime: number;
  uptime: number;
  requests: number;
  errors: number;
  description: string;
}
