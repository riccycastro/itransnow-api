import { User } from '../../../src/Entities/user.entity';
import { utc } from 'moment';

export const buildUser = (index: number): User => {
  const user = new User();
  user.id = index;
  user.name = 'user_name_' + index;
  user.email = 'user_email_' + index;
  user.username = 'user_username_' + index;
  user.isActive = true;
  user.deletedAt = utc().unix();
  user.isVisible = true;
  return user;
};

export const buildUserWithId1 = () => buildUser(1);
