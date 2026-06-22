import { useState, useEffect } from "react";
import { useListAdminUsers, getListAdminUsersQueryKey } from "@workspace/api-client-react";
import { format } from "date-fns";
import { Loader2, RefreshCw, LogOut, Copy, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

export default function AdminPage() {
  const [password, setPassword] = useState(sessionStorage.getItem("admin_password") || "");
  const [loginInput, setLoginInput] = useState("");
  const { toast } = useToast();

  const { data, error, isError, isLoading, isFetching, refetch } = useListAdminUsers({
    request: {
      headers: { Authorization: `Bearer ${password}` }
    },
    query: {
      queryKey: getListAdminUsersQueryKey(),
      enabled: !!password,
      refetchInterval: 10000,
      retry: false
    }
  });

  useEffect(() => {
    if (data && password) {
      sessionStorage.setItem("admin_password", password);
    }
  }, [data, password]);

  useEffect(() => {
    if (isError) {
      sessionStorage.removeItem("admin_password");
      setPassword("");
      toast({
        title: "Authentication Failed",
        description: "Incorrect password or session expired.",
        variant: "destructive"
      });
    }
  }, [isError, toast]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginInput) return;
    setPassword(loginInput);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_password");
    setPassword("");
    setLoginInput("");
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: `${label} copied to clipboard.`,
    });
  };

  if (!password || isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md border-border bg-card">
          <CardHeader>
            <CardTitle className="text-2xl font-mono text-center tracking-tight">System Admin</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="Enter admin password"
                  value={loginInput}
                  onChange={(e) => setLoginInput(e.target.value)}
                  className="font-mono bg-background border-border"
                />
              </div>
              <Button type="submit" className="w-full font-mono bg-primary text-primary-foreground hover:bg-primary/90" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Authenticate"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading && !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const users = data?.users || [];
  const totalUsers = data?.total || 0;
  const activeCount = users.filter((u) => u.status === "active").length;
  const pendingCount = users.filter((u) => u.status === "pending").length;

  return (
    <div className="min-h-screen bg-background text-foreground p-6 md:p-8 flex flex-col gap-6">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-mono tracking-tight text-primary">vilo_ops_console</h1>
          <p className="text-sm text-muted-foreground font-mono mt-1">Real-time user provisioning status</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => refetch()} 
            disabled={isFetching}
            className="font-mono text-xs border-border bg-card hover:bg-muted"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isFetching ? "animate-spin text-primary" : ""}`} />
            Refresh
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleLogout}
            className="font-mono text-xs text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-mono">{totalUsers}</div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Active Numbers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-mono text-primary">{activeCount}</div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Pending Provision</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-mono text-yellow-500">{pendingCount}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex-1 bg-card border border-border rounded-lg overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50 border-b border-border">
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-mono text-xs text-muted-foreground whitespace-nowrap">Name</TableHead>
                <TableHead className="font-mono text-xs text-muted-foreground whitespace-nowrap">Email</TableHead>
                <TableHead className="font-mono text-xs text-muted-foreground whitespace-nowrap">Phone</TableHead>
                <TableHead className="font-mono text-xs text-muted-foreground whitespace-nowrap">Vilo Number</TableHead>
                <TableHead className="font-mono text-xs text-muted-foreground whitespace-nowrap">Status</TableHead>
                <TableHead className="font-mono text-xs text-muted-foreground whitespace-nowrap">11Labs ID</TableHead>
                <TableHead className="font-mono text-xs text-muted-foreground whitespace-nowrap">Stripe Session</TableHead>
                <TableHead className="font-mono text-xs text-muted-foreground whitespace-nowrap text-right">Created At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} className="border-border hover:bg-muted/30">
                  <TableCell className="font-medium whitespace-nowrap">{user.name}</TableCell>
                  <TableCell className="text-muted-foreground whitespace-nowrap">{user.email}</TableCell>
                  <TableCell className="font-mono text-sm whitespace-nowrap">
                    {user.phone || <span className="text-muted-foreground/50">N/A</span>}
                  </TableCell>
                  <TableCell className="font-mono text-sm whitespace-nowrap">
                    {user.viloNumber ? (
                      <span className="text-primary">{user.viloNumber}</span>
                    ) : (
                      <span className="text-muted-foreground italic">Pending...</span>
                    )}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <Badge
                      variant="outline"
                      className={`font-mono text-[10px] uppercase tracking-wider rounded-sm ${
                        user.status === 'active' ? 'bg-primary/10 text-primary border-primary/20' :
                        user.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                        'bg-red-500/10 text-red-500 border-red-500/20'
                      }`}
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {user.elevenLabsPhoneId ? (
                      <div 
                        className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-foreground cursor-pointer group"
                        onClick={() => copyToClipboard(user.elevenLabsPhoneId!, "ElevenLabs ID")}
                      >
                        {user.elevenLabsPhoneId.slice(0, 8)}...
                        <Copy className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    ) : (
                      <span className="text-muted-foreground/50 text-xs font-mono">-</span>
                    )}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {user.stripeSessionId ? (
                      <div 
                        className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-foreground cursor-pointer group"
                        onClick={() => copyToClipboard(user.stripeSessionId!, "Stripe Session ID")}
                      >
                        {user.stripeSessionId.slice(0, 12)}...
                        <Copy className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    ) : (
                      <span className="text-muted-foreground/50 text-xs font-mono">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right whitespace-nowrap font-mono text-xs text-muted-foreground">
                    {format(new Date(user.createdAt), "MMM d, yyyy h:mm a")}
                  </TableCell>
                </TableRow>
              ))}
              {users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground font-mono text-sm">
                    No users provisioned yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
