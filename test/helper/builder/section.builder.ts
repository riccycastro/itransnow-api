import { Section } from '../../../src/Entities/section.entity';
import { buildApplication } from './application.builder';
import { utc } from 'moment';

export const buildSection = (index: number) => {
  const section = new Section();
  section.id = index;
  section.name = 'section_name_' + index;
  section.alias = 'section_alias_' + index;
  section.isActive = true;
  section.deletedAt = utc().unix();
  return section;
};

export const buildSectionWithApplication = (sectionIndex: number, applicationIndex: number) => {
  const section = buildSection(sectionIndex);
  section.application = buildApplication(applicationIndex);
  return section;
};

export const buildSectionWithId1 = () => buildSection(1);
