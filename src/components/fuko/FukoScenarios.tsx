
import { Button } from '@/components/ui/button';
import { useFuko, CreateFUKOMessageData } from '@/hooks/useFuko';

const FukoScenarios = () => {
  const { createFukoMessage } = useFuko();

  const executeScenario = (scenarioName: string) => {
    const scenarios: Record<string, CreateFUKOMessageData> = {
        'senior_health_check': { F: "Senior Health Check", U: "Monitor senior activity and health metrics", K2: "&senior-agent --check-vitals --user_id senior_001", K: "User is senior_001", O: "Vital signs checked", P: "Daily at 8am", Z: "senior-agent active", source_agent: "@ceo", priority: "high"},
        'lead_nurturing': { F: "Lead Nurturing", U: "Convert high-scoring leads to customers", K2: "&crm-agent --nurture-lead --lead_id lead_12345", K: "Lead score > 80", O: "Lead converted", P: "On score update", Z: "crm-agent active", source_agent: "@ceo", priority: "medium"},
        'system_optimization': { F: "System Optimization", U: "Optimize system performance and resources", K2: "&guardian-core --optimize-resources", K: "CPU Load > 85%", O: "CPU Load < 70%", P: "On high load alert", Z: "guardian-core active", source_agent: "@ceo", priority: "high"},
        'emergency_response': { F: "Emergency Response", U: "Handle critical system alerts", K2: "&guardian-core --emergency --alert_type system_critical", K: "Critical alert received", O: "System stabilized", P: "On critical alert", Z: "guardian-core active", source_agent: "@ceo", priority: "urgent"},
    };

    if (scenarios[scenarioName]) {
      createFukoMessage(scenarios[scenarioName]);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Button 
        onClick={() => executeScenario('senior_health_check')}
        className="bg-green-600 hover:bg-green-700 h-auto p-4"
      >
        <div className="text-left">
          <p className="font-semibold">Senior Health Check</p>
          <p className="text-sm opacity-80">Monitor senior activity and health metrics</p>
        </div>
      </Button>
      <Button 
        onClick={() => executeScenario('lead_nurturing')}
        className="bg-blue-600 hover:bg-blue-700 h-auto p-4"
      >
        <div className="text-left">
          <p className="font-semibold">Lead Nurturing</p>
          <p className="text-sm opacity-80">Convert high-scoring leads to customers</p>
        </div>
      </Button>
      <Button 
        onClick={() => executeScenario('system_optimization')}
        className="bg-purple-600 hover:bg-purple-700 h-auto p-4"
      >
        <div className="text-left">
          <p className="font-semibold">System Optimization</p>
          <p className="text-sm opacity-80">Optimize system performance and resources</p>
        </div>
      </Button>
      <Button 
        onClick={() => executeScenario('emergency_response')}
        className="bg-red-600 hover:bg-red-700 h-auto p-4"
      >
        <div className="text-left">
          <p className="font-semibold">Emergency Response</p>
          <p className="text-sm opacity-80">Handle critical system alerts</p>
        </div>
      </Button>
    </div>
  );
};

export default FukoScenarios;
