import { StoryPartCharacter } from './StoryPartCharacter';

export interface StoryPart {
  storyPartId: number;
  title: string;
  content: string;
  storyId: number;
  createdAt: string;
  imageUrl: string;
  description: string;
  story: string;
  storyPartCharacters: StoryPartCharacter[];
}
