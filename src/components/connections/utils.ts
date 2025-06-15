
import { ConnectionStatus, ConnectionType } from "@/types/system";

export const typeColors: Record<ConnectionType, string> = {
  api: 'bg-blue-500/20 text-blue-400',
  database: 'bg-green-500/20 text-green-400',
  service: 'bg-purple-500/20 text-purple-400',
  webhook: 'bg-orange-500/20 text-orange-400',
  integration: 'bg-cyan-500/20 text-cyan-400'
};

export const statusColors: Record<ConnectionStatus, string> = {
  connected: 'bg-green-500/20 text-green-400',
  disconnected: 'bg-gray-500/20 text-gray-400',
  error: 'bg-red-500/20 text-red-400',
  testing: 'bg-yellow-500/20 text-yellow-400'
};

export const getResponseTimeColor = (time: number) => {
  if (time === 0) return 'text-gray-400';
  if (time < 200) return 'text-green-400';
  if (time < 500) return 'text-yellow-400';
  return 'text-red-400';
};

export const getUptimeColor = (uptime: number) => {
  if (uptime >= 99) return 'text-green-400';
  if (uptime >= 95) return 'text-yellow-400';
  return 'text-red-400';
};
