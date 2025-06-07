
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartDataPoint {
  time: string;
  performance: number;
  efficiency: number;
  accuracy: number;
}

interface PerformanceChartProps {
  data: ChartDataPoint[];
  height?: number;
}

const PerformanceChart = ({ data, height = 300 }: PerformanceChartProps) => {
  return (
    <Card className="bg-slate-800/50 border-slate-700/50">
      <CardHeader>
        <CardTitle className="text-cyan-400">Performance Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="time" 
              stroke="#9CA3AF"
              fontSize={12}
            />
            <YAxis 
              stroke="#9CA3AF"
              fontSize={12}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#F3F4F6'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="performance" 
              stroke="#06B6D4" 
              strokeWidth={2}
              name="Performance"
            />
            <Line 
              type="monotone" 
              dataKey="efficiency" 
              stroke="#10B981" 
              strokeWidth={2}
              name="Efficiency"
            />
            <Line 
              type="monotone" 
              dataKey="accuracy" 
              stroke="#F59E0B" 
              strokeWidth={2}
              name="Accuracy"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default PerformanceChart;
