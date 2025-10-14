import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/moving-border';

const Signup = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    if (formData.fullName && formData.email && formData.password) {
      if (onLogin) {
        onLogin();
      }
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-md p-10 rounded-3xl border border-white/20 shadow-2xl w-full max-w-md mt-28">
        <div className="text-center mb-8">
          <h2 className="text-white text-4xl font-bold mb-2">Create Account</h2>
          <p className="text-white/70 text-lg">Join us today</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-white/80 text-sm font-medium">Full Name</label>
            <input 
              type="text" 
              name="fullName"
              placeholder="Enter your full name" 
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full p-4 rounded-xl bg-white/10 text-white placeholder-white/50 border border-white/20 focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-400/20 transition-all duration-300"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-white/80 text-sm font-medium">Email</label>
            <input 
              type="email" 
              name="email"
              placeholder="Enter your email" 
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-4 rounded-xl bg-white/10 text-white placeholder-white/50 border border-white/20 focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-400/20 transition-all duration-300"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-white/80 text-sm font-medium">Password</label>
            <input 
              type="password" 
              name="password"
              placeholder="Create a password" 
              value={formData.password}
              onChange={handleInputChange}
              className="w-full p-4 rounded-xl bg-white/10 text-white placeholder-white/50 border border-white/20 focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-400/20 transition-all duration-300"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-white/80 text-sm font-medium">Confirm Password</label>
            <input 
              type="password" 
              name="confirmPassword"
              placeholder="Confirm your password" 
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="w-full p-4 rounded-xl bg-white/10 text-white placeholder-white/50 border border-white/20 focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-400/20 transition-all duration-300"
              required
            />
          </div>
          
          <Button 
            borderRadius="0.75rem"
            className="bg-white/10 backdrop-blur-md text-white border-white/20 hover:bg-white/20 transition-all duration-300 px-4 py-2 text-sm font-medium cursor-pointer "
            onClick={handleSubmit}
          >
            Create Account
          </Button>
        </form>
        
        <div className="mt-8 text-center">
          <p className="text-white/70">
            Already have an account? 
            <Link to="/login" className="text-green-400 ml-1 hover:text-green-300 font-semibold transition-colors duration-300">
              Sign in here
            </Link>
          </p>
        </div>
        
      </div>
    </div>
  );
};

export default Signup;