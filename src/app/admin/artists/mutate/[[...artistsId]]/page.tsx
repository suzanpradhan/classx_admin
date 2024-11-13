'use client';
import { Button, FormCard, FormGroup, ImageInput, TextField } from '@/core/ui/zenbuddha/src';

import { useRouter } from 'next/navigation';

const Page = () => {
  const router = useRouter();


  return (
    <FormCard  className="m-4">
      <FormGroup title="Basic Type">
        <div className="flex gap-2 mb-2 max-sm:flex-col">
          <div className="flex flex-col flex-1">
            <TextField
              id="name"
              type="text"
              label="Name"
              className="flex-1"
            />
           
          </div>

          <div className="flex flex-col flex-1">
            <ImageInput
              id="icon"
              label="Profile Picture"
              required
              className="flex-1 font-normal"
            />
           
          </div>
        </div>
        <div className="flex gap-2 mb-2 max-sm:flex-col">
          <div className="flex flex-col flex-1">
            <TextField
              id="bio"
              type="text"
              label="Bio"
              className="flex-1"
              isMulti
            />
            
          </div>
        </div>
      </FormGroup>
      <div className="flex justify-end gap-2 m-4">
        <Button
          text="Submit"
          kind="default"
          className="h-8 w-fit"
          type="submit"
        />
        <Button
          text="Cancel"
          kind="danger"
          className="h-8 w-fit"
          buttonType="flat"
          onClick={() => {
            router.back();
          }}
        />
      </div>
    </FormCard>
  );
};

export default Page;
