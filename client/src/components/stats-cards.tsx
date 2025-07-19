import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Folder, 
  CheckCircle, 
  DollarSign, 
  AlertTriangle 
} from "lucide-react";

interface Stats {
  totalProjects: number;
  totalLoanApproved: number;
  totalCashSpent: number;
  totalOutstanding: number;
}

export default function StatsCards() {
  const { data: stats } = useQuery<Stats>({
    queryKey: ["/api/stats"],
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const cards = [
    {
      title: "Total Projects",
      value: stats?.totalProjects || 0,
      icon: Folder,
      color: "blue",
      change: "+12%",
      changeLabel: "from last month"
    },
    {
      title: "Loan Approved",
      value: formatCurrency(stats?.totalLoanApproved || 0),
      icon: CheckCircle,
      color: "green",
      change: "+8%",
      changeLabel: "from last month"
    },
    {
      title: "Cash Spent",
      value: formatCurrency(stats?.totalCashSpent || 0),
      icon: DollarSign,
      color: "amber",
      change: "75%",
      changeLabel: "of approved amount"
    },
    {
      title: "Outstanding",
      value: formatCurrency(stats?.totalOutstanding || 0),
      icon: AlertTriangle,
      color: "red",
      change: "25%",
      changeLabel: "remaining balance"
    }
  ];

  return (
    <section className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card, index) => (
          <Card key={index} className="border border-slate-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">{card.title}</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{card.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  card.color === 'blue' ? 'bg-blue-50' :
                  card.color === 'green' ? 'bg-green-50' :
                  card.color === 'amber' ? 'bg-amber-50' : 'bg-red-50'
                }`}>
                  <card.icon className={`h-5 w-5 ${
                    card.color === 'blue' ? 'text-blue-500' :
                    card.color === 'green' ? 'text-green-500' :
                    card.color === 'amber' ? 'text-amber-500' : 'text-red-500'
                  }`} />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                <span className={`font-medium ${
                  card.color === 'blue' ? 'text-green-500' :
                  card.color === 'green' ? 'text-green-500' :
                  card.color === 'amber' ? 'text-amber-500' : 'text-red-500'
                }`}>
                  {card.change}
                </span>
                <span className="text-slate-600 ml-1">{card.changeLabel}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
