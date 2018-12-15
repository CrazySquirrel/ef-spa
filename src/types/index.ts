export interface MetadataAuthor {
  name: string;
  url: string;
}

export interface MetadataImage {
  src: string;
  type: string;
  width: string;
  height: string;
  alt: string;
  sizes?: string;
}

export interface MetadataVideo {
  src: string;
  type: string;
  width: string;
  height: string;
}

export interface MetadataAudio {
  src: string;
  type: string;
}

export enum MetadataType {
  NONE = 'NONE',
  ARTICLE = 'ARTICLE',
}

export interface Metadata {
  menu: string;
  title: string;
  description: string;
  keywords: string;
  h1: string;
  type: MetadataType;
  author: MetadataAuthor;
  images?: MetadataImage[];
  videos?: MetadataVideo[];
  audios?: MetadataAudio[];
}
