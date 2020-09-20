interface UserSeedInterface {
  name: string,
  username: string,
  email: string,
  password: string,
  isVisible: boolean,
  isAdmin: boolean,
}

export const UserSeed: UserSeedInterface[] = [
  {
    name: 'System',
    username: 'system',
    email: 'system@itransnow.com',
    password: process.env.SYSTEM_PASSWORD,
    isVisible: false,
    isAdmin: true,
  },
  {
    name: "Ricardo Castro",
    username: "rcastro",
    email: "ricardo.castro@itransnow.com",
    password: "123456",
    isVisible: true,
    isAdmin: true,
  }
];
