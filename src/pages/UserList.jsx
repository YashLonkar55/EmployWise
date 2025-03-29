import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Pagination,
  IconButton,
  useMediaQuery,
  Box,
  Typography
} from '@mui/material';
import { Edit2, Trash2, LogOut, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

function UserList() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editUser, setEditUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const fetchUsers = async () => {
    try {
      const response = await fetch(`https://reqres.in/api/users?page=${page}`);
      const data = await response.json();
      setUsers(data.data);
      setTotalPages(data.total_pages);
    } catch (error) {
      toast.error('Failed to fetch users');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const handleEdit = (user) => {
    setEditUser(user);
    setOpenDialog(true);
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`https://reqres.in/api/users/${id}`, {
        method: 'DELETE',
      });
      setUsers(users.filter(user => user.id !== id));
      toast.success('User deleted successfully');
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`https://reqres.in/api/users/${editUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editUser),
      });

      if (!response.ok) throw new Error('Failed to update user');

      setUsers(users.map(user => 
        user.id === editUser.id ? editUser : user
      ));
      
      setOpenDialog(false);
      toast.success('User updated successfully');
    } catch (error) {
      toast.error('Failed to update user');
    }
  };

  const handleLogout = () => {
    logout();
    toast('Logged out successfully');
    navigate('/login');
  };

  return (
    <Box 
      className="min-h-screen p-4 md:p-8"
      sx={{ 
        background: 'radial-gradient(circle, rgba(241, 137, 18, 0.3) 20%, rgba(233, 158, 21, 0.3) 50%,rgb(241, 241, 241) 70%)',
        overflowX: 'hidden'
      }}
    >
      <Box className="max-w-6xl mx-auto">
        <Box className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-4 md:p-6 mb-6">
          <Box className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
            <Box className="flex items-center">
              <Users className="w-5 h-5 md:w-6 md:h-6 text-gray-700 mr-2 md:mr-3" />
              <Typography variant="h5" component="h1" className="text-gray-800 font-medium">
                User Management
              </Typography>
            </Box>
            <Button
              variant="outlined"
              startIcon={<LogOut size={isMobile ? 16 : 20} />}
              onClick={handleLogout}
              size={isMobile ? 'small' : 'medium'}
              sx={{
                borderColor: '#e2e8f0',
                color: '#64748b',
                '&:hover': {
                  borderColor: '#cbd5e1',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                },
              }}
            >
              {isMobile ? 'Logout' : 'Logout'}
            </Button>
          </Box>

          <TableContainer 
            sx={{ 
              maxHeight: '60vh', 
              overflow: 'auto',
              '&::-webkit-scrollbar': {
                width: '6px',
                height: '6px'
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#cbd5e1',
                borderRadius: '3px'
              }
            }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {!isMobile && <TableCell>Avatar</TableCell>}
                  <TableCell>First Name</TableCell>
                  <TableCell>Last Name</TableCell>
                  {!isMobile && <TableCell>Email</TableCell>}
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} hover>
                    {!isMobile && (
                      <TableCell>
                        <img
                          src={user.avatar}
                          alt={`${user.first_name} ${user.last_name}`}
                          className="w-8 h-8 md:w-10 md:h-10 rounded-full"
                        />
                      </TableCell>
                    )}
                    <TableCell>{user.first_name}</TableCell>
                    <TableCell>{user.last_name}</TableCell>
                    {!isMobile && <TableCell>{user.email}</TableCell>}
                    <TableCell>
                      <IconButton
                        onClick={() => handleEdit(user)}
                        size="small"
                        sx={{ color: '#64748b', mr: 1 }}
                      >
                        <Edit2 className="w-4 h-4" />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(user.id)}
                        size="small"
                        sx={{ color: '#ef4444' }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box className="flex justify-center mt-4 md:mt-6">
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
              size={isMobile ? 'small' : 'medium'}
              siblingCount={isMobile ? 0 : 1}
            />
          </Box>
        </Box>

        <Dialog 
          open={openDialog} 
          onClose={() => setOpenDialog(false)}
          fullScreen={isMobile}
          PaperProps={{
            sx: {
              width: isMobile ? '100%' : '500px',
              maxWidth: '100%',
              borderRadius: isMobile ? 0 : '12px',
              bgcolor: 'background.paper'
            }
          }}
        >
          <DialogTitle sx={{ fontSize: isMobile ? '1.25rem' : '1.5rem' }}>
            Edit User
          </DialogTitle>
          <DialogContent>
            <Box className="space-y-3 md:space-y-4 pt-2 md:pt-4">
              <TextField
                fullWidth
                label="First Name"
                value={editUser?.first_name || ''}
                onChange={(e) => setEditUser({ ...editUser, first_name: e.target.value })}
                size={isMobile ? 'small' : 'medium'}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  }
                }}
              />
              <TextField
                fullWidth
                label="Last Name"
                value={editUser?.last_name || ''}
                onChange={(e) => setEditUser({ ...editUser, last_name: e.target.value })}
                size={isMobile ? 'small' : 'medium'}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  }
                }}
              />
              <TextField
                fullWidth
                label="Email"
                value={editUser?.email || ''}
                onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                size={isMobile ? 'small' : 'medium'}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  }
                }}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button 
              onClick={() => setOpenDialog(false)}
              size={isMobile ? 'small' : 'medium'}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleUpdate} 
              variant="contained"
              size={isMobile ? 'small' : 'medium'}
              sx={{
                backgroundColor: '#1e293b',
                '&:hover': {
                  backgroundColor: '#334155'
                }
              }}
            >
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}

export default UserList;