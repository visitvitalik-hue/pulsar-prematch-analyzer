
export interface Match {
  id: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  kickoff: string;
  homeLogo: string;
  awayLogo: string;
  status: 'upcoming' | 'scanning' | 'ready' | 'posted';
}

export interface ScanResult {
  firstHalf: string;
  secondHalf: string;
  prediction: {
    p1: number;
    totalOver25: number;
    goal1T: boolean;
  };
  betOfDay: string;
  confidence: number;
  postText: string;
  imageUrl?: string;
}

export enum League {
  PREMIER_LEAGUE = "Premier League",
  LA_LIGA = "La Liga",
  SERIE_A = "Serie A",
  BUNDESLIGA = "Bundesliga",
  LIGUE_1 = "Ligue 1",
  EREDIVISIE = "Eredivisie",
  PRIMEIRA_LIGA = "Primeira Liga",
  SCOTTISH_PREM = "Scottish Premiership",
  BELGIAN_PRO = "Belgian Pro League",
  TURKISH_SUPER = "Turkish Super Lig",
  RPL = "Russian Premier League",
  MLS = "MLS"
}
