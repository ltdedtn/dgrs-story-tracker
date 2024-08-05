import { StoryPartCharacter } from './StoryPartCharacter';

export interface StoryPart {
  partId: number;
  content: string;
  storyId: number;
  createdAt: string;
  imageUrl: string;
  story: string;
  storyPartCharacters: StoryPartCharacter[];
}
