import { User } from '../entity/user';

/**
 * Response for user in DB function
 * @description based on this you can proceed with your logic
 * @param {boolean} inDb this variable helps you to test if user is in db
 * @param {User} user this variable only exist if user is in the db, and it contains all the user data
 */
export interface UserInDBResponse {
  inDb: boolean;
  user?: User;
}

/**
 * Response for save user function
 * @description this function is using the dbService to save the user in the UserTable
 * @param {boolean} success this variable helps you to test if user was saved
 */
export interface SaveUserResponse {
  success: boolean;
}
