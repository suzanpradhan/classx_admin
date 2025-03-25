import { NewsType } from '@/modules/news/newsType';
import { format, parseISO } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import parse from 'html-react-parser';
import Image from 'next/image';

const NewsDetailsTap = ({ news }: { news: NewsType }) => {
  const parsedDate = parseISO(news.date as string);
  const formattedDate = news.date
    ? format(toZonedTime(parsedDate, 'UTC'), 'PPpp')
    : 'Invalid Date';
  return (
    <div className="m-4 flex flex-col max-w-5xl">
      <div className="bg-blueWhite border border-primaryGray-300 rounded-lg overflow-hidden max-w-xl relative aspect-video">
        <Image
          src={news.cover_image ?? '/default-profile-picture.jpg'}
          alt="cover image"
          fill
          objectFit="cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div
        className={`h-fit grid md:grid-rows-none grid-rows-3 md:grid-cols-2 mt-4 gap-4`}
      >
        <div className="grid grid-cols-2 md:grid-cols-none md:grid-rows-2 ">
          <div className="text-sm text-black">Name</div>
          <div className="text-base capitalize text-black">{news.title}</div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-none md:grid-rows-2 ">
          <div className="text-sm text-black">Date</div>
          <div className="text-base capitalize text-black">{formattedDate}</div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-1">
          <div className="text-sm text-black">Content</div>
          <div className="text-base capitalize text-black">
            {parse(news.content)}
          </div>
        </div>
        <div>
          <div className="grid grid-cols-2 md:grid-cols-1 ">
            <div className="text-sm text-black">Description</div>
            <div className="text-base text-black ">
              {parse(news.description)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsDetailsTap;
