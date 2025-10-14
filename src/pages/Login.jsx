import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/moving-border';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      onLogin(); 
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-md p-10 rounded-3xl border border-white/20 shadow-2xl w-full max-w-md mt-10">
        <div className="text-center mb-8">
          <h2 className="text-white text-4xl font-bold mb-2">Welcome Back</h2>
          <p className="text-white/70 text-lg">Sign in to your account</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-white/80 text-sm font-medium">Email</label>
            <input 
              type="email" 
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 rounded-xl bg-white/10 text-white placeholder-white/50 border border-white/20 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-all duration-300"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-white/80 text-sm font-medium">Password</label>
            <input 
              type="password" 
              placeholder="Enter your password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 rounded-xl bg-white/10 text-white placeholder-white/50 border border-white/20 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-all duration-300"
              required
            />
          </div>
          
          <Button 
            borderRadius="1rem"
            className="bg-white/10 backdrop-blur-md text-white border-white/20 hover:bg-white/20 transition-all duration-300 px-4 py-2 text-sm font-medium cursor-pointer"
            onClick={handleSubmit}
          >
            Sign In
          </Button>
        </form>
        
        <div className="mt-8 text-center">
          <p className="text-white/70">
            Don't have an account? 
            <Link to="/signup" className="text-blue-400 ml-1 hover:text-blue-300 font-semibold transition-colors duration-300">
              Sign up here
            </Link>
          </p>
        </div>
        
        
      </div>
    </div>
  );
};

export default Login;