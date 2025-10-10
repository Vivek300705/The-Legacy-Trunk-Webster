import React, { useState, useEffect } from 'react';
import { getRandomPrompt } from '../api/services';
import { Box, Typography, Button, Paper, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const MemoryPrompt = () => {
  const [prompt, setPrompt] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchNewPrompt = async () => {
    setLoading(true);
    try {
      const data = await getRandomPrompt();
      setPrompt(data);
    } catch (error) {
      console.error("Error fetching prompt:", error);
      setPrompt({ question: "Could not fetch a prompt. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewPrompt();
  }, []);

  const handleWrite = () => {
    // Navigate to the story editor, passing the prompt as state
    navigate('/story-editor', { state: { prompt: prompt?.question } });
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ p: 3, my: 4, textAlign: 'center', backgroundColor: 'primary.lightest', borderRadius: 3 }}
    >
      <Typography variant="h6" color="text.secondary" gutterBottom>
        Need some inspiration?
      </Typography>
      <Typography variant="body1" sx={{ fontStyle: 'italic', minHeight: '3em' }}>
        {loading ? <CircularProgress size={24} /> : prompt?.question}
      </Typography>
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 1 }}>
        <Button onClick={fetchNewPrompt}>
          New Prompt
        </Button>
        <Button variant="contained" onClick={handleWrite} disabled={!prompt || loading}>
          Write About This
        </Button>
      </Box>
    </Paper>
  );
};

export default MemoryPrompt;