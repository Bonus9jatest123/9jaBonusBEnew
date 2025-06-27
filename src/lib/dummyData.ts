import { Fixture } from '@/types/commonTypes';

export const dummyFixtures: Fixture[] = [
  {
    _id: '1',
    eventDateTime: '2023-12-01T16:30:00Z',
    league: 'UEFA Champion League test',
    homeTeam: 'Real Madrid',
    awayTeam: 'Barcelona',
    suspendAll: false,
    bestCalculatedOdds: {
      oddSum: 8.15,
      homeWin: {
        value: 2.31,
        bookie: 'betGoodWin'
      },
      draw: {
        value: 3.22,
        bookie: 'betWay'
      },
      awayWin: {
        value: 2.62,
        bookie: 'betWay'
      }
    },
    odds: {
      betWay: {
        oneX: { homeWin: 1.4, draw: 3, awayWin: 5 },
        suspended: false
      },
      betUk: {
        oneX: { homeWin: 1.3, draw: 2.9, awayWin: 3.8 },
        suspended: false
      },
      betGoodWin: {
        oneX: { homeWin: 1.2, draw: 1.9, awayWin: 4.8 },
        suspended: false
      }
    }
  },
  {
    _id: '2',
    eventDateTime: '2023-12-01T18:00:00Z',
    league: 'UEFA Champion League',
    homeTeam: 'Manchester United',
    awayTeam: 'Liverpool',
    suspendAll: false,
    bestCalculatedOdds: {
      oddSum: 7.83,
      homeWin: {
        value: 2.12,
        bookie: 'betUk'
      },
      draw: {
        value: 3.2,
        bookie: 'betWay'
      },
      awayWin: {
        value: 2.51,
        bookie: 'betWay'
      }
    },
    odds: {
      betWay: {
        oneX: { homeWin: 2.0, draw: 3.2, awayWin: 2.51 },
        suspended: false
      },
      betUk: {
        oneX: { homeWin: 2.12, draw: 3.0, awayWin: 2.43 },
        suspended: false
      },
      betGoodWin: {
        oneX: { homeWin: 2.2, draw: 2.9, awayWin: 2.3 },
        suspended: false
      }
    }
  },
  {
    _id: '3',
    eventDateTime: '2023-12-01T19:45:00Z',
    league: 'England Southern Premier South Division',
    homeTeam: 'Bayern Munich',
    awayTeam: 'Borussia Dortmund',
    suspendAll: false,
    bestCalculatedOdds: {
      oddSum: 8.61,
      homeWin: {
        value: 2.0,
        bookie: 'betGoodWin'
      },
      draw: {
        value: 3.51,
        bookie: 'betWay'
      },
      awayWin: {
        value: 3.1,
        bookie: 'betWay'
      }
    },
    odds: {
      betWay: {
        oneX: { homeWin: 1.87, draw: 3.51, awayWin: 3.1 },
        suspended: false
      },
      betUk: {
        oneX: { homeWin: 1.92, draw: 3.41, awayWin: 2.91 },
        suspended: false
      },
      betGoodWin: {
        oneX: { homeWin: 2.0, draw: 3.31, awayWin: 2.89 },
        suspended: false
      }
    }
  },
  {
    _id: '4',
    eventDateTime: '2023-12-01T20:00:00Z',
    league: 'England Championship',
    homeTeam: 'AC Milan',
    awayTeam: 'Inter Milan',
    suspendAll: false,
    bestCalculatedOdds: {
      oddSum: 7.96,
      homeWin: {
        value: 2.23,
        bookie: 'betUk'
      },
      draw: {
        value: 3.02,
        bookie: 'betWay'
      },
      awayWin: {
        value: 2.71,
        bookie: 'betWay'
      }
    },
    odds: {
      betWay: {
        oneX: { homeWin: 2.21, draw: 3.02, awayWin: 2.71 },
        suspended: false
      },
      betUk: {
        oneX: { homeWin: 2.23, draw: 2.38, awayWin: 2.16 },
        suspended: false
      },
      betGoodWin: {
        oneX: { homeWin: 2.4, draw: 2.71, awayWin: 2.52 },
        suspended: false
      }
    }
  },
  {
    _id: '5',
    eventDateTime: '2023-12-01T17:30:00Z',
    league: 'England National League South',
    homeTeam: 'Chelsea',
    awayTeam: 'Manchester City',
    suspendAll: false,
    bestCalculatedOdds: {
      oddSum: 8.15,
      homeWin: {
        value: 2.31,
        bookie: 'betGoodWin'
      },
      draw: {
        value: 3.22,
        bookie: 'betWay'
      },
      awayWin: {
        value: 2.62,
        bookie: 'betWay'
      }
    },
    odds: {
      betWay: {
        oneX: { homeWin: 2.11, draw: 3.22, awayWin: 2.62 },
        suspended: false
      },
      betUk: {
        oneX: { homeWin: 2.25, draw: 3.11, awayWin: 2.55 },
        suspended: false
      },
      betGoodWin: {
        oneX: { homeWin: 2.31, draw: 3.01, awayWin: 2.45 },
        suspended: false
      }
    }
  },
  {
    _id: '6',
    eventDateTime: '2023-12-01T14:00:00Z',
    league: 'England Isthmian Premier Division',
    homeTeam: 'Paris Saint-Germain',
    awayTeam: 'Lyon',
    suspendAll: false,
    bestCalculatedOdds: {
      oddSum: 8.63,
      homeWin: {
        value: 1.98,
        bookie: 'betGoodWin'
      },
      draw: {
        value: 3.45,
        bookie: 'betWay'
      },
      awayWin: {
        value: 3.2,
        bookie: 'betWay'
      }
    },
    odds: {
      betWay: {
        oneX: { homeWin: 1.7, draw: 3.45, awayWin: 3.2 },
        suspended: false
      },
      betUk: {
        oneX: { homeWin: 1.8, draw: 3.31, awayWin: 3.0 },
        suspended: false
      },
      betGoodWin: {
        oneX: { homeWin: 1.98, draw: 3.21, awayWin: 2.8 },
        suspended: false
      }
    }
  }
];
