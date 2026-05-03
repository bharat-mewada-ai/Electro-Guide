import app from './app';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`[SERVER] Electro-Guide backend running on http://localhost:${PORT}`);
  console.log(`[SERVER] Health check: http://localhost:${PORT}/health`);
});
