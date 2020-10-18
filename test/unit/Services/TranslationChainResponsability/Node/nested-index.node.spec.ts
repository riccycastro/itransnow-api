import { NestedIndexNode } from '../../../../../src/Services/TranslationChainResponsability/Node/nested-index.node';
import { TranslationExportData } from '../../../../../src/Types/type';

describe('NestedIndexNode', () => {
  let nestedIndex: NestedIndexNode;

  beforeAll(() => {
    nestedIndex = new NestedIndexNode();
  });

  describe('apply', () => {
    it('should return translation request in with nested index', () => {
      const translations: TranslationExportData[] = [];

      const translationObject = {
        'qwe.rew.rte.ytry.rewr': 'lkzrsaghv esaprgj gnaog',
        'qwe.rew.rte.ytry.wa4tcw': 'hy64by6 tpº,fog gnaog',
        'rwqcr.wqrwer.qwtrv.yt': 'fwarc gghr6u wd4 rq23r',
        'ey.vfrthvr.ethyve.eirgv':
          'gjes hes0º jgam ºegvmnaºeirjg otenkfdjnbv la',
        'ey.vfrthvr.ethyve.hter':
          'lrsgjpoersjgpejhg ptesjh pºtesjhç  nbço gdçghu',
      };

      Object.keys(translationObject).forEach(translationKeys => {
        translations.push({
          translationKey: translationKeys,
          translation: translationObject[translationKeys],
          section: '',
        });
      });

      expect(nestedIndex.apply(translations)).toEqual({
        qwe: {
          rew: {
            rte: {
              ytry: {
                rewr: 'lkzrsaghv esaprgj gnaog',
                wa4tcw: 'hy64by6 tpº,fog gnaog',
              },
            },
          },
        },
        rwqcr: {
          wqrwer: {
            qwtrv: {
              yt: 'fwarc gghr6u wd4 rq23r',
            },
          },
        },
        ey: {
          vfrthvr: {
            ethyve: {
              eirgv: 'gjes hes0º jgam ºegvmnaºeirjg otenkfdjnbv la',
              hter: 'lrsgjpoersjgpejhg ptesjh pºtesjhç  nbço gdçghu',
            },
          },
        },
      });
    });
  });
});
