interface UserSeedInterface {
  name: string,
  username: string,
  email: string,
  password: string,
}

export const UserSeed: UserSeedInterface[] = [
  {
    name: "Ricardo Castro",
    username: "rcastro",
    email: "ricardo.castro@itransnow.com",
    password: "123456",
  }
];
