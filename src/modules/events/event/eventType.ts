import { EventCategoryType } from '../event_category/event_categoryType';
import { VenueDataType } from '../venue/venueType';

export type Organizer = {
  id: number;
  email: string;
  is_staff: boolean;
  profile: any;
  username: string;
  organizer_key: string | null;
};

export type EventType = {
  id: number;
  tags: [string];
  organizer: Organizer;
  category: EventCategoryType;
  venue: VenueDataType;
  is_favorite: boolean;
  name: string;
  image: string;
  status: string;
  description: string;
  start_date: string;
  end_date: string;
  duration: string;
  views_count: number;
  favourites_count: number;
  is_refundable: boolean;
  is_featured: boolean;
};
