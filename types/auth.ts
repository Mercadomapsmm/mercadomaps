export interface User {
  id: string;
  username: string;
  name: string;
  createdAt: number;
}

export interface StoredUserAccount extends User {
  passwordHash: string; // Plain/Base64 stored securely in client storage
}
