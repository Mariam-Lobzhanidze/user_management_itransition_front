export interface User {
  id: number;
  name: string;
  email: string;
  registration_time: string;
  status: "active" | "blocked";
  lastLoginTime: string;
}
