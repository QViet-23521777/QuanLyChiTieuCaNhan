import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

let requestCount = 0;
const MAX_REQUESTS_PER_MINUTE = 3;
let isPaused = false;

const resetRequestCount = () => {
  requestCount = 0;
  isPaused = false;
  console.log('🟢 Cho phép gọi API trở lại.');
};

// API route
app.post('/api/gpt', async (req, res) => {
  if (isPaused) {
    return res.status(429).json({ error: 'Đang tạm ngưng do vượt quá giới hạn. Vui lòng thử lại sau.' });
  }

  requestCount++;

  if (requestCount > MAX_REQUESTS_PER_MINUTE) {
    isPaused = true;
    console.log('⛔ Vượt quá giới hạn. Tạm ngừng trong 60s...');
    setTimeout(resetRequestCount, 60000); // Đặt lại sau 60s
    return res.status(429).json({ error: 'Vượt quá giới hạn số lần gọi. Vui lòng thử lại sau 1 phút.' });
  }

  try {
    const { messages } = req.body;

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: messages,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('Phản hồi GPT:', response.data);
    // res.status(200).json(response.data);

    res.json(response.data);
  } catch (err) {
    console.error('GPT Error:', err.response?.data || err.message);
    res.status(500).json({ error: 'GPT API error', detail: err.message });
  }
});



app.listen(PORT, () => {
  console.log(`GPT Server đang chạy tại http://localhost:${PORT}`);
});
