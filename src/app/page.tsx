import { API_ENDPOINT } from '../lib/constants';
import Offers from '@/components/Offers';

export default async function Home() {
  const res = await fetch(`${API_ENDPOINT}/offers?pageNumber=1&pageSize=100`, { cache: 'no-store' });
   

  const data = await res.json();
  const initialOffers = data.offers;
 
  return (
    <>
      <div className="nav_banner">
        <div className="nav_banner_heading">Top Sports Betting Bonuses</div>
        <div className="nav_banner_para">Bet smarter – become a winner with Bonus9ja</div>
      </div>

      <Offers initialOffers={initialOffers || []} />
    </>
  );
}
