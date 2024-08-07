export interface Role {
  roleId: number;
  roleName: string;
}

export interface User {
  userId: number;
  username: string;
  passwordHash: string;
  email: string;
  createdAt: string;
  stories: string[];
  roles: Role[];
}
