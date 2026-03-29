import { describe, it, expect, vi, beforeEach } from 'vitest';

// Use vi.hoisted to create variables that can be used inside vi.mock factory
const { mockGet, mockPost, mockPut, mockDelete, mockRequestUse, mockResponseUse, getInterceptorHandlers } =
  vi.hoisted(() => {
    let reqHandler = null;
    let resHandler = null;

    const mockRequestUse = vi.fn((onFulfilled) => { reqHandler = onFulfilled; });
    const mockResponseUse = vi.fn((onFulfilled) => { resHandler = onFulfilled; });

    return {
      mockGet: vi.fn(),
      mockPost: vi.fn(),
      mockPut: vi.fn(),
      mockDelete: vi.fn(),
      mockRequestUse,
      mockResponseUse,
      getInterceptorHandlers: () => ({ reqHandler, resHandler }),
    };
  });

vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      get: mockGet,
      post: mockPost,
      put: mockPut,
      delete: mockDelete,
      interceptors: {
        request: { use: mockRequestUse },
        response: { use: mockResponseUse },
      },
    })),
  },
}));

import api from '../api';

describe('API Service', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('api module exports a defined object', () => {
    expect(api).toBeDefined();
    expect(typeof api).toBe('object');
  });

  it('request interceptor adds auth header when token exists', () => {
    const { reqHandler } = getInterceptorHandlers();
    expect(reqHandler).not.toBeNull();
    localStorage.setItem('token', 'my-test-token');
    const config = { headers: {} };
    const result = reqHandler(config);
    expect(result.headers.Authorization).toBe('Bearer my-test-token');
  });

  it('request interceptor does not add auth header when no token', () => {
    const { reqHandler } = getInterceptorHandlers();
    expect(reqHandler).not.toBeNull();
    const config = { headers: {} };
    const result = reqHandler(config);
    expect(result.headers.Authorization).toBeUndefined();
  });

  it('response interceptor returns response as-is on success', () => {
    const { resHandler } = getInterceptorHandlers();
    expect(resHandler).not.toBeNull();
    const mockResponse = { data: { success: true }, status: 200 };
    const result = resHandler(mockResponse);
    expect(result).toEqual(mockResponse);
  });

  it('api has get method', () => {
    expect(typeof api.get).toBe('function');
  });

  it('api has post method', () => {
    expect(typeof api.post).toBe('function');
  });

  it('api has put method', () => {
    expect(typeof api.put).toBe('function');
  });

  it('api has delete method', () => {
    expect(typeof api.delete).toBe('function');
  });
});
