import { Menu } from 'lucide-react';

export interface AppBarProps {
  leading?: React.ReactNode;
  children?: React.ReactNode;
  hasSideBar?: boolean;
  onSideBarToggle?: () => void;
}

const AppBar = ({
  leading,
  children,
  hasSideBar = true,
  onSideBarToggle,
}: AppBarProps) => {
  return (
    <div className="flex flex-col sticky top-0 z-50 w-full">
      <div className="h-1 bg-grayDark/80"></div>
      <div className="h-14 bg-blackPrimary/95 flex justify-between items-center max-lg:px-4">
        <div className="w-full max-w-[15rem] h-full flex items-center gap-2 justify-center max-lg:justify-start">
          {hasSideBar ? (
            <button
              className="w-9 h-9 bg-white/5 rounded-md hidden items-center justify-center max-lg:flex"
              onClick={onSideBarToggle}
            >
              <Menu className="text-white" size={20} accentHeight={'bold'} />
            </button>
          ) : (
            <></>
          )}
          <div className='relative w-[90px] overflow-hidden'>
          {leading}
          </div>
        </div>
        <div className="max-w-[160px] flex gap-2 lg:px-4">{children}</div>
      </div>
    </div>
  );
};

export default AppBar;
