export interface StoryPart {
    partId: number;
    content: string;
    storyId: number;
    createdAt: string;
    imageUrl: string;
    storyTitle: string;
    story?: any;
    storyPartCharacters?: any[];
  }
  
  export interface Character {
    characterId: number;
    name: string;
    description: string;
    storyId: number;
    imageUrl: string;
    storyParts?: StoryPart[];
  }
  