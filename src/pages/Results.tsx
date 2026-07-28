import { useState, useEffect } from 'react';
import { BarChart3, RefreshCw, Users, ClipboardList, TrendingUp } from 'lucide-react';
import { surveyService } from '../lib/surveyService';
import { blockchainService } from '../lib/blockchain';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export default function Analytics() {
  const [globalStats, setGlobalStats] = useState<{
    totalSurveys: number;
    totalResponses: number;
    activeSurveys: number;
    closedSurveys: number;
    categoryBreakdown: Record<string, number>;
    responsesByCategory: Record<string, number>;
  } | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const contractAddress = blockchainService.getContractAddress();

  const fetchAnalytics = async () => {
    setIsRefreshing(true);
    try {
      const stats = await surveyService.getGlobalAnalytics();
      setGlobalStats(stats);
    } finally {
      setIsRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-8 page-enter">
        <div className="h-10 w-48 rounded bg-white/10 animate-pulse"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <Card key={i} className="h-28 animate-pulse" />)}
        </div>
        <Card className="h-64 animate-pulse"></Card>
      </div>
    );
  }

  if (!globalStats) {
    return (
      <Card className="py-20 border-dashed max-w-2xl mx-auto mt-10">
        <CardContent className="flex flex-col items-center justify-center text-center space-y-4">
          <BarChart3 className="w-16 h-16 text-muted-foreground" />
          <h3 className="text-xl font-bold">No analytics available</h3>
          <p className="text-muted-foreground">Analytics will appear once surveys receive responses.</p>
        </CardContent>
      </Card>
    );
  }

  const maxCategoryCount = Math.max(...Object.values(globalStats.categoryBreakdown), 1);
  const maxResponseCount = Math.max(...Object.values(globalStats.responsesByCategory), 1);

  return (
    <div className="max-w-5xl mx-auto space-y-8 page-enter">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center space-x-3">
            <BarChart3 className="w-8 h-8 text-primary" />
            <span>Survey Analytics</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Aggregate statistics computed dynamically from on-chain data. No individual responses are ever revealed.
          </p>
        </div>
        <Button 
          variant="outline"
          onClick={fetchAnalytics}
          disabled={isRefreshing}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 space-y-2">
            <div className="flex items-center space-x-2 text-muted-foreground text-sm">
              <ClipboardList className="w-4 h-4" />
              <span>Total Surveys</span>
            </div>
            <div className="text-4xl font-bold font-mono text-foreground">{globalStats.totalSurveys}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 space-y-2">
            <div className="flex items-center space-x-2 text-muted-foreground text-sm">
              <Users className="w-4 h-4" />
              <span>Total Responses</span>
            </div>
            <div className="text-4xl font-bold font-mono text-foreground">{globalStats.totalResponses}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 space-y-2">
            <div className="flex items-center space-x-2 text-green-400 text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>Active</span>
            </div>
            <div className="text-4xl font-bold font-mono text-green-400">{globalStats.activeSurveys}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 space-y-2">
            <div className="flex items-center space-x-2 text-red-400 text-sm">
              <BarChart3 className="w-4 h-4" />
              <span>Closed</span>
            </div>
            <div className="text-4xl font-bold font-mono text-red-400">{globalStats.closedSurveys}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts / Progress Bars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Surveys by Category</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {Object.entries(globalStats.categoryBreakdown).map(([category, count]) => {
              const percentage = Math.round((count / maxCategoryCount) * 100);
              return (
                <div key={category} className="space-y-2">
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm font-medium text-muted-foreground">{category}</span>
                    <span className="text-sm font-mono font-semibold">{count}</span>
                  </div>
                  <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Responses by Category</CardTitle>
          </CardHeader>
          <CardContent>
            {globalStats.totalResponses === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No responses yet. Analytics will populate as surveys receive anonymous submissions.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(globalStats.responsesByCategory).map(([category, count]) => {
                  const percentage = maxResponseCount > 0 ? Math.round((count / maxResponseCount) * 100) : 0;
                  return (
                    <div key={category} className="space-y-2">
                      <div className="flex justify-between items-baseline">
                        <span className="text-sm font-medium text-muted-foreground">{category}</span>
                        <span className="text-sm font-mono font-semibold">{count} responses</span>
                      </div>
                      <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-accent rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Contract Info */}
      {contractAddress && (
        <div className="text-center">
          <div className="inline-block font-mono text-xs text-primary bg-primary/10 px-4 py-2 rounded-lg border border-primary/20">
            Contract: {contractAddress.slice(0, 15)}...{contractAddress.slice(-10)}
          </div>
        </div>
      )}

      <div className="text-center text-sm text-muted-foreground pb-10">
        <p>All statistics are computed dynamically from survey data.</p>
        <p>Individual responses are never revealed — only aggregate counts.</p>
      </div>
    </div>
  );
}
