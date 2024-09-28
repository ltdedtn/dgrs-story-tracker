export interface UserContextType {
  username: string | null;
  setUsername: React.Dispatch<React.SetStateAction<string | null>>;
  role: string | null; // Add role property
  setRole: React.Dispatch<React.SetStateAction<string | null>>; // Add setRole method
}
