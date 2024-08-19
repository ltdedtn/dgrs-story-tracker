import { User } from './User';
import { StoryPart } from './StoryPart';
import { Character } from './Character';

export interface Story {
  storyId: number;
  title: string;
  description: string;
  content: string | null;
  createdAt: string;
  userId: number;
  imageUrl: string;
  user: User | null;
  characters: Character[];
  storyParts: StoryPart[];
}
