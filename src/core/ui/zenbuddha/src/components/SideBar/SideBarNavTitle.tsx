'use client';

const SideBarNavTitle = ({ title }: { title: string }) => {
  return (
    <div
      className={`flex items-center py-2 text-white/60 font-medium text-xs w-full h-10 group-[&.nav-group]:h-auto whitespace-nowrap rounded-md group-[&.nav-group]:hover:bg-white/5 group-[&.nav-group]:px-2 uppercase`}
    >
      {title}
    </div>
  );
};

export default SideBarNavTitle;
