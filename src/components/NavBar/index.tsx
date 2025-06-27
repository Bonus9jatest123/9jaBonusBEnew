'use client';
import React from 'react';
import Link from 'next/link';

import { usePathname } from 'next/navigation';

const NavBar = () => {
  const pathname = usePathname();

  return (
    <>
      {pathname && !pathname.includes('admin') && (
        <div className="nav-bar_container">
          <div className="nav-bar_logo_container">
            <Link href="/" className="nav-bar_img">
              <img src="/images/svg/Logo.png" className="nav-Logo" />
            </Link>
            <div className="flex">
              <Link href="/">
                <div className={pathname === '/' ? ' nav_bar_active' : 'nav_bar_item'}>
                  <span>Offers</span>
                </div>
              </Link>
              <Link href="/bet">
                <div className={pathname === '/bet' ? ' nav_bar_active' : 'nav_bar_item'}>Odds</div>
              </Link>
              <Link href="/blog">
                <div className={pathname === '/blog' ? ' nav_bar_active' : 'nav_bar_item'}>Blog</div>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NavBar;
