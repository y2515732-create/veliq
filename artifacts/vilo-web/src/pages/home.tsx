import { Link } from "wouter";
import { CheckoutForm } from "@/components/checkout-form";
import { 
  Zap, 
  Phone, 
  MessageSquare, 
  Bot, 
  ShieldCheck, 
  Globe,
  ArrowRight,
  Terminal
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="font-bold text-2xl tracking-tighter flex items-center gap-2">
            <span className="text-primary">VILO</span>
            <span>AI</span>
          </div>
          <div className="hidden md:flex items-center gap-8 font-mono text-sm uppercase tracking-widest text-muted-foreground">
            <a href="#how-it-works" className="hover:text-primary transition-colors">How it Works</a>
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#pricing" className="hover:text-primary transition-colors">Pricing</a>
          </div>
          <Button onClick={() => document.getElementById('checkout')?.scrollIntoView({ behavior: 'smooth' })} className="hidden md:inline-flex bg-primary text-primary-foreground hover:bg-primary/90 font-bold uppercase tracking-widest">
            Get Number
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 md:pt-52 md:pb-32 px-6">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.css')] opacity-20 pointer-events-none mix-blend-overlay" />
        
        <div className="container mx-auto max-w-5xl text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-mono text-sm mb-8 uppercase tracking-widest">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Live in 60 seconds
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8">
            YOUR AI AGENT. <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">ON A REAL PHONE NUMBER.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 font-medium leading-relaxed">
            Stop giving out your real number. For $4.99, get a dedicated phone line wired directly to a customizable ElevenLabs AI agent. It answers calls, takes messages, and filters the noise.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button onClick={() => document.getElementById('checkout')?.scrollIntoView({ behavior: 'smooth' })} size="lg" className="w-full sm:w-auto h-16 px-10 text-lg font-bold bg-primary text-primary-foreground hover:bg-primary/90 uppercase tracking-widest transition-all hover:scale-105 active:scale-95">
              Claim Your Number
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <div className="text-sm font-mono text-muted-foreground uppercase tracking-widest">
              One-time payment • No hidden fees
            </div>
          </div>
        </div>
      </section>

      {/* Demo / Terminal Section */}
      <section className="py-20 bg-black relative border-y border-border/50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto bg-background/50 rounded-xl border border-border p-6 font-mono text-sm md:text-base overflow-hidden relative backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-border/50">
              <div className="w-3 h-3 rounded-full bg-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-green-500/50" />
              <span className="ml-2 text-muted-foreground opacity-50">agent_log.txt</span>
            </div>
            
            <div className="space-y-4">
              <div className="text-muted-foreground"><span className="text-primary">{`>`}</span> System initialized.</div>
              <div className="text-muted-foreground"><span className="text-primary">{`>`}</span> Provisioning +1 (555) 019-4821...</div>
              <div className="text-emerald-400"><span className="text-primary">{`>`}</span> Number active.</div>
              <div className="text-muted-foreground"><span className="text-primary">{`>`}</span> Binding ElevenLabs voice module...</div>
              <div className="text-emerald-400"><span className="text-primary">{`>`}</span> Voice binding successful.</div>
              <div className="pt-4 border-t border-border/20 mt-4">
                <div className="text-foreground font-bold">INCOMING CALL FROM: UNKNOWN</div>
                <div className="text-muted-foreground pl-4 border-l-2 border-primary/30 mt-2 space-y-2">
                  <p><span className="text-primary font-bold">AI:</span> "Hello, this is Vilo. How can I help you today?"</p>
                  <p><span className="text-foreground/50">Caller:</span> "Is John available?"</p>
                  <p><span className="text-primary font-bold">AI:</span> "John is currently unavailable. Would you like me to take a message?"</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-32 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-20">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase">How It Works</h2>
            <div className="h-1 w-20 bg-primary mt-6" />
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                step: "01",
                title: "Pay $4.99",
                desc: "One single payment. No recurring subscriptions, no hidden bullshit. You pay once, you own the number.",
                icon: Zap
              },
              {
                step: "02",
                title: "Get Number",
                desc: "We instantly provision a real US phone number and wire it up to our systems.",
                icon: Phone
              },
              {
                step: "03",
                title: "AI Takes Over",
                desc: "Your number is automatically routed to an ElevenLabs voice agent ready to handle incoming calls.",
                icon: Bot
              }
            ].map((item, i) => (
              <div key={i} className="relative p-8 rounded-2xl border border-border/50 bg-card/50 hover:bg-card hover:border-primary/50 transition-all group">
                <div className="absolute -top-6 -right-6 text-8xl font-black text-border/20 group-hover:text-primary/10 transition-colors pointer-events-none">
                  {item.step}
                </div>
                <item.icon className="h-12 w-12 text-primary mb-6" />
                <h3 className="text-2xl font-bold mb-4 uppercase tracking-tight">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-32 px-6 bg-secondary/30">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-6">Built For The Hustle</h2>
              <p className="text-xl text-muted-foreground mb-12">
                Founders, creators, and builders need a shield. Vilo is that shield.
              </p>
              
              <div className="space-y-8">
                {[
                  { title: "Zero Spam", desc: "Never give out your personal cell to a sketchy signup form again.", icon: ShieldCheck },
                  { title: "Always On", desc: "Your AI agent doesn't sleep. It handles calls 24/7.", icon: Globe },
                  { title: "Real SMS", desc: "Receive real text messages to your Vilo number.", icon: MessageSquare }
                ].map((feat, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0 mt-1">
                      <feat.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold uppercase tracking-tight mb-1">{feat.title}</h4>
                      <p className="text-muted-foreground">{feat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative aspect-square">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-full blur-3xl animate-pulse" />
              <div className="relative h-full w-full border border-border/50 bg-black/50 backdrop-blur-sm rounded-3xl p-8 flex flex-col">
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 border border-primary/30 mb-6">
                      <Bot className="h-12 w-12 text-primary" />
                    </div>
                    <div className="text-2xl font-mono uppercase tracking-widest text-primary animate-pulse">
                      Awaiting Call
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Checkout / CTA */}
      <section id="checkout" className="py-32 px-6 relative">
        <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-6">
            Get It Now
          </h2>
          <p className="text-2xl text-muted-foreground mb-16 max-w-2xl mx-auto">
            $4.99 one-time. No subscriptions. Instantly provisioned.
          </p>
          
          <CheckoutForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border/50 bg-black">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="font-bold tracking-tighter flex items-center gap-2">
            <span className="text-primary">VILO</span>
            <span>AI</span>
          </div>
          <div className="text-sm font-mono text-muted-foreground uppercase tracking-widest">
            © {new Date().getFullYear()} Vilo AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

// Needed to add Button import up here since it was missing
import { Button } from "@/components/ui/button";
