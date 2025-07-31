interface Attributes {
  trait_type: string;
  value: string;
}

export interface UriDataType {
  name: string;
  description?: string;
  image: string;
  attributes: Attributes[];
  youtube_url?: string;
}
