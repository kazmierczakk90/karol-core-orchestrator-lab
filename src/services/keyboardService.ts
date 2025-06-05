
import { fukoCore } from './fukoCore';
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
  private executeQuickAction(action: string) {
    console.log(`Executing quick action: ${action}`);
    switch (action) {
      case 'style-shift':
        fukoCore.createFUKOMessage(
          'modify_decision_style',
          'Keyboard shortcut F1 triggered style modification',
          'user_keyboard_input',
          'Apply new decision parameters',
          'F1_key_pressed',
          'style_engine',
          '&style-shift',
          '@karol-core',
          'high'
        );
        this.showNotification('Style Shift Activated', 'Decision style is being modified');
        break;
      case 'activate-agent':
        this.activateRandomDormantAgent();
        break;
      case 'freeze-evolution':
        fukoCore.createFUKOMessage(
          'freeze_evolution_process',
          'Emergency evolution freeze via F3',
          'evolution_state_monitoring',
          'Lock current configuration',
          'F3_emergency_key',
          'evolution_control',
          '&freeze-evolution',
          '@guardian-core',
          'urgent'
        );
        this.showNotification('Evolution Frozen', 'System evolution locked');
        break;
      case 'emergency-stop':
        this.emergencyShutdown();
        break;
    }
  }

  private refreshAllSystems() {
    console.log('Refreshing all systems (F5)');
    fukoCore.createFUKOMessage(
      'refresh_all_systems',
      'Manual system refresh requested',
      'system_maintenance',
      'Update all agent states and KPIs',
      'F5_refresh_key',
      'monitoring_systems',
      '/system_refresh',
      '@system-admin',
      'medium'
    );
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
      fukoCore.createFUKOMessage(
        'process_voice_command',
        `Voice command received: ${command}`,
        'voice_input_processing',
        'Execute appropriate action',
        'voice_command_detected',
        'voice_core',
        `/voice_process "${command}"`,
        '@voice-core',
        'medium'
      );
    }
  }

  private switchToNextAgent() {
    console.log('Switching to next agent (F7)');
    const agents = fukoCore.getAgents().filter(a => a.status === 'active');
    if (agents.length > 0) {
      const randomAgent = agents[Math.floor(Math.random() * agents.length)];
      this.showNotification('Agent Switch', `Switched to ${randomAgent.name}`);
      voiceService.speak(`Przełączono na agenta ${randomAgent.name}`);
    }
  }

  private optimizeSystem() {
    console.log('Optimizing system (F8)');
    fukoCore.createFUKOMessage(
      'optimize_system_performance',
      'Manual optimization triggered via F8',
      'performance_optimization',
      'Improve overall system efficiency',
      'F8_optimize_key',
      'optimization_engine',
      '/system_optimize',
      '@system-optimizer',
      'high'
    );
    this.showNotification('System Optimization', 'Performance optimization started');
  }

  private generateReport() {
    console.log('Generating report (F9)');
    const kpiData = fukoCore.getKPIData();
    const agents = fukoCore.getAgents();
    const messages = fukoCore.getMessages();
    
    const report = {
      timestamp: new Date().toISOString(),
      activeAgents: agents.filter(a => a.status === 'active').length,
      totalMessages: messages.length,
      avgPerformance: agents.reduce((sum, a) => sum + a.performance, 0) / agents.length,
      kpiSummary: Object.keys(kpiData).map(key => ({
        metric: key,
        value: kpiData[key].value,
        threshold: kpiData[key].threshold,
        status: kpiData[key].value >= kpiData[key].threshold ? 'OK' : 'ALERT'
      }))
    };
    
    console.log('System Report:', report);
    this.showNotification('Report Generated', 'System report available in console');
  }

  private backupSystem() {
    console.log('Creating system backup (F10)');
    const backup = {
      timestamp: new Date().toISOString(),
      agents: fukoCore.getAgents(),
      messages: fukoCore.getMessages(),
      kpiData: fukoCore.getKPIData()
    };
    
    localStorage.setItem('karol-core-backup', JSON.stringify(backup));
    this.showNotification('Backup Created', 'System state saved to local storage');
  }

  private enterMaintenanceMode() {
    console.log('Entering maintenance mode (F11)');
    fukoCore.createFUKOMessage(
      'enter_maintenance_mode',
      'Maintenance mode activated via F11',
      'system_maintenance',
      'Prepare system for maintenance operations',
      'F11_maintenance_key',
      'maintenance_systems',
      '/maintenance_mode_on',
      '@guardian-core',
      'urgent'
    );
    this.showNotification('Maintenance Mode', 'System entering maintenance mode');
  }

  private showSystemStatus() {
    console.log('Showing system status (F12)');
    const agents = fukoCore.getAgents();
    const activeCount = agents.filter(a => a.status === 'active').length;
    const avgPerformance = agents.reduce((sum, a) => sum + a.performance, 0) / agents.length;
    
    this.showNotification('System Status', `Active: ${activeCount}/${agents.length}, Avg Performance: ${avgPerformance.toFixed(1)}%`);
    voiceService.speak(`System aktywny. ${activeCount} agentów online. Wydajność ${avgPerformance.toFixed(0)} procent.`);
  }

  private activateAgent(agentId: string) {
    console.log(`Activating agent: ${agentId}`);
    const success = fukoCore.activateAgent(agentId);
    if (success) {
      this.showNotification('Agent Activated', `${agentId} is now active`);
      voiceService.speak(`Agent ${agentId} aktywowany`);
    } else {
      this.showNotification('Activation Failed', `Could not activate ${agentId}`);
    }
  }

  private activateRandomDormantAgent() {
    const dormantAgents = fukoCore.getAgents().filter(a => a.status === 'dormant');
    if (dormantAgents.length > 0) {
      const randomAgent = dormantAgents[Math.floor(Math.random() * dormantAgents.length)];
      this.activateAgent(randomAgent.id);
    } else {
      this.showNotification('No Dormant Agents', 'All agents are already active');
    }
  }

  private executeSystemScan() {
    console.log('Executing system scan (Alt+S)');
    fukoCore.checkKPIThresholds();
    this.showNotification('System Scan', 'Full system scan completed');
  }

  private analyzePerformance() {
    console.log('Analyzing performance (Alt+A)');
    const agents = fukoCore.getAgents();
    const lowPerformanceAgents = agents.filter(a => a.performance < 70);
    
    if (lowPerformanceAgents.length > 0) {
      this.showNotification('Performance Alert', `${lowPerformanceAgents.length} agents need optimization`);
    } else {
      this.showNotification('Performance OK', 'All agents performing well');
    }
  }

  private resetAgent() {
    console.log('Resetting agent (Alt+R)');
    // Reset random active agent
    const activeAgents = fukoCore.getAgents().filter(a => a.status === 'active');
    if (activeAgents.length > 0) {
      const agent = activeAgents[Math.floor(Math.random() * activeAgents.length)];
      fukoCore.deactivateAgent(agent.id);
      setTimeout(() => fukoCore.activateAgent(agent.id), 1000);
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

  private emergencyShutdown() {
    console.log('Emergency shutdown initiated');
    fukoCore.createFUKOMessage(
      'emergency_system_halt',
      'Emergency shutdown via keyboard shortcut',
      'emergency_protocols',
      'Safe system shutdown',
      'emergency_key_combination',
      'safety_systems',
      '/emergency_stop',
      '@guardian-core',
      'urgent'
    );
    this.showNotification('EMERGENCY SHUTDOWN', 'System shutting down safely');
    voiceService.speak('Awaryjne wyłączenie systemu');
    
    // Deactivate all agents
    fukoCore.getAgents().forEach(agent => {
      fukoCore.deactivateAgent(agent.id);
    });
  }

  private forceRestart() {
    console.log('Force restart initiated');
    this.showNotification('Force Restart', 'System restarting...');
    setTimeout(() => window.location.reload(), 2000);
  }

  private saveCurrentState() {
    console.log('Saving current state');
    this.backupSystem();
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
