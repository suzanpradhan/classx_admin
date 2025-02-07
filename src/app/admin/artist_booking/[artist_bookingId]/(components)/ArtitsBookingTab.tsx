import { ArtitstBookingType } from '@/modules/artists/artistsType';
import { format, parseISO } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

const ArtistBookingTab = ({
  artitsBooking,
}: {
  artitsBooking: ArtitstBookingType;
}) => {
  const parsedDate = parseISO(artitsBooking.event_date as string);
  const formattedDate = artitsBooking.event_date
    ? format(toZonedTime(parsedDate, 'UTC'), 'PPpp')
    : 'Invalid Date';
  return (
    <div className="m-4 flex flex-col max-w-5xl">
      <div
        className={`h-fit grid md:grid-rows-none grid-rows-3 md:grid-cols-2 mt-4 gap-3`}
      >
        <div>
          <div className="grid grid-cols-2 md:grid-cols-none md:mt-2 ">
            <div className="text-sm text-black">Full Name</div>
            <div className="text-base capitalize text-black">
              {artitsBooking.full_name}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-none">
          <div className="text-sm text-black">Email</div>
          <div className="text-base text-black">{artitsBooking.email}</div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-none">
          <div className="text-sm text-black">Artist</div>
          <div className="text-base text-black">
            {artitsBooking.artist?.name}
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-none">
          <div className="text-sm text-black">Event Type</div>
          <div className="text-base text-black">{artitsBooking.event_type}</div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-none">
          <div className="text-sm text-black">Location</div>
          <div className="text-base text-black">{artitsBooking.location}</div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-none">
          <div className="text-sm text-black">Phone</div>
          <div className="text-base text-black">{artitsBooking.phone}</div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-none">
          <div className="text-sm text-black">Date</div>
          <div className="text-base text-black">{formattedDate}</div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-none">
          <div className="text-sm text-black">Info</div>
          <div className="text-base text-black">{artitsBooking.info}</div>
        </div>
      </div>
    </div>
  );
};

export default ArtistBookingTab;
