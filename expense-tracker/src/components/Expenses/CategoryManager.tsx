import React, { useState } from 'react';
import { 
  Box, Typography, TextField, IconButton, Stack, Paper, Tooltip, CircularProgress 
} from '@mui/material';
import { 
  useCategories, useAddCategory, useUpdateCategory, useDeleteCategory 
} from '../../hooks/useExpenses';
import { motion, AnimatePresence } from 'framer-motion';
import AddIcon from '@mui/icons-material/AddRounded';
import DeleteIcon from '@mui/icons-material/DeleteRounded';
import EditIcon from '@mui/icons-material/EditRounded';
import SaveIcon from '@mui/icons-material/CheckRounded';
import CloseIcon from '@mui/icons-material/CloseRounded';
import CategoryIcon from '@mui/icons-material/CategoryRounded';

export default function CategoryManager() {
  const { data: categories, isLoading } = useCategories();
  const addCategory = useAddCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const [newCategory, setNewCategory] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');

  // Handle Add
  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    addCategory.mutate(newCategory, { onSuccess: () => setNewCategory('') });
  };

  // Start Edit Mode
  const startEdit = (cat: any) => {
    setEditingId(cat.id);
    setEditName(cat.name);
  };

  // Save Edit
  const saveEdit = () => {
    if (editingId && editName.trim()) {
      updateCategory.mutate({ id: editingId, name: editName });
      setEditingId(null);
    }
  };

  // Handle Delete
  const handleDelete = (id: number) => {
    if (window.confirm('Delete this category?')) {
      deleteCategory.mutate(id, {
        onError: (err) => alert(err.message) // Show error if expenses are linked
      });
    }
  };

  if (isLoading) return <Box sx={{p:4, display:'flex', justifyContent:'center'}}><CircularProgress /></Box>;

  return (
    <Box>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
        <CategoryIcon sx={{ color: 'secondary.main', fontSize: 30 }} />
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Manage Categories
        </Typography>
      </Stack>

      {/* --- Add New Input --- */}
      <Paper 
        component="form" 
        onSubmit={handleAdd}
        sx={{ 
          p: '2px 4px', display: 'flex', alignItems: 'center', mb: 3,
          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' 
        }}
      >
        <TextField
          sx={{ ml: 1, flex: 1, '& fieldset': { border: 'none' } }}
          placeholder="Create new category..."
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <IconButton type="submit" color="secondary" sx={{ p: '10px' }} disabled={addCategory.isPending}>
          {addCategory.isPending ? <CircularProgress size={24} /> : <AddIcon />}
        </IconButton>
      </Paper>

      {/* --- Category List --- */}
      <Stack spacing={2}>
        <AnimatePresence>
          {categories?.map((cat: any) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              layout
            >
              <Paper sx={{ 
                p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: editingId === cat.id ? 'rgba(139, 92, 246, 0.1)' : 'rgba(255,255,255,0.03)',
                border: editingId === cat.id ? '1px solid #8B5CF6' : '1px solid rgba(255,255,255,0.05)'
              }}>
                
                {editingId === cat.id ? (
                  // EDIT MODE
                  <>
                    <TextField 
                      value={editName} 
                      onChange={(e) => setEditName(e.target.value)} 
                      variant="standard" 
                      fullWidth 
                      autoFocus
                      sx={{ mr: 2 }}
                    />
                    <Stack direction="row">
                        <IconButton onClick={saveEdit} color="primary"><SaveIcon /></IconButton>
                        <IconButton onClick={() => setEditingId(null)}><CloseIcon /></IconButton>
                    </Stack>
                  </>
                ) : (
                  // VIEW MODE
                  <>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>{cat.name}</Typography>
                    <Stack direction="row" spacing={1}>
                        <Tooltip title="Edit">
                            <IconButton size="small" onClick={() => startEdit(cat)} sx={{ '&:hover': { color: 'primary.main' } }}>
                                <EditIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                            <IconButton size="small" onClick={() => handleDelete(cat.id)} sx={{ '&:hover': { color: 'error.main' } }}>
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                  </>
                )}
              </Paper>
            </motion.div>
          ))}
        </AnimatePresence>
      </Stack>
    </Box>
  );
}