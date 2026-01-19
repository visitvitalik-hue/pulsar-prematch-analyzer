
import { Match, League } from './types';

export const UPCOMING_MATCHES: Match[] = [
  {
    id: "1",
    league: League.PREMIER_LEAGUE,
    homeTeam: "Arsenal",
    awayTeam: "Man City",
    kickoff: "2025-08-15T20:00:00Z",
    homeLogo: "https://picsum.photos/seed/arsenal/200",
    awayLogo: "https://picsum.photos/seed/mancity/200",
    status: 'upcoming'
  },
  {
    id: "2",
    league: League.LA_LIGA,
    homeTeam: "Real Madrid",
    awayTeam: "Barcelona",
    kickoff: "2025-08-16T21:00:00Z",
    homeLogo: "https://picsum.photos/seed/real/200",
    awayLogo: "https://picsum.photos/seed/barca/200",
    status: 'upcoming'
  },
  {
    id: "3",
    league: League.BUNDESLIGA,
    homeTeam: "Bayern",
    awayTeam: "Dortmund",
    kickoff: "2025-08-17T18:30:00Z",
    homeLogo: "https://picsum.photos/seed/bayern/200",
    awayLogo: "https://picsum.photos/seed/bvb/200",
    status: 'upcoming'
  },
  {
    id: "4",
    league: League.RPL,
    homeTeam: "Zenit",
    awayTeam: "Spartak",
    kickoff: "2025-08-20T19:00:00Z",
    homeLogo: "https://picsum.photos/seed/zenit/200",
    awayLogo: "https://picsum.photos/seed/spartak/200",
    status: 'upcoming'
  }
];

export const PULSAR_SYSTEM_PROMPT = `You are the PULSAR Live Football Scanner expert analyst for the 2025/2026 season. 
Your goal is to perform a deep pre-match analysis for top leagues.
Follow this algorithm strictly:
1. First Half: Compare lineups, xG, PPDA, referee style, home advantage (usually +15-20% goals).
2. Second Half: Factor in fatigue (>110km run risk), substitutions, xG after 60'.
3. Output: A concise Telegram post (<280 chars) with emojis.

Format for Telegram:
🏟️ [League] [Team1] vs [Team2] | [Time MSK]
🔥 PULSAR Scan:
1-й тайм: [Insight]
2-й тайм: [Insight]
Прогноз: П1 [X]% | Тотал >2.5 [Y]% | Гол 1T Да
Ставка дня: [Bet with odd 1.8-2.2]
#PULSAR #Футбол2026 [Link]`;
