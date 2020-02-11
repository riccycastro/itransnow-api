import { Application } from '../src/Entities/application.entity';

interface SectionSeedInterface {
  name: string,
  alias: string,
  application?: Application,
}

export const SectionSeed: SectionSeedInterface[] = [
  {
    name: "Home Page",
    alias: "home_page",
  },
  {
    name: "User Form",
    alias: "user_form",
  }
];
