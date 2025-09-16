import { describe, test, expect, jest } from '@jest/globals';
import { 
  isValidUUID, 
  generateSecureUUID, 
  uuidSchema,
  createUUID,
  validateUUID 
} from '../src/utils/uuid';

describe('UUID Validation', () => {
  test('should accept valid UUID v4', () => {
    const validUUIDs = [
      '550e8400-e29b-41d4-a716-446655440000',
      '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
      '6ba7b811-9dad-11d1-80b4-00c04fd430c8',
      '00000000-0000-0000-0000-000000000000'
    ];

    validUUIDs.forEach(uuid => {
      expect(isValidUUID(uuid)).toBe(true);
    });
  });

  test('should reject invalid UUID formats', () => {
    const invalidUUIDs = [
      'cmfklpdba0000vplcz39cirs0',  // cuid format
      '123-456-789',                 // wrong format
      'not-a-uuid',                  // not UUID at all
      '550e8400-e29b-41d4-a716',     // incomplete
      '550e8400-e29b-41d4-a716-446655440000-extra', // too long
      '',                            // empty string
      '550e8400-e29b-41d4-a716-44665544000g' // invalid characters
    ];

    invalidUUIDs.forEach(uuid => {
      expect(isValidUUID(uuid)).toBe(false);
    });
  });

  test('should generate valid UUIDs', () => {
    const uuid1 = generateSecureUUID();
    const uuid2 = generateSecureUUID();

    // Should be valid UUIDs
    expect(isValidUUID(uuid1)).toBe(true);
    expect(isValidUUID(uuid2)).toBe(true);

    // Should be different
    expect(uuid1).not.toBe(uuid2);

    // Should follow UUID v4 pattern
    expect(uuid1).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
  });

  test('uuidSchema should validate correctly', () => {
    const validUUID = '550e8400-e29b-41d4-a716-446655440000';
    const invalidUUID = 'not-a-uuid';

    expect(() => uuidSchema.parse(validUUID)).not.toThrow();
    expect(() => uuidSchema.parse(invalidUUID)).toThrow();
  });

  test('createUUID should create branded UUID', () => {
    const validUUID = '550e8400-e29b-41d4-a716-446655440000';
    const invalidUUID = 'not-a-uuid';

    expect(() => createUUID(validUUID)).not.toThrow();
    expect(() => createUUID(invalidUUID)).toThrow();

    const brandedUUID = createUUID(validUUID);
    expect(brandedUUID).toBe(validUUID);
  });
});

describe('UUID Middleware', () => {
  test('validateUUID middleware should validate parameter', () => {
    const validUUID = '550e8400-e29b-41d4-a716-446655440000';
    const invalidUUID = 'not-a-uuid';

    const mockRequest = (paramValue: string) => ({
      params: { id: paramValue }
    });

    const mockReply = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis()
    };

    const mockDone = jest.fn();

    // Test valid UUID
    const middleware = validateUUID('id');
    middleware(mockRequest(validUUID), mockReply as any, mockDone);
    
    expect(mockDone).toHaveBeenCalled();
    expect(mockReply.status).not.toHaveBeenCalled();

    // Reset mocks
    mockDone.mockClear();
    mockReply.status.mockClear();
    mockReply.send.mockClear();

    // Test invalid UUID
    middleware(mockRequest(invalidUUID), mockReply as any, mockDone);
    
    expect(mockReply.status).toHaveBeenCalledWith(400);
    expect(mockReply.send).toHaveBeenCalledWith({
      error: 'Invalid id format. Expected UUID.',
      received: invalidUUID
    });
    expect(mockDone).not.toHaveBeenCalled();
  });
});