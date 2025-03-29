import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography } from '@mui/material';
import { LogIn } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('https://reqres.in/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      login(data.token);
      toast.success('Welcome back!');
      navigate('/');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
  className="min-h-screen flex items-center justify-center p-4" 
  style={{ 
    background: 'radial-gradient(circle, rgba(224, 126, 15, 0.3) 10%, rgba(222, 151, 19, 0.3) 30%, #ffffff 70%)' 
  }}
>



      <div className="w-full max-w-md p-8 floating-container animate-fade">
        <div className="flex items-center justify-center mb-8">
          <Typography variant="h4" component="h1" className="text-gray-900 font-bold">
            Sign In
          </Typography>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
              }
            }}
          />
          <TextField
            fullWidth
            label="Password"
            variant="outlined"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
              }
            }}
          />
          <Button
            fullWidth
            variant="contained"
            type="submit"
            disabled={loading}
            sx={{
              textTransform: 'none',
              backgroundColor: '#1e293b',
              '&:hover': {
                backgroundColor: '#334155'
              }
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
          <Typography variant="body2" className="text-center text-gray-500 mt-4">
            Use email: eve.holt@reqres.in | password: cityslicka
          </Typography>
        </form>
      </div>
    </div>
  );
}

export default Login;