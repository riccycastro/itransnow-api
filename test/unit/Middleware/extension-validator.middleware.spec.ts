import { createRequest, createResponse, MockRequest, MockResponse } from 'node-mocks-http';
import { Request, Response } from 'express';
import { ExtensionValidatorMiddleware } from '../../../src/Middleware/extension-validator.middleware';
import { NotFoundException } from '@nestjs/common';

describe('ExtensionValidatorMiddleware', () => {
  let req: any | MockRequest<Request>;
  let res: MockResponse<Response>;
  let extensionValidatorMiddleware: ExtensionValidatorMiddleware;
  let next = () => {
    return;
  };

  beforeAll(() => {
    req = createRequest();
    res = createResponse();
    extensionValidatorMiddleware = new ExtensionValidatorMiddleware();
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('use', () => {
    it('should throw not found exception if extension is not set', () => {
      req = {
        params: ['.query'],
      };

      let err = undefined;

      try {
        extensionValidatorMiddleware.use(req, res, next);
      } catch (e) {
        err = e;
      }

      expect(err).toBeInstanceOf(NotFoundException);
    });

    it('should accept json extension', () => {
      const jsonExtension = 'json';
      req = {
        params: [jsonExtension],
        query: {},
      };

      extensionValidatorMiddleware.use(req, res, next);

      expect(req.query.extension).toBe(jsonExtension);
    });

    it('should accept yaml extension', () => {
      const yamlExtension = 'yaml';
      req = {
        params: [yamlExtension],
        query: {},
      };

      extensionValidatorMiddleware.use(req, res, next);

      expect(req.query.extension).toBe(yamlExtension);
    });
  });
});
