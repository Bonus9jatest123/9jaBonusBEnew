export interface OneX {
  homeWin: number;
  draw: number;
  awayWin: number;
}

export interface BookieOdd {
  oneX: OneX;
  suspended: boolean;
}

interface OddFormat {
  value: number;
  bookie: string;
}
interface BestCalculatedOdds {
  oddSum: number;
  homeWin: OddFormat;
  draw: OddFormat;
  awayWin: OddFormat;
}

export type Odds = Record<string, BookieOdd>;

export type OddsProduct = Record<string, number>;

export interface Fixture {
  _id: string;
  eventDateTime: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  suspendAll: boolean;
  bestCalculatedOdds: BestCalculatedOdds;
  odds: Odds;
}

export type FixtureForForm = Omit<Fixture, 'bestCalculatedOdds'>;

export interface bookieInfo {
  bonus: number;
  url: string;
  icon: string;
  minOddsForBonus: number;
  selections: { [key: number]: string };
}

export type bookie = Record<string, bookieInfo>;
