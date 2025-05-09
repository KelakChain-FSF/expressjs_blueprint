import { describe, expect, test } from 'vitest';
import getPaginationInfo from './pagination';

describe('getPaginationInfo', () => {
  test('should return correct pagination info when totalData is divisible by limit', () => {
    const result = getPaginationInfo(100, 2, 10);
    expect(result).toEqual({
      current: 2,
      next: 3,
      prev: 1,
      total: 10,
    });
  });

  test('should return correct pagination info when totalData is not divisible by limit', () => {
    const result = getPaginationInfo(95, 1, 10);
    expect(result).toEqual({
      current: 1,
      next: 2,
      prev: null,
      total: 10,
    });
  });

  test('should return null for next page if current page is the last page', () => {
    const result = getPaginationInfo(50, 5, 10);
    expect(result).toEqual({
      current: 5,
      next: null,
      prev: 4,
      total: 5,
    });
  });

  test('should return null for prev page if current page is the first page', () => {
    const result = getPaginationInfo(50, 1, 10);
    expect(result).toEqual({
      current: 1,
      next: 2,
      prev: null,
      total: 5,
    });
  });

  test('should handle edge case where totalData is 0', () => {
    const result = getPaginationInfo(0, 1, 10);
    expect(result).toEqual({
      current: 1,
      next: null,
      prev: null,
      total: 0,
    });
  });

  test('should handle edge case where limit is 0', () => {
    const result = getPaginationInfo(100, 1, 0);
    expect(result).toEqual({
      current: 1,
      next: null,
      prev: null,
      total: 0,
    });
  });

  test('should handle edge case where currentPage is greater than total pages', () => {
    const result = getPaginationInfo(50, 10, 10);
    expect(result).toEqual({
      current: 10,
      next: null,
      prev: 9,
      total: 5,
    });
  });
});
