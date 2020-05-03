import { FlatIndexNode } from '../../../../../src/Services/TranslationChainResponsability/Node/flat-index.node';
import { Translation } from '../../../../../src/Entities/translation.entity';
import { buildTranslation } from '../../../../helper/builder/translation.builder';
import { buildTranslationKey } from '../../../../helper/builder/translation-key.build';

describe('FlatIndexNode', () => {
  let flatIndexNode: FlatIndexNode;

  beforeAll(() => {
    flatIndexNode = new FlatIndexNode();
  });

  describe('apply', () => {
    it('should return translation request in with flat index', () => {
      const translations: Translation[] = [];

      const expectedResult = {
        'qwe.rew.rte.ytry.rewr': 'lkzrsaghv esaprgj gnaog',
        'qwe.rew.rte.ytry.wa4tcw': 'hy64by6 tpº,fog gnaog',
        'qwe.rew.rte.eirgv': 'gjes hes0º jgam ºegvmnaºeirjg otenkfdjnbv la',
        'ey.vfrthvr.ethyve.hter':
          'lrsgjpoersjgpejhg ptesjh pºtesjhç  nbço gdçghu',
      };

      Object.keys(expectedResult).forEach(translationKeys => {
        const translation = buildTranslation();
        const translationKey = buildTranslationKey();

        translation.translation = expectedResult[translationKeys];
        translationKey.alias = translationKeys;
        translation.translationKey = translationKey;
        translations.push(translation);
      });

      expect(flatIndexNode.apply(translations)).toEqual(expectedResult);
    });
  });
});
