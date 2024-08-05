export interface UserContextType {
    username: string | null;
    setUsername: React.Dispatch<React.SetStateAction<string | null>>;
  }