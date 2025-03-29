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
        background: 'radial-gradient(circle, rgba(224, 126, 15, 0.3) 10%, rgba(222, 151, 19, 0.3) 30%, #ffffff 70%)',
        padding: '1rem'
      }}
    >
      <div 
        className="w-full p-6 md:p-8 rounded-xl shadow-lg bg-white/90 backdrop-blur-sm"
        style={{
          maxWidth: '28rem', // Slightly wider on desktop
          margin: '1rem',
          transition: 'all 0.3s ease'
        }}
      >
        <div className="flex flex-col items-center justify-center mb-6 md:mb-8">

          <Typography 
            variant="h4" 
            component="h1" 
            className="text-gray-900 font-bold"
            sx={{
              fontSize: { xs: '1.5rem', sm: '2rem' } // Responsive font size
            }}
          >
            Sign In
          </Typography>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
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
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
              },
              '& .MuiInputLabel-root': {
                fontSize: { xs: '0.875rem', sm: '1rem' } // Responsive label size
              }
            }}
            size="small" // Smaller on mobile
            margin="normal"
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
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
              },
              '& .MuiInputLabel-root': {
                fontSize: { xs: '0.875rem', sm: '1rem' } // Responsive label size
              }
            }}
            size="small" // Smaller on mobile
            margin="normal"
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
              },
              py: { xs: '0.5rem', sm: '0.75rem' }, // Responsive padding
              fontSize: { xs: '0.875rem', sm: '1rem' } // Responsive font size
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
          <Typography 
            variant="body2" 
            className="text-center text-gray-500 mt-4"
            sx={{
              fontSize: { xs: '0.75rem', sm: '0.875rem' } // Responsive font size
            }}
          >
            Use email: eve.holt@reqres.in | password: cityslicka
          </Typography>
        </form>
      </div>
    </div>
  );
}

export default Login;