import { useState, useCallback, useRef } from 'react';
import type {
  Vehicle,
  TrafficAlert,
  TrafficData,
  DashboardStats,
  TrafficPrediction,
  CongestionScore,
  EmergencyEvent,
  AIInsight } from
'../types/traffic';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  type:
  'text' |
  'data-card' |
  'alert-summary' |
  'prediction' |
  'emergency' |
  'route-tip' |
  'vehicle-info' |
  'congestion';
  data?: Record<string, unknown>;
}

export interface TrafficAIContext {
  stats: DashboardStats;
  vehicles: Vehicle[];
  alerts: TrafficAlert[];
  trafficData: TrafficData[];
  predictions: TrafficPrediction[];
  congestionScore: CongestionScore;
  emergencyEvents: EmergencyEvent[];
  aiInsights: AIInsight[];
}

interface UseTrafficAIReturn {
  messages: ChatMessage[];
  sendMessage: (text: string) => void;
  isTyping: boolean;
  clearChat: () => void;
  suggestedQueries: string[];
}

function createId(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content:
  "Hello! I'm **TrafficIQ AI**, your intelligent traffic assistant for Colombo. I have real-time access to all traffic data, vehicle positions, alerts, predictions, and emergency events across Colombo, Sri Lanka.\n\nAsk me anything about current conditions, or try the quick actions below!",
  timestamp: new Date(),
  type: 'text'
};

function getTopCongested(trafficData: TrafficData[]): TrafficData[] {
  return [...trafficData].sort((a, b) => b.density - a.density).slice(0, 3);
}

function getActiveAlerts(alerts: TrafficAlert[]): TrafficAlert[] {
  return alerts.filter((a) => !a.resolved);
}

function matchArea(
query: string,
trafficData: TrafficData[])
: TrafficData | undefined {
  const lower = query.toLowerCase();
  return trafficData.find((td) => lower.includes(td.area.toLowerCase()));
}

function matchVehicleType(query: string): string | undefined {
  const types = ['car', 'bus', 'truck', 'emergency'];
  const lower = query.toLowerCase();
  return types.find((t) => lower.includes(t));
}

function generateResponse(query: string, ctx: TrafficAIContext): ChatMessage {
  const lower = query.toLowerCase();
  const activeAlerts = getActiveAlerts(ctx.alerts);
  const topCongested = getTopCongested(ctx.trafficData);

  // ── Status / Overview ──
  if (
  lower.match(
    /status|overview|how.*(traffic|things|city)|what.*(happening|going on)|summary|report/
  ))
  {
    const grade = ctx.congestionScore.grade;
    const trend = ctx.congestionScore.trend;
    return {
      id: createId(),
      role: 'assistant',
      content: `Here's the current Colombo traffic overview:`,
      timestamp: new Date(),
      type: 'data-card',
      data: {
        title: 'Colombo Traffic Status',
        stats: [
        {
          label: 'Active Vehicles',
          value: ctx.stats.totalVehicles,
          icon: 'car'
        },
        {
          label: 'Active Alerts',
          value: ctx.stats.activeAlerts,
          icon: 'alert'
        },
        {
          label: 'Avg Speed',
          value: `${ctx.stats.avgSpeed} km/h`,
          icon: 'speed'
        },
        {
          label: 'Congestion',
          value: `${ctx.stats.congestionLevel}%`,
          icon: 'gauge'
        }],

        grade,
        trend,
        summary: `Congestion grade is **${grade}** and ${trend === 'improving' ? '📉 improving' : trend === 'worsening' ? '📈 worsening' : '➡️ stable'}. ${activeAlerts.length} active alerts across the city. Top congested area: **${topCongested[0]?.area}** at ${topCongested[0]?.density}% density.`
      }
    };
  }

  // ── Alerts ──
  if (lower.match(/alert|incident|accident|warning|danger|problem/)) {
    const critical = activeAlerts.filter((a) => a.severity === 'critical');
    const high = activeAlerts.filter((a) => a.severity === 'high');
    return {
      id: createId(),
      role: 'assistant',
      content: `Current alert summary:`,
      timestamp: new Date(),
      type: 'alert-summary',
      data: {
        total: activeAlerts.length,
        critical: critical.length,
        high: high.length,
        medium: activeAlerts.filter((a) => a.severity === 'medium').length,
        low: activeAlerts.filter((a) => a.severity === 'low').length,
        topAlerts: activeAlerts.slice(0, 4).map((a) => ({
          type: a.type,
          severity: a.severity,
          location: a.location,
          description: a.description
        })),
        summary:
        critical.length > 0 ?
        `⚠️ **${critical.length} critical alert${critical.length > 1 ? 's' : ''}** requiring immediate attention! ${high.length} high-severity incidents also active.` :
        high.length > 0 ?
        `${high.length} high-severity alert${high.length > 1 ? 's' : ''} active. No critical incidents currently.` :
        `No critical or high-severity alerts. ${activeAlerts.length} minor incidents being monitored.`
      }
    };
  }

  // ── Predictions / Forecast ──
  if (
  lower.match(
    /predict|forecast|future|next.*hour|will.*traffic|expect|upcoming/
  ))
  {
    const worsening = ctx.predictions.filter((p) => p.trend === 'worsening');
    const improving = ctx.predictions.filter((p) => p.trend === 'improving');
    return {
      id: createId(),
      role: 'assistant',
      content: `Here's the traffic forecast for the next 2 hours:`,
      timestamp: new Date(),
      type: 'prediction',
      data: {
        predictions: ctx.predictions.map((p) => ({
          time: p.timeLabel,
          density: p.predictedDensity,
          speed: p.predictedSpeed,
          confidence: p.confidence,
          trend: p.trend
        })),
        summary:
        worsening.length > improving.length ?
        `📈 Traffic is expected to **worsen** over the next 2 hours. ${worsening.length} of ${ctx.predictions.length} intervals show increasing density. Plan accordingly!` :
        improving.length > worsening.length ?
        `📉 Good news! Traffic is expected to **improve**. ${improving.length} of ${ctx.predictions.length} intervals show decreasing density.` :
        `Traffic conditions are expected to remain **relatively stable** over the next 2 hours.`,
        peakExpected: ctx.congestionScore.peakExpected
      }
    };
  }

  // ── Emergency ──
  if (
  lower.match(/emergency|ambulance|fire|police|ems|rescue|priority|siren/))
  {
    const events = ctx.emergencyEvents;
    return {
      id: createId(),
      role: 'assistant',
      content:
      events.length > 0 ?
      `Active emergency operations:` :
      `No active emergency operations at this time.`,
      timestamp: new Date(),
      type: 'emergency',
      data: {
        events: events.map((e) => ({
          vehicleName: e.vehicleName,
          type: e.type,
          origin: e.origin,
          destination: e.destination,
          eta: e.eta,
          priority: e.priority,
          status: e.status,
          clearedPath: e.clearedPath
        })),
        summary:
        events.length > 0 ?
        `🚨 **${events.length} active emergency operation${events.length > 1 ? 's' : ''}**. ${events.filter((e) => e.clearedPath).length} with cleared priority corridors. ${events.filter((e) => e.status === 'en-route').length} currently en-route.` :
        '✅ All clear — no active emergency dispatches.'
      }
    };
  }

  // ── Congestion / Score ──
  if (lower.match(/congestion|score|grade|rating|how bad|density/)) {
    return {
      id: createId(),
      role: 'assistant',
      content: `Current congestion analysis:`,
      timestamp: new Date(),
      type: 'congestion',
      data: {
        overall: ctx.congestionScore.overall,
        grade: ctx.congestionScore.grade,
        trend: ctx.congestionScore.trend,
        peakExpected: ctx.congestionScore.peakExpected,
        areas: ctx.congestionScore.areas.map((a) => ({
          area: a.area,
          score: a.score,
          grade: a.grade
        })),
        summary: `City-wide congestion score: **${ctx.congestionScore.overall}/100** (Grade **${ctx.congestionScore.grade}**). Trend: ${ctx.congestionScore.trend}. Next peak expected at **${ctx.congestionScore.peakExpected}**.`
      }
    };
  }

  // ── Specific Area ──
  const areaMatch = matchArea(query, ctx.trafficData);
  if (areaMatch) {
    const areaScore = ctx.congestionScore.areas.find(
      (a) => a.area.toLowerCase() === areaMatch.area.toLowerCase()
    );
    return {
      id: createId(),
      role: 'assistant',
      content: `Traffic details for ${areaMatch.area}:`,
      timestamp: new Date(),
      type: 'data-card',
      data: {
        title: `${areaMatch.area} Traffic`,
        stats: [
        { label: 'Density', value: `${areaMatch.density}%`, icon: 'gauge' },
        {
          label: 'Avg Speed',
          value: `${areaMatch.avgSpeed} km/h`,
          icon: 'speed'
        },
        { label: 'Incidents', value: areaMatch.incidents, icon: 'alert' },
        { label: 'Peak Hour', value: areaMatch.peakHour, icon: 'clock' }],

        grade: areaScore?.grade,
        trend: ctx.congestionScore.trend,
        summary: `**${areaMatch.area}** currently at **${areaMatch.density}%** density with ${areaMatch.incidents} active incidents. Average speed is ${areaMatch.avgSpeed} km/h.${areaScore ? ` Congestion grade: **${areaScore.grade}** (${areaScore.score}/100).` : ''}`
      }
    };
  }

  // ── Vehicles ──
  const vType = matchVehicleType(query);
  if (lower.match(/vehicle|fleet|car|bus|truck/) || vType) {
    const typeFilter = vType;
    const filtered = typeFilter ?
    ctx.vehicles.filter((v) => v.type === typeFilter) :
    ctx.vehicles;
    const active = filtered.filter((v) => v.status === 'active');
    const idle = filtered.filter((v) => v.status === 'idle');
    const maintenance = filtered.filter((v) => v.status === 'maintenance');
    return {
      id: createId(),
      role: 'assistant',
      content: typeFilter ?
      `${typeFilter.charAt(0).toUpperCase() + typeFilter.slice(1)} fleet status:` :
      `Fleet overview:`,
      timestamp: new Date(),
      type: 'vehicle-info',
      data: {
        total: filtered.length,
        active: active.length,
        idle: idle.length,
        maintenance: maintenance.length,
        avgSpeed: Math.round(
          active.reduce((s, v) => s + v.speed, 0) / (active.length || 1)
        ),
        type: typeFilter || 'all',
        summary: `**${active.length}** active, **${idle.length}** idle, **${maintenance.length}** in maintenance. Average speed of active ${typeFilter || 'vehicle'}s: **${Math.round(active.reduce((s, v) => s + v.speed, 0) / (active.length || 1))} km/h**.`
      }
    };
  }

  // ── Route / Best way ──
  if (lower.match(/route|best way|fastest|how.*get|navigate|direction|path/)) {
    const leastCongested = [...ctx.trafficData].
    sort((a, b) => a.density - b.density).
    slice(0, 3);
    return {
      id: createId(),
      role: 'assistant',
      content: `Smart routing recommendations:`,
      timestamp: new Date(),
      type: 'route-tip',
      data: {
        recommendations: [
        `Avoid **${topCongested[0]?.area}** (${topCongested[0]?.density}% density) — use alternate routes through less congested areas.`,
        `**${leastCongested[0]?.area}** has the lowest congestion at ${leastCongested[0]?.density}% — consider routing through this area.`,
        ctx.predictions[0]?.trend === 'worsening' ?
        `Traffic is expected to worsen in the next ${ctx.predictions[0]?.minutesFromNow} minutes — depart now if possible.` :
        `Conditions are stable — no urgency to reroute at this time.`],

        avoid: topCongested.map((t) => t.area),
        prefer: leastCongested.map((t) => t.area),
        summary: `🗺️ Best areas to route through: **${leastCongested.map((t) => t.area).join(', ')}**. Avoid: **${topCongested.map((t) => t.area).join(', ')}**.`
      }
    };
  }

  // ── AI Insights ──
  if (
  lower.match(/insight|ai.*think|recommend|suggestion|optimization|anomal/))
  {
    const actionable = ctx.aiInsights.filter((i) => i.actionable);
    return {
      id: createId(),
      role: 'assistant',
      content: `Latest AI insights:`,
      timestamp: new Date(),
      type: 'data-card',
      data: {
        title: 'AI Intelligence Summary',
        stats: [
        {
          label: 'Total Insights',
          value: ctx.aiInsights.length,
          icon: 'brain'
        },
        { label: 'Actionable', value: actionable.length, icon: 'zap' },
        {
          label: 'Avg Confidence',
          value: `${Math.round(ctx.aiInsights.reduce((s, i) => s + i.confidence, 0) / ctx.aiInsights.length)}%`,
          icon: 'target'
        },
        {
          label: 'High Impact',
          value: ctx.aiInsights.filter((i) => i.impact === 'high').length,
          icon: 'alert'
        }],

        insights: ctx.aiInsights.slice(0, 3).map((i) => ({
          type: i.type,
          title: i.title,
          impact: i.impact,
          confidence: i.confidence
        })),
        summary: `**${ctx.aiInsights.length} AI insights** generated. ${actionable.length} are actionable. Top insight: "${ctx.aiInsights[0]?.title}" (${ctx.aiInsights[0]?.confidence}% confidence).`
      }
    };
  }

  // ── Help ──
  if (lower.match(/help|what can you|how.*use|command|feature/)) {
    return {
      id: createId(),
      role: 'assistant',
      content: `Here's what I can help you with:\n\n🚦 **Traffic Status** — Current city-wide overview\n🚨 **Alerts** — Active incidents and warnings\n🔮 **Predictions** — AI traffic forecasts\n🚑 **Emergencies** — Active emergency operations\n📊 **Congestion** — Congestion scores and grades\n🚗 **Vehicles** — Fleet status (try "bus status" or "emergency vehicles")\n🗺️ **Routes** — Smart routing recommendations\n🧠 **AI Insights** — Latest AI analysis\n📍 **Area Info** — Ask about specific areas (e.g., "How's Manhattan?")\n\nJust type naturally — I understand conversational queries!`,
      timestamp: new Date(),
      type: 'text'
    };
  }

  // ── Greeting ──
  if (lower.match(/^(hi|hello|hey|good|thanks|thank you|yo|sup)/)) {
    const greetings = [
    `Hey there! 👋 I'm monitoring Colombo traffic in real-time. Currently tracking **${ctx.stats.totalVehicles}** vehicles with **${ctx.stats.activeAlerts}** active alerts. What would you like to know?`,
    `Hello! 🚦 Traffic in Colombo is currently at **${ctx.stats.congestionLevel}%** congestion (Grade **${ctx.congestionScore.grade}**). How can I help you today?`,
    `Hi! 👋 Everything's running smoothly. Average speed across Colombo is **${ctx.stats.avgSpeed} km/h**. Ask me anything about traffic conditions!`];

    return {
      id: createId(),
      role: 'assistant',
      content: greetings[Math.floor(Math.random() * greetings.length)],
      timestamp: new Date(),
      type: 'text'
    };
  }

  // ── Fallback ──
  return {
    id: createId(),
    role: 'assistant',
    content: `I'm not sure I understand that query. Here's what I can help with:\n\n• **"traffic status"** — City overview\n• **"alerts"** — Active incidents\n• **"predictions"** — Traffic forecast\n• **"emergencies"** — Emergency ops\n• **"congestion score"** — Congestion analysis\n• **"vehicles"** — Fleet info\n• **"routes"** — Routing tips\n• **"Manhattan traffic"** — Area-specific info\n\nTry asking about any of these topics!`,
    timestamp: new Date(),
    type: 'text'
  };
}

export function useTrafficAI(context: TrafficAIContext): UseTrafficAIReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [isTyping, setIsTyping] = useState(false);
  const contextRef = useRef(context);
  contextRef.current = context;

  const suggestedQueries = [
  'Traffic status',
  'Active alerts',
  'Predictions',
  'Emergency status',
  'Congestion score',
  'Best routes',
  'AI insights',
  'Manhattan traffic'];


  const sendMessage = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg: ChatMessage = {
      id: createId(),
      role: 'user',
      content: trimmed,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    // Simulate AI thinking delay (300-1200ms)
    const delay = 300 + Math.random() * 900;
    setTimeout(() => {
      const response = generateResponse(trimmed, contextRef.current);
      setMessages((prev) => [...prev, response]);
      setIsTyping(false);
    }, delay);
  }, []);

  const clearChat = useCallback(() => {
    setMessages([WELCOME_MESSAGE]);
  }, []);

  return { messages, sendMessage, isTyping, clearChat, suggestedQueries };
}