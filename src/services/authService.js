import apiClient from './api';

const SESSION_KEY = 'stockpilot_session';

export const authService = {
  /**
   * Authenticate user with email and password
   */
  async login(email, password) {
    const cleanEmail = email?.trim().toLowerCase();
    const users = await apiClient.get('/users', { email: cleanEmail });

    if (!users || users.length === 0) {
      throw new Error('Credenciales inválidas. Correo electrónico no encontrado.');
    }

    const user = users[0];

    if (user.password !== password) {
      throw new Error('Contraseña incorrecta. Por favor verifique.');
    }

    if (user.status !== 'active') {
      throw new Error('Su cuenta se encuentra inactiva. Comuníquese con el administrador.');
    }

    const sessionData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      businessName: user.businessName || 'StockPilot Corp',
      avatar: user.avatar,
      token: `demo-token-${user.id}-${Date.now()}`
    };

    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));

    // Update last login timestamp in background
    try {
      await apiClient.patch(`/users/${user.id}`, {
        lastLogin: new Date().toISOString()
      });
      // Register activity
      await apiClient.post('/activities', {
        type: 'LOGIN',
        description: `Inicio de sesión exitoso de ${user.name} (${user.role})`,
        userId: user.id,
        userName: user.name,
        timestamp: new Date().toISOString()
      });
    } catch {
      // Ignore background activity logging errors
    }

    return sessionData;
  },

  /**
   * Register a new user in the system
   */
  async register({ name, email, password, businessName = 'Mi Negocio', businessType = 'General' }) {
    const cleanEmail = email?.trim().toLowerCase();

    // Check if email already exists
    const existing = await apiClient.get('/users', { email: cleanEmail });
    if (existing && existing.length > 0) {
      throw new Error('El correo electrónico ya se encuentra registrado.');
    }

    const newUser = {
      name: name.trim(),
      email: cleanEmail,
      password,
      role: 'employee', // default new registrations as employee
      status: 'active',
      businessName,
      businessType,
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80`,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };

    const created = await apiClient.post('/users', newUser);

    const sessionData = {
      id: created.id,
      name: created.name,
      email: created.email,
      role: created.role,
      businessName: created.businessName,
      avatar: created.avatar,
      token: `demo-token-${created.id}-${Date.now()}`
    };

    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));

    try {
      await apiClient.post('/activities', {
        type: 'CREATE_USER',
        description: `Nuevo usuario registrado: ${created.name} (${created.email})`,
        userId: created.id,
        userName: created.name,
        timestamp: new Date().toISOString()
      });
    } catch {
      // Ignore
    }

    return sessionData;
  },

  getCurrentSession() {
    try {
      const data = localStorage.getItem(SESSION_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  async logout() {
    const session = this.getCurrentSession();
    if (session) {
      try {
        await apiClient.post('/activities', {
          type: 'LOGOUT',
          description: `Cierre de sesión de ${session.name}`,
          userId: session.id,
          userName: session.name,
          timestamp: new Date().toISOString()
        });
      } catch {
        // Ignore
      }
    }
    localStorage.removeItem(SESSION_KEY);
  },

  /**
   * Update current user profile
   */
  async updateProfile(userId, updates) {
    const updatedUser = await apiClient.patch(`/users/${userId}`, updates);
    
    // Update local session
    const currentSession = this.getCurrentSession();
    if (currentSession && currentSession.id === userId) {
      const newSession = { ...currentSession, ...updates, name: updatedUser.name, avatar: updatedUser.avatar };
      localStorage.setItem(SESSION_KEY, JSON.stringify(newSession));
      return newSession;
    }
    return updatedUser;
  }
};

export default authService;
