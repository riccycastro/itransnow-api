import { User } from '../../../src/Entities/user.entity';

export const buildUser = (index: number): User => {
  const user = new User();
  user.id = index;
  user.name = 'user_name_' + index;
  user.email = 'user_email_' + index;
  user.username = 'user_username_' + index;
  user.isActive = true;
  user.isAdmin = false;
  user.deletedAt = 0;
  user.isVisible = true;
  return user;
};

export const buildUserWithId1 = () => buildUser(1);
