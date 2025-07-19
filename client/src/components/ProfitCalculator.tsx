import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Calculator, DollarSign, Target } from 'lucide-react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

interface ProfitMetrics {
  projectId: number;
  projectName: string;
  totalInvestment: number;
  currentCosts: number;
  projectedSalePrice: number;
  estimatedProfit: number;
  profitMargin: number;
  roi: number;
  timeToCompletion: number;
  riskFactor: 'Low' | 'Medium' | 'High';
}

const ProfitCalculator = () => {
  const [profits, setProfits] = useState<ProfitMetrics[]>([]);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);

  useEffect(() => {
    // Mock profit calculations
    const mockProfits: ProfitMetrics[] = [
      {
        projectId: 1,
        projectName: "56 Inge King Crescent",
        totalInvestment: 820000,
        currentCosts: 650000,
        projectedSalePrice: 1080000,
        estimatedProfit: 260000,
        profitMargin: 31.7,
        roi: 24.1,
        timeToCompletion: 6,
        riskFactor: 'Low'
      },
      {
        projectId: 2,
        projectName: "Block 15 Section 87",
        totalInvestment: 595000,
        currentCosts: 420000,
        projectedSalePrice: 720000,
        estimatedProfit: 125000,
        profitMargin: 21.0,
        roi: 17.4,
        timeToCompletion: 8,
        riskFactor: 'Medium'
      }
    ];
    setProfits(mockProfits);
  }, []);

  const totalPortfolioValue = profits.reduce((sum, p) => sum + p.projectedSalePrice, 0);
  const totalInvestment = profits.reduce((sum, p) => sum + p.totalInvestment, 0);
  const totalProfit = profits.reduce((sum, p) => sum + p.estimatedProfit, 0);
  const averageROI = profits.reduce((sum, p) => sum + p.roi, 0) / profits.length;

  const profitTrendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Projected Monthly Profit',
        data: [45000, 52000, 48000, 61000, 58000, 65000],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Actual Profit',
        data: [42000, 48000, 45000, 58000, 55000, 62000],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const projectComparisonData = {
    labels: profits.map(p => p.projectName),
    datasets: [
      {
        label: 'Investment',
        data: profits.map(p => p.totalInvestment),
        backgroundColor: '#f59e0b'
      },
      {
        label: 'Projected Sale',
        data: profits.map(p => p.projectedSalePrice),
        backgroundColor: '#10b981'
      },
      {
        label: 'Estimated Profit',
        data: profits.map(p => p.estimatedProfit),
        backgroundColor: '#3b82f6'
      }
    ]
  };

  const riskDistributionData = {
    labels: ['Low Risk', 'Medium Risk', 'High Risk'],
    datasets: [
      {
        data: [
          profits.filter(p => p.riskFactor === 'Low').length,
          profits.filter(p => p.riskFactor === 'Medium').length,
          profits.filter(p => p.riskFactor === 'High').length
        ],
        backgroundColor: ['#10b981', '#f59e0b', '#ef4444']
      }
    ]
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'High': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-green-700">
              <DollarSign className="h-5 w-5" />
              Total Profit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">
              ${totalProfit.toLocaleString()}
            </div>
            <p className="text-sm text-green-600">Estimated portfolio profit</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <TrendingUp className="h-5 w-5" />
              Average ROI
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">
              {averageROI.toFixed(1)}%
            </div>
            <p className="text-sm text-blue-600">Return on investment</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-purple-700">
              <Target className="h-5 w-5" />
              Portfolio Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">
              ${totalPortfolioValue.toLocaleString()}
            </div>
            <p className="text-sm text-purple-600">Total projected value</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-orange-700">
              <Calculator className="h-5 w-5" />
              Total Investment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">
              ${totalInvestment.toLocaleString()}
            </div>
            <p className="text-sm text-orange-600">Capital deployed</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>💰 Profit Trend Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <Line 
                data={profitTrendData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: 'top' }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: function(value: any) {
                          return '$' + (value / 1000) + 'K';
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>📊 Project Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <Bar 
                data={projectComparisonData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: 'top' }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: function(value: any) {
                          return '$' + (value / 1000) + 'K';
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Project Details Table */}
      <Card>
        <CardHeader>
          <CardTitle>🎯 Detailed Profit Analysis by Project</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Project</th>
                  <th className="text-right p-3">Investment</th>
                  <th className="text-right p-3">Current Costs</th>
                  <th className="text-right p-3">Projected Sale</th>
                  <th className="text-right p-3">Est. Profit</th>
                  <th className="text-right p-3">Margin</th>
                  <th className="text-right p-3">ROI</th>
                  <th className="text-center p-3">Risk</th>
                  <th className="text-center p-3">Completion</th>
                </tr>
              </thead>
              <tbody>
                {profits.map((profit) => (
                  <tr 
                    key={profit.projectId} 
                    className="border-b hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedProject(profit.projectId)}
                  >
                    <td className="p-3 font-medium">{profit.projectName}</td>
                    <td className="p-3 text-right">${profit.totalInvestment.toLocaleString()}</td>
                    <td className="p-3 text-right">${profit.currentCosts.toLocaleString()}</td>
                    <td className="p-3 text-right font-semibold text-green-600">
                      ${profit.projectedSalePrice.toLocaleString()}
                    </td>
                    <td className="p-3 text-right font-bold text-blue-600">
                      ${profit.estimatedProfit.toLocaleString()}
                    </td>
                    <td className="p-3 text-right">{profit.profitMargin.toFixed(1)}%</td>
                    <td className="p-3 text-right font-semibold">{profit.roi.toFixed(1)}%</td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-1 rounded text-xs ${getRiskColor(profit.riskFactor)}`}>
                        {profit.riskFactor}
                      </span>
                    </td>
                    <td className="p-3 text-center">{profit.timeToCompletion} months</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Risk Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>⚠️ Risk Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <Doughnut 
                data={riskDistributionData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: 'bottom' }
                  }
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>🚀 Profit Optimization Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800 mb-2">✅ High Performers</h4>
                <p className="text-sm text-green-700">
                  56 Inge King Crescent showing excellent 31.7% margin. Consider similar properties in the area.
                </p>
              </div>
              
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Monitor Closely</h4>
                <p className="text-sm text-yellow-700">
                  Block 15 Section 87 has medium risk. Review construction timeline and cost overruns.
                </p>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">💡 Optimization Tips</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Negotiate bulk material discounts across projects</li>
                  <li>• Consider pre-sales to reduce holding costs</li>
                  <li>• Implement progress payment optimization</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfitCalculator;