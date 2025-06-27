'use client';
import { getCookie, removeCookie } from '@/lib/cookies';
import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

const Header = () => {
  const { push } = useRouter();
  const pathname = usePathname();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const cookie = getCookie('token');
    if (cookie) {
      try {
        setToken(JSON.parse(cookie));
      } catch (e) {
        console.error('Invalid cookie format');
      }
    }
  }, []);

  const handleLogout = () => {
    removeCookie('token');
    setToken(null); // Update UI after logout
    push('/admin/login');
  };

  // Optional: skip rendering until cookie is checked
  if (token === null && typeof window !== 'undefined') {
    // Optionally return null, loader, or just render unauthenticated menu
  }

  return (
    <div className="admin-nav">
      <div className="wrapper">
        <div className="admin-nav-content">
          <Link href="/admin/offers" className="admin-logo">
            Back Office
          </Link>
          <div className="nav-links">
            {token ? (
              <>
                <Link href="/admin/offers" className={pathname === '/admin/offers' ? 'link-item --active' : 'link-item'}>
                  Bookies
                </Link>
                <Link href="/admin/odds" className={pathname === '/admin/odds' ? 'link-item --active' : 'link-item'}>
                  Odds
                </Link>
                <Link href="/admin/footer" className={pathname === '/admin/footer' ? 'link-item --active' : 'link-item'}>
                  Footer
                </Link>
                <div className="auth-links">
                  <div className="link-item" onClick={handleLogout}>
                    Logout
                  </div>
                </div>
              </>
            ) : (
              <div className="auth-links">
                <Link href="/admin/signup" className={pathname === '/admin/signup' ? 'link-item --active' : 'link-item'}>
                  Sign Up
                </Link>
                <Link href="/admin/login" className={pathname === '/admin/login' ? 'link-item --active' : 'link-item'}>
                  Log In
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
