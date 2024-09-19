'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

interface SideBarNavGroupProps {
  title?: string;
  link: string;
  linkExact?: boolean;
}

const SideBarNavLink = ({
  title,
  link,
  linkExact = false,
}: SideBarNavGroupProps) => {
  const [toggle, setToggle] = useState(false);
  const pathName = usePathname();

  useEffect(() => {
    if (linkExact) {
      setToggle(pathName == link ? true : false);
    } else {
      setToggle(pathName.startsWith(link) ? true : false);
    }
  }, [pathName, setToggle, link, linkExact]);

  return (
    <Link
      href={link}
      className={
        `flex items-center py-2 text-white/60 font-normal text-sm w-full h-10 group-[&.nav-group]:h-auto whitespace-nowrap rounded-md group-[&.nav-group]:hover:bg-white/5 group-[&.nav-group]:px-2`
      }
      onClick={() => {
        if (!pathName.startsWith(link)) {
          setToggle(!toggle);
        }
      }}
    >
      {title}
    </Link>
  );
};

export default SideBarNavLink;