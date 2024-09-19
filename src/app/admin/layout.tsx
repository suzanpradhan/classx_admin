'use client';
/* eslint-disable @next/next/no-img-element */

import {
  AppBar,
  SideBarNavGroup,
  SideBarNavLink,
} from '@/core/ui/zenbuddha/src';
import { Logout, NotificationBing } from 'iconsax-react';
import Link from 'next/link';
import { useState } from 'react';

export default function TestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [toggle, setToggle] = useState(true);

  return (
    <div className="relative overflow-hidden">
      <AppBar
        onSideBarToggle={() => {
          setToggle(!toggle);
        }}
        leading={
          <Link href="/">
            <img
              src="/logo/classX-white.png"
              alt="buddha_air_logo_white"
              className="h-full w-full object-contain"
            />
          </Link>
        }
      >
        <button className="flex h-9 w-9 items-center justify-center rounded-md bg-white/20">
          <NotificationBing className="text-white" variant="Bold" size={20} />
        </button>
        <button className="flex h-9 w-9 items-center justify-center rounded-md bg-white/20">
          <Logout className="text-white" />
        </button>
      </AppBar>
      <div className="min-h-[calc(100vh-3.25rem)] gap-2 overflow-hidden">
        <div
          className={
            `custom-scrollbar absolute left-0 top-[3.75rem] flex h-[calc(100vh-3.25rem)] w-full max-w-[15rem] flex-col overflow-y-auto bg-blackPrimary/95 px-4 py-1 ` +
            (toggle ? '' : '')
          }
        >
          <SideBarNavLink title="Dashboard" link="/admin/dashboard" />
          <SideBarNavGroup title="Tickets" segment="admin/tickets">
            <SideBarNavLink title="Reports" link="/admin/tickets/reports" />
            <SideBarNavLink title="Complains" link="/admin/tickets/complains" />
            <SideBarNavLink
              title="Lost and Found"
              link="/admin/tickets/lostandfound"
            />
            <SideBarNavLink
              title="Baggage Repairs"
              link="/admin/tickets/repairs"
            />
          </SideBarNavGroup>
          <SideBarNavGroup title="Survey" segment="admin/surveys">
            <SideBarNavLink title="Surveys" link="/admin/surveys" />
            <SideBarNavLink title="Spot Checks" link="/admin/spotchecks" />
          </SideBarNavGroup>
          <div className="my-2 border-t border-white/5 text-sm font-medium"></div>
          <SideBarNavLink title="Settings" link="#" />
          <SideBarNavGroup title="Accounts" segment="admin/accounts">
            <SideBarNavLink
              title="All Users"
              link="/admin/accounts/users/all"
            />
          </SideBarNavGroup>
          <SideBarNavGroup title="General" segment="admin/settings">
            <SideBarNavLink title="Flights" link="/admin/settings/flights" />
            <SideBarNavLink
              title="Severities"
              link="/admin/settings/severities"
            />
            <SideBarNavLink title="Stations" link="/admin/settings/stations" />
            <SideBarNavLink title="Status" link="/admin/settings/status" />
            <SideBarNavLink title="Sources" link="/admin/settings/sources" />
            <SideBarNavLink
              title="Departments"
              link="/admin/settings/departments"
            />
          </SideBarNavGroup>
        </div>
        <div
          className={
            `custom-scrollbar absolute left-[15rem] top-[3.75rem] h-[calc(100vh-3.25rem)] w-[calc(100%-15rem)] flex-1 overflow-y-auto bg-white transition duration-200 ease-in-out max-lg:w-full ` +
            (toggle ? 'max-lg:-translate-x-[15rem]' : '')
          }
        >
          {children}
        </div>
      </div>
    </div>
  );
}
