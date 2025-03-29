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
} from '@mui/material';
import { Edit2, Trash2, LogOut, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function UserList() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editUser, setEditUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

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
    <div className="min-h-screen p-8"
    style={{ 
      background: 'radial-gradient(circle, rgba(241, 137, 18, 0.3) 20%, rgba(233, 158, 21, 0.3) 50%,rgb(241, 241, 241) 70%)' 
    }}>
      <div className="max-w-4xl mx-auto">
        <div className="floating-container p-6 mb-6 animate-fade ">
          <div className="flex justify-between items-center mb-6 rounded-lg">
            <div className="flex items-center ">
              <Users className="w-6 h-6 text-gray-700 mr-3" />
              <h1 className="text-2xl font-medium text-gray-800">User Management</h1>
            </div>
            <Button
              variant="outlined"
              startIcon={<LogOut />}
              onClick={handleLogout}
              sx={{
                borderColor: '#e2e8f0',
                color: '#64748b',
                '&:hover': {
                  borderColor: '#cbd5e1',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                },
              }}
            >
              Logout
            </Button>
          </div>

          <TableContainer className="bg-white/80 rounded-lg" sx={{ maxHeight: '400px', overflow: 'hidden' }}>

            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Avatar</TableCell>
                  <TableCell>First Name</TableCell>
                  <TableCell>Last Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>
                      <img
                        src={user.avatar}
                        alt={user.first_name}
                        className="w-10 h-10 rounded-full"
                      />
                    </TableCell>
                    <TableCell>{user.first_name}</TableCell>
                    <TableCell>{user.last_name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => handleEdit(user)}
                        size="small"
                        sx={{ color: '#64748b' }}
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

          <div className="flex justify-center mt-6">
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
            />
          </div>
        </div>

        <Dialog 
          open={openDialog} 
          onClose={() => setOpenDialog(false)}
          PaperProps={{
            className: 'floating-container',
            style: { maxWidth: '500px', width: '100%' }
          }}
        >
          <DialogTitle>Edit User</DialogTitle>
          <DialogContent>
            <div className="space-y-4 pt-4">
              <TextField
                fullWidth
                label="First Name"
                value={editUser?.first_name || ''}
                onChange={(e) => setEditUser({ ...editUser, first_name: e.target.value })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  }
                }}
              />
              <TextField
                fullWidth
                label="Last Name"
                value={editUser?.last_name || ''}
                onChange={(e) => setEditUser({ ...editUser, last_name: e.target.value })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  }
                }}
              />
              <TextField
                fullWidth
                label="Email"
                value={editUser?.email || ''}
                onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  }
                }}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpdate} 
              variant="contained"
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
      </div>
    </div>
  );
}

export default UserList;