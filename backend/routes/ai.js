// backend/routes/ai.js
const express = require('express');
const router = express.Router();
const axios = require('axios');

// GET /api/ai - Basic health check for AI service
router.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'AI Service is running',
    endpoints: [
      'POST /api/ai/symptom-checker'
    ]
  });
});

// POST /api/ai/symptom-checker - Analyze symptoms using AI
router.post('/symptom-checker', async (req, res) => {
  try {
    const { symptoms } = req.body;
    
    if (!symptoms) {
      return res.status(400).json({ error: 'Symptoms are required' });
    }

    // For demonstration, we'll use a mock AI response
    // In a real implementation, you would integrate with an AI service like OpenAI
    const aiResponse = await analyzeSymptoms(symptoms);
    
    res.status(200).json(aiResponse);
  } catch (error) {
    console.error('Error analyzing symptoms:', error);
    res.status(500).json({ error: 'Failed to analyze symptoms' });
  }
});

// Mock AI symptom analysis function
async function analyzeSymptoms(symptoms) {
  // In a real implementation, you would call an AI service like OpenAI:
  /*
  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a medical assistant. Analyze the symptoms provided and suggest possible conditions and recommendations.'
        },
        {
          role: 'user',
          content: symptoms
        }
      ],
      max_tokens: 500,
      temperature: 0.3
    },
    {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    }
  );
  
  const aiText = response.data.choices[0].message.content;
  */
  
  // Mock response for demonstration
  return {
    possibleConditions: [
      { name: 'Common Cold', likelihood: 'High' },
      { name: 'Seasonal Allergies', likelihood: 'Medium' },
      { name: 'Influenza', likelihood: 'Low' }
    ],
    recommendations: 'Rest, stay hydrated, and monitor your symptoms. If they worsen or persist for more than a week, consult a healthcare professional.',
    urgent: false,
    urgentMessage: null
  };
}

module.exports = router;