
export enum ThumbnailCategory {
  GAMING = 'Gaming',
  TECH = 'Tech',
  VLOG = 'Vlog',
  FINANCE = 'Finance',
  COOKING = 'Cooking',
  PODCAST = 'Podcast',
  EDUCATION = 'Education'
}

export interface ThumbnailStyle {
  id: string;
  name: string;
  promptModifier: string;
  previewColor: string;
}

export interface GeneratedThumbnail {
  id: string;
  url: string;
  prompt: string;
  title: string;
  category: ThumbnailCategory;
  createdAt: number;
}

export interface TextOverlay {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  fontFamily: string;
  strokeColor: string;
  strokeWidth: number;
}

export interface EditorState {
  imageUrl: string;
  overlays: TextOverlay[];
  filter: string;
  brightness: number;
  contrast: number;
  saturation: number;
}
