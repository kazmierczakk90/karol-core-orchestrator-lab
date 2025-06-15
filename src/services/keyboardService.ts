import { fukoService } from './fukoService';
import { voiceService } from './voiceService';

export class KeyboardService {
  private keyMap: Map<string, () => void> = new Map();
  private isListening = false;

  constructor() {
    this.initializeKeyBindings();
    this.setupEventListeners();
  }

  private initializeKeyBindings() {
    // FUKO Command Keys (F1-F12)
    this.keyMap.set('F1', () => this.executeQuickAction('style-shift'));
    this.keyMap.set('F2', () => this.executeQuickAction('activate-agent'));
    this.keyMap.set('F3', () => this.executeQuickAction('freeze-evolution'));
    this.keyMap.set('F4', () => this.executeQuickAction('emergency-stop'));
    this.keyMap.set('F5', () => this.refreshAllSystems());
    this.keyMap.set('F6', () => this.toggleVoiceMode());
    this.keyMap.set('F7', () => this.switchToNextAgent());
    this.keyMap.set('F8', () => this.optimizeSystem());
    this.keyMap.set('F9', () => this.generateReport());
    this.keyMap.set('F10', () => this.backupSystem());
    this.keyMap.set('F11', () => this.enterMaintenanceMode());
    this.keyMap.set('F12', () => this.showSystemStatus());

    // Agent Control Keys (Ctrl + Number)
    this.keyMap.set('Ctrl+1', () => this.activateAgent('@ceo'));
    this.keyMap.set('Ctrl+2', () => this.activateAgent('@voice-core'));
    this.keyMap.set('Ctrl+3', () => this.activateAgent('@guardian-core'));
    this.keyMap.set('Ctrl+4', () => this.activateAgent('@router'));
    this.keyMap.set('Ctrl+5', () => this.activateAgent('@controlling'));

    // System Commands (Alt + Letter)
    this.keyMap.set('Alt+s', () => this.executeSystemScan());
    this.keyMap.set('Alt+a', () => this.analyzePerformance());
    this.keyMap.set('Alt+r', () => this.resetAgent());
    this.keyMap.set('Alt+m', () => this.toggleMicrophone());
    this.keyMap.set('Alt+v', () => this.adjustVolume());

    // Emergency Commands (Ctrl+Shift+Key)
    this.keyMap.set('Ctrl+Shift+E', () => this.emergencyShutdown());
    this.keyMap.set('Ctrl+Shift+R', () => this.forceRestart());
    this.keyMap.set('Ctrl+Shift+S', () => this.saveCurrentState());
  }

  private setupEventListeners() {
    document.addEventListener('keydown', (event) => {
      const key = this.getKeyString(event);
      const action = this.keyMap.get(key);
      
      if (action) {
        event.preventDefault();
        action();
        console.log(`Executed command: ${key}`);
      }
    });
  }

  private getKeyString(event: KeyboardEvent): string {
    const parts = [];
    if (event.ctrlKey) parts.push('Ctrl');
    if (event.shiftKey) parts.push('Shift');
    if (event.altKey) parts.push('Alt');
    parts.push(event.key);
    return parts.join('+');
  }

  // Implementacja funkcji systemowych
  private async executeQuickAction(action: string) {
    console.log(`Executing quick action: ${action}`);
    switch (action) {
      case 'style-shift':
        await fukoService.createFukoMessage({
          F: 'modify_decision_style',
          U: 'Keyboard shortcut F1 triggered style modification',
          K: 'user_keyboard_input',
          O: 'Apply new decision parameters',
          P: 'F1_key_pressed',
          Z: 'style_engine',
          K2: '&style-shift',
          source_agent: '@karol-core',
          priority: 'high'
        });
        this.showNotification('Style Shift Activated', 'Decision style is being modified');
        break;
      case 'activate-agent':
        await this.activateRandomDormantAgent();
        break;
      case 'freeze-evolution':
        await fukoService.createFukoMessage({
          F: 'freeze_evolution_process',
          U: 'Emergency evolution freeze via F3',
          K: 'evolution_state_monitoring',
          O: 'Lock current configuration',
          P: 'F3_emergency_key',
          Z: 'evolution_control',
          K2: '&freeze-evolution',
          source_agent: '@guardian-core',
          priority: 'urgent'
        });
        this.showNotification('Evolution Frozen', 'System evolution locked');
        break;
      case 'emergency-stop':
        await this.emergencyShutdown();
        break;
    }
  }

