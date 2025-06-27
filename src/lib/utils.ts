import { Offer } from '@/components/TabCards';
import { BetslipItem } from '@/redux/features/betslipSlice';
import { Bonus, BonusInfo } from '@/redux/features/bonusSlice';
import { Filters } from '@/redux/features/fixturesSlice';
import { Fixture, Odds, OddsProduct, OneX, bookie } from '@/types/commonTypes';
import moment from 'moment';

export const checkHTTPProtocol = (uri: string): string => {
  if (uri.startsWith('https://') || uri.startsWith('http://')) return uri;
  else return 'https://' + uri;
};

export function getCurrentWeekDays() {
  const today = new Date();
  const dayNames = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
  const fullDayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const weekDays = [];

  for (let i = 0; i < 7; i++) {
    const day = new Date(today);
    day.setDate(today.getDate() + i);

    const formattedDate = `${String(day.getDate()).padStart(2, '0')}.${String(day.getMonth() + 1).padStart(2, '0')}`;

    weekDays.push({
      name: i === 0 ? 'TODAY' : dayNames[day.getDay()],
      fullName: fullDayNames[day.getDay()],
      date: formattedDate
    });
  }

  return weekDays;
}

export function findItemByKey(array: any, key: any, value: any) {
  return array.find((item: any) => item[key] === value);
}
export function getDateAndTime(dateString: string) {
  const date = new Date(dateString);

  const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const formattedDate = date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    timeZone: localTimeZone
  });

  let hours = date.getHours().toString().padStart(2, '0');
  let minutes = date.getMinutes().toString().padStart(2, '0');
  const formattedTime = `${hours}:${minutes}`;

  return {
    date: formattedDate,
    time: formattedTime
  };
}

export function getDateForFilters(dateString: string) {
  const date = new Date(dateString);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${day}.${month}`;
}

export function findBestBookie(odds: Odds) {
  let bestBookie = null;

  for (const [bookieName, data] of Object.entries(odds)) {
    if (data.suspended) continue;

    const oneXData: OneX = data?.oneX;

    const totalOdds: number = oneXData.homeWin + oneXData.draw + oneXData.awayWin;

    if (!bestBookie || totalOdds > bestBookie.totalOdds) {
      bestBookie = {
        bookieName,
        totalOdds
      };
    }
  }

  return bestBookie?.bookieName;
}

export function filterFixtures(fixtures: Fixture[], filters: Filters) {
  let filteredFixtures = fixtures
    .filter((f) => getDateForFilters(f.eventDateTime) === filters.day.date)
    .filter((f) => {
      if (filters.league === '*') return f;
      return f.league === filters.league;
    })
    .sort((a, b) => {
      if (a.eventDateTime < b.eventDateTime) {
        return -1;
      }
      if (a.eventDateTime > b.eventDateTime) {
        return 1;
      }
      return 0;
    });

  if (filters?.sortBy.toLocaleLowerCase() === 'odds') filteredFixtures.sort((a, b) => a.bestCalculatedOdds.oddSum - b.bestCalculatedOdds.oddSum);

  return filteredFixtures;
}

export function calculateTotalOddsPerBookie(items: BetslipItem[]) {
  let oddsProduct: OddsProduct = {
    betWay: 1,
    betGoodWin: 1,
    betUk: 1
  };

  items.forEach((item) => {
    const selectedType = item.selectedOdds!.type;

    for (const bookie in item.odds) {
      if (item.odds.hasOwnProperty(bookie)) {
        const odds = item.odds[bookie as keyof Odds].oneX[selectedType as keyof OneX];
        oddsProduct[bookie as keyof OddsProduct] *= odds;
      }
    }
  });

  return oddsProduct;
}

export function getValueWithBonus(value: number, bonus: number) {
  return value * (1 + bonus / 100);
}

export function getBestBookie(odds: OddsProduct, bonusInfo: BonusInfo) {
  let maxOdds = 0;
  let bookieWithHighestOdds = '';

  for (const bookie in odds) {
    const oddsWithBonus = getValueWithBonus(odds[bookie], bonusInfo[bookie]?.bonus);
    if (oddsWithBonus > maxOdds) {
      maxOdds = oddsWithBonus;
      bookieWithHighestOdds = bookie;
    }
  }

  return bookieWithHighestOdds;
}

export function clearOldBetslip() {
  const today = new Date().toLocaleDateString();
  const storedDate = JSON.parse(localStorage.getItem('betslipTimestamp') as string);

  if (storedDate !== today) localStorage.clear();
}

export function formatDateForOddssRow(dateString: string) {
  const date = new Date(dateString);
  const localDate = date?.toLocaleString()?.replace(',', ' @')?.slice(0, -3);
  return localDate;
}

export function getLocalDate(dateString: string = '') {
  if (dateString) {
    return moment(dateString).format('YYYY-MM-DDTHH:mm');
  }
}

export function getLeagueOptions(fixtures: Fixture[]) {
  const uniqueLeagues = new Set(fixtures.map((obj) => obj.league.trim()));

  const options = Array.from(uniqueLeagues).map((league) => ({
    label: league,
    value: league
  }));

  options.unshift({ label: 'All', value: '*' });

  return options;
}

export function getBookies(offers: Offer[]) {
  const result: any = {};

  offers.forEach((item) => {
    if (!result.hasOwnProperty(item.name)) {
      result[item.name] = { url: item.playLink, icon: item?.logo?.imageUrl, selections: item.selections, minOddsForBonus: item.minOddsForBonus };
    }
  });

  return result;
}

export function getOddsInitialValues(bookieNames: string[]) {
  const result: any = {};

  bookieNames.forEach((item) => {
    result[item] = {
      oneX: { homeWin: 0, draw: 0, awayWin: 0 },
      suspended: false
    };
  });

  return result;
}

export function getBestOddsTotal(totalOddsPerBookie: OddsProduct, bonusInfo: BonusInfo) {
  let bestTotalOdds = 0;

  Object.keys(totalOddsPerBookie).map((bookie) => {
    const bonus = bonusInfo[bookie as keyof bookie]?.bonus;
    const odds = totalOddsPerBookie[bookie as keyof OddsProduct];
    const totalOdds = getValueWithBonus(odds, bonus);
    if (totalOdds > bestTotalOdds) bestTotalOdds = totalOdds;
  });

  return bestTotalOdds;
}

export function getBonusInfo(betslipItems: BetslipItem[], bookies: bookie) {
  let bonusInfo: BonusInfo = {};

  // Initialize
  for (const bookie in bookies) {
    bonusInfo[bookie] = { qualifyingOdds: 0, bonus: 0 };
  }

  betslipItems.forEach((item) => {
    const selectedType = item?.selectedOdds?.type;

    // Check for each bookie
    for (const bookie in item.odds) {
      const bookieOdds = (item as any).odds[bookie].oneX[selectedType!];

      // Check qualifying odds
      if (bookieOdds >= bookies[bookie]?.minOddsForBonus) {
        bonusInfo[bookie].qualifyingOdds++;
      }
    }
  });

  // Calculate the bonus
  for (const bookie in bonusInfo) {
    const count = bonusInfo[bookie].qualifyingOdds;
    const selections = bookies[bookie].selections;

    if (selections[count]) {
      bonusInfo[bookie].bonus = parseInt(selections[count]);
    }
  }

  return bonusInfo;
}
