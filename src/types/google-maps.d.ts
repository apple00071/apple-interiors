interface GoogleReview {
  author_name: string;
  author_url: string;
  language: string;
  profile_photo_url: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number;
}

interface GooglePlace {
  reviews?: GoogleReview[];
  name?: string;
  rating?: number;
  user_ratings_total?: number;
}

interface PlacesServiceStatus {
  OK: string;
  ZERO_RESULTS: string;
  OVER_QUERY_LIMIT: string;
  REQUEST_DENIED: string;
  INVALID_REQUEST: string;
  UNKNOWN_ERROR: string;
  NOT_FOUND: string;
}

interface PlacesService {
  getDetails(
    request: { placeId: string; fields: string[] },
    callback: (place: GooglePlace | null, status: string) => void
  ): void;
}

declare global {
  interface Window {
    google: {
      maps: {
        places: {
          PlacesService: new (element: HTMLElement) => PlacesService;
          PlacesServiceStatus: PlacesServiceStatus;
        };
      };
    };
  }
} 