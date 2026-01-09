
import { GeneratedThumbnail } from '../types';

const STORAGE_KEY = 'creator_thumb_saved';

export const saveThumbnail = async (thumbnail: GeneratedThumbnail): Promise<void> => {
  const existing = getSavedThumbnails();
  const updated = [thumbnail, ...existing];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const getSavedThumbnails = (): GeneratedThumbnail[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
};

export const deleteThumbnail = (id: string): void => {
  const existing = getSavedThumbnails();
  const updated = existing.filter(t => t.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};
