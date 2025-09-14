import { Role } from "@day-05-rbac/enum/role.enum";

export interface User {
  Id: string;
  Name: string;
  Email: string;
  Password: string;
  Roles: Role[];
}
