'use client';
import Selector from '@/core/ui/components/Selector';
import { Button, FormCard, FormGroup, ImageInput, TextField } from '@/core/ui/zenbuddha/src';
import DateSelector from '@/core/ui/zenbuddha/src/components/DateSelector';
import RichTextField from '@/core/ui/zenbuddha/src/components/RichTextField';

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
              label="Title"
              className="flex-1"
            />
          </div>
          <div className="flex flex-col flex-1">
            <ImageInput
              id="icon"
              label="CoverImage"
              required
              className="flex-1 font-normal"
            />
          </div>
        </div>
        <div className="flex gap-2 mb-2 max-sm:flex-col">
        <div className="flex flex-col flex-1">
            <DateSelector
              id="release_date"
              label="Release date"
            /> 
          </div>
          <div className="flex flex-col flex-1">
            <Selector
              id="genres:"
              label="Genres"
             
              // options={PRICING_TYPES}    
            />
          </div>
        </div>
        <div className="flex gap-2 mb-2 max-sm:flex-col">
        <div className="flex flex-col flex-1">
            <Selector
              id="artist:"
              label="Artist"
             
              // options={PRICING_TYPES}    
            />
          </div>
        <div className="flex flex-col flex-1">
            <Selector
              id="release type::"
              label="Release type"
             
              // options={PRICING_TYPES}
             
            />
          </div>
        </div>
        <RichTextField
          id="description"
          label="Description"
        />
       
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
