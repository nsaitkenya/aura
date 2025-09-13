# AURA Platform Integration Guide
## Google Earth Engine & VAPI Voice Assistant Implementation

This guide provides step-by-step instructions for integrating Google Earth Engine satellite data and VAPI voice assistant capabilities into your AURA environmental platform.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Google Cloud Project with Earth Engine API enabled
- VAPI account and API keys
- n8n instance (optional for advanced workflows)

### Installation Commands
```bash
# Install required dependencies
npm install @google/earthengine --legacy-peer-deps
npm install leaflet leaflet.markercluster --legacy-peer-deps
npm install ol --legacy-peer-deps
npm install --save-dev @types/leaflet @types/ol --legacy-peer-deps
```

## 📋 Environment Configuration

### Required Environment Variables
Copy the following to your `.env.local` file and replace placeholder values:

```bash
# Google Earth Engine & Maps
NEXT_PUBLIC_GOOGLE_EARTH_ENGINE_TOKEN=your_earth_engine_token_here
NEXT_PUBLIC_GOOGLE_EARTH_ENGINE_CLIENT_ID=your_oauth_client_id_here
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
NEXT_PUBLIC_GOOGLE_MAPS_ID=your_google_maps_id_here

# VAPI Voice Assistant Configuration
NEXT_PUBLIC_VAPI_API_KEY=your_vapi_api_key_here
NEXT_PUBLIC_VAPI_ENVIRONMENTAL_ASSISTANT_ID=asst_environmental_123
NEXT_PUBLIC_VAPI_MAPPING_ASSISTANT_ID=asst_mapping_456
NEXT_PUBLIC_VAPI_ANALYSIS_ASSISTANT_ID=asst_analysis_789
NEXT_PUBLIC_VAPI_GENERAL_ASSISTANT_ID=asst_general_000
VAPI_FORWARDING_NUMBER=your_phone_number_here

# n8n Workflow Integration
NEXT_PUBLIC_N8N_VAPI_WEBHOOK_URL=https://your-n8n-instance.com/webhook/aura-voice-webhook
NEXT_PUBLIC_N8N_API_KEY=your_n8n_api_key_here
```

### Getting API Keys

