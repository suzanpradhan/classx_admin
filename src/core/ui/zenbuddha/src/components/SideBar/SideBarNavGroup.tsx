'use client';

import { ArrowDown2, ArrowRight2 } from 'iconsax-react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

interface SideBarNavGroupProps {
  title: string;
  segment: string;
  children?: React.ReactNode;
}

const SideBarNavGroup = ({
  title,
  segment,
  children,
}: SideBarNavGroupProps) => {
  const [toggle, setToggle] = useState(false);
  const pathName = usePathname();

  useEffect(() => {
    setToggle(pathName.startsWith('/' + segment) ? true : false);
  }, [pathName, setToggle, segment]);

  return (
    <div
      className={
        `p-1 text-white font-normal my-[2px] rounded-md flex flex-col items-start nav-group group ` +
        (toggle ? 'bg-white/10' : 'bg-white/5')
      }
    >
      <button
        className={
          `p-2 flex justify-between items-center w-full text-sm whitespace-nowrap ` +
          (toggle ? 'mb-1' : '')
        }
        onClick={() => {
          setToggle(!toggle);
        }}
      >
        {title}
        {toggle ? (
          <ArrowDown2 className="text-primaryGray-500" size={16} />
        ) : (
          <ArrowRight2 className="text-primaryGray-500" size={16} />
        )}
      </button>

      {toggle ? children : <></>}
    </div>
  );
};

export default SideBarNavGroup;
