import { ApplicantsType } from '@/modules/applicants/applicantsType';
import Image from 'next/image';

const ApplicantsTab = ({ Applicants }: { Applicants: ApplicantsType }) => {
  return (
    <div className="m-4 flex flex-col max-w-5xl">
      <div className="bg-blueWhite border border-primaryGray-300 rounded-lg overflow-hidden max-w-xl relative aspect-video">
        <Image
          src={Applicants.photo ?? '/default-profile-picture.jpg'}
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
              {Applicants.full_name}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-none">
          <div className="text-sm text-black">Age</div>
          <div className="text-base text-black">{Applicants.age}</div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-none">
          <div className="text-sm text-black">Email</div>
          <div className="text-base text-black">{Applicants.email}</div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-none">
          <div className="text-sm text-black">Current Address</div>
          <div className="text-base text-black">
            {Applicants.current_address}
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-none">
          <div className="text-sm text-black">Permanent Address</div>
          <div className="text-base text-black">{Applicants.perm_address}</div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-none">
          <div className="text-sm text-black">Applicant Type</div>
          <div className="text-base text-black">
            {Applicants.applicant_type}
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-none">
          <div className="text-sm text-black">Genre</div>
          <div className="text-base text-black">{Applicants.genre}</div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-none">
          <div className="text-sm text-black">Carrer Plan</div>
          <div className="text-base text-black">{Applicants.carrer_plan}</div>
        </div>
      </div>
    </div>
  );
};

export default ApplicantsTab;
