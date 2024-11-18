import { ReleasesType } from '@/modules/releases/releasesType';
import parse from "html-react-parser";
import Image from 'next/image';

const ReleasesInfosTab = ({ releases }: { releases:  ReleasesType }) => {
  // console.log(releases)
  return (
    <div className="m-4 flex flex-col max-w-5xl">
      <div className="bg-blueWhite border border-primaryGray-300 rounded-lg overflow-hidden max-w-xl relative aspect-video">
        <Image
          src={releases.cover}
          alt="cover image"
          fill
          objectFit="cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div
        className={`h-fit grid md:grid-rows-none grid-rows-3 md:grid-cols-2 mt-4 gap-4`}
      >
        <div className="grid grid-cols-2 md:grid-cols-none md:grid-rows-2">
          <div className="text-sm text-black">Title</div>
          <div className="text-base capitalize text-black">{releases.title}</div>
        </div>
        {/* <div className="grid grid-cols-2 md:grid-cols-none md:grid-rows-2">
          <div className="text-sm text-black">Artists</div>
          <div className="text-base capitalize text-black">{releases.artist}</div>
        </div> */}
        <div className="grid grid-cols-2 md:grid-cols-none md:grid-rows-2">
          <div className="text-sm text-black">Releases Date</div>
          <div className="text-base capitalize text-black">{releases.release_date}</div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-none md:grid-rows-2">
          <div className="text-sm text-black">Releases Type</div>
          <div className="text-base capitalize text-black">{releases.release_type}</div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-none md:grid-rows-2">
          <div className="text-sm text-black">Description</div>
          <div className="text-base text-black">{parse(releases.description)}</div>
        </div> 
      </div>
     
     
    </div>
  );
};
export default ReleasesInfosTab;
