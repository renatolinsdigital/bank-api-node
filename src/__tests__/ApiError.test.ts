import ApiError from '../models/ApiError';

describe('ApiError', () => {
  it('should create a BadRequest error with status 400', () => {
    const error = ApiError.badRequest();
    expect(error.status).toBe(400);
    expect(error.message).toBeDefined();
  });

  it('should create a NotFound error with status 404', () => {
    const error = ApiError.notFound();
    expect(error.status).toBe(404);
    expect(error.message).toBeDefined();
  });

  it('should create a NotEnoughFunds error with status 403', () => {
    const error = ApiError.notEnoughFunds();
    expect(error.status).toBe(403);
    expect(error.message).toBeDefined();
  });

  it('should create an Internal error with status 500', () => {
    const error = ApiError.internal();
    expect(error.status).toBe(500);
    expect(error.message).toBeDefined();
  });
});