  private async refreshAllSystems() {
    console.log('Refreshing all systems (F5)');
    await fukoService.createFukoMessage({
      F: 'refresh_all_systems',
      U: 'Manual system refresh requested',
      K: 'system_maintenance',
      O: 'Update all agent states and KPIs',
      P: 'F5_refresh_key',
      Z: 'monitoring_systems',
      K2: '/system_refresh',
      source_agent: '@system-admin',
      priority: 'medium'
    });
    this.showNotification('System Refresh', 'All systems refreshed');
    window.location.reload();
  }

  private toggleVoiceMode() {
    console.log('Toggling voice mode (F6)');
    if (voiceService.getIsListening()) {
      voiceService.stopListening();
      this.showNotification('Voice Mode OFF', 'Microphone deactivated');
    } else {
      this.startVoiceListening();
    }
  }

  private async startVoiceListening() {
    const hasAccess = await voiceService.requestMicrophoneAccess();
    if (hasAccess) {
      voiceService.startListening(
        (text, isFinal) => {
          if (isFinal) {
            this.processVoiceCommand(text);
          }
        },
        (error) => {
          this.showNotification('Voice Error', error);
        }
      );
      this.showNotification('Voice Mode ON', 'Listening for commands...');
    } else {
      this.showNotification('Microphone Access Denied', 'Cannot activate voice mode');
    }
  }

  private processVoiceCommand(command: string) {
    console.log(`Voice command: ${command}`);
    const lowercaseCommand = command.toLowerCase();
    
    if (lowercaseCommand.includes('aktywuj agenta')) {
      this.activateRandomDormantAgent();
    } else if (lowercaseCommand.includes('zmień styl')) {
      this.executeQuickAction('style-shift');
    } else if (lowercaseCommand.includes('stop awaryjny')) {
      this.emergencyShutdown();
    } else if (lowercaseCommand.includes('status systemu')) {
      this.showSystemStatus();
    } else {
      fukoService.createFukoMessage({
        F: 'process_voice_command',
        U: `Voice command received: ${command}`,
        K: 'voice_input_processing',
        O: 'Execute appropriate action',
        P: 'voice_command_detected',
        Z: 'voice_core',
        K2: `/voice_process "${command}"`,
        source_agent: '@voice-core',
        priority: 'medium'
      });
    }
  }

  private async switchToNextAgent() {
    console.log('Switching to next agent (F7)');
    const agents = await fukoService.getAgents();
    const activeAgents = agents.filter(a => a.status === 'active');
    if (activeAgents.length > 0) {
      const randomAgent = activeAgents[Math.floor(Math.random() * activeAgents.length)];
      this.showNotification('Agent Switch', `Switched to ${randomAgent.name}`);
      voiceService.speak(`Przełączono na agenta ${randomAgent.name}`);
    }
  }

  private async optimizeSystem() {
    console.log('Optimizing system (F8)');
    await fukoService.createFukoMessage({
      F: 'optimize_system_performance',
      U: 'Manual optimization triggered via F8',
      K: 'performance_optimization',
      O: 'Improve overall system efficiency',
      P: 'F8_optimize_key',
      Z: 'optimization_engine',
      K2: '/system_optimize',
      source_agent: '@system-optimizer',
      priority: 'high'
    });
    this.showNotification('System Optimization', 'Performance optimization started');
  }

  private async generateReport() {
    console.log('Generating report (F9)');
    const agents = await fukoService.getAgents();
    const messages = await fukoService.getMessages();
    
    const report = {
      timestamp: new Date().toISOString(),
      activeAgents: agents.filter(a => a.status === 'active').length,
      totalMessages: messages.length,
      avgPerformance: agents.length > 0 ? agents.reduce((sum, a) => sum + a.performance, 0) / agents.length : 0,
    };
    
    console.log('System Report:', report);
    this.showNotification('Report Generated', 'System report available in console');
  }

