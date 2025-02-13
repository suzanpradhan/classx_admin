import { ApplicantsType } from '@/modules/applicants/applicantsType';
import Image from 'next/image';

const ApplicantsTab = ({ applicants }: { applicants: ApplicantsType }) => {
  return (
    <div className="m-4 flex flex-col max-w-5xl">
      <div className="bg-blueWhite border border-primaryGray-300 rounded-lg overflow-hidden max-w-xl relative aspect-video">
        <Image
          src={applicants.photo ?? '/default-profile-picture.jpg'}
          alt="cover image"
          fill
          objectFit="cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div
        className={`h-fit grid md:grid-rows-none grid-rows-3 md:grid-cols-2 mt-4 gap-3`}
      >
        <div>
          <div className="grid grid-cols-2 md:grid-cols-none md:mt-2 ">
            <div className="text-sm text-black">Name</div>
            <div className="text-base capitalize text-black">
              {applicants.full_name}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-none">
          <div className="text-sm text-black">Age</div>
          <div className="text-base text-black">{applicants.age}</div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-none">
          <div className="text-sm text-black">Email</div>
          <div className="text-base text-black">{applicants.email}</div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-none">
          <div className="text-sm text-black">Current Address</div>
          <div className="text-base text-black">
            {applicants.current_address}
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-none">
          <div className="text-sm text-black">Permanent Address</div>
          <div className="text-base text-black">{applicants.perm_address}</div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-none">
          <div className="text-sm text-black">Applicant Type</div>
          <div className="text-base text-black">
            {applicants.applicant_type}
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-none">
          <div className="text-sm text-black">Genre</div>
          <div className="text-base text-black">{applicants?.genre?.name}</div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-none">
          <div className="text-sm text-black">Carrer Plan</div>
          <div className="text-base text-black">{applicants.carrer_plan}</div>
        </div>
      </div>
    </div>
  );
};

export default ApplicantsTab;
