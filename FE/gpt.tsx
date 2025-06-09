import axios from 'axios';

export const analyzeSpending = async (spendingData: string) => {
  const messages = [
    { role: 'system', content: 'Bạn là trợ lý tài chính cá nhân.' },
    {
      role: 'user',
      content: `Dưới đây là dữ liệu chi tiêu của tôi:\n${spendingData}\nHãy phân tích và đưa ra đề xuất.`,
    },
  ];

  try {
    const response = await axios.post('http://192.168.100.134:3000/api/gpt', { messages });
    console.log('GPT phản hồi:', response.data);
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Lỗi gọi GPT server:', error);
    return null;
  }
};
