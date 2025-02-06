'use client';
import { useGetApiResponse } from '@/core/api/getApiResponse';
import { useAppDispatch, useAppSelector } from '@/core/redux/clientStore';
import { RootState } from '@/core/redux/store';
import { PaginatedResponseType } from '@/core/types/responseTypes';
import { SelectorDataType } from '@/core/types/selectorType';
import Selector from '@/core/ui/components/Selector';
import {
  Button,
  FormCard,
  FormGroup,
  ImageInput,
  TextField,
} from '@/core/ui/zenbuddha/src';
import applicantsApi from '@/modules/applicants/applicantsApi';
import {
  applicantsSchema,
  ApplicantsSchemaType,
  ApplicantsType,
} from '@/modules/applicants/applicantsType';
import genresApi from '@/modules/genres/genresApi';
import { GenresType } from '@/modules/genres/genresType';
import { useFormik } from 'formik';
import { useParams, useRouter } from 'next/navigation';
import { ChangeEvent, useEffect, useState } from 'react';
import { SingleValue } from 'react-select';
import { ZodError } from 'zod';

const Page = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const param = useParams();
  const applicantsId = param.applicantsId && param.applicantsId[0];
  const dispatch = useAppDispatch();

  const APPLICANTS_TYPES: Array<SelectorDataType> = [
    { value: 'singer', label: 'Singer' },
    { value: 'songwriter', label: 'Songwriter' },
    { value: 'guitarist', label: 'Guitarist' },
    { value: 'composer', label: 'Composer' },
    { value: 'music_producer', label: 'Music producer' },
    { value: 'director', label: 'Director' },
    { value: 'editor', label: 'Editor' },
  ];

  useEffect(() => {
    dispatch(genresApi.endpoints.getAllGenres.initiate({ pageNumber: '1' }));
    if (applicantsId) {
      dispatch(
        applicantsApi.endpoints.getEachApplicants.initiate(applicantsId)
      );
    }
  }, [applicantsId, dispatch]);

  const toMutateAppliacantsData = useGetApiResponse<ApplicantsType>(
    `getEachApplicants("${applicantsId ? applicantsId : undefined}")`
  );

  console.log(toMutateAppliacantsData, 'toMutateAppliacantsData');
  const allGenres = useAppSelector(
    (state: RootState) =>
      state.baseApi.queries[`getAllGenres`]
        ?.data as PaginatedResponseType<GenresType>
  );
  const allGenresMod = allGenres?.results.map((item) => {
    return { label: item.name, value: item.id.toString() };
  });

  const onSubmit = async (values: ApplicantsSchemaType) => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const data = applicantsId
        ? await dispatch(
            applicantsApi.endpoints.updateApplicants.initiate({
              id: Number(applicantsId),
              ...values,
            })
          ).unwrap()
        : await dispatch(
            applicantsApi.endpoints.addApplicants.initiate(values)
          ).unwrap();

      if (data) router.push('/admin/applicants/all');
    } catch (error) {
      console.error('Failed to submit:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = (values: ApplicantsSchemaType) => {
    try {
      applicantsSchema.parse(values);
    } catch (error) {
      if (error instanceof ZodError) {
        console.log(error.errors);
        return error.formErrors.fieldErrors;
      }
    }
  };

  const formik = useFormik<ApplicantsSchemaType>({
    enableReinitialize: true,
    initialValues: {
      id: toMutateAppliacantsData?.id ?? null,
      full_name: toMutateAppliacantsData?.full_name || '',
      why_classx: toMutateAppliacantsData?.why_classx || '',
      photo: toMutateAppliacantsData ? null : null,
      genre: toMutateAppliacantsData?.genre
        ? {
            label: toMutateAppliacantsData.genre.name,
            value: toMutateAppliacantsData.genre.id.toString(),
          }
        : { value: '', label: '' },
      age: toMutateAppliacantsData ? toMutateAppliacantsData.age : 0,
      applicant_type: toMutateAppliacantsData?.applicant_type || '',
      carrer_plan: toMutateAppliacantsData?.carrer_plan || '',
      current_address: toMutateAppliacantsData?.current_address || '',
      email: toMutateAppliacantsData?.email || '',
      perm_address: toMutateAppliacantsData?.perm_address || '',
      prev_work_link: toMutateAppliacantsData?.prev_work_link || '',
      document: toMutateAppliacantsData ? null : null,
    },
    validateOnChange: true,
    validate: validateForm,
    onSubmit,
  });

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      formik.setFieldValue('photo', e.target.files[0]);
    }
  };
  const hanldeDocChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      formik.setFieldValue('document', e.target.files[0]);
    }
  };

  const loadPaginatedOptions = async (
    searchQuery: any,
    _loadedOptions: any,
    // eslint-disable-next-line no-unused-vars
    { page }: any
  ) => {
    dispatch(
      genresApi.endpoints.getAllGenres.initiate({
        pageNumber: (allGenres.pagination.current_page + 1).toString(),
        searchString: searchQuery as string,
      })
    );

    return {
      options: allGenresMod,
      hasMore: allGenres?.pagination.next != null,
    };
  };

  const handleCreateGenre = async (inputValue: string) => {
    dispatch(
      genresApi.endpoints.addGenres.initiate({
        name: inputValue,
      })
    );
  };

  return (
    <FormCard onSubmit={formik.handleSubmit} className="m-4">
      <FormGroup title="Basic Type">
        <div className="flex gap-2 mb-2 max-sm:flex-col">
          <div className="flex flex-col flex-1">
            <TextField
              id="full_name"
              type="text"
              label="Full Name"
              required
              className="flex-1"
              {...formik.getFieldProps('full_name')}
            />
            {formik.errors.full_name && (
              <div className="text-red-500 text-sm">
                {formik.errors.full_name}
              </div>
            )}
          </div>
          <div className="flex flex-col flex-1">
            <TextField
              id="age"
              type="number"
              label="Age"
              required
              className="flex-1"
              {...formik.getFieldProps('age')}
            />
            {formik.errors.age && (
              <div className="text-red-500 text-sm">{formik.errors.age}</div>
            )}
          </div>
        </div>
        <div className="flex gap-2 mb-2 max-sm:flex-col">
          <div className="flex flex-col flex-1">
            <TextField
              id="perm_address"
              type=""
              label="Permanent Address"
              required
              className="flex-1"
              {...formik.getFieldProps('perm_address')}
            />
            {formik.errors.perm_address && (
              <div className="text-red-500 text-sm">
                {formik.errors.perm_address}
              </div>
            )}
          </div>

          <div className="flex flex-col flex-1">
            <TextField
              id="current_address"
              type="text"
              label="Current Address"
              required
              className="flex-1"
              {...formik.getFieldProps('current_address')}
            />
            {formik.errors.current_address && (
              <div className="text-red-500 text-sm">
                {formik.errors.current_address}
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-2 mb-2 max-sm:flex-col">
          <div className="flex flex-col flex-1">
            <TextField
              id="email"
              type="text"
              label="Email "
              required
              className="flex-1"
              {...formik.getFieldProps('email')}
            />
            {formik.errors.email && (
              <div className="text-red-500 text-sm">{formik.errors.email}</div>
            )}
          </div>
          <div className="flex flex-col flex-1">
            <ImageInput
              id="photo"
              label="Photo"
              className="flex-1 font-normal"
              value={formik.values.photo}
              onChange={handleImageChange}
            />
            {formik.errors.photo && (
              <div className="text-red-500 text-sm">{formik.errors.photo}</div>
            )}
          </div>
        </div>
        <div className="flex gap-2 mb-2 max-sm:flex-col">
          <div className="flex flex-col flex-1">
            <Selector
              id="applicant_type"
              label="Applicants Type"
              required
              handleChange={(e) => {
                formik.setFieldValue(
                  'applicant_type',
                  (e as SingleValue<{ value: string; label: string }>)?.value
                );
              }}
              options={APPLICANTS_TYPES}
              placeholder="Select Applicant_type"
              value={{
                label:
                  APPLICANTS_TYPES.find(
                    (item) => item.value === formik.values.applicant_type
                  )?.label ?? '',
                value: formik.values.applicant_type ?? '',
              }}
            ></Selector>
          </div>

          <div className="flex flex-col flex-1">
            <div className="flex flex-col flex-1">
              {allGenres && (
                <Selector
                  id="genre"
                  options={allGenresMod}
                  loadPaginatedOptions={loadPaginatedOptions}
                  type="AsyncPaginate"
                  label="genre"
                  value={formik.values.genre}
                  placeholder="Select genre"
                  className="flex-1"
                  handleChange={(e) => {
                    formik.setFieldValue('genre', e);
                  }}
                  name="genre"
                ></Selector>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2 mb-2 max-sm:flex-col">
          <div className="flex flex-col flex-1">
            <TextField
              id="prev_work_link"
              type="text"
              label="Prev_Work_Link "
              className="flex-1"
              {...formik.getFieldProps('prev_work_link')}
            />
            {formik.errors.prev_work_link && (
              <div className="text-red-500 text-sm">
                {formik.errors.prev_work_link}
              </div>
            )}
          </div>
          <div className="flex flex-col flex-1">
            <ImageInput
              id="document"
              label="Document"
              className="flex-1 font-normal"
              value={formik.values.document}
              onChange={hanldeDocChange}
            />
            {formik.errors.document && (
              <div className="text-red-500 text-sm">
                {formik.errors.document}
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col mb-2">
          <TextField
            id="why-classx"
            type="text"
            label="Why Classx"
            className="flex-1 mb-2"
            isMulti
            {...formik.getFieldProps('why_classx')}
          />
          {!!formik.errors.why_classx && (
            <div className="text-red-500 text-sm">
              {formik.errors.why_classx}
            </div>
          )}
        </div>
        <div className="flex flex-col mb-2">
          <TextField
            id="carrer_plan"
            type="text"
            label="Carrer Plan"
            className="flex-1 mb-2"
            isMulti
            {...formik.getFieldProps('carrer_plan')}
          />
          {!!formik.errors.carrer_plan && (
            <div className="text-red-500 text-sm">
              {formik.errors.carrer_plan}
            </div>
          )}
        </div>
      </FormGroup>

      <div className="flex justify-end gap-2 m-4">
        <Button
          text="Submit"
          kind="warning"
          className="h-8 w-fit"
          type="submit"
          isLoading={isLoading}
        />
        <Button
          text="Cancel"
          kind="danger"
          className="h-8 w-fit"
          buttonType="flat"
          onClick={() => router.back()}
        />
      </div>
    </FormCard>
  );
};

export default Page;
