
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Bot, Sparkles, Target, Zap } from 'lucide-react';

interface AITemplateAssistantProps {
  onSuggestionApply?: (suggestion: any) => void;
}

const AITemplateAssistant = ({ onSuggestionApply }: AITemplateAssistantProps) => {
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);

  const analyzeURL = async () => {
    if (!url) return;
    
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const mockSuggestions = [
        {
          id: 1,
          type: 'selector',
          title: 'Product Container',
          suggestion: '.product-grid, .products-list, [data-testid="product-list"]',
          confidence: 0.95,
          reasoning: 'Detected common e-commerce product container patterns'
        },
        {
          id: 2,
          type: 'field',
          title: 'Product Title',
          suggestion: 'h2.product-title, .product-name, [data-testid="product-title"]',
          confidence: 0.89,
          reasoning: 'Found semantic HTML patterns for product titles'
        },
        {
          id: 3,
          type: 'field',
          title: 'Price',
          suggestion: '.price, .product-price, [data-price]',
          confidence: 0.92,
          reasoning: 'Identified price-related CSS classes and attributes'
        },
        {
          id: 4,
          type: 'optimization',
          title: 'Rate Limiting',
          suggestion: 'Add 2-3 second delays between requests',
          confidence: 0.85,
          reasoning: 'This site appears to have anti-bot measures'
        }
      ];
      
      setSuggestions(mockSuggestions);
      setIsAnalyzing(false);
    }, 2000);
  };

  const applySuggestion = (suggestion: any) => {
    onSuggestionApply?.(suggestion);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'bg-green-500/20 text-green-400';
    if (confidence >= 0.8) return 'bg-yellow-500/20 text-yellow-400';
    return 'bg-orange-500/20 text-orange-400';
  };

  return (
    <Card className="bg-slate-800/50 border-purple-500/30">
      <CardHeader>
        <CardTitle className="text-purple-400 flex items-center space-x-2">
          <Bot className="h-5 w-5" />
          <span>AI Template Assistant</span>
          <Sparkles className="h-4 w-4" />
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter URL to analyze..."
            className="bg-slate-700/50 border-slate-600"
          />
          <Button 
            onClick={analyzeURL}
            disabled={!url || isAnalyzing}
            className="bg-gradient-secondary"
          >
            {isAnalyzing ? (
              <Zap className="h-4 w-4 animate-spin" />
            ) : (
              <Target className="h-4 w-4" />
            )}
            Analyze
          </Button>
        </div>

        {suggestions.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-slate-300">AI Suggestions</h4>
            {suggestions.map((suggestion) => (
              <div key={suggestion.id} className="bg-slate-700/30 p-3 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-white">{suggestion.title}</span>
                    <Badge className={getConfidenceColor(suggestion.confidence)}>
                      {Math.round(suggestion.confidence * 100)}%
                    </Badge>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => applySuggestion(suggestion)}
                    className="bg-purple-500/20 hover:bg-purple-500/30"
                  >
                    Apply
                  </Button>
                </div>
                
                <div className="text-xs text-slate-400 mb-2">{suggestion.reasoning}</div>
                
                <code className="text-xs bg-slate-800/50 p-1 rounded text-cyan-400">
                  {suggestion.suggestion}
                </code>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AITemplateAssistant;
