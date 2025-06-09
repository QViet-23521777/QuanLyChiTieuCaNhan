import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method not allowed');
  }

  const { spendingData, question } = req.body;

  const prompt = `
    Dưới đây là dữ liệu chi tiêu của tôi:\n${spendingData}\n
    Hãy phân tích và trả lời câu hỏi sau: ${question}
  `;

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'Bạn là một cố vấn tài chính thông minh.' },
          { role: 'user', content: prompt },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.json({ answer: response.data.choices[0].message.content });
  } catch (error: any) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: 'GPT API error' });
  }
}
