import { buildTranslation } from '../../../../helper/builder/translation.builder';
import { buildTranslationKey } from '../../../../helper/builder/translation-key.build';
import { Translation } from '../../../../../src/Entities/translation.entity';
import { NestedIndexNode } from '../../../../../src/Services/TranslationChainResponsability/Node/nested-index.node';

describe('NestedIndexNode', () => {
  let nestedIndex: NestedIndexNode;

  beforeAll(() => {
    nestedIndex = new NestedIndexNode();
  });

  describe('apply', () => {
    it('should return translation request in with nested index', () => {
      const translations: Translation[] = [];

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
        const translation = buildTranslation();
        const translationKey = buildTranslationKey();

        translation.translation = translationObject[translationKeys];
        translationKey.alias = translationKeys;
        translation.translationKey = translationKey;
        translations.push(translation);
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
