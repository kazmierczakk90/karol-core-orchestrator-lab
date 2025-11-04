import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AgentVote {
  agent: string;
  vote: 'approve' | 'reject' | 'abstain';
  weight: number;
  reasoning: string;
  timestamp: string;
}

interface ImprovementDecision {
  id: string;
  pattern_id: string;
  action_type: string;
  action_description: string;
  implementation_plan: any;
  agent_votes: AgentVote[];
  total_vote_score: number;
  required_approval_score: number;
  risk_level: string;
  status: string;
}

class ImprovementDecisionService {
  // Multi-agent voting system
  async initiateVoting(patternId: string): Promise<string | null> {
    try {
      console.log('🗳️ Initiating multi-agent voting for pattern:', patternId);

      // Get pattern details
      const { data: pattern } = await supabase
        .from('improvement_patterns')
        .select('*')
        .eq('id', patternId)
        .single();

      if (!pattern) {
        throw new Error('Pattern not found');
      }

      // Define voting agents with their weights
      const votingAgents = [
        { agent: '@ceo', weight: 3, role: 'strategic_oversight' },
        { agent: '@optimizer', weight: 2, role: 'performance_expert' },
        { agent: '@security', weight: 2, role: 'security_expert' },
        { agent: '@architect', weight: 2, role: 'architecture_expert' }
      ];

      // Collect votes from each agent via AI
      const votes: AgentVote[] = [];
      
      for (const votingAgent of votingAgents) {
        const vote = await this.getAgentVote(
          votingAgent.agent,
          votingAgent.role,
          pattern,
          votingAgent.weight
        );
        votes.push(vote);
      }

      // Calculate total vote score
      const totalScore = votes.reduce((sum, vote) => {
        const multiplier = vote.vote === 'approve' ? 1 : vote.vote === 'reject' ? -1 : 0;
        return sum + (vote.weight * multiplier);
      }, 0);

      // Determine if approved (need positive score and no critical rejections)
      const criticalRejection = votes.some(v => 
        v.vote === 'reject' && 
        (v.agent === '@security' || v.agent === '@ceo')
      );
      
      const status = !criticalRejection && totalScore >= 3 ? 'approved' : 'rejected';

      // Check if decision already exists
      const { data: existingDecision } = await supabase
        .from('improvement_decisions')
        .select('id')
        .eq('pattern_id', patternId)
        .maybeSingle();

      let decisionId: string;

      if (existingDecision) {
        // Update existing
        const { data: updated } = await supabase
          .from('improvement_decisions')
          .update({
            agent_votes: votes as any,
            total_vote_score: totalScore,
            status,
            decided_at: status === 'approved' || status === 'rejected' ? new Date().toISOString() : null,
            decided_by: status === 'approved' || status === 'rejected' ? 'multi_agent_consensus' : null,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingDecision.id)
          .select()
          .single();

        decisionId = updated!.id;
      } else {
        // Create new
        const rootCause = pattern.root_cause_analysis as any;
        const firstAction = pattern.suggested_actions[0] as any;
        
        const { data: created } = await supabase
          .from('improvement_decisions')
          .insert({
            pattern_id: patternId,
            action_type: firstAction?.action || 'investigation',
            action_description: rootCause?.root_cause || 'Improvement needed',
            implementation_plan: firstAction || {},
            agent_votes: votes as any,
            total_vote_score: totalScore,
            risk_level: this.assessRiskLevel(pattern.severity),
            status,
            decided_at: status === 'approved' || status === 'rejected' ? new Date().toISOString() : null,
            decided_by: status === 'approved' || status === 'rejected' ? 'multi_agent_consensus' : null
          })
          .select()
          .single();

        decisionId = created!.id;
      }

      // Update pattern status
      await supabase
        .from('improvement_patterns')
        .update({ 
          status: status === 'approved' ? 'approved' : 'analyzed',
          updated_at: new Date().toISOString()
        })
        .eq('id', patternId);

      console.log('✅ Voting completed:', {
        decision_id: decisionId,
        total_score: totalScore,
        status,
        votes: votes.map(v => ({ agent: v.agent, vote: v.vote }))
      });

      if (status === 'approved') {
        toast.success('Improvement approved by multi-agent consensus');
      } else {
        toast.warning('Improvement rejected - requires further analysis');
      }

      return decisionId;

    } catch (error) {
      console.error('Error in voting process:', error);
      toast.error('Failed to complete voting process');
      return null;
    }
  }

  // Get vote from individual agent using AI
  private async getAgentVote(
    agentName: string,
    role: string,
    pattern: any,
    weight: number
  ): Promise<AgentVote> {
    try {
      const { data, error } = await supabase.functions.invoke('openai-integration', {
        body: {
          action: 'chat',
          messages: [
            {
              role: 'system',
              content: `You are ${agentName}, an AI agent with role: ${role}.
Your job is to vote on system improvement proposals.
Consider: impact, risk, effort, alignment with system goals.

Return JSON only:
{
  "vote": "approve" | "reject" | "abstain",
  "reasoning": "detailed explanation of your decision",
  "concerns": ["concern1", "concern2"] or [],
  "conditions": ["condition1"] or []
}`
            },
            {
              role: 'user',
              content: `Improvement Proposal:
Pattern Type: ${pattern.pattern_type}
Severity: ${pattern.severity}
Impact: ${JSON.stringify(pattern.impact_assessment)}
Root Cause: ${pattern.root_cause_analysis?.root_cause}
Suggested Actions: ${JSON.stringify(pattern.suggested_actions)}

Vote on this proposal.`
            }
          ],
          model: 'gpt-4o-mini',
          max_tokens: 500
        }
      });

      if (error) throw error;

      const voteData = typeof data.response === 'string' 
        ? JSON.parse(data.response) 
        : data.response;

      return {
        agent: agentName,
        vote: voteData.vote,
        weight,
        reasoning: voteData.reasoning,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error(`Error getting vote from ${agentName}:`, error);
      // Default to abstain on error
      return {
        agent: agentName,
        vote: 'abstain',
        weight,
        reasoning: 'Unable to analyze - technical error',
        timestamp: new Date().toISOString()
      };
    }
  }

  private assessRiskLevel(severity: string): string {
    const riskMap: Record<string, string> = {
      'critical': 'high',
      'high': 'medium',
      'medium': 'low',
      'low': 'minimal'
    };
    return riskMap[severity] || 'medium';
  }

  // Get pending decisions that need voting
  async getPendingDecisions(): Promise<ImprovementDecision[]> {
    const { data } = await supabase
      .from('improvement_decisions')
      .select('*')
      .eq('status', 'voting')
      .order('created_at', { ascending: false });

    return (data || []) as unknown as ImprovementDecision[];
  }

  // Get decision by ID
  async getDecision(decisionId: string): Promise<ImprovementDecision | null> {
    const { data } = await supabase
      .from('improvement_decisions')
      .select('*')
      .eq('id', decisionId)
      .maybeSingle();

    return data as unknown as ImprovementDecision | null;
  }
}

export const improvementDecisionService = new ImprovementDecisionService();
