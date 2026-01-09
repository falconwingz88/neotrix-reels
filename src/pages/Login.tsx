import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { isAuthenticated, loading, login, signup } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      toast({
        title: "Welcome!",
        description: "You're logged in successfully.",
      });
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, loading, navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const result = isSignUp 
        ? await signup(username, password)
        : await login(username, password);
      
      if (result.error) {
        toast({
          title: isSignUp ? "Sign up failed" : "Login failed",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Floating blue circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -top-48 -left-48 animate-bounce" style={{ animationDuration: '8s' }} />
        <div className="absolute w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl top-1/4 right-0 animate-bounce" style={{ animationDuration: '10s', animationDelay: '1s' }} />
        <div className="absolute w-72 h-72 bg-blue-400/20 rounded-full blur-3xl bottom-0 left-1/4 animate-bounce" style={{ animationDuration: '9s', animationDelay: '2s' }} />
        <div className="absolute w-64 h-64 bg-cyan-400/15 rounded-full blur-3xl -bottom-32 -right-32 animate-bounce" style={{ animationDuration: '7s', animationDelay: '0.5s' }} />
      </div>
      <div className="absolute top-4 left-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="text-white hover:bg-white/10 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </div>

      <div className="w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 shadow-2xl">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-white text-center mb-2">
            {isSignUp ? 'Create Account' : 'Sign In'}
          </h1>
          <p className="text-white/60 text-center mb-8">
            {isSignUp 
              ? 'Create an account to save your calendar events'
              : 'Sign in to save your calendar events and access all tools'
            }
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-white/80">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white/80">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isSignUp ? "Min 6 characters" : "Enter your password"}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-6"
            >
              {isLoading ? (isSignUp ? 'Creating account...' : 'Signing in...') : (isSignUp ? 'Create Account' : 'Sign In')}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-white/60 hover:text-white text-sm transition-colors"
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
