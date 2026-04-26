import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else if (data.session) {
      navigate("/");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-primary">BR|vis.case</h2>
          <p className="mt-2 text-sm text-muted-foreground">Entrar no sistema de automação</p>
        </div>
        <div className="bg-card p-8 rounded-xl shadow-sm border">
          <form className="space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="p-3 text-sm text-destructive-foreground bg-destructive/90 rounded-md">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-2">E-mail</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" 
                placeholder="admin@brviscase.com" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Senha</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" 
                placeholder="••••••••" 
              />
            </div>
            <button 
              type="submit"
              disabled={loading}
              className="w-full h-10 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {loading ? "Entrando..." : "Fazer Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