  private async backupSystem() {
    console.log('Creating system backup (F10)');
    const backup = {
      timestamp: new Date().toISOString(),
      agents: await fukoService.getAgents(),
      messages: await fukoService.getMessages(),
    };
    
    localStorage.setItem('karol-core-backup', JSON.stringify(backup));
    this.showNotification('Backup Created', 'System state saved to local storage');
  }

  private async enterMaintenanceMode() {
    console.log('Entering maintenance mode (F11)');
    await fukoService.createFukoMessage({
      F: 'enter_maintenance_mode',
      U: 'Maintenance mode activated via F11',
      K: 'system_maintenance',
      O: 'Prepare system for maintenance operations',
      P: 'F11_maintenance_key',
      Z: 'maintenance_systems',
      K2: '/maintenance_mode_on',
      source_agent: '@guardian-core',
      priority: 'urgent'
    });
    this.showNotification('Maintenance Mode', 'System entering maintenance mode');
  }

  private async showSystemStatus() {
    console.log('Showing system status (F12)');
    const agents = await fukoService.getAgents();
    const activeCount = agents.filter(a => a.status === 'active').length;
    const avgPerformance = agents.length > 0 ? agents.reduce((sum, a) => sum + a.performance, 0) / agents.length : 0;
    
    this.showNotification('System Status', `Active: ${activeCount}/${agents.length}, Avg Performance: ${avgPerformance.toFixed(1)}%`);
    voiceService.speak(`System aktywny. ${activeCount} agentów online. Wydajność ${avgPerformance.toFixed(0)} procent.`);
  }

  private async activateAgent(agentName: string) {
    console.log(`Activating agent: ${agentName}`);
    const success = await fukoService.updateAgentStatusByName(agentName, 'active');
    if (success) {
      this.showNotification('Agent Activated', `${agentName} is now active`);
      voiceService.speak(`Agent ${agentName} aktywowany`);
    } else {
      this.showNotification('Activation Failed', `Could not activate ${agentName}`);
    }
  }

  private async activateRandomDormantAgent() {
    const agents = await fukoService.getAgents();
    const dormantAgents = agents.filter(a => a.status === 'dormant');
    if (dormantAgents.length > 0) {
      const randomAgent = dormantAgents[Math.floor(Math.random() * dormantAgents.length)];
      await this.activateAgent(randomAgent.name);
    } else {
      this.showNotification('No Dormant Agents', 'All agents are already active');
    }
  }

  private async executeSystemScan() {
    console.log('Executing system scan (Alt+S)');
    await fukoService.createFukoMessage({
        F: 'system_scan',
        U: 'Manual system scan triggered',
        K: 'system_health_check',
        O: 'Verify system integrity and performance',
        P: 'Alt+S_scan_key',
        Z: 'monitoring_systems',
        K2: '/system_scan',
        source_agent: '@system-admin',
        priority: 'medium'
    });
    this.showNotification('System Scan', 'Full system scan initiated');
  }

  private async analyzePerformance() {
    console.log('Analyzing performance (Alt+A)');
    const agents = await fukoService.getAgents();
    const lowPerformanceAgents = agents.filter(a => a.performance < 70);
    
    if (lowPerformanceAgents.length > 0) {
      this.showNotification('Performance Alert', `${lowPerformanceAgents.length} agents need optimization`);
    } else {
      this.showNotification('Performance OK', 'All agents performing well');
    }
  }

  private async resetAgent() {
    console.log('Resetting agent (Alt+R)');
    const agents = await fukoService.getAgents();
    const activeAgents = agents.filter(a => a.status === 'active');
    if (activeAgents.length > 0) {
      const agent = activeAgents[Math.floor(Math.random() * activeAgents.length)];
      await fukoService.updateAgentStatus(agent.id, 'dormant');
      setTimeout(async () => await fukoService.updateAgentStatus(agent.id, 'active'), 1000);
      this.showNotification('Agent Reset', `${agent.name} restarted`);
    }
  }

  private toggleMicrophone() {
    console.log('Toggling microphone (Alt+M)');
    this.toggleVoiceMode();
  }

