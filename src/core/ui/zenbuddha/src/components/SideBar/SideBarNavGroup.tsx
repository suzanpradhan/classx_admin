'use client';

import { usePathname } from 'next/navigation';
import { CaretDown, CaretRight } from 'phosphor-react';
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
    setToggle(!!pathName.startsWith('/' + segment));
  }, [pathName, segment]);

  return (
    <div
      className={
        `px-1 text-white font-normal my-[2px] rounded-md flex flex-col items-start nav-group group ` +
        (toggle ? 'bg-white/10' : 'bg-black/5')
      }
    >
      <button
        className={
          `px-2 flex justify-between items-center w-full text-sm whitespace-nowrap h-10 ` +
          (toggle ? 'mb-1' : '')
        }
        onClick={() => {
          setToggle(!toggle);
        }}
      >
        {title}
        {toggle ? <CaretDown size={16} /> : <CaretRight size={16} />}
      </button>

      {toggle && <div className=" w-full">{children}</div>}
    </div>
  );
};

export default SideBarNavGroup;
