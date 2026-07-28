import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ListChecks, Clock, Users, Search } from 'lucide-react';
import { surveyService, Survey } from '../lib/surveyService';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

function SurveySkeleton() {
  return (
    <Card className="animate-pulse">
      <CardContent className="p-6 space-y-4">
        <div className="h-4 w-24 rounded bg-white/10"></div>
        <div className="h-6 w-3/4 rounded bg-white/10"></div>
        <div className="h-4 w-full rounded bg-white/10"></div>
        <div className="h-4 w-2/3 rounded bg-white/10"></div>
        <div className="flex justify-between items-center pt-4">
          <div className="h-4 w-20 rounded bg-white/10"></div>
          <div className="h-4 w-16 rounded bg-white/10"></div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Surveys() {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'closed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    surveyService.getSurveys().then(data => {
      setSurveys(data);
      setLoading(false);
    });
  }, []);

  const filtered = surveys.filter(s => {
    const matchesFilter = filter === 'all' || s.status === filter;
    const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 page-enter">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center space-x-3">
            <ListChecks className="w-8 h-8 text-primary" />
            <span>Browse Surveys</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Select a survey to provide anonymous feedback powered by zero-knowledge proofs.
          </p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search surveys..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 transition-colors backdrop-blur-md"
          />
        </div>
        <div className="flex space-x-2">
          {(['all', 'active', 'closed'] as const).map(f => (
            <Button
              key={f}
              variant={filter === f ? "default" : "outline"}
              onClick={() => setFilter(f)}
              className="capitalize"
            >
              {f}
            </Button>
          ))}
        </div>
      </div>

      {/* Survey Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <SurveySkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <Card className="py-12 border-dashed">
          <CardContent className="flex flex-col items-center justify-center text-center space-y-3">
            <ListChecks className="w-12 h-12 text-muted-foreground" />
            <h3 className="text-lg font-semibold">No surveys found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((survey, i) => (
            <Link key={survey.id} to={`/surveys/${survey.id}`} className="group block">
              <Card className="h-full transition-transform hover:scale-[1.02]" style={{ animationDelay: `${i * 80}ms` }}>
                <CardContent className="p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="category">{survey.category}</Badge>
                    <Badge variant={survey.status === 'active' ? 'active' : 'secondary'}>
                      {survey.status}
                    </Badge>
                  </div>
                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                    {survey.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
                    {survey.description}
                  </p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 mt-auto border-t border-white/5">
                    <span className="flex items-center space-x-1">
                      <Users className="w-3.5 h-3.5" />
                      <span>{survey.responseCount} responses</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Closes {survey.closingDate}</span>
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
