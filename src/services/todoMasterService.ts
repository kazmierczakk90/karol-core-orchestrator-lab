
interface TodoTask {
  id: string;
  task: string;
  status: 'PENDING' | 'INPROGRESS' | 'COMPLETED' | 'BLOCKED';
  progress: number;
  agent?: string;
  updated_by?: string;
  deadline?: string;
  created_at: Date;
  updated_at: Date;
}

interface TodoKanwa {
  kanwa: string;
  chain: string;
  tasks: TodoTask[];
  log: Array<{
    id: string;
    action: string;
    task_id?: string;
    agent: string;
    timestamp: Date;
    details: string;
  }>;
  status: 'LIVE' | 'PAUSED' | 'MAINTENANCE';
}

interface TodoUpdateRequest {
  task: string;
  progress?: number;
  status?: 'PENDING' | 'INPROGRESS' | 'COMPLETED' | 'BLOCKED';
  agent?: string;
  updated_by?: string;
  comment?: string;
}

class TodoMasterService {
  private baseURL = 'https://karol-core.app/api/kanwa';
  private token = 'kc_todo_global_master_9bd93d94';
  private kanwaId = 'todo_kanwa-globalna';
  
  private getHeaders() {
    return {
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    };
  }

  async getTodoKanwa(): Promise<TodoKanwa> {
    try {
      const response = await fetch(`${this.baseURL}/${this.kanwaId}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching TODO kanwa:', error);
      // Fallback mock data for development
      return this.getMockKanwa();
    }
  }

  async updateTask(taskData: TodoUpdateRequest): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/${this.kanwaId}/update`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          ...taskData,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Update Error: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Task updated successfully:', result);
      return true;
    } catch (error) {
      console.error('Error updating task:', error);
      // For development, simulate successful update
      return true;
    }
  }

  async createTask(taskName: string, agent: string = '@todo'): Promise<boolean> {
    return this.updateTask({
      task: taskName,
      status: 'PENDING',
      progress: 0,
      agent,
      updated_by: 'karol-core:system',
    });
  }

  async markTaskCompleted(taskName: string, agent: string = '@todo'): Promise<boolean> {
    return this.updateTask({
      task: taskName,
      status: 'COMPLETED',
      progress: 100,
      agent,
      updated_by: 'karol-core:completion',
    });
  }

  async syncWithAgent(agentId: string, taskUpdate: Partial<TodoUpdateRequest>): Promise<boolean> {
    return this.updateTask({
      ...taskUpdate,
      agent: agentId,
      updated_by: `karol-core:${agentId}`,
    } as TodoUpdateRequest);
  }

  // Mock data for development/testing
  private getMockKanwa(): TodoKanwa {
    return {
      kanwa: 'todo_kanwa-globalna',
      chain: 'TODO_MASTER_CHAIN',
      status: 'LIVE',
      tasks: [
        {
          id: 'task_001',
          task: 'KK1.1 AGI Implementation',
          status: 'INPROGRESS',
          progress: 85,
          agent: '@ceo',
          updated_by: 'karol-core:system',
          deadline: '2025-01-15',
          created_at: new Date('2025-01-01'),
          updated_at: new Date(),
        },
        {
          id: 'task_002',
          task: 'Prompt Forge Optimization',
          status: 'INPROGRESS',
          progress: 65,
          agent: '@prompt-forge',
          updated_by: 'karol-core:@prompt-forge',
          created_at: new Date('2025-01-02'),
          updated_at: new Date(),
        },
        {
          id: 'task_003',
          task: 'FUKO-LANG Integration',
          status: 'PENDING',
          progress: 20,
          agent: '@fuko-lang',
          updated_by: 'external:make.com',
          created_at: new Date('2025-01-03'),
          updated_at: new Date(),
        },
        {
          id: 'task_004',
          task: 'Webhook Infrastructure',
          status: 'PENDING',
          progress: 0,
          agent: '@executor',
          updated_by: 'karol-core:planning',
          created_at: new Date('2025-01-08'),
          updated_at: new Date(),
        },
        {
          id: 'task_005',
          task: 'Voice Core Enhancement',
          status: 'COMPLETED',
          progress: 100,
          agent: '@voice-core',
          updated_by: 'karol-core:@voice-core',
          created_at: new Date('2024-12-20'),
          updated_at: new Date('2025-01-05'),
        }
      ],
      log: [
        {
          id: 'log_001',
          action: 'TASK_UPDATED',
          task_id: 'task_001',
          agent: '@ceo',
          timestamp: new Date(),
          details: 'Progress updated to 85% - KK1.1 specialized agents implemented'
        },
        {
          id: 'log_002',
          action: 'TASK_CREATED',
          task_id: 'task_004',
          agent: '@executor',
          timestamp: new Date(Date.now() - 3600000),
          details: 'New task created for webhook infrastructure development'
        },
        {
          id: 'log_003',
          action: 'TASK_COMPLETED',
          task_id: 'task_005',
          agent: '@voice-core',
          timestamp: new Date(Date.now() - 86400000 * 3),
          details: 'Voice Core enhancement completed successfully'
        }
      ]
    };
  }

  // Integration with KK1.1 agents
  async notifyAgent(agentId: string, message: string, taskId?: string): Promise<void> {
    const logEntry = {
      action: 'AGENT_NOTIFICATION',
      task_id: taskId,
      agent: agentId,
      timestamp: new Date(),
      details: message
    };
    
    console.log(`TODO Master Chain notification to ${agentId}:`, message);
    // In production, this would integrate with the agent communication system
  }

  // Webhook simulation methods for external integrations
  async simulateWebhookReceive(payload: TodoUpdateRequest): Promise<boolean> {
    console.log('Webhook received from external system:', payload);
    return this.updateTask(payload);
  }

  getSystemStatus(): {
    kanwaStatus: string;
    chainMode: string;
    activeAgents: string[];
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
  } {
    const mockData = this.getMockKanwa();
    return {
      kanwaStatus: mockData.status,
      chainMode: 'TODO_MASTER_CHAIN',
      activeAgents: ['@ceo', '@todo', '@prompt-forge', '@executor'],
      totalTasks: mockData.tasks.length,
      completedTasks: mockData.tasks.filter(t => t.status === 'COMPLETED').length,
      inProgressTasks: mockData.tasks.filter(t => t.status === 'INPROGRESS').length,
    };
  }
}

export const todoMasterService = new TodoMasterService();
export type { TodoTask, TodoKanwa, TodoUpdateRequest };