  private adjustVolume() {
    console.log('Adjusting volume (Alt+V)');
    // Cycle through volume levels: 0.3, 0.6, 1.0
    const currentVolume = parseFloat(localStorage.getItem('karol-core-volume') || '1.0');
    const newVolume = currentVolume >= 1.0 ? 0.3 : currentVolume + 0.3;
    localStorage.setItem('karol-core-volume', newVolume.toString());
    this.showNotification('Volume Adjusted', `Volume set to ${Math.round(newVolume * 100)}%`);
  }

  private async emergencyShutdown() {
    console.log('Emergency shutdown initiated');
    await fukoService.createFukoMessage({
      F: 'emergency_system_halt',
      U: 'Emergency shutdown via keyboard shortcut',
      K: 'emergency_protocols',
      O: 'Safe system shutdown',
      P: 'emergency_key_combination',
      Z: 'safety_systems',
      K2: '/emergency_stop',
      source_agent: '@guardian-core',
      priority: 'urgent'
    });
    this.showNotification('EMERGENCY SHUTDOWN', 'System shutting down safely');
    voiceService.speak('Awaryjne wyłączenie systemu');
    
    const agents = await fukoService.getAgents();
    for (const agent of agents) {
      await fukoService.updateAgentStatus(agent.id, 'dormant');
    }
  }

  private forceRestart() {
    console.log('Force restart initiated');
    this.showNotification('Force Restart', 'System restarting...');
    setTimeout(() => window.location.reload(), 2000);
  }

  private async saveCurrentState() {
    console.log('Saving current state');
    await this.backupSystem();
  }

  private showNotification(title: string, message: string) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-blue-600 text-white p-4 rounded-lg shadow-lg z-50 max-w-sm';
    notification.innerHTML = `
      <div class="font-bold">${title}</div>
      <div class="text-sm">${message}</div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 3000);
  }

  // Public methods
  getKeyBindings(): Array<{key: string, description: string, category: string}> {
    return [
      // FUKO Commands
      {key: 'F1', description: 'Style Shift', category: 'FUKO Commands'},
      {key: 'F2', description: 'Activate Agent', category: 'FUKO Commands'},
      {key: 'F3', description: 'Freeze Evolution', category: 'FUKO Commands'},
      {key: 'F4', description: 'Emergency Stop', category: 'FUKO Commands'},
      {key: 'F5', description: 'Refresh Systems', category: 'FUKO Commands'},
      {key: 'F6', description: 'Toggle Voice Mode', category: 'FUKO Commands'},
      {key: 'F7', description: 'Switch Agent', category: 'FUKO Commands'},
      {key: 'F8', description: 'Optimize System', category: 'FUKO Commands'},
      {key: 'F9', description: 'Generate Report', category: 'FUKO Commands'},
      {key: 'F10', description: 'Backup System', category: 'FUKO Commands'},
      {key: 'F11', description: 'Maintenance Mode', category: 'FUKO Commands'},
      {key: 'F12', description: 'System Status', category: 'FUKO Commands'},
      
      // Agent Control
      {key: 'Ctrl+1', description: 'Activate CEO', category: 'Agent Control'},
      {key: 'Ctrl+2', description: 'Activate Voice Core', category: 'Agent Control'},
      {key: 'Ctrl+3', description: 'Activate Guardian', category: 'Agent Control'},
      {key: 'Ctrl+4', description: 'Activate Router', category: 'Agent Control'},
      {key: 'Ctrl+5', description: 'Activate Controlling', category: 'Agent Control'},
      
      // System Commands
      {key: 'Alt+S', description: 'System Scan', category: 'System Commands'},
      {key: 'Alt+A', description: 'Analyze Performance', category: 'System Commands'},
      {key: 'Alt+R', description: 'Reset Agent', category: 'System Commands'},
      {key: 'Alt+M', description: 'Toggle Microphone', category: 'System Commands'},
      {key: 'Alt+V', description: 'Adjust Volume', category: 'System Commands'},
      
      // Emergency
      {key: 'Ctrl+Shift+E', description: 'Emergency Shutdown', category: 'Emergency'},
      {key: 'Ctrl+Shift+R', description: 'Force Restart', category: 'Emergency'},
      {key: 'Ctrl+Shift+S', description: 'Save State', category: 'Emergency'}
    ];
  }
}

export const keyboardService = new KeyboardService();
