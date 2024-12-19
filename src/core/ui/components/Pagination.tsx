import { CaretLeft, CaretRight } from 'phosphor-react';
import { useCallback } from 'react';

interface ButtonProps {
  content: React.ReactNode;
  onClick: () => {};
  active?: boolean;
  disabled?: boolean;
}

function Button({ content, onClick, active, disabled }: ButtonProps) {
  return (
    <button
      className={`flex flex-col cursor-pointer items-center justify-center w-8 h-8 shadow-[0_4px_10px_rgba(0,0,0,0.03)] text-sm font-normal transition-colors rounded-md
        ${!disabled
          ? 'hover:bg-gray-400 hover:text-white'
          : 'text-black cursor-not-allowed'
        }
        ${active ? 'bg-accentBlue-500 text-white hover:bg-accentBlue-300' : 'text-dark-500/30'}
        `}
      onClick={onClick}
      disabled={disabled}
    >
      {content}
    </button>
  );
}

interface PaginationProps {
  gotoPage: any;
  canPreviousPage: boolean;
  canNextPage: boolean;
  pageCount: number;
  pageIndex: number;
}

export default function PaginationNav({
  gotoPage,
  canPreviousPage,
  canNextPage,
  pageCount,
  pageIndex,
}: PaginationProps) {
  const renderPageLinks = useCallback(() => {
    if (pageCount === 0) return null;
    const visiblePageButtonCount = 3;
    let numberOfButtons =
      pageCount < visiblePageButtonCount ? pageCount : visiblePageButtonCount;
    const pageIndices = [pageIndex];
    numberOfButtons--;
    [...Array(numberOfButtons)].forEach((_item, itemIndex) => {
      const pageNumberBefore = pageIndices[0] - 1;
      const pageNumberAfter = pageIndices[pageIndices.length - 1] + 1;

      if (
        pageNumberBefore >= 0 &&
        (itemIndex < numberOfButtons / 2 || pageNumberAfter > pageCount - 1)
      ) {
        pageIndices.unshift(pageNumberBefore);
      } else {
        pageIndices.push(pageNumberAfter);
      }
    });
    return pageIndices.map((pageIndexToMap) => (
      <li key={pageIndexToMap}>
        <Button
          content={pageIndexToMap + 1}
          onClick={() => gotoPage(pageIndexToMap + 1)}
          active={pageIndex === pageIndexToMap}
        />
      </li>
    ));
  }, [gotoPage, pageCount, pageIndex]);
  return (
    <div className="flex justify-between">
      <div></div>
      <ul className="flex gap-1">
        <li>
          <Button
            content={
              <div className="flex ml-1 ">
                <CaretLeft size={15} />
              </div>
            }
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canPreviousPage}
          />
        </li>
        {renderPageLinks()}
        <li>
          <Button
            content={
              <div className="flex ml-1 ">
                <CaretRight size={15} />
              </div>
            }
            onClick={() => gotoPage(pageCount + 1)}
            disabled={!canNextPage}
          />
        </li>
      </ul>
    </div>
  );
}
