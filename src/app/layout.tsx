import './global-styles.scss';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavBar from '../components/NavBar';
import { Providers } from '@/redux/providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Bonus9ja',
  description: 'Welcome to Bonus9ja - the best Nigerian Betting Bonus Offers  Bet smarter, become a winner with Bonus9ja.',
  icons: {
    icon: '/images/svg/bonus9ja.png'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <html lang="en">
        <body className={`${inter.className} hww`}>
          <ToastContainer autoClose={1500} />
          <NavBar />
          {children}
        </body>
      </html>
    </Providers>
  );
}
