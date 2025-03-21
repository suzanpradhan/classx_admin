import { GenresType } from '../genres/genresType';

export type AppointmentsType = {
  id: number;
  full_name: string;
  age: number;
  perm_address?: string;
  current_address?: string;
  email?: string;
  phone?: string;
  type?: string;
  document?: string;
  prev_work_link?: string;
  why_classx?: string;
  start_dt?: string;
  genre?: GenresType;
  end_dt?: string;
};
