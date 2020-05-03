import { Section } from '../../../src/Entities/section.entity';

export const buildSection = (sectionData?: any) => {
  sectionData = sectionData || {};

  const section = new Section();
  section.id = sectionData.id || 1;
  section.name = sectionData.name || 'section_name_1';
  section.alias = sectionData.alias || 'section_alias_1';
  section.isActive = sectionData.isActive !== undefined ? sectionData.isActive : true;
  section.deletedAt = sectionData.deletedAt || 0;
  section.translationKeys = sectionData.translationKeys || [];
  section.application = sectionData.application;
  return section;
};

export const buildSectionArray = () =>
  [1, 2, 3, 4, 5].map(index => buildSection({
    id: index,
    name: 'section_name_' + index,
    alias: 'section_alias_' + index,
  }));
