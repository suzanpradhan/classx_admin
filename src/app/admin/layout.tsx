/* eslint-disable @next/next/no-img-element */
'use client';

import AppBar from '@/core/ui/zenbuddha/src/components/AppBar';
import SideBarNavGroup from '@/core/ui/zenbuddha/src/components/SideBar/SideBarNavGroup';
import SideBarNavLink from '@/core/ui/zenbuddha/src/components/SideBar/SideBarNavLink';
import SideBarNavTitle from '@/core/ui/zenbuddha/src/components/SideBar/SideBarNavTitle';
import { Bell, LogOut } from 'lucide-react';
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
          <Bell className="text-white" size={20} />
        </button>
        <button
          className="flex h-9 w-9 items-center justify-center rounded-md bg-white/5"
          onClick={() => {
            signOut({ callbackUrl: '/login', redirect: true });
          }}
        >
          <LogOut className="text-white" />
        </button>
      </AppBar>
      <div className="min-h-[calc(100vh-3.75rem)] gap-2 overflow-hidden">
        <div
          className={
            `custom-scrollbar absolute left-0 top-[60px] flex h-[calc(100vh-3.25rem)] w-full max-w-[15rem] flex-col overflow-y-auto bg-blackPrimary/95 px-4 pt-1 pb-5 ` +
            (toggle ? '' : '')
          }
        >
          <SideBarNavLink title="Dashboard" link="/admin/dashboard" />
          <div className="my-2 border-t border-white/5"></div>

          <SideBarNavGroup
            title="Featured Release"
            segment="admin/featured_releases"
          >
            <SideBarNavLink
              title="All Featured Release"
              link="/admin/featured_releases/all"
              linkExact
            />
            <SideBarNavLink
              title="Add New Featured Release"
              link="/admin/featured_releases/mutate"
              linkExact
            />
          </SideBarNavGroup>
          <SideBarNavGroup title="Applicants" segment="admin/applicants">
            <SideBarNavLink
              title="All Applicants"
              link="/admin/applicants/all"
              linkExact
            />
            <SideBarNavLink
              title="Add New Applicant"
              link="/admin/applicants/mutate"
              linkExact
            />
          </SideBarNavGroup>
          <SideBarNavGroup title="Appointments" segment="admin/appointments">
            <SideBarNavLink
              title="All Appointments"
              link="/admin/appointments/all"
              linkExact
            />
          </SideBarNavGroup>
          <SideBarNavGroup
            title="Artist Booking"
            segment="admin/artist_booking"
          >
            <SideBarNavLink
              title="All Artist Booking"
              link="/admin/artist_booking/all"
              linkExact
            />
            <SideBarNavLink
              title="Add New Artist Booking"
              link="/admin/artist_booking/mutate"
              linkExact
            />
          </SideBarNavGroup>
          <SideBarNavGroup title="News" segment="admin/news">
            <SideBarNavLink title="All News" link="/admin/news/all" linkExact />
            <SideBarNavLink
              title="Add News"
              link="/admin/news/mutate"
              linkExact
            />
          </SideBarNavGroup>
          <SideBarNavGroup title="Artists" segment="admin/artists">
            <SideBarNavLink
              title="All Artists"
              link="/admin/artists/all"
              linkExact
            />
            <SideBarNavLink
              title="Add New Artists"
              link="/admin/artists/mutate"
              linkExact
            />
            <SideBarNavLink
              title="All Artists Infos"
              link="/admin/artists/artist_infos/all"
              linkExact
            />
            <SideBarNavLink
              title="Add New Artists Infos"
              link="/admin/artists/artist_infos/mutate"
              linkExact
            />
          </SideBarNavGroup>
          <SideBarNavTitle title="Library" />
          <SideBarNavGroup title="Genres" segment="admin/genres">
            <SideBarNavLink title="All Genres" link="/admin/genres/all" />
            <SideBarNavLink
              title="Add New Genres"
              link="/admin/genres/mutate"
            />
          </SideBarNavGroup>
          <SideBarNavGroup title="Releases" segment="admin/releases">
            <SideBarNavLink title="All Releases" link="/admin/releases/all" />
            <SideBarNavLink
              title="Add New Releases"
              link="/admin/releases/mutate"
            />
          </SideBarNavGroup>

          <SideBarNavGroup title="Tracks" segment="admin/tracks">
            <SideBarNavLink title="All Tracks" link="/admin/tracks/all" />
            <SideBarNavLink
              title="Add New Tracks"
              link="/admin/tracks/mutate"
            />
          </SideBarNavGroup>
          <SideBarNavGroup title="Beats" segment="admin/sounds">
            <SideBarNavLink title="All Beats" link="/admin/sounds/all" />
            <SideBarNavLink title="Add New Beats" link="/admin/sounds/mutate" />
          </SideBarNavGroup>
          <div className="my-2 border-t border-white/5"></div>
          <SideBarNavTitle title="SHOP" />
          <SideBarNavGroup title="Orders" segment="admin/orders">
            <SideBarNavLink title="All Orders" link="/admin/orders/all" />
          </SideBarNavGroup>
          <SideBarNavGroup title="Products" segment="admin/products">
            <SideBarNavLink title="All Products" link="/admin/products/all" />
            <SideBarNavLink
              title="Add New Products"
              link="/admin/products/mutate"
            />
          </SideBarNavGroup>
          <SideBarNavGroup
            title="Digital Download"
            segment="admin/digital_download"
          >
            <SideBarNavLink
              title="All Digital Download"
              link="/admin/digital_download/all"
            />
            <SideBarNavLink
              title="Add New Digital Download"
              link="/admin/digital_download/mutate"
            />
          </SideBarNavGroup>
          <SideBarNavTitle title="Events" />
          <SideBarNavGroup title="Venue" segment="admin/events/venue">
            <SideBarNavLink title="All Venue" link="/admin/events/venue/all" />
            <SideBarNavLink
              title="Add New Venue"
              link="/admin/events/venue/mutate"
            />
          </SideBarNavGroup>
          <SideBarNavGroup
            title="Event Catergory"
            segment="admin/events/category"
          >
            <SideBarNavLink
              title="All Events Catergory"
              link="/admin/events/category/all"
            />
            <SideBarNavLink
              title="Add New Event Catergory"
              link="/admin/events/category/mutate"
            />
          </SideBarNavGroup>
          <SideBarNavGroup
            title="Event Performer"
            segment="admin/events/performer"
          >
            <SideBarNavLink
              title="All Events Performer"
              link="/admin/events/performer/all"
            />
            <SideBarNavLink
              title="Add New Event Performer"
              link="/admin/events/performer/mutate"
            />
          </SideBarNavGroup>
          <SideBarNavGroup title="Event" segment="admin/events/event">
            <SideBarNavLink title="All Events" link="/admin/events/event/all" />
            <SideBarNavLink
              title="Add New Event"
              link="/admin/events/event/mutate"
            />
          </SideBarNavGroup>
          <SideBarNavGroup
            title="Ticket Type"
            segment="admin/events/ticket_type"
          >
            <SideBarNavLink
              title="All Ticket Type"
              link="/admin/events/ticket_type/all"
            />
            <SideBarNavLink
              title="Add New Ticket Type"
              link="/admin/events/ticket_type/mutate"
            />
          </SideBarNavGroup>
          <div className="my-2 border-t border-white/5"></div>
          {/* <SideBarNavTitle title="Settings" />
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
          </SideBarNavGroup> */}
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
