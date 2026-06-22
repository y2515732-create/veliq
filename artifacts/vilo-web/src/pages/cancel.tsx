import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Cancel() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 mx-auto rounded-full bg-secondary border border-border flex items-center justify-center">
          <div className="text-4xl text-muted-foreground font-black">×</div>
        </div>

        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-4">Checkout Cancelled</h1>
          <p className="text-muted-foreground text-lg mb-8">
            You haven't been charged. Ready to get your Vilo number?
          </p>
        </div>

        <Link href="/">
          <Button className="w-full h-16 text-lg font-bold bg-primary text-primary-foreground hover:bg-primary/90 uppercase tracking-widest transition-all">
            Try Again
          </Button>
        </Link>
      </div>
    </div>
  );
}
