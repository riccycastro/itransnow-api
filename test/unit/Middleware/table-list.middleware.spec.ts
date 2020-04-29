import { createRequest, createResponse, MockRequest, MockResponse } from 'node-mocks-http';
import { TableListMiddleware } from '../../../src/Middleware/table-list.middleware';
import { Request, Response } from 'express';

describe('TableListMiddleware', () => {
  let req: MockRequest<Request>;
  let res: MockResponse<Response>;
  let tableListMiddleware: TableListMiddleware;
  let next = () => {
    return;
  };

  beforeAll(() => {
    req = createRequest();
    res = createResponse();
    tableListMiddleware = new TableListMiddleware();
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('use', () => {
    it('should create query default structure', () => {
      expect(tableListMiddleware.use(req, res, next)).toBe(undefined);
      expect(next).toHaveBeenCalledTimes(1);
      expect(req.query).toEqual({
        offset: 0,
        limit: 10,
        orderField: '',
        orderDirection: 'ASC',
        includes: [],
      });
    });

    it('should return includes as an array', () => {
      const includes = 'applications,languages';
      req.query.includes = includes;

      expect(tableListMiddleware.use(req, res, next)).toBe(undefined);
      expect(next).toHaveBeenCalledTimes(1);
      expect(req.query.includes).toEqual(includes.split(','));
    });
  });
});
