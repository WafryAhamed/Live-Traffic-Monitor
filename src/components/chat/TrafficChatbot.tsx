import React, { useCallback, useEffect, useState, useRef } from 'react';
import type {
  Vehicle,
  TrafficAlert,
  TrafficData,
  DashboardStats,
  TrafficPrediction,
  CongestionScore,
  EmergencyEvent,
  AIInsight } from
'../../types/traffic';
import { useTrafficAI } from '../../hooks/useTrafficAI';
import type { ChatMessage } from '../../hooks/useTrafficAI';
import { Button } from '../Button';
import { Badge } from '../Badge';
import { ScrollArea } from '../ScrollArea';
import { Separator } from '../Separator';
import { Avatar, AvatarFallback } from '../Avatar';
import { Textarea } from '../Textarea';
import {
  MessageSquare,
  X,
  Send,
  Trash2,
  Minimize2,
  Maximize2,
  Brain,
  Car,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  Siren,
  Flame,
  Shield,
  Gauge,
  Clock,
  MapPin,
  Zap,
  Target,
  Navigation,
  Sparkles,
  ChevronDown,
  Bot,
  User,
  Activity } from
'lucide-react';
interface TrafficChatbotProps {
  stats: DashboardStats;
  vehicles: Vehicle[];
  alerts: TrafficAlert[];
  trafficData: TrafficData[];
  predictions: TrafficPrediction[];
  congestionScore: CongestionScore;
  emergencyEvents: EmergencyEvent[];
  aiInsights: AIInsight[];
}
const gradeColors: Record<string, string> = {
  A: 'text-emerald-500',
  B: 'text-blue-500',
  C: 'text-amber-500',
  D: 'text-orange-500',
  F: 'text-red-500'
};
const gradeBgColors: Record<string, string> = {
  A: 'bg-emerald-100 dark:bg-emerald-900/30',
  B: 'bg-blue-100 dark:bg-blue-900/30',
  C: 'bg-amber-100 dark:bg-amber-900/30',
  D: 'bg-orange-100 dark:bg-orange-900/30',
  F: 'bg-red-100 dark:bg-red-900/30'
};
const severityColors: Record<string, string> = {
  critical: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  high: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  medium:
  'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  low: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
};
const emergencyIcons: Record<string, React.ReactNode> = {
  ambulance: <Siren className="h-3.5 w-3.5 text-red-500" />,
  fire: <Flame className="h-3.5 w-3.5 text-orange-500" />,
  police: <Shield className="h-3.5 w-3.5 text-blue-500" />
};
const statIcons: Record<string, React.ReactNode> = {
  car: <Car className="h-3.5 w-3.5" />,
  alert: <AlertTriangle className="h-3.5 w-3.5" />,
  speed: <Gauge className="h-3.5 w-3.5" />,
  gauge: <Activity className="h-3.5 w-3.5" />,
  clock: <Clock className="h-3.5 w-3.5" />,
  brain: <Brain className="h-3.5 w-3.5" />,
  zap: <Zap className="h-3.5 w-3.5" />,
  target: <Target className="h-3.5 w-3.5" />
};
function renderMarkdown(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold">
          {part.slice(2, -2)}
        </strong>);

    }
    return <span key={i}>{part}</span>;
  });
}
function DataCardMessage({ data }: {data: Record<string, unknown>;}) {
  const stats = data.stats as Array<{
    label: string;
    value: string | number;
    icon: string;
  }>;
  const grade = data.grade as string | undefined;
  const summary = data.summary as string;
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-1">
        <Sparkles className="h-3.5 w-3.5 text-[#328cc1]" />
        <span className="text-xs font-semibold text-foreground">
          {data.title as string}
        </span>
        {grade &&
        <span
          className={`text-xs font-bold px-1.5 py-0.5 rounded ${gradeBgColors[grade] || ''} ${gradeColors[grade] || ''}`}>
          
            {grade}
          </span>
        }
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        {stats.map((stat) =>
        <div
          key={stat.label}
          className="flex items-center gap-1.5 p-1.5 rounded bg-[#f4f4f4] dark:bg-muted/50">
          
            <span className="text-muted-foreground">
              {statIcons[stat.icon] || <Activity className="h-3.5 w-3.5" />}
            </span>
            <div>
              <p className="text-[9px] text-muted-foreground leading-none">
                {stat.label}
              </p>
              <p className="text-xs font-bold text-foreground">{stat.value}</p>
            </div>
          </div>
        )}
      </div>
      <p className="text-xs text-foreground/80 leading-relaxed">
        {renderMarkdown(summary)}
      </p>
    </div>);

}
function AlertSummaryMessage({ data }: {data: Record<string, unknown>;}) {
  const topAlerts = data.topAlerts as Array<{
    type: string;
    severity: string;
    location: string;
    description: string;
  }>;
  const summary = data.summary as string;
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3 text-xs">
        <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 font-medium">
          🔴 {data.critical as number}
        </span>
        <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 font-medium">
          🟠 {data.high as number}
        </span>
        <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 font-medium">
          🟡 {data.medium as number}
        </span>
        <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium">
          🔵 {data.low as number}
        </span>
      </div>
      {topAlerts.slice(0, 3).map((alert, i) =>
      <div
        key={i}
        className="flex items-start gap-2 p-1.5 rounded bg-[#f4f4f4] dark:bg-muted/50">
        
          <Badge
          variant="secondary"
          className={`text-[8px] px-1 py-0 h-4 flex-shrink-0 ${severityColors[alert.severity] || ''}`}>
          
            {alert.severity}
          </Badge>
          <div className="min-w-0">
            <p className="text-[10px] font-medium text-foreground truncate">
              {alert.description}
            </p>
            <p className="text-[9px] text-muted-foreground truncate">
              {alert.location}
            </p>
          </div>
        </div>
      )}
      <p className="text-xs text-foreground/80 leading-relaxed">
        {renderMarkdown(summary)}
      </p>
    </div>);

}
function PredictionMessage({ data }: {data: Record<string, unknown>;}) {
  const predictions = data.predictions as Array<{
    time: string;
    density: number;
    speed: number;
    confidence: number;
    trend: string;
  }>;
  const summary = data.summary as string;
  return (
    <div className="space-y-2">
      <div className="flex gap-1 overflow-x-auto pb-1">
        {predictions.map((p) =>
        <div
          key={p.time}
          className="flex-shrink-0 p-1.5 rounded bg-[#f4f4f4] dark:bg-muted/50 text-center min-w-[52px]">
          
            <p className="text-[9px] text-muted-foreground">{p.time}</p>
            <p className="text-xs font-bold text-foreground">{p.density}%</p>
            <div className="flex items-center justify-center">
              {p.trend === 'worsening' ?
            <TrendingUp className="h-2.5 w-2.5 text-red-500" /> :
            p.trend === 'improving' ?
            <TrendingDown className="h-2.5 w-2.5 text-emerald-500" /> :

            <Minus className="h-2.5 w-2.5 text-muted-foreground" />
            }
            </div>
          </div>
        )}
      </div>
      <p className="text-[10px] text-muted-foreground">
        <Clock className="h-3 w-3 inline mr-0.5" /> Peak expected:{' '}
        <strong>{data.peakExpected as string}</strong>
      </p>
      <p className="text-xs text-foreground/80 leading-relaxed">
        {renderMarkdown(summary)}
      </p>
    </div>);

}
function EmergencyMessage({ data }: {data: Record<string, unknown>;}) {
  const events = data.events as Array<{
    vehicleName: string;
    type: string;
    origin: string;
    destination: string;
    eta: number;
    priority: string;
    status: string;
    clearedPath: boolean;
  }>;
  const summary = data.summary as string;
  return (
    <div className="space-y-2">
      {events.map((event, i) =>
      <div key={i} className="p-2 rounded border border-border">
          <div className="flex items-center gap-2 mb-1">
            {emergencyIcons[event.type] || <Siren className="h-3.5 w-3.5" />}
            <span className="text-xs font-semibold text-foreground">
              {event.vehicleName}
            </span>
            {event.status === 'en-route' &&
          <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500" />
              </span>
          }
            <Badge
            variant="secondary"
            className={`text-[8px] px-1 py-0 h-4 ml-auto ${event.priority === 'critical' ? severityColors.critical : severityColors.high}`}>
            
              {event.priority}
            </Badge>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <MapPin className="h-2.5 w-2.5" />
            <span className="truncate">{event.destination}</span>
            <span className="ml-auto flex-shrink-0 font-medium">
              ETA {event.eta}m
            </span>
          </div>
          {event.clearedPath &&
        <Badge
          variant="secondary"
          className="text-[8px] px-1 py-0 h-4 mt-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
          
              ✓ Path Cleared
            </Badge>
        }
        </div>
      )}
      <p className="text-xs text-foreground/80 leading-relaxed">
        {renderMarkdown(summary)}
      </p>
    </div>);

}
function CongestionMessage({ data }: {data: Record<string, unknown>;}) {
  const areas = data.areas as Array<{
    area: string;
    score: number;
    grade: string;
  }>;
  const summary = data.summary as string;
  const grade = data.grade as string;
  const overall = data.overall as number;
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3 p-2 rounded-lg bg-[#f4f4f4] dark:bg-muted/50">
        <div className={`text-2xl font-bold ${gradeColors[grade] || ''}`}>
          {grade}
        </div>
        <div>
          <p className="text-xs font-semibold text-foreground">{overall}/100</p>
          <p className="text-[10px] text-muted-foreground">City-wide score</p>
        </div>
        <div className="ml-auto flex items-center gap-1">
          {data.trend === 'improving' ?
          <TrendingDown className="h-3.5 w-3.5 text-emerald-500" /> :
          data.trend === 'worsening' ?
          <TrendingUp className="h-3.5 w-3.5 text-red-500" /> :

          <Minus className="h-3.5 w-3.5 text-muted-foreground" />
          }
          <span className="text-[10px] text-muted-foreground capitalize">
            {data.trend as string}
          </span>
        </div>
      </div>
      <div className="space-y-1">
        {areas.slice(0, 4).map((area) =>
        <div key={area.area} className="flex items-center gap-2">
            <span className="text-[10px] text-foreground w-24 truncate">
              {area.area}
            </span>
            <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
              <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${area.score}%`,
                backgroundColor:
                area.grade === 'A' ?
                '#10b981' :
                area.grade === 'B' ?
                '#328cc1' :
                area.grade === 'C' ?
                '#f59e0b' :
                area.grade === 'D' ?
                '#f97316' :
                '#ef4444'
              }} />
            
            </div>
            <span
            className={`text-[10px] font-bold w-5 text-right ${gradeColors[area.grade] || ''}`}>
            
              {area.grade}
            </span>
          </div>
        )}
      </div>
      <p className="text-xs text-foreground/80 leading-relaxed">
        {renderMarkdown(summary)}
      </p>
    </div>);

}
function RouteTipMessage({ data }: {data: Record<string, unknown>;}) {
  const recommendations = data.recommendations as string[];
  const avoid = data.avoid as string[];
  const prefer = data.prefer as string[];
  const summary = data.summary as string;
  return (
    <div className="space-y-2">
      <div className="space-y-1.5">
        {recommendations.map((rec, i) =>
        <div
          key={i}
          className="flex items-start gap-2 text-xs text-foreground/80">
          
            <Navigation className="h-3 w-3 text-[#328cc1] mt-0.5 flex-shrink-0" />
            <span>{renderMarkdown(rec)}</span>
          </div>
        )}
      </div>
      <div className="flex gap-2 flex-wrap">
        {prefer.slice(0, 2).map((area) =>
        <Badge
          key={area}
          variant="secondary"
          className="text-[9px] bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
          
            ✓ {area}
          </Badge>
        )}
        {avoid.slice(0, 2).map((area) =>
        <Badge
          key={area}
          variant="secondary"
          className="text-[9px] bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
          
            ✕ {area}
          </Badge>
        )}
      </div>
      <p className="text-xs text-foreground/80 leading-relaxed">
        {renderMarkdown(summary)}
      </p>
    </div>);

}
function VehicleInfoMessage({ data }: {data: Record<string, unknown>;}) {
  const summary = data.summary as string;
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-3 gap-1.5">
        <div className="p-1.5 rounded bg-emerald-50 dark:bg-emerald-900/20 text-center">
          <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
            {data.active as number}
          </p>
          <p className="text-[9px] text-muted-foreground">Active</p>
        </div>
        <div className="p-1.5 rounded bg-amber-50 dark:bg-amber-900/20 text-center">
          <p className="text-xs font-bold text-amber-600 dark:text-amber-400">
            {data.idle as number}
          </p>
          <p className="text-[9px] text-muted-foreground">Idle</p>
        </div>
        <div className="p-1.5 rounded bg-red-50 dark:bg-red-900/20 text-center">
          <p className="text-xs font-bold text-red-600 dark:text-red-400">
            {data.maintenance as number}
          </p>
          <p className="text-[9px] text-muted-foreground">Maint.</p>
        </div>
      </div>
      <p className="text-xs text-foreground/80 leading-relaxed">
        {renderMarkdown(summary)}
      </p>
    </div>);

}
function ChatMessageBubble({ message }: {message: ChatMessage;}) {
  const isUser = message.role === 'user';
  const renderRichContent = () => {
    if (!message.data) return null;
    const data = message.data as Record<string, unknown>;
    switch (message.type) {
      case 'data-card':
        return <DataCardMessage data={data} />;
      case 'alert-summary':
        return <AlertSummaryMessage data={data} />;
      case 'prediction':
        return <PredictionMessage data={data} />;
      case 'emergency':
        return <EmergencyMessage data={data} />;
      case 'congestion':
        return <CongestionMessage data={data} />;
      case 'route-tip':
        return <RouteTipMessage data={data} />;
      case 'vehicle-info':
        return <VehicleInfoMessage data={data} />;
      default:
        return null;
    }
  };
  return (
    <div className={`flex gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <Avatar className="h-6 w-6 flex-shrink-0 mt-0.5">
        <AvatarFallback
          className={`text-[10px] font-bold ${isUser ? 'bg-[#328cc1] text-white' : 'bg-gradient-to-br from-[#328cc1] to-[#0b3c5d] text-white'}`}>
          
          {isUser ? <User className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
        </AvatarFallback>
      </Avatar>
      <div className={`max-w-[85%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`rounded-2xl px-3 py-2 ${isUser ? 'bg-[#328cc1] text-white rounded-br-md' : 'bg-[#f4f4f4] dark:bg-muted border border-border rounded-bl-md'}`}>
          
          {message.type === 'text' || !message.data ?
          <div className="text-xs leading-relaxed whitespace-pre-wrap">
              {message.content.split('\n').map((line, i) =>
            <span key={i}>
                  {renderMarkdown(line)}
                  {i < message.content.split('\n').length - 1 && <br />}
                </span>
            )}
            </div> :

          <div>
              <p className="text-xs font-medium mb-2">
                {renderMarkdown(message.content)}
              </p>
              {renderRichContent()}
            </div>
          }
        </div>
        <p
          className={`text-[9px] text-muted-foreground mt-0.5 ${isUser ? 'text-right' : 'text-left'} px-1`}>
          
          {message.timestamp.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      </div>
    </div>);

}
function TypingIndicator() {
  return (
    <div className="flex gap-2">
      <Avatar className="h-6 w-6 flex-shrink-0">
        <AvatarFallback className="bg-gradient-to-br from-[#328cc1] to-[#0b3c5d] text-white text-[10px]">
          <Bot className="h-3 w-3" />
        </AvatarFallback>
      </Avatar>
      <div className="bg-[#f4f4f4] dark:bg-muted border border-border rounded-2xl rounded-bl-md px-4 py-2.5">
        <div className="flex gap-1">
          <span
            className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce"
            style={{
              animationDelay: '0ms'
            }} />
          
          <span
            className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce"
            style={{
              animationDelay: '150ms'
            }} />
          
          <span
            className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce"
            style={{
              animationDelay: '300ms'
            }} />
          
        </div>
      </div>
    </div>);

}
export function TrafficChatbot({
  stats,
  vehicles,
  alerts,
  trafficData,
  predictions,
  congestionScore,
  emergencyEvents,
  aiInsights
}: TrafficChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { messages, sendMessage, isTyping, clearChat, suggestedQueries } =
  useTrafficAI({
    stats,
    vehicles,
    alerts,
    trafficData,
    predictions,
    congestionScore,
    emergencyEvents,
    aiInsights
  });
  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector(
        '[data-radix-scroll-area-viewport]'
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages, isTyping]);
  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);
  const handleSend = useCallback(() => {
    if (!inputValue.trim()) return;
    sendMessage(inputValue);
    setInputValue('');
  }, [inputValue, sendMessage]);
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );
  const handleQuickAction = useCallback(
    (query: string) => {
      sendMessage(query);
    },
    [sendMessage]
  );
  const panelWidth = isExpanded ? 'w-[480px]' : 'w-[380px]';
  const panelHeight = isExpanded ? 'h-[600px]' : 'h-[520px]';
  return (
    <>
      {/* Chat Panel */}
      {isOpen &&
      <div
        className={`fixed bottom-20 right-6 ${panelWidth} ${panelHeight} bg-card border border-border rounded-2xl shadow-2xl flex flex-col z-50 transition-all duration-200 overflow-hidden`}>
        
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[#0b3c5d] to-[#328cc1] text-white flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm">
                  <Brain className="h-4 w-4" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
                </span>
              </div>
              <div>
                <h3 className="text-sm font-semibold leading-none">
                  TrafficIQ AI
                </h3>
                <p className="text-[10px] text-white/70 mt-0.5">
                  Real-time traffic intelligence
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-white/70 hover:text-white hover:bg-white/10"
              onClick={() => setIsExpanded(!isExpanded)}
              aria-label={isExpanded ? 'Minimize' : 'Expand'}>
              
                {isExpanded ?
              <Minimize2 className="h-3.5 w-3.5" /> :

              <Maximize2 className="h-3.5 w-3.5" />
              }
              </Button>
              <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-white/70 hover:text-white hover:bg-white/10"
              onClick={clearChat}
              aria-label="Clear chat">
              
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
              <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-white/70 hover:text-white hover:bg-white/10"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat">
              
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 px-3 py-3" ref={scrollRef}>
            <div className="space-y-3">
              {messages.map((msg) =>
            <ChatMessageBubble key={msg.id} message={msg} />
            )}
              {isTyping && <TypingIndicator />}
            </div>
          </ScrollArea>

          {/* Quick Actions — show when few messages */}
          {messages.length <= 2 && !isTyping &&
        <div className="px-3 pb-2 flex-shrink-0">
              <p className="text-[10px] text-muted-foreground mb-1.5 font-medium">
                Quick actions
              </p>
              <div className="flex flex-wrap gap-1">
                {suggestedQueries.map((query) =>
            <button
              key={query}
              onClick={() => handleQuickAction(query)}
              className="text-[10px] px-2 py-1 rounded-full border border-border bg-[#f4f4f4] dark:bg-muted hover:bg-[#d9e8f5] dark:hover:bg-[#328cc1]/20 hover:border-[#328cc1]/30 text-foreground transition-colors">
              
                    {query}
                  </button>
            )}
              </div>
            </div>
        }

          <Separator />

          {/* Input */}
          <div className="px-3 py-2.5 flex-shrink-0">
            <div className="flex items-end gap-2">
              <Textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about traffic, alerts, routes..."
              className="min-h-[36px] max-h-[80px] resize-none text-xs border-border focus:border-[#328cc1] bg-[#f4f4f4] dark:bg-muted rounded-xl py-2 px-3"
              rows={1} />
            
              <Button
              size="icon"
              className="h-9 w-9 rounded-xl bg-[#328cc1] hover:bg-[#2a7ab0] text-white flex-shrink-0"
              onClick={handleSend}
              disabled={!inputValue.trim() || isTyping}
              aria-label="Send message">
              
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-[9px] text-muted-foreground mt-1 text-center">
              AI responses based on live traffic data · Press Enter to send
            </p>
          </div>
        </div>
      }

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-all duration-300 ${isOpen ? 'bg-[#707070] hover:bg-[#555] rotate-0 scale-90' : 'bg-gradient-to-br from-[#328cc1] to-[#0b3c5d] hover:from-[#2a7ab0] hover:to-[#0a3350] scale-100 hover:scale-105'}`}
        aria-label={isOpen ? 'Close AI assistant' : 'Open AI assistant'}>
        
        {isOpen ?
        <ChevronDown className="h-6 w-6 text-white" /> :

        <div className="relative">
            <MessageSquare className="h-6 w-6 text-white" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400 border-2 border-[#328cc1]" />
            </span>
          </div>
        }
      </button>
    </>);

}