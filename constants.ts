
import { ThumbnailCategory, ThumbnailStyle } from './types';

export const THUMBNAIL_WIDTH = 1280;
export const THUMBNAIL_HEIGHT = 720;

export const CATEGORIES = Object.values(ThumbnailCategory);

export const STYLES: ThumbnailStyle[] = [
  {
    id: 'cinematic',
    name: 'Cinematic',
    promptModifier: 'cinematic lighting, shallow depth of field, professional photography, high contrast, dramatic shadows',
    previewColor: 'bg-blue-600'
  },
  {
    id: 'vibrant',
    name: 'Vibrant',
    promptModifier: 'hyper-saturated colors, bright, energetic, popping colors, sharp details, high energy',
    previewColor: 'bg-pink-500'
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    promptModifier: 'clean background, simple composition, flat colors, elegant, modern aesthetic',
    previewColor: 'bg-slate-400'
  },
  {
    id: 'neon',
    name: 'Neon Future',
    promptModifier: 'cyberpunk aesthetic, neon glows, purple and blue accents, high tech, glowing elements',
    previewColor: 'bg-purple-600'
  },
  {
    id: 'comic',
    name: 'Comic Book',
    promptModifier: 'bold lines, halftone patterns, comic style, stylized illustration, dramatic action',
    previewColor: 'bg-yellow-500'
  }
];

export const BASE_SYSTEM_PROMPT = `
Generate a high-quality YouTube-style thumbnail with bright colors, bold elements, sharp contrast, and attention-grabbing design.
Style: modern, cinematic, click-worthy, creator-optimized.
Aspect Ratio: 16:9.
Requirements: Focus on visual clarity, avoid cluttered text (text will be added separately), professional lighting.
`;

export const CATEGORY_PROMPTS: Record<ThumbnailCategory, string> = {
  [ThumbnailCategory.GAMING]: "Exciting action, particle effects, gaming elements, intense competition vibe, 4k gaming assets.",
  [ThumbnailCategory.TECH]: "Sleek hardware, circuit patterns, clean glass surfaces, blue/white highlights, sophisticated gadgets.",
  [ThumbnailCategory.VLOG]: "Warm lifestyle lighting, natural settings, expressive mood, relatable atmosphere, sun-drenched lens flares.",
  [ThumbnailCategory.FINANCE]: "Professional graphs, currency symbols, solid gold/green accents, clean high-end office look.",
  [ThumbnailCategory.COOKING]: "Extreme food close-ups, steam, fresh ingredients, warm kitchen lighting, vibrant organic colors.",
  [ThumbnailCategory.PODCAST]: "Professional studio mic, soundproofing textures, moody lighting, podcast setup, intimate conversation vibe.",
  [ThumbnailCategory.EDUCATION]: "Clean whiteboard, organized books, lightbulb moments, clear symbols, focused scholarly atmosphere."
};
