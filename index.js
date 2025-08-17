import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Configuration, OpenAIApi } from 'openai';
import axios from 'axios';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAIApi(
  new Configuration({ apiKey: process.env.OPENAI_API_KEY })
);

// 2.1 Chat Completion
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const completion = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [{ role: 'user', content: message }]
    });
    res.json({ reply: completion.data.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2.2 Image Generation (DALL·E)
app.post('/api/image', async (req, res) => {
  try {
    const { prompt } = req.body;
    const response = await openai.createImage({
      prompt,
      n: 1,
      size: '512x512'
    });
    res.json({ imageUrl: response.data.data[0].url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2.3 3D Model Generation (via Replicate or similar)
// This example uses a hypothetical Replicate “image-to-3d” model.
app.post('/api/model', async (req, res) => {
  try {
    const { imageUrl } = req.body;
    const replicateRes = await axios.post(
      'https://api.replicate.com/v1/predictions',
      {
        version: 'your-3d-model-version-id',
        input: { image: imageUrl }
      },
      {
        headers: {
          Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`
        }
      }
    );
    // Poll until finished
    let modelData;
    while (!modelData) {
      const status = await axios.get(
        `https://api.replicate.com/v1/predictions/${replicateRes.data.id}`,
        {
          headers: { Authorization: `Token ${process.env.REPLICATE_API_TOKEN}` }
        }
      );
      if (status.data.status === 'succeeded') {
        modelData = status.data.output;
      } else if (status.data.status === 'failed') {
        throw new Error('3D model generation failed');
      } else {
        await new Promise(r => setTimeout(r, 2000));
      }
    }
    res.json({ model: modelData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
