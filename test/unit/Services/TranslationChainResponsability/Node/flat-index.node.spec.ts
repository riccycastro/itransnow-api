import { FlatIndexNode } from '../../../../../src/Services/TranslationChainResponsability/Node/flat-index.node';
import { TranslationExportData } from '../../../../../src/Types/type';

describe('FlatIndexNode', () => {
  let flatIndexNode: FlatIndexNode;

  beforeAll(() => {
    flatIndexNode = new FlatIndexNode();
  });

  describe('apply', () => {
    it('should return translation request in with flat index', () => {
      const translations: TranslationExportData[] = [];

      const expectedResult = {
        'qwe.rew.rte.ytry.rewr': 'lkzrsaghv esaprgj gnaog',
        'qwe.rew.rte.ytry.wa4tcw': 'hy64by6 tpº,fog gnaog',
        'qwe.rew.rte.eirgv': 'gjes hes0º jgam ºegvmnaºeirjg otenkfdjnbv la',
        'ey.vfrthvr.ethyve.hter':
          'lrsgjpoersjgpejhg ptesjh pºtesjhç  nbço gdçghu',
      };

      Object.keys(expectedResult).forEach(translationKeys => {
        translations.push({
          translationKey: translationKeys,
          translation: expectedResult[translationKeys],
          section: '',
        });
      });

      expect(flatIndexNode.apply(translations)).toEqual(expectedResult);
    });
  });
});