#### Google Earth Engine Setup
1. Visit [Google Earth Engine](https://earthengine.google.com/)
2. Sign up for Earth Engine access
3. Create a Google Cloud Project
4. Enable Earth Engine API
5. Create OAuth 2.0 credentials
6. Get your Maps API key from Google Cloud Console

#### VAPI Setup
1. Sign up at [VAPI.ai](https://vapi.ai)
2. Create voice assistants for different contexts:
   - Environmental Assistant (for environmental analysis)
   - Mapping Assistant (for agriculture and mapping)
   - Analysis Assistant (for urban planning and analytics)
   - General Assistant (for dashboard and community features)
3. Get your API key from the VAPI dashboard

## 🏗️ Architecture Overview

### Core Components

#### 1. Earth Engine Authentication Service
Location: `lib/earthEngineAuth.js`
- Handles Google Earth Engine API initialization
- Manages OAuth authentication
- Provides fallback authentication methods

#### 2. VAPI Voice Service
Location: `lib/vapiService.js`
- Context-aware voice assistant configuration
- Page-specific assistant routing
- Voice command processing

#### 3. Voice Interface Component
Location: `components/voice-interface.tsx`
- Floating voice interface widget
- Speech recognition integration
- Context-aware command processing
- n8n workflow triggering

#### 4. Enhanced Page Components
- **Agriculture Hub**: Satellite crop monitoring with NDVI, soil moisture, temperature analysis
- **Environmental Map**: Deforestation, water quality, air quality, land use analysis
- **Dashboard**: Real-time environmental intelligence overview

## 🗺️ Page-Specific Implementations

### Agriculture Hub (`/agriculture`)
**Satellite Data Sources:**
- Sentinel-2 for NDVI vegetation health
- MODIS for soil moisture and temperature
- CHIRPS for precipitation data

**Voice Commands:**
- "Show crop health" → Displays NDVI analysis
- "Check soil moisture" → Shows moisture levels
- "Analyze field" → Click-based field analysis

**Features:**
- Interactive satellite map with crop analysis
- Click-to-analyze field functionality
- Real-time crop health metrics
- Voice-controlled data layer switching

### Environmental Map (`/environmental`)
**Satellite Data Sources:**
- Hansen Global Forest Change for deforestation
- Sentinel-5P for air quality monitoring
- MODIS for water surface temperature
- Copernicus Land Cover for land use analysis

**Voice Commands:**
- "Run deforestation analysis" → Shows forest loss data
- "Check water quality" → Displays water monitoring
- "Show air pollution" → Air quality visualization

### Dashboard (`/`)
**Features:**
- Multi-layer environmental overview
- Real-time satellite data integration
- Voice-activated data exploration
- Environmental metrics summary

## 🎤 Voice Assistant Integration

### Context-Aware Responses
The voice assistant adapts its responses based on the current page:

```javascript
// Example: Agriculture page voice response
"Analyzing crop health using satellite NDVI data. The vegetation index shows 0.72 average NDVI which indicates healthy crop conditions. Continue current management practices and monitor for any changes."

// Example: Environmental page voice response
"Running deforestation analysis on the satellite data. The analysis shows recent forest loss in the selected region. I recommend monitoring the trends over the next few days."
```

### Voice Command Patterns
Each page supports specific voice command patterns:

- **Dashboard**: "Show temperature", "Environmental data", "Switch layer"
- **Environmental**: "Run analysis", "Deforestation", "Water quality", "Air quality"
- **Agriculture**: "Crop health", "NDVI", "Soil moisture", "Temperature", "Rainfall"
- **Conservation**: "Forest loss", "Carbon mapping", "Protected areas"
- **Urban**: "Urban heat", "Air pollution", "Urban growth"

## 🔄 n8n Workflow Integration

### Webhook Configuration
The n8n workflow (`n8n-workflows/aura-voice-webhook.json`) handles voice commands:

1. **Voice Command Webhook**: Receives commands from the voice interface
2. **Command Routing**: Routes commands based on type and page context
3. **VAPI Response**: Sends contextual responses back to the voice assistant
4. **Success Response**: Confirms command processing

### Workflow Triggers
- `show_temperature` → Temperature data analysis
- `run_analysis` → Environmental analysis execution
- `analyze_crop_health` → Agricultural monitoring
- `general_query` → AI-powered general responses

## 🛠️ Development Workflow

### 1. Initial Setup
```bash
# Clone and install dependencies
git clone <your-repo>
cd aura
npm install
```

### 2. Configure Environment
- Copy environment variables to `.env.local`
- Replace all placeholder values with actual API keys
- Test Google Maps loading in browser

### 3. Test Earth Engine Integration
```bash
# Start development server
npm run dev

# Navigate to /agriculture to test satellite integration
# Check browser console for Earth Engine authentication status
```

### 4. Configure Voice Assistant
- Set up VAPI assistants with provided configurations
- Test voice interface on each page
- Verify n8n webhook responses

### 5. Deploy n8n Workflows
- Import `n8n-workflows/aura-voice-webhook.json` to your n8n instance
- Configure environment variables in n8n
- Test webhook endpoints

## 🔧 Troubleshooting

### Common Issues

#### Earth Engine Authentication Fails
```bash
# Check if APIs are enabled in Google Cloud Console
# Verify OAuth client ID is correct
# Ensure Earth Engine access is approved for your account
```

#### Voice Interface Not Working
```bash
# Check VAPI API key validity
# Verify assistant IDs are correct
# Test browser microphone permissions
```

#### Satellite Data Not Loading
```bash
# Verify Google Maps API key
# Check Earth Engine authentication status
# Review browser console for API errors
```

### Debug Commands
```bash
# Check environment variables
echo $NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

# Test API connectivity
curl -X GET "https://api.vapi.ai/assistant" -H "Authorization: Bearer YOUR_API_KEY"
```

## 📊 Performance Optimization

### Earth Engine Best Practices
- Use appropriate scale parameters (1000m for regional analysis)
- Implement cloud filtering for optical imagery
- Cache analysis results when possible
- Use geometry bounds to limit processing area

### Voice Interface Optimization
- Implement speech recognition debouncing
- Use context-aware command matching
- Provide visual feedback during processing
- Handle offline scenarios gracefully

## 🔐 Security Considerations

### API Key Management
- Never commit API keys to version control
- Use environment variables for all sensitive data
- Implement API key rotation policies
- Monitor API usage and set quotas

### Earth Engine Security
- Use read-only Earth Engine permissions
- Implement proper OAuth scopes
- Validate user inputs before processing
- Monitor Earth Engine compute usage

## 📈 Monitoring & Analytics

### Key Metrics to Track
- Earth Engine API usage and quotas
- Voice command success rates
- User engagement with satellite features
- n8n workflow execution times

### Logging Implementation
```javascript
// Example logging for voice commands
console.log('Voice command processed:', {
  command: workflowType,
  page: pageName,
  timestamp: new Date().toISOString(),
  success: true
});
```

## 🚀 Deployment

### Production Checklist
- [ ] All environment variables configured
- [ ] Google Cloud APIs enabled and quotas set
- [ ] VAPI assistants configured and tested
- [ ] n8n workflows deployed and tested
- [ ] SSL certificates configured for webhooks
- [ ] Monitoring and logging implemented

### Scaling Considerations
- Implement Earth Engine request caching
- Use CDN for static satellite imagery
- Consider serverless functions for heavy processing
- Implement rate limiting for voice commands

## 📞 Support

### Resources
- [Google Earth Engine Documentation](https://developers.google.com/earth-engine)
- [VAPI Documentation](https://docs.vapi.ai)
- [n8n Documentation](https://docs.n8n.io)

### Community
- Join the AURA Platform Discord
- Follow development updates on GitHub
- Contribute to the open-source project

---

**Last Updated**: January 2024  
**Version**: 1.0.0  
**Compatibility**: Next.js 14+, Node.js 18+
