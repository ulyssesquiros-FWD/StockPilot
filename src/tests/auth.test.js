jest.mock('../services/api', () => ({
  __esModule: true,
  default: {
    get: jest.fn().mockResolvedValue([]),
    post: jest.fn().mockResolvedValue({}),
    patch: jest.fn().mockResolvedValue({})
  },
  apiClient: {
    get: jest.fn().mockResolvedValue([]),
    post: jest.fn().mockResolvedValue({}),
    patch: jest.fn().mockResolvedValue({})
  }
}));

import authService from '../services/authService';

describe('Auth Service & Session Persistence Suite', () => {
  const mockUserSession = {
    id: 1,
    name: 'Carlos Mendoza',
    email: 'admin@stockpilot.com',
    role: 'admin',
    businessName: 'StockPilot Corp',
    token: 'test-session-token'
  };

  beforeEach(() => {
    localStorage.clear();
  });

  test('getCurrentSession returns null when localStorage is empty', () => {
    expect(authService.getCurrentSession()).toBeNull();
  });

  test('getCurrentSession retrieves and parses saved session correctly', () => {
    localStorage.setItem('stockpilot_session', JSON.stringify(mockUserSession));
    const session = authService.getCurrentSession();
    expect(session).toEqual(mockUserSession);
    expect(session.name).toBe('Carlos Mendoza');
    expect(session.role).toBe('admin');
  });

  test('logout removes the stockpilot_session key from localStorage', async () => {
    localStorage.setItem('stockpilot_session', JSON.stringify(mockUserSession));
    expect(localStorage.getItem('stockpilot_session')).not.toBeNull();

    await authService.logout();
    expect(localStorage.getItem('stockpilot_session')).toBeNull();
    expect(authService.getCurrentSession()).toBeNull();
  });
});
