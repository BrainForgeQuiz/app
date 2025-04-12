import { User } from '../entity/user';

export interface UserInDBResponse {
  inDb: boolean;
  user?: User;
}
