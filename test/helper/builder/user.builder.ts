import { User } from '../../../src/Entities/user.entity';

export const buildUser = (userData?: any): User => {
  userData = userData || {};
  const user = new User();
  user.id = userData.id || 1;
  user.name = userData.name || 'user_name_1';
  user.email = userData.email || 'user_email_1';
  user.password = userData.password || '123456';
  user.username = userData.username || 'user_username_1';
  user.isActive = userData.isActive !== undefined ? userData.isActive : true;
  user.isAdmin = userData.isAdmin !== undefined ? userData.isAdmin : false;
  user.deletedAt = userData.deletedAt || 0;
  user.isVisible = userData.isVisible !== undefined ? userData.isVisible : true;
  user.company = userData.company;
  return user;
};

export const buildUserArray = () => [1, 2, 3, 4, 5].map(index => buildUser({
  id: index,
  name: 'user_name_' + index,
  email: 'user_email_' + index,
  username: 'user_username_' + index,
}));
