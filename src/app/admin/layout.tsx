'use client';
/* eslint-disable @next/next/no-img-element */

import {
  AppBar,
  SideBarNavGroup,
  SideBarNavLink,
} from '@/core/ui/zenbuddha/src';
import SideBarNavTitle from '@/core/ui/zenbuddha/src/components/SideBar/SideBarNavTitle';
import { Logout, NotificationBing } from 'iconsax-react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';

export default function TestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [toggle, setToggle] = useState(true);

  return (
    <div className="relative overflow-hidden ">
      <AppBar
        onSideBarToggle={() => {
          setToggle(!toggle);
        }}
        leading={
          <Link href="/">
            <img
              src="/logo/classX-white.png"
              alt="classX_logo_white"
              className="h-full w-full object-contain"
            />
          </Link>
        }
      >
        <button className="flex h-9 w-9 items-center justify-center rounded-md bg-white/5">
          <NotificationBing className="text-white" variant="Bold" size={20} />
        </button>
        <button className="flex h-9 w-9 items-center justify-center rounded-md bg-white/5"
         onClick={() => {
          signOut({ callbackUrl: '/login', redirect: true });
        }}
        >
          <Logout className="text-white" />
        </button>
      </AppBar>
      <div className="min-h-[calc(100vh-3.75rem)] gap-2 overflow-hidden">
        <div
          className={
            `custom-scrollbar absolute left-0 top-[3.75rem] flex h-[calc(100vh-3.25rem)] w-full max-w-[15rem] flex-col overflow-y-auto bg-blackPrimary/95 px-4 pt-1 pb-5 ` +
            (toggle ? '' : '')
          }
        >
          <SideBarNavLink
            title="Dashboard"
            link="/admin/dashboard"
          />
          <div className="my-2 border-t border-white/5"></div>
          <SideBarNavGroup title='Artists' segment='admin/artists'>
          <SideBarNavLink
            title="All Artists"
            link="/admin/artists/all"
          />
          <SideBarNavLink
            title="Add New Artists"
            link="/admin/artists/mutate"
          />
          </SideBarNavGroup>
          <SideBarNavTitle title="Music" />
         
          <SideBarNavGroup title='Genres' segment='admin/genres'>
          <SideBarNavLink
            title="All Genres"
            link="/admin/genres/all"
          />
          <SideBarNavLink
            title="Add New Genres"
            link="/admin/genres/mutate"
          />
          </SideBarNavGroup>
          <SideBarNavGroup title='Releases' segment='admin/releases'>
          <SideBarNavLink
            title="All Releases"
            link="/admin/releases/all"
          />
          <SideBarNavLink
            title="Add New Releases"
            link="/admin/releases/mutate"
          />
          </SideBarNavGroup>
        
          <SideBarNavGroup title="Tracks" segment="admin/tracks">
            <SideBarNavLink title="All Tracks" link="/admin/tracks/all" />
            <SideBarNavLink title="Add New Tracks" link="/admin/tracks/mutate" />
    
          </SideBarNavGroup>
          <div className="my-2 border-t border-white/5"></div>
          <SideBarNavTitle title="SHOP" />
          <SideBarNavGroup title="Orders" segment="admin/orders">
            <SideBarNavLink title="All Orders items" link="/admin/Orders/all" />
            <SideBarNavLink title="Add Orders items" link="/admin/Orders/mutate" />
          </SideBarNavGroup>
           <SideBarNavGroup title="Products" segment="admin/products">
            <SideBarNavLink title="All Products" link="/admin/products/all" />
            <SideBarNavLink title="Add New Products" link="/admin/products/mutate" />
          </SideBarNavGroup>
            
          <div className="my-2 border-t border-white/5"></div>
          <SideBarNavTitle title="Settings" />
          <SideBarNavGroup title="Accounts" segment="admin/accounts">
            <div className="w-full border-t border-white/5"></div>
            <SideBarNavLink
              title="All Users"
              link="/admin/accounts/users/all"
            />
          </SideBarNavGroup>
          <SideBarNavGroup title="General" segment="admin/settings">
            <div className="w-full border-t border-white/5"></div>
            <SideBarNavLink title="Manage site" link="/admin/settings" />
          </SideBarNavGroup>
        </div>
        <div
          className={
            `custom-scrollbar absolute left-[15rem] top-[3.75rem] h-[calc(100vh-3.75rem)] w-[calc(100%-15rem)] flex-1 overflow-y-auto bg-white transition duration-200 ease-in-out max-lg:w-full ` +
            (toggle ? 'max-lg:-translate-x-[15rem]' : '')
          }
        >
          {children}
        </div>
      </div>
    </div>
  );
}
