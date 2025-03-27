import { Trackstype } from '@/modules/tracks/trackType';

const TrackDetailsTap = ({ tracks }: { tracks: Trackstype }) => {
  return (
    <div className="m-4 flex flex-col max-w-5xl">
      <div
        className={`h-fit grid md:grid-rows-none grid-rows-3 md:grid-cols-2 mt-4 gap-4`}
      >
        <div className="grid grid-cols-2 md:grid-cols-none md:grid-rows-2">
          <div className="text-sm text-black">Title</div>
          <div className="text-base capitalize text-black">{tracks.title}</div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-none md:grid-rows-2">
          <div className="text-sm text-black">Artists</div>
          <div className="text-base capitalize text-black">
            {tracks.artist.name}
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-none md:grid-rows-2">
          <div className="text-sm text-black">Release</div>
          <div className="text-base capitalize text-black">
            {tracks.release.title}
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-none md:grid-rows-2">
          <div className="text-sm text-black">Genres</div>
          <div className="text-base capitalize text-black">
            {tracks.genres.map((genre, index) => (
              <span key={index}>{genre.name}</span>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-none md:grid-rows-2">
          <div className="text-sm text-black">Duration</div>
          <div className="text-base capitalize text-black">
            {tracks.duration}
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-none md:grid-rows-2">
          <div className="text-sm text-black">Youtube</div>
          <div className="text-base capitalize text-black">
            {tracks.youtube}
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-none md:grid-rows-2">
          <div className="text-sm text-black">Spotify</div>
          <div className="text-base capitalize text-black">
            {tracks.spotify}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackDetailsTap;
