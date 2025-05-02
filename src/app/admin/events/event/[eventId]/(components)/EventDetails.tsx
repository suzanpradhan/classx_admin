import { EventType } from '@/modules/events/event/eventType';
import parse from 'html-react-parser';
import Image from 'next/image';

const EventDetailsTap = ({ event }: { event: EventType }) => {
  return (
    <div className="m-4 flex flex-col max-w-5xl">
      <div className="bg-blueWhite border border-primaryGray-300 rounded-lg overflow-hidden max-w-xl relative aspect-video">
        <Image
          src={event.image ?? '/default-profile-picture.jpg'}
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
          <div className="text-base capitalize text-black">{event.name}</div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-none md:grid-rows-2 ">
          <div className="text-sm text-black">Organizer</div>
          <div className="text-base capitalize text-black">
            {event.organizer.username}
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-none md:grid-rows-2 ">
          <div className="text-sm text-black">Status</div>
          <div className="text-base capitalize text-black">{event.status}</div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-none md:grid-rows-2 ">
          <div className="text-sm text-black">Venue</div>
          <div className="text-base capitalize text-black">
            {event.venue.name}
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-none md:grid-rows-2 ">
          <div className="text-sm text-black">Venue</div>
          <div className="text-base capitalize text-black">
            {event.start_date}
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-1">
          Category
          <div className="text-base capitalize text-black">
            {event?.category?.title}
          </div>
        </div>
        <div>
          <div className="grid grid-cols-2 md:grid-cols-1 ">
            <div className="text-sm text-black">Description</div>
            <div className="text-base text-black ">
              {parse(event.description)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsTap;
