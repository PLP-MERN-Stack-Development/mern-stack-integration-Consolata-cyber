import { useState } from 'react';
import { useQuery } from 'react-query';
import { Link as RouterLink } from 'react-router-dom';
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Pagination,
  Box,
} from '@mui/material';
import { postService } from '../services/api';

function Home() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useQuery(
    ['posts', page],
    () => postService.getPosts(page),
    {
      keepPreviousData: true,
    }
  );

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error.message}</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Latest Posts
      </Typography>
      <Grid container spacing={4}>
        {data.data.posts.map((post) => (
          <Grid item xs={12} sm={6} md={4} key={post._id}>
            <Card
              component={RouterLink}
              to={`/posts/${post._id}`}
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                textDecoration: 'none'
              }}
            >
              {post.featuredImage && (
                <CardMedia
                  component="img"
                  height="200"
                  image={post.featuredImage}
                  alt={post.title}
                />
              )}
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  {post.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {post.content.substring(0, 150)}...
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 2 }}>
                  By {post.author.username} • {new Date(post.createdAt).toLocaleDateString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Pagination
          count={data.data.totalPages}
          page={page}
          onChange={(_, value) => setPage(value)}
          color="primary"
        />
      </Box>
    </Box>
  );
}

export default Home;