import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Wallet, Loader2, CheckCircle2, LogOut, ArrowLeft, ShieldCheck, Info } from 'lucide-react';
import { blockchainService } from '../lib/blockchain';
import { surveyService, Survey } from '../lib/surveyService';
import toast from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { cn } from '../lib/utils';

export default function SurveyDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [survey, setSurvey] = useState<Survey | null>(null);
  const [loading, setLoading] = useState(true);
  const [wallet, setWallet] = useState<string | null>(null);
  const [network, setNetwork] = useState<string | number | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);

  useEffect(() => {
    if (blockchainService.isConnected()) {
      setWallet(blockchainService.getAddress());
      setNetwork(blockchainService.getNetwork());
    }
  }, []);

  useEffect(() => {
    if (!id) return;
    surveyService.getSurvey(id).then(data => {
      setSurvey(data);
      setLoading(false);
    });
  }, [id]);

  useEffect(() => {
    if (wallet && id) {
      surveyService.hasSubmitted(id, wallet).then(setAlreadySubmitted);
    }
  }, [wallet, id]);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const w = await blockchainService.connectWallet();
      setWallet(w.address);
      setNetwork(w.network);
      toast.success("Connected to Lace Wallet!");
    } catch (err: any) {
      toast.error(err.message || "Failed to connect wallet.");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    await blockchainService.disconnectWallet();
    setWallet(null);
    setNetwork(null);
    toast.success("Disconnected wallet.");
  };

  const handleSubmit = async () => {
    if (!id || !wallet || !survey) return;
    
    // Validate all questions answered
    const unanswered = survey.questions.filter(q => !answers[q.id] && answers[q.id] !== 0);
    if (unanswered.length > 0) {
      toast.error("Please answer all questions before submitting.");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await surveyService.submitResponse(id, wallet, answers);
      setTxHash(result.txHash);
      setSubmitted(true);
      toast.success("Response submitted anonymously!");
    } catch (err: any) {
      toast.error(err.message || "Submission failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 page-enter">
        <div className="h-8 w-64 rounded bg-white/10 animate-pulse"></div>
        <div className="h-4 w-full rounded bg-white/10 animate-pulse"></div>
        <Card className="animate-pulse">
          <CardContent className="p-8 space-y-6">
            {[...Array(3)].map((_, i) => <div key={i} className="h-16 w-full rounded bg-white/10"></div>)}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center page-enter space-y-4">
        <Info className="w-16 h-16 text-muted-foreground" />
        <h3 className="text-xl font-bold">Survey not found</h3>
        <p className="text-muted-foreground">The survey you're looking for doesn't exist or has been removed.</p>
        <Link to="/surveys">
          <Button variant="outline" className="mt-4">Back to Surveys</Button>
        </Link>
      </div>
    );
  }

  // Success Screen
  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 page-enter">
        <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/30 text-green-400 animate-fade-in shadow-[0_0_30px_rgba(34,197,94,0.3)]">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h2 className="text-3xl font-bold text-center">Response Submitted Anonymously</h2>
        <p className="text-muted-foreground max-w-md text-center">
          Your response was verified via ZK proof and the public counter has been incremented. 
          Your identity and response contents remain permanently hidden.
        </p>
        {txHash && (
          <div className="bg-black/40 backdrop-blur-md border border-white/10 p-4 rounded-xl w-full max-w-lg overflow-hidden text-center">
            <span className="text-sm text-muted-foreground block mb-1">Transaction Hash</span>
            <code className="text-primary font-mono text-sm break-all">{txHash}</code>
          </div>
        )}
        <div className="flex space-x-4">
          <Link to="/surveys">
            <Button variant="outline">Browse More Surveys</Button>
          </Link>
          <Link to="/analytics">
            <Button>View Analytics</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 page-enter">
      {/* Back Link */}
      <Link to="/surveys" className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors w-fit">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Surveys</span>
      </Link>

      {/* Survey Header */}
      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <Badge variant="category">{survey.category}</Badge>
          <Badge variant={survey.status === 'active' ? 'active' : 'secondary'}>
            {survey.status}
          </Badge>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight">{survey.title}</h1>
        <p className="text-muted-foreground leading-relaxed text-lg">{survey.description}</p>
      </div>

      {/* Privacy Tooltip */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4 flex items-start space-x-3">
          <ShieldCheck className="w-5 h-5 text-primary mt-0.5 shrink-0" />
          <p className="text-sm text-muted-foreground">
            <span className="text-foreground font-semibold">Privacy Guarantee:</span> Your response is processed locally by a zero-knowledge circuit. 
            Only a proof of valid submission reaches the blockchain — never your identity or answers.
          </p>
        </CardContent>
      </Card>

      {/* Wallet Gate */}
      {!wallet ? (
        <Card>
          <CardContent className="p-10 flex flex-col items-center space-y-6 text-center">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center">
              <Wallet className="w-10 h-10 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-semibold">Connect Wallet to Respond</h3>
              <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                Your wallet proves eligibility through a zero-knowledge proof. Your address is never linked to your response.
              </p>
            </div>
            <Button onClick={handleConnect} disabled={isConnecting} size="lg" className="w-full sm:w-auto">
              {isConnecting && <Loader2 className="w-5 h-5 animate-spin mr-2" />}
              <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Connected Wallet Bar */}
          <Card className="bg-black/60 border-white/5">
            <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-3 text-green-400">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-medium text-sm">Connected</span>
                <span className="text-xs font-mono text-muted-foreground bg-white/5 px-2 py-1 rounded">
                  {typeof wallet === 'string' ? `${wallet.slice(0, 10)}...${wallet.slice(-6)}` : 'Connected'}
                </span>
              </div>
              <Button variant="destructive" size="sm" onClick={handleDisconnect} className="w-full sm:w-auto space-x-2">
                <LogOut className="w-4 h-4" />
                <span>Disconnect</span>
              </Button>
            </CardContent>
          </Card>

          {/* Already Submitted */}
          {alreadySubmitted ? (
            <Card className="border-green-500/20 bg-green-500/5">
              <CardContent className="p-10 text-center space-y-4">
                <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto" />
                <h3 className="text-2xl font-semibold text-foreground">Already Submitted</h3>
                <p className="text-muted-foreground">You have already submitted a response to this survey. One response per wallet is enforced to prevent spam.</p>
              </CardContent>
            </Card>
          ) : survey.status !== 'active' ? (
            <Card>
              <CardContent className="p-10 text-center space-y-4">
                <Info className="w-16 h-16 text-muted-foreground mx-auto" />
                <h3 className="text-2xl font-semibold text-foreground">Survey Closed</h3>
                <p className="text-muted-foreground">This survey is no longer accepting responses.</p>
              </CardContent>
            </Card>
          ) : (
            /* Survey Questions */
            <div className="space-y-6">
              {survey.questions.map((q, i) => (
                <Card key={q.id}>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg">
                      <span className="text-primary mr-2">Q{i + 1}.</span>
                      {q.text}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {q.type === 'rating' && (
                      <div className="flex flex-wrap gap-2">
                        {[1, 2, 3, 4, 5].map(val => (
                          <button
                            key={val}
                            onClick={() => setAnswers(prev => ({ ...prev, [q.id]: val }))}
                            className={cn(
                              "w-12 h-12 rounded-xl border transition-all font-bold text-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background",
                              answers[q.id] === val
                                ? "bg-primary text-primary-foreground border-primary shadow-[0_0_15px_rgba(124,58,237,0.4)] scale-105"
                                : "border-white/10 text-muted-foreground hover:border-primary/50 hover:bg-white/5"
                            )}
                          >
                            {val}
                          </button>
                        ))}
                      </div>
                    )}

                    {q.type === 'choice' && q.options && (
                      <div className="space-y-2">
                        {q.options.map(opt => (
                          <button
                            key={opt}
                            onClick={() => setAnswers(prev => ({ ...prev, [q.id]: opt }))}
                            className={cn(
                              "w-full text-left px-5 py-3.5 rounded-xl border transition-all text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background",
                              answers[q.id] === opt
                                ? "bg-primary/20 border-primary text-primary"
                                : "border-white/10 text-muted-foreground hover:border-primary/50 hover:bg-white/5"
                            )}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}

                    {q.type === 'text' && (
                      <textarea
                        value={(answers[q.id] as string) || ''}
                        onChange={e => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                        placeholder="Type your response here..."
                        rows={4}
                        className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                      />
                    )}
                  </CardContent>
                </Card>
              ))}

              {/* Submit Button */}
              <div className="flex justify-end pt-4">
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  {isSubmitting && <Loader2 className="w-5 h-5 animate-spin mr-2" />}
                  <span>{isSubmitting ? 'Generating ZK Proof...' : 'Submit Anonymous Response'}</span>
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
