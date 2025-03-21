import { AppointmentsType } from '@/modules/appointments/appointmentsType';
import { format, parseISO } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

const AppointmentsTab = ({
  appointments,
}: {
  appointments: AppointmentsType;
}) => {
  const formatDate = (date: string | null, timeZone: string = 'UTC') => {
    if (!date) return 'Invalid Date';
    try {
      const parsedDate = parseISO(date);
      return format(toZonedTime(parsedDate, timeZone), 'PPpp');
    } catch (error) {
      return 'Invalid Date';
    }
  };
  const formattedStartDate = formatDate(appointments.start_dt as string);
  const formattedEndDate = formatDate(appointments.end_dt as string);

  return (
    <div className="m-4 flex flex-col max-w-5xl">
      <div
        className={`h-fit grid md:grid-rows-none grid-rows-3 md:grid-cols-2 mt-4 gap-3`}
      >
        <div>
          <div className="grid grid-cols-2 md:grid-cols-none md:mt-2 ">
            <div className="text-sm text-black">FullName</div>
            <div className="text-base capitalize text-black">
              {appointments.full_name}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-none">
          <div className="text-sm text-black">Age</div>
          <div className="text-base text-black">{appointments.age}</div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-none">
          <div className="text-sm text-black">Email</div>
          <div className="text-base text-black">{appointments.email}</div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-none">
          <div className="text-sm text-black">Phone</div>
          <div className="text-base text-black">{appointments.phone}</div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-none">
          <div className="text-sm text-black">Current Address</div>
          <div className="text-base text-black">
            {appointments.current_address}
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-none">
          <div className="text-sm text-black">Permanent Address</div>
          <div className="text-base text-black">
            {appointments.perm_address}
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-none">
          <div className="text-sm text-black">Type</div>
          <div className="text-base text-black">{appointments.type}</div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-none">
          <div className="text-sm text-black">Genre</div>
          <div className="text-base text-black">
            {appointments?.genre?.name}
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-none">
          <div className="text-sm text-black">Start Date</div>
          <div className="text-base text-black">{formattedStartDate}</div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-none">
          <div className="text-sm text-black">End Date</div>
          <div className="text-base text-black">{formattedEndDate}</div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-none">
          <div className="text-sm text-black">Why Classx</div>
          <div className="text-base text-black">{appointments.why_classx}</div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentsTab;
