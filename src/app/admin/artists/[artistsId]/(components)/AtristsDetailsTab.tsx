import { ArtistsType } from '@/modules/artists/artistsType';
import parse from "html-react-parser";
import Image from 'next/image';

const ArtistsInfosTab = ({ Artists }: { Artists:  ArtistsType }) => {
  return (
    <div className="m-4 flex flex-col max-w-5xl">
      <div className="bg-blueWhite border border-primaryGray-300 rounded-lg overflow-hidden max-w-xl relative aspect-video">
        <Image
          src={Artists.profile_picture}
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
          <div className="text-sm text-black">Name</div>
          <div className="text-base capitalize text-black">{Artists.name}</div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-none md:grid-rows-2">
          <div className="text-sm text-black">Bio</div>
          <div className="text-base text-black">{parse(Artists.bio)}</div>
        </div> 
      </div>
     
     
    </div>
  );
};
export default ArtistsInfosTab;