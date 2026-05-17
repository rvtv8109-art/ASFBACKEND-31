// index.ts
import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import axios from 'axios';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());

// Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

// Brevo (Email) Integration
app.post('/api/send-email', async (req: Request, res: Response) => {
  try {
    const { email, name, subject, htmlContent } = req.body;
    const response = await axios.post('https://api.brevo.com/v3/smtp/email', {
      sender: { name: process.env.SENDER_NAME, email: process.env.SENDER_EMAIL },
      to: [{ email, name }],
      subject,
      htmlContent
    }, {
      headers: {
        'api-key': process.env.BREVO_API_KEY,
        'content-type': 'application/json'
      }
    });
    res.json(response.data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
