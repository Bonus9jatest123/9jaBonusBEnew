'use client';
import { getCookie, removeCookie, removeUserCookie } from '@/lib/cookies';
import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { hasPermission } from '@/redux/hasPermissions';
import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const Header = () => {
  const { push } = useRouter();
  const pathname = usePathname();
  const [token, setToken] = useState<string | null>(null);
  const currentState = useSelector((state: RootState) => state);

  useEffect(() => {
    const cookie = getCookie('token');

    if (cookie) {
      try {
        setToken(cookie);
      } catch (e) {
        console.error('Invalid cookie format');
      }
    }
  }, [pathname]);
  const handleLogout = () => {
    removeCookie('token');
    removeUserCookie('user');
    setToken(null);
    setTimeout(() => {
      toast.success('Logged out successfully');
      push('/admin/login');
    }, 500)

  };
  return (
    <div className="admin-nav">
      <div className="wrapper">
        <div className="admin-nav-content">
          {hasPermission('Bookies', currentState) ? <Link href="/admin/offers" className="admin-logo">
            Back Office
          </Link> : <div className="admin-logo">
            Back Office
          </div>}

          <div className="nav-links">
            {token ? (
              <>
                {hasPermission('Bookies', currentState) && <Link href="/admin/offers" className={pathname === '/admin/offers' ? 'link-item --active' : 'link-item'}>
                  Bookies
                </Link>}
                {hasPermission('Odds', currentState) && <Link href="/admin/odds" className={pathname === '/admin/odds' ? 'link-item --active' : 'link-item'}>
                  Odds
                </Link>}
                {hasPermission('Users', currentState) && <Link href="/admin/users" className={pathname === '/admin/users' ? 'link-item --active' : 'link-item'}>
                  Users
                </Link>}
                {hasPermission('Footers', currentState) && <Link href="/admin/footer" className={pathname === '/admin/footer' ? 'link-item --active' : 'link-item'}>
                  Footer
                </Link>}

                <div className="auth-links">
                  <div className="link-item" onClick={handleLogout}>
                    Logout
                  </div>
                  <Link href="/admin/change-password" className={pathname === '/admin/change-password' ? 'link-item --active' : 'link-item'}>
                    Change Password
                  </Link>

                </div>

              </>
            ) : (
               pathname?.startsWith('/admin/reset-password')?(
 <div className="auth-links">
             
                <Link href="/admin/login" className={pathname === '/admin/login' ? 'link-item --active' : 'link-item'}>
                  Log In
                </Link>
                 
              </div>
               ):( <div className="auth-links">
                <Link href="/admin/signup" className={pathname === '/admin/signup' ? 'link-item --active' : 'link-item'}>
                  Sign Up
                </Link>
                <Link href="/admin/login" className={pathname === '/admin/login' ? 'link-item --active' : 'link-item'}>
                  Log In
                </Link>
                 <Link href="/admin/verify-email" className={pathname === '/admin/verify-email' ? 'link-item --active' : 'link-item'}>
                  Reset Password
                </Link>
              </div>)
             
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
