import { useState } from 'react';
import axios from 'axios'; // ✅ Import axios
import Container from '@mui/material/Container';  
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import './App.css';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

function App() {
  const [emailContent, setEmailContent] = useState('');
  const [tone, setTone] = useState('');
  const [generatedReply, setGeneratedReply] = useState('');
  const [loading, setLoading] = useState(false); // ✅ Use boolean
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setLoading(true); // ✅ Start loading
    setError('');

    try {
      const payload = { emailContent, tone }; // ✅ Send as object
      const response = await axios.post("http://localhost:8080/api/email/generate", payload);

      setGeneratedReply(typeof response.data === 'string' ? response.data : JSON.stringify(response.data));
    } catch (error) {
      setError("Failed to generate the email reply");
      console.error(error);
    } finally {
      setLoading(false); // ✅ Stop loading
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant='h3' component="h1" gutterBottom>
        Email Reply Generator
      </Typography>

      <Box>
        <TextField
          fullWidth
          multiline
          rows={6}
          variant='outlined'
          label="Original Email Content"
          value={emailContent}
          onChange={(e) => setEmailContent(e.target.value)}
          sx={{ mb: 2 }}
        />

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Tone (Optional)</InputLabel>
          <Select
            value={tone}
            label="Tone (Optional)"
            onChange={(e) => setTone(e.target.value)}
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="Professional">Professional</MenuItem>
            <MenuItem value="Casual">Casual</MenuItem>
            <MenuItem value="Friendly">Friendly</MenuItem> 
          </Select>
        </FormControl>

        <Button
          variant='contained'
          onClick={handleSubmit}
          disabled={!emailContent || loading}
          fullWidth
        >
          {loading ? <CircularProgress size={24} /> : "Generate Reply"} 
        </Button>
      </Box>

      {error && (
        <Typography color='error' sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Box sx={{ mt: 3 }}>
        <Typography variant='h6' gutterBottom>
          Generated Reply
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={6}
          variant='outlined'
          value={generatedReply}
          InputProps={{ readOnly: true }} 
        />
        <Button
          variant='outlined'
          sx={{ mt: 3 }}
          onClick={() => navigator.clipboard.writeText(generatedReply)}
        >
          Copy to Clipboard
        </Button>
      </Box>
    </Container>
  );
}

export default App;
