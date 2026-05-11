import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../lib/auth";
import { toast } from "@/hooks/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;
    try {
      setLoading(true);
      await login(username.trim(), password);
      toast({ title: "Logged in", description: "Welcome back!" });
      navigate("/ce", { replace: true });
    } catch (err) {
      toast({
        title: "Login failed",
        description: (err as Error).message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm bg-card rounded-xl shadow-[var(--shadow-card)] p-6 space-y-4 border border-border"
      >
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold">Sign in</h1>
          <p className="text-sm text-muted-foreground">
            Login to your Srijan IVF account
          </p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-primary/40"
            placeholder="user_one"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-primary/40"
            placeholder="••••••••"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[image:var(--gradient-brand)] text-white py-2 rounded-md text-sm font-semibold shadow hover:-translate-y-0.5 transition disabled:opacity-60 disabled:translate-y-0"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </main>
  );
};

export default Login;