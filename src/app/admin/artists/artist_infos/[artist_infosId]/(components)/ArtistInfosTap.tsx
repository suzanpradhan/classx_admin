import { ArtistInfosType } from '@/modules/artists/artistsType';
import parse from 'html-react-parser';

const ArtistInfosTap = ({ artistInfos }: { artistInfos: ArtistInfosType }) => {
  return (
    <div className="m-4 flex flex-col max-w-5xl">
      <div
        className={`h-fit grid md:grid-rows-none grid-rows-3 md:grid-cols-2 mt-4 gap-2`}
      >
        <div className="grid grid-cols-2 md:grid-cols-none ">
          <div className="text-base font-medium text-black">Artist</div>
          <div className="text-sm capitalize text-black">
            {artistInfos?.artist?.name}
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-none ">
          <div className="text-base font-medium text-black">Text One</div>
          <div className="text-sm capitalize text-black">
            {artistInfos.text_one}
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-none ">
          <div className="text-base font-medium text-black">Text Two</div>
          <div className="text-sm capitalize text-black">
            {artistInfos.text_two}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-none">
          <div className="text-base font-medium text-black">About</div>
          <div className="text-sm text-black">{parse(artistInfos.about)}</div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-none">
          <div className="text-base font-medium text-black">Book Artist</div>
          <div className="text-sm text-black">
            {parse(artistInfos.book_artist as string)}
          </div>
        </div>
        <div>
          <div className="grid grid-cols-2 md:grid-cols-none  ">
            <div className="text-base font-medium text-black">Feat Text</div>
            <div className="text-sm capitalize text-black">
              {parse(artistInfos.feat_text)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ArtistInfosTap;
