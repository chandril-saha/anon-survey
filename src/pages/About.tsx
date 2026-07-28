import { Code, BookOpen, ShieldCheck, Eye, EyeOff, Lock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

export default function About() {
  return (
    <div className="max-w-3xl mx-auto space-y-12 py-8 page-enter">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight">How It Works</h1>
        <p className="text-xl text-muted-foreground">
          Understanding how Midnight Network enables truly anonymous surveys.
        </p>
      </div>

      <div className="space-y-8">
        {/* Privacy Model */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-3 text-primary">
              <ShieldCheck className="w-8 h-8" />
              <span>The Privacy Model</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-muted-foreground leading-relaxed">
            <div className="flex items-start space-x-4">
              <Eye className="w-6 h-6 text-green-400 mt-1 shrink-0" />
              <div>
                <h4 className="text-foreground font-semibold mb-1 text-lg">Public Ledger State (Visible)</h4>
                <p>Survey metadata, response counts, and survey status are stored publicly on-chain. Anyone can verify the integrity and total participation of any survey.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <EyeOff className="w-6 h-6 text-red-400 mt-1 shrink-0" />
              <div>
                <h4 className="text-foreground font-semibold mb-1 text-lg">Private Witnesses (Hidden)</h4>
                <p>The respondent's wallet identity, survey response contents, and uniqueness proof remain entirely off-chain. They are supplied as a "private witness" directly to the zero-knowledge circuit running locally on the user's device.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <Lock className="w-6 h-6 text-primary mt-1 shrink-0" />
              <div>
                <h4 className="text-foreground font-semibold mb-1 text-lg">What is Proven?</h4>
                <p>The zero-knowledge circuit mathematically proves that the respondent holds a valid response token and that exactly one response was submitted. The ledger accepts the proof and increments the counter, without ever "knowing" who responded or what they said.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ZK Flow */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-3 text-accent">
              <Lock className="w-8 h-8" />
              <span>Zero-Knowledge Flow</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {[
              { step: 1, title: 'Connect Wallet', desc: 'User connects their Lace wallet. The wallet address is used locally for eligibility — it is never sent to the blockchain.' },
              { step: 2, title: 'Complete Survey', desc: 'User fills in the survey form locally. Responses never leave the browser.' },
              { step: 3, title: 'Generate ZK Proof', desc: 'The Compact circuit runs locally, generating a cryptographic proof that a valid response was submitted without revealing its contents.' },
              { step: 4, title: 'Submit Proof', desc: 'Only the proof is submitted to the Midnight blockchain. The public counter increments. Identity and response remain hidden forever.' },
            ].map(item => (
              <div key={item.step} className="flex items-start space-x-4">
                <div className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold shrink-0 ring-1 ring-accent/30">
                  {item.step}
                </div>
                <div>
                  <h4 className="text-foreground font-semibold text-lg">{item.title}</h4>
                  <p className="text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* What Midnight Enables */}
        <Card>
          <CardHeader>
            <CardTitle>Why Midnight?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              Conventional blockchains store all transaction data publicly. This means any survey, vote, or feedback system built on Ethereum, Solana, or Cardano's base layer inherently reveals the respondent's wallet address and transaction contents.
            </p>
            <p>
              Midnight solves this using <span className="text-primary font-semibold">Compact</span> — a domain-specific language for writing zero-knowledge smart contracts. Compact allows developers to explicitly define what is public (on the ledger) and what is private (witnessed off-chain), making it possible to build applications where privacy is mathematically guaranteed, not just promised.
            </p>
          </CardContent>
        </Card>

        {/* Tech Stack */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-3">
              <Code className="w-6 h-6" />
              <span>Tech Stack</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="grid grid-cols-2 gap-4 text-muted-foreground">
              {[
                'Midnight Network',
                'Compact Smart Contracts',
                'React & TypeScript',
                'Tailwind CSS & Shadcn',
                'Vite',
                'Midnight Wallet SDK (Lace)',
              ].map(tech => (
                <li key={tech} className="flex items-center space-x-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  <span className="font-medium">{tech}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Builder Challenge */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-3">
              <BookOpen className="w-6 h-6" />
              <span>Builder Challenge</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              This project was developed for the Midnight Builder Challenge to showcase how zero-knowledge proofs can solve real-world privacy problems — such as enabling truly anonymous feedback in organizations, schools, and communities while ensuring verifiable and tamper-proof aggregate results.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
