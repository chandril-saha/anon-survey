import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Zap, Lock, ClipboardList, Users, Brain } from 'lucide-react';
import { blockchainService } from '../lib/blockchain';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

const categories = [
  { icon: Users, label: 'Workplace Feedback', color: 'text-blue-400' },
  { icon: ClipboardList, label: 'Student Feedback', color: 'text-green-400' },
  { icon: Zap, label: 'Customer Satisfaction', color: 'text-yellow-400' },
  { icon: Shield, label: 'Community Governance', color: 'text-purple-400' },
  { icon: Brain, label: 'Mental Health Check', color: 'text-pink-400' },
  { icon: Users, label: 'Event Feedback', color: 'text-cyan-400' },
];

export default function Home() {
  const contractAddress = blockchainService.getContractAddress();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-14 page-enter">
      <div className="space-y-6 max-w-3xl">
        {contractAddress ? (
          <Badge variant="active" className="mb-4">
            Live on Midnight Preview
          </Badge>
        ) : (
          <Badge variant="secondary" className="mb-4 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
            Deployment Pending
          </Badge>
        )}
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-accent to-primary">
          Anonymous Surveys
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          A zero-knowledge survey platform built on the Midnight Network. 
          Submit honest feedback without ever revealing your identity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full text-left">
        <Card className="pt-6">
          <CardContent className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center shadow-inner">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Zero-Knowledge Proofs</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">Your survey responses are validated locally using Compact circuits. The blockchain only sees that a valid response was submitted — never its contents.</p>
          </CardContent>
        </Card>
        <Card className="pt-6">
          <CardContent className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center shadow-inner">
              <Shield className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold">Publicly Verifiable</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">Response counts and survey metadata are stored on the public ledger, ensuring transparency and tamper-proof aggregate results.</p>
          </CardContent>
        </Card>
        <Card className="pt-6">
          <CardContent className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center shadow-inner">
              <Zap className="w-6 h-6 text-indigo-400" />
            </div>
            <h3 className="text-xl font-semibold">Seamless UX</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">Connect your Lace wallet, complete the survey, and the ZK proof is generated automatically. No complex setup required.</p>
          </CardContent>
        </Card>
      </div>

      {/* Category Showcase */}
      <div className="w-full max-w-5xl">
        <h2 className="text-2xl font-bold mb-6">Survey Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link key={cat.label} to="/surveys">
                <Card className="h-full hover:scale-[1.02] transition-transform cursor-pointer pt-6">
                  <CardContent className="flex flex-col items-center space-y-2 text-center pb-6">
                    <Icon className={`w-6 h-6 ${cat.color}`} />
                    <span className="text-xs text-muted-foreground font-medium">{cat.label}</span>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="pt-4">
        <Link to="/surveys">
          <Button size="lg" className="space-x-2 text-base px-8 h-12">
            <span>Browse Surveys</span>
            <ArrowRight className="w-5 h-5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
