export class VAPIService {
  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_VAPI_API_KEY;
    this.baseUrl = 'https://api.vapi.ai';
    this.assistantIds = {
      environmental: process.env.NEXT_PUBLIC_VAPI_ENVIRONMENTAL_ASSISTANT_ID,
      mapping: process.env.NEXT_PUBLIC_VAPI_MAPPING_ASSISTANT_ID,
      analysis: process.env.NEXT_PUBLIC_VAPI_ANALYSIS_ASSISTANT_ID,
      general: process.env.NEXT_PUBLIC_VAPI_GENERAL_ASSISTANT_ID
    };
  }

  async createCall(phoneNumber, assistantConfig = {}) {
    try {
      const response = await fetch(`${this.baseUrl}/call`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber,
          assistantId: this.assistantId,
          ...assistantConfig
        })
      });

      return await response.json();
    } catch (error) {
      console.error('VAPI call creation failed:', error);
      throw error;
    }
  }

  async updateAssistant(assistantId, config) {
    try {
      const response = await fetch(`${this.baseUrl}/assistant/${assistantId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config)
      });

      return await response.json();
    } catch (error) {
      console.error('VAPI assistant update failed:', error);
      throw error;
    }
  }

  // Context-aware assistant configuration for different pages
  getPageSpecificConfig(pageName, pageData = {}) {
    const baseConfig = {
      voice: 'jennifer',
      language: 'en-US',
      forwardingPhoneNumber: process.env.VAPI_FORWARDING_NUMBER,
    };

    const pageConfigs = {
      dashboard: {
        ...baseConfig,
        firstMessage: "Hello! I'm AURA's environmental intelligence assistant. I can help you understand the satellite data, environmental metrics, and monitoring insights on your dashboard. What would you like to explore?",
        systemMessage: `You are AURA's environmental intelligence assistant. You have access to real-time environmental data for Africa including:
        - Current temperature: ${pageData.temperature || 'N/A'}
        - Vegetation health: ${pageData.ndvi || 'N/A'}  
        - Air quality index: ${pageData.aqi || 'N/A'}
        - Active monitoring sites: ${pageData.sites || 'N/A'}
        
        Help users understand environmental patterns, explain satellite data, and provide insights about African environmental conditions. Be knowledgeable, professional, and focused on environmental intelligence.`,
        functions: [
          {
            name: 'get_environmental_data',
            description: 'Get current environmental metrics and satellite data',
            parameters: {
              type: 'object',
              properties: {
                dataType: { type: 'string', enum: ['temperature', 'vegetation', 'air_quality', 'all'] },
                region: { type: 'string' }
              }
            }
          }
        ]
      },
      
      environmental: {
        ...baseConfig,
        firstMessage: "Hi! I'm your environmental mapping assistant. I can help you interpret satellite imagery, run environmental analysis, and explain the data patterns you're seeing. What analysis would you like to explore?",
        systemMessage: `You are AURA's environmental mapping specialist. You can help with:
        - Satellite imagery interpretation
        - Deforestation analysis using Hansen data
        - Water quality monitoring
        - Air quality assessment
        - Land use change detection
        
        Current analysis: ${pageData.analysisType || 'N/A'}
        Results: ${JSON.stringify(pageData.results || {})}
        
        Explain environmental patterns, help users understand satellite data analysis, and provide actionable insights for conservation efforts.`,
        functions: [
          {
            name: 'run_environmental_analysis',
            description: 'Trigger environmental analysis on the map',
            parameters: {
              type: 'object',
              properties: {
                analysisType: { type: 'string', enum: ['deforestation', 'water_quality', 'air_quality', 'land_use'] },
                coordinates: { type: 'array', items: { type: 'number' } }
              }
            }
          }
        ]
      },

      agriculture: {
        ...baseConfig,
        firstMessage: "Welcome to AURA's agricultural intelligence! I can help you understand crop health data, satellite monitoring results, and provide farming recommendations based on the satellite analysis. How can I assist with your agricultural monitoring?",
        systemMessage: `You are AURA's agricultural intelligence specialist. You have access to:
        - Crop health data (NDVI): ${pageData.ndvi || 'N/A'}
        - Soil moisture levels: ${pageData.moisture || 'N/A'}
        - Temperature data: ${pageData.temperature || 'N/A'}
        - Precipitation patterns: ${pageData.rainfall || 'N/A'}
        
        Provide agricultural insights, crop management advice, and help interpret satellite-based agricultural monitoring data for African farming contexts.`,
        functions: [
          {
            name: 'analyze_crop_field',
            description: 'Analyze specific field coordinates for crop health',
            parameters: {
              type: 'object',
              properties: {
                coordinates: { type: 'array', items: { type: 'number' } },
                analysisType: { type: 'string', enum: ['ndvi', 'moisture', 'temperature', 'rainfall'] }
              }
            }
          }
        ]
      },

      conservation: {
        ...baseConfig,
        firstMessage: "Hello! I'm your conservation and reforestation assistant. I can help you understand forest monitoring data, carbon tracking, and biodiversity protection insights. What conservation topic would you like to explore?",
        systemMessage: `You are AURA's conservation specialist. You help with:
        - Forest monitoring and deforestation tracking
        - Carbon credit analysis
        - Biodiversity conservation planning
        - Reforestation site optimization
        
        Current conservation metrics: ${JSON.stringify(pageData.metrics || {})}
        
        Provide conservation insights, reforestation guidance, and help users understand forest monitoring satellite data.`,
        functions: [
          {
            name: 'run_conservation_analysis',
            description: 'Run forest monitoring or conservation analysis',
            parameters: {
              type: 'object',
              properties: {
                analysisType: { type: 'string', enum: ['forest_loss', 'carbon_mapping', 'protected_areas', 'biodiversity'] },
                coordinates: { type: 'array', items: { type: 'number' } }
              }
            }
          }
        ]
      },

      urban: {
        ...baseConfig,
        firstMessage: "Welcome to AURA's urban planning intelligence! I can help you analyze satellite data for urban development, heat islands, air quality, and smart city planning. How can I assist with your urban analysis?",
        systemMessage: `You are AURA's urban planning specialist. You provide insights on:
        - Urban growth and expansion patterns
        - Heat island analysis and mitigation
        - Air quality monitoring
        - Green space optimization
        - Infrastructure planning
        
        Current urban metrics: ${JSON.stringify(pageData.metrics || {})}
        
        Help users understand urban satellite data and provide actionable urban planning recommendations.`,
        functions: [
          {
            name: 'analyze_urban_data',
            description: 'Analyze urban satellite data',
            parameters: {
              type: 'object',
              properties: {
                analysisType: { type: 'string', enum: ['urban_growth', 'land_surface_temp', 'green_space', 'air_quality', 'water_bodies'] },
                city: { type: 'string' }
              }
            }
          }
        ]
      },

      community: {
        ...baseConfig,
        firstMessage: "Hi! I'm your community engagement assistant. I can help you understand environmental data in your community context and facilitate discussions about local environmental issues. What would you like to explore?",
        systemMessage: `You are AURA's community engagement specialist. You help with:
        - Community environmental education
        - Local environmental impact explanation
        - Citizen science initiatives
        - Environmental awareness campaigns
        
        Focus on making environmental data accessible and actionable for community members.`
      },

      analytics: {
        ...baseConfig,
        firstMessage: "Hello! I'm your environmental analytics assistant. I can help you interpret data trends, generate reports, and understand complex environmental patterns. What analytics would you like to explore?",
        systemMessage: `You are AURA's analytics specialist. You provide:
        - Data trend analysis and interpretation
        - Environmental pattern recognition
        - Predictive insights
        - Report generation assistance
        
        Current analytics data: ${JSON.stringify(pageData.analytics || {})}
        
        Help users understand complex environmental data patterns and generate actionable insights.`,
        functions: [
          {
            name: 'generate_analytics_report',
            description: 'Generate environmental analytics report',
            parameters: {
              type: 'object',
              properties: {
                reportType: { type: 'string', enum: ['trend_analysis', 'prediction', 'summary', 'comparison'] },
                timeframe: { type: 'string' },
                region: { type: 'string' }
              }
            }
          }
        ]
      },

      settings: {
        ...baseConfig,
        firstMessage: "Hi! I'm here to help you configure your AURA platform settings and preferences. What would you like to adjust or learn about?",
        systemMessage: `You are AURA's settings and configuration assistant. You help with:
        - Platform configuration
        - User preferences
        - Data source settings
        - Notification preferences
        
        Provide clear guidance on platform customization and settings management.`
      },

      urban: {
        ...baseConfig,
        firstMessage: "Hi! I'm your urban planning and sustainability assistant. I can help you analyze urban heat islands, air pollution, and sustainable city development using satellite data. What urban analysis interests you?",
        systemMessage: `You are AURA's urban planning specialist. You help with:
        - Urban heat island analysis
        - Air pollution monitoring
        - Urban growth tracking
        - Sustainable development planning
        
        Focus on African urban contexts and provide actionable insights for sustainable city development.`
      },

      community: {
        ...baseConfig,
        firstMessage: "Welcome! I'm your community engagement assistant. I can help you understand environmental impacts on communities and facilitate citizen science initiatives. How can I help with community environmental projects?",
        systemMessage: `You are AURA's community engagement specialist. You help with:
        - Community environmental impact assessment
        - Citizen science project coordination
        - Environmental education and awareness
        - Community-based monitoring programs
        
        Focus on empowering African communities with environmental knowledge and tools.`
      },

      analytics: {
        ...baseConfig,
        firstMessage: "Hello! I'm your environmental analytics assistant. I can help you interpret data trends, generate reports, and understand the analytical insights from your environmental monitoring. What data would you like to explore?",
        systemMessage: `You are AURA's analytics specialist. You help with:
        - Environmental data interpretation
        - Trend analysis and forecasting
        - Report generation
        - Statistical analysis of satellite data
        
        Current analytics: ${JSON.stringify(pageData.analytics || {})}
        
        Provide clear explanations of complex environmental data and trends.`
      }
    };

    return pageConfigs[pageName] || baseConfig;
  }

  // Get appropriate assistant ID for page
  getAssistantIdForPage(pageName) {
    const pageAssistantMap = {
      dashboard: this.assistantIds.general,
      environmental: this.assistantIds.environmental,
      agriculture: this.assistantIds.environmental,
      conservation: this.assistantIds.environmental,
      urban: this.assistantIds.mapping,
      community: this.assistantIds.general,
      analytics: this.assistantIds.analysis,
      settings: this.assistantIds.general
    };
    
    return pageAssistantMap[pageName] || this.assistantIds.general;
  }

  // Trigger n8n workflow
  async triggerWorkflow(workflowType, pageData = {}, additionalData = {}) {
    try {
      const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_N8N_API_KEY}`
        },
        body: JSON.stringify({
          workflowType,
          pageData,
          additionalData,
          timestamp: new Date().toISOString()
        })
      });
      
      return await response.json();
    } catch (error) {
      console.error('N8N workflow trigger failed:', error);
      throw error;
    }
  }
}

export const vapiService = new VAPIService();
