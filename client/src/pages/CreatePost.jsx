import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { postService, categoryService } from '../services/api';

function CreatePost() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    featuredImage: null,
  });
  const [error, setError] = useState('');

  const { data: categories } = useQuery('categories', categoryService.getCategories);

  const createPostMutation = useMutation(postService.createPost, {
    onSuccess: () => {
      queryClient.invalidateQueries('posts');
      navigate('/');
    },
    onError: (err) => {
      setError(err.response?.data?.message || 'An error occurred');
    },
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'featuredImage' && files?.length) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createPostMutation.mutate(formData);
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create New Post
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="title"
            label="Post Title"
            name="title"
            autoFocus
            value={formData.title}
            onChange={handleChange}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            multiline
            rows={6}
            name="content"
            label="Content"
            id="content"
            value={formData.content}
            onChange={handleChange}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              label="Category"
            >
              {categories?.data.map((category) => (
                <MenuItem key={category._id} value={category._id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ mt: 2 }}>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="featured-image"
              type="file"
              name="featuredImage"
              onChange={handleChange}
            />
            <label htmlFor="featured-image">
              <Button variant="outlined" component="span">
                Upload Featured Image
              </Button>
            </label>
            {formData.featuredImage && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Selected file: {formData.featuredImage.name}
              </Typography>
            )}
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3 }}
            disabled={createPostMutation.isLoading}
          >
            {createPostMutation.isLoading ? 'Creating...' : 'Create Post'}
          </Button>
        </form>
      </Paper>
    </Container>
  );
}

export default CreatePost;