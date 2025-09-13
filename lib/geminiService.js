import { GoogleGenerativeAI } from '@google/genai';

class GeminiService {
  constructor() {
    this.genAI = null;
    this.model = null;
    this.isInitialized = false;
  }

  async initialize() {
    try {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('Google Gemini API key not found');
      }

      this.genAI = new GoogleGenerativeAI({ apiKey });
      this.model = 'gemini-2.0-flash-exp';
      this.isInitialized = true;
      console.log('Gemini service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Gemini service:', error);
      throw error;
    }
  }

  async analyzeCropData(cropData, location, cropType) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      const prompt = `
        As an agricultural expert, analyze the following crop data and provide recommendations:

        Location: ${location}
        Crop Type: ${cropType}
        
        Environmental Data:
        - NDVI (Vegetation Health): ${cropData.ndvi || 'N/A'}
        - Soil Moisture: ${cropData.soilMoisture || 'N/A'}
        - Temperature: ${cropData.temperature || 'N/A'}°C
        - Precipitation: ${cropData.precipitation || 'N/A'}mm
        - Air Quality: ${cropData.airQuality || 'N/A'}
        - Water Quality: ${cropData.waterQuality || 'N/A'}

        Please provide:
        1. Overall crop health assessment
        2. Specific recommendations for improving yield
        3. Irrigation recommendations based on soil moisture and precipitation
        4. Fertilizer recommendations
        5. Pest and disease risk assessment
        6. Optimal planting/harvesting timing
        7. Climate adaptation strategies

        Format the response as a structured analysis with clear sections.
      `;

      const tools = [
        {
          googleSearch: {}
        }
      ];

      const config = {
        thinkingConfig: {
          thinkingBudget: -1
        },
        tools
      };

      const contents = [
        {
          role: 'user',
          parts: [
            {
              text: prompt
            }
          ]
        }
      ];

      const response = await this.genAI.models.generateContentStream({
        model: this.model,
        config,
        contents
      });

      let fullText = '';
      for await (const chunk of response) {
        if (chunk.text) {
          fullText += chunk.text;
        }
      }

      return {
        analysis: fullText,
        recommendations: this.extractRecommendations(fullText)
      };
    } catch (error) {
      console.error('Error analyzing crop data:', error);
      throw error;
    }
  }

  async getCropRecommendations(location, season, soilType, cropType) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      const prompt = `
        Provide agricultural recommendations for:
        
        Location: ${location}
        Season: ${season}
        Soil Type: ${soilType}
        Crop Type: ${cropType || 'General farming'}

        Please provide specific recommendations for:
        1. Best crops to plant in this location and season
        2. Planting techniques and timing
        3. Irrigation strategies
        4. Fertilizer application schedule
        5. Pest management
        6. Expected yield and market considerations
        7. Sustainable farming practices
        8. Climate resilience strategies

        Provide practical, actionable advice suitable for African farming conditions.
      `;

      const tools = [
        {
          googleSearch: {}
        }
      ];

      const config = {
        thinkingConfig: {
          thinkingBudget: -1
        },
        tools
      };

      const contents = [
        {
          role: 'user',
          parts: [
            {
              text: prompt
            }
          ]
        }
      ];

      const response = await this.genAI.models.generateContentStream({
        model: this.model,
        config,
        contents
      });

      let fullText = '';
      for await (const chunk of response) {
        if (chunk.text) {
          fullText += chunk.text;
        }
      }

      return fullText;
    } catch (error) {
      console.error('Error getting crop recommendations:', error);
      throw error;
    }
  }

  async analyzeFieldImage(imageData, location) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      const prompt = `
        Analyze this agricultural field image and provide:
        
        1. Crop identification
        2. Health assessment
        3. Growth stage determination
        4. Visible issues (diseases, pests, nutrient deficiencies)
        5. Recommendations for improvement
        6. Estimated yield potential
        
        Location context: ${location}
        
        Provide detailed, actionable insights for the farmer.
      `;

      const imagePart = {
        inlineData: {
          data: imageData,
          mimeType: 'image/jpeg'
        }
      };

      const result = await this.model.generateContent([prompt, imagePart]);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error analyzing field image:', error);
      throw error;
    }
  }

  async getWeatherBasedAdvice(weatherData, cropType, location) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      const prompt = `
        Based on the current and forecasted weather conditions, provide agricultural advice:

        Location: ${location}
        Crop: ${cropType}
        
        Weather Data:
        - Current Temperature: ${weatherData.temperature}°C
        - Humidity: ${weatherData.humidity}%
        - Precipitation: ${weatherData.precipitation}mm
        - Wind Speed: ${weatherData.windSpeed}km/h
        - UV Index: ${weatherData.uvIndex}

        Provide specific advice for:
        1. Immediate actions needed (next 24-48 hours)
        2. Irrigation adjustments
        3. Disease/pest risk management
        4. Harvesting timing considerations
        5. Protective measures if needed
        6. Fertilizer application timing
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error getting weather-based advice:', error);
      throw error;
    }
  }

  extractRecommendations(text) {
    // Extract key recommendations from unstructured text
    const recommendations = [];
    const lines = text.split('\n');
    
    for (const line of lines) {
      if (line.includes('recommend') || line.includes('suggest') || line.includes('should')) {
        recommendations.push(line.trim());
      }
    }
    
    return recommendations;
  }

  async getPestDiseaseIdentification(symptoms, cropType, location) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      const prompt = `
        Help identify pest or disease based on these symptoms:

        Crop: ${cropType}
        Location: ${location}
        Symptoms: ${symptoms}

        Provide:
        1. Most likely pest/disease identification
        2. Confidence level of diagnosis
        3. Treatment recommendations
        4. Prevention strategies
        5. Expected recovery timeline
        6. When to seek professional help

        Focus on solutions available in African agricultural contexts.
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error identifying pest/disease:', error);
      throw error;
    }
  }
}

export const geminiService = new GeminiService();
