"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mic, MicOff, Volume2, VolumeX, Phone, PhoneOff } from "lucide-react"
import { vapiService } from "@/lib/vapiService"

interface VoiceInterfaceProps {
  pageData?: any;
}

export function VoiceInterface({ pageData = {} }: VoiceInterfaceProps) {
  const [isListening, setIsListening] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [currentCall, setCurrentCall] = useState(null);
  const [transcript, setTranscript] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [callStatus, setCallStatus] = useState('idle'); // idle, connecting, connected, ended
  const pathname = usePathname();

  const getPageName = () => {
    const pathMap: Record<string, string> = {
      '/': 'dashboard',
      '/environmental': 'environmental',
      '/agriculture': 'agriculture',
      '/conservation': 'conservation',
      '/urban': 'urban',
      '/community': 'community',
      '/analytics': 'analytics',
      '/settings': 'settings'
    };
    return pathMap[pathname] || 'dashboard';
  };

  const startVoiceSession = async () => {
    try {
      setIsListening(true);
      setIsConnected(true);
      
      const pageName = getPageName();
      const assistantConfig = vapiService.getPageSpecificConfig(pageName, pageData);
      
      setTranscript(`Voice assistant ready for ${pageName}. ${assistantConfig.firstMessage}`);
      
      // Initialize speech recognition
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        
        recognition.onstart = () => {
          setTranscript('Listening...');
        };
        
        recognition.onresult = (event: any) => {
          let interimTranscript = '';
          let finalTranscript = '';
          
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }
          
          setTranscript(finalTranscript || interimTranscript);
          
          if (finalTranscript) {
            processVoiceCommand(finalTranscript);
          }
        };
        
        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setTranscript('Speech recognition error. Please try again.');
        };
        
        recognition.start();
      } else {
        setTranscript('Speech recognition not supported in this browser.');
      }
      
    } catch (error) {
      console.error('Voice session failed:', error);
      setIsListening(false);
      setIsConnected(false);
    }
  };

  const stopVoiceSession = () => {
    if (currentCall && typeof currentCall === 'object' && 'stop' in currentCall) {
      (currentCall as any).stop();
    }
    
    setIsListening(false);
    setIsConnected(false);
    setCurrentCall(null);
    setTranscript('');
    setCallStatus('idle');
  };

  const processVoiceCommand = async (command: string) => {
    setIsProcessing(true);
    const pageName = getPageName();
    
    try {
      // Context-aware command processing
      const commandActions: Record<string, Array<{ regex: RegExp; action: () => Promise<void>; response: string }>> = {
        dashboard: [
          { 
            regex: /show.*temperature/i, 
            action: () => triggerN8NWorkflow('show_temperature'),
            response: 'Displaying temperature data from satellite imagery...'
          },
          { 
            regex: /environmental.*data/i, 
            action: () => triggerN8NWorkflow('get_environmental_data'),
            response: 'Loading comprehensive environmental data...'
          },
          { 
            regex: /satellite.*imagery/i, 
            action: () => triggerN8NWorkflow('load_satellite_data'),
            response: 'Loading latest satellite imagery...'
          }
        ],
        environmental: [
          { 
            regex: /run.*analysis/i, 
            action: () => triggerN8NWorkflow('run_analysis'),
            response: 'Running environmental analysis...'
          },
          { 
            regex: /deforestation/i, 
            action: () => triggerN8NWorkflow('deforestation_analysis'),
            response: 'Analyzing deforestation patterns...'
          },
          { 
            regex: /water.*quality/i, 
            action: () => triggerN8NWorkflow('water_quality_analysis'),
            response: 'Checking water quality indicators...'
          }
        ],
        agriculture: [
          { 
            regex: /crop.*health/i, 
            action: () => triggerN8NWorkflow('analyze_crop_health'),
            response: 'Analyzing crop health using satellite data...'
          },
          { 
            regex: /ndvi/i, 
            action: () => triggerN8NWorkflow('show_ndvi'),
            response: 'Displaying NDVI vegetation analysis...'
          },
          { 
            regex: /soil.*moisture/i, 
            action: () => triggerN8NWorkflow('check_soil_moisture'),
            response: 'Checking soil moisture levels...'
          }
        ],
        conservation: [
          { 
            regex: /forest.*loss/i, 
            action: () => triggerN8NWorkflow('forest_loss_analysis'),
            response: 'Analyzing forest loss patterns...'
          },
          { 
            regex: /carbon.*mapping/i, 
            action: () => triggerN8NWorkflow('carbon_analysis'),
            response: 'Mapping carbon storage and biomass...'
          }
        ],
        urban: [
          { 
            regex: /urban.*growth/i, 
            action: () => triggerN8NWorkflow('urban_growth_analysis'),
            response: 'Analyzing urban expansion patterns...'
          },
          { 
            regex: /heat.*island/i, 
            action: () => triggerN8NWorkflow('heat_island_analysis'),
            response: 'Mapping urban heat islands...'
          }
        ]
      };

      const pageCommands = commandActions[pageName] || [];
      const matchedCommand = pageCommands.find(cmd => cmd.regex.test(command));
      
      if (matchedCommand) {
        setTranscript(matchedCommand.response);
        await matchedCommand.action();
      } else {
        setTranscript('Processing your request...');
        await triggerN8NWorkflow('general_query', { query: command, page: pageName });
      }
    } catch (error) {
      console.error('Command processing failed:', error);
      setTranscript('Sorry, I encountered an error processing your request.');
    } finally {
      setIsProcessing(false);
    }
  };

  const triggerN8NWorkflow = async (workflowType: string, data: any = {}) => {
    try {
      return await vapiService.triggerWorkflow(workflowType, {
        page: getPageName(),
        ...pageData
      }, data);
    } catch (error) {
      console.error('N8N workflow trigger failed:', error);
      throw error;
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-80 shadow-lg border-2">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
              <span className="text-sm font-medium">AURA Voice Assistant</span>
            </div>
            <div className="flex items-center space-x-1">
              <Badge className="bg-blue-100 text-blue-700 text-xs">
                {getPageName().charAt(0).toUpperCase() + getPageName().slice(1)}
              </Badge>
              {isProcessing && (
                <Badge className="bg-orange-100 text-orange-700 text-xs">
                  Processing
                </Badge>
              )}
            </div>
          </div>
          
          {(isConnected || transcript) && (
            <div className="mb-3 p-2 bg-gray-50 rounded text-xs text-gray-600 max-h-20 overflow-y-auto">
              {transcript || "Listening..."}
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <Button
              onClick={isListening ? stopVoiceSession : startVoiceSession}
              variant={isListening ? "destructive" : "default"}
              size="sm"
              className="flex-1 mr-2"
              disabled={callStatus === 'connecting'}
            >
              {isListening ? (
                <>
                  <MicOff className="w-4 h-4 mr-2" />
                  Stop
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4 mr-2" />
                  Talk to AURA
                </>
              )}
            </Button>
            
            <Button
              onClick={() => setIsMuted(!isMuted)}
              variant="outline"
              size="sm"
              disabled={!isConnected}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>
          </div>
          
          <div className="text-xs text-muted-foreground mt-2">
            Context: {getPageName()} • {isConnected ? "Connected" : "Ready to connect"}
            {isProcessing && " • Processing command..."}
          </div>
          
          {/* Quick Commands */}
          {isConnected && (
            <div className="mt-3 space-y-1">
              <div className="text-xs font-medium text-gray-600">Quick Commands:</div>
              <div className="text-xs text-gray-500">
                {getPageName() === 'dashboard' && "• Show temperature • Environmental data"}
                {getPageName() === 'environmental' && "• Run analysis • Show deforestation"}
                {getPageName() === 'agriculture' && "• Crop health • Show NDVI"}
                {getPageName() === 'conservation' && "• Forest loss • Carbon mapping"}
                {getPageName() === 'urban' && "• Urban heat • Air pollution"}
                {getPageName() === 'community' && "• Community impact • Citizen science"}
                {getPageName() === 'analytics' && "• Generate report • Trend analysis"}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
