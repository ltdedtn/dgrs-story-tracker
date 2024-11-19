export interface AADate {
  aaDateId: number;
  ceYear: number;
  monthNumber: number;
  day: number;
  isAD: boolean;
}

export interface Story {
  storyId: number;
  title: string;
  description: string;
  content: string;
  createdAt: string;
  imageUrl: string;
  storyGroupId: number;
  characters: string[];
}

export interface StoryPart {
  storyPartId: number;
  storyId: number;
  title: string;
  content: string;
  description: string;
  createdAt: string;
  imageUrl: string;
  createdBy: number;
  youtubeLink: string;
  aaDateId: number;
  story: Story;
  aaDate: AADate;
  storyPartCharacters: StoryPartCharacter[];
}

export interface StoryPartCharacter {
  storyPartId: number;
  storyPart: StoryPart;
  characterId: number;
  character: Character;
}

export interface CharacterRelationship {
  relationshipId: number;
  characterAId: number;
  characterBId: number;
  relationshipTag: string;
  characterA: string;
  characterB: string;
}

export interface Character {
  characterId: number;
  name: string;
  description: string;
  imageUrl: string;
  relationshipTag: string;
  storyId: number;
  storyPartCharacters: StoryPartCharacter[];
  characterRelationshipsA: CharacterRelationship[];
  characterRelationshipsB: CharacterRelationship[];
}
