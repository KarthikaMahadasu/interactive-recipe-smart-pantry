import type { Restaurant, User, SignUpPayload, AddStaffPayload } from '../../types/auth';

const STORAGE_KEY_RESTAURANTS = 'restaurant_system_restaurants_v1';
const STORAGE_KEY_USERS = 'restaurant_system_users_v1';
const STORAGE_KEY_CREDENTIALS = 'restaurant_system_credentials_v1';
const STORAGE_KEY_SESSION = 'restaurant_system_session_v1';

// Pre-seeded default data for immediate demo/testing capability
const DEFAULT_RESTAURANT_ID = 'rest_spice_garden';

const DEFAULT_RESTAURANT: Restaurant = {
  id: DEFAULT_RESTAURANT_ID,
  name: 'Spice Garden',
  phone: '+1 (555) 234-5678',
  email: 'contact@spicegarden.com',
  address: '100 Culinary Avenue, Suite A',
  type: 'Restaurant',
  createdAt: new Date('2026-01-01').toISOString(),
  updatedAt: new Date().toISOString()
};

const DEFAULT_USERS: User[] = [
  {
    id: 'usr_owner_tejaswi',
    restaurantId: DEFAULT_RESTAURANT_ID,
    name: 'Tejaswi',
    phone: '+1 (555) 111-2222',
    email: 'owner@spicegarden.com',
    role: 'owner',
    status: 'active',
    createdAt: new Date('2026-01-01').toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'usr_manager_rahul',
    restaurantId: DEFAULT_RESTAURANT_ID,
    name: 'Rahul',
    phone: '+1 (555) 333-4444',
    email: 'manager@spicegarden.com',
    role: 'manager',
    status: 'active',
    createdAt: new Date('2026-01-02').toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'usr_chef_priya',
    restaurantId: DEFAULT_RESTAURANT_ID,
    name: 'Priya',
    phone: '+1 (555) 555-6666',
    email: 'chef@spicegarden.com',
    role: 'chef',
    status: 'active',
    createdAt: new Date('2026-01-03').toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'usr_staff_arun',
    restaurantId: DEFAULT_RESTAURANT_ID,
    name: 'Arun',
    phone: '+1 (555) 777-8888',
    email: 'inventory@spicegarden.com',
    role: 'inventory_staff',
    status: 'active',
    createdAt: new Date('2026-01-04').toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const DEFAULT_PASSWORDS: Record<string, string> = {
  'owner@spicegarden.com': 'password123',
  'manager@spicegarden.com': 'password123',
  'chef@spicegarden.com': 'password123',
  'inventory@spicegarden.com': 'password123'
};

/**
 * Encrypt/Obfuscate raw password so passwords are not stored in raw local data.
 */
function hashPassword(pass: string): string {
  try {
    return btoa(`salt_key_v1:${pass}`);
  } catch (e) {
    return `hashed_${pass}`;
  }
}

export class AuthService {
  /**
   * Initializes database with seed data if not present.
   */
  private static ensureStorageInitialized(): {
    restaurants: Restaurant[];
    users: User[];
    credentials: Record<string, string>;
  } {
    let restaurants: Restaurant[] = [];
    let users: User[] = [];
    let credentials: Record<string, string> = {};

    try {
      const restRaw = localStorage.getItem(STORAGE_KEY_RESTAURANTS);
      if (restRaw) {
        restaurants = JSON.parse(restRaw);
      }
      const userRaw = localStorage.getItem(STORAGE_KEY_USERS);
      if (userRaw) {
        users = JSON.parse(userRaw);
      }
      const credRaw = localStorage.getItem(STORAGE_KEY_CREDENTIALS);
      if (credRaw) {
        credentials = JSON.parse(credRaw);
      }
    } catch (e) {
      console.warn('Error reading auth storage', e);
    }

    if (restaurants.length === 0) {
      restaurants = [DEFAULT_RESTAURANT];
      localStorage.setItem(STORAGE_KEY_RESTAURANTS, JSON.stringify(restaurants));
    }

    if (users.length === 0) {
      users = DEFAULT_USERS;
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));

      credentials = {};
      Object.entries(DEFAULT_PASSWORDS).forEach(([email, pass]) => {
        credentials[email.toLowerCase()] = hashPassword(pass);
      });
      localStorage.setItem(STORAGE_KEY_CREDENTIALS, JSON.stringify(credentials));
    }

    return { restaurants, users, credentials };
  }

  /**
   * Helper to retrieve all restaurants
   */
  private static getRestaurants(): Restaurant[] {
    const { restaurants } = this.ensureStorageInitialized();
    return restaurants;
  }

  /**
   * Helper to retrieve all users
   */
  private static getUsers(): User[] {
    const { users } = this.ensureStorageInitialized();
    return users;
  }

  /**
   * Helper to retrieve hashed credentials mapping
   */
  private static getCredentials(): Record<string, string> {
    const { credentials } = this.ensureStorageInitialized();
    return credentials;
  }

  /**
   * Registers a new restaurant and owner.
   */
  static signUpRestaurant(payload: SignUpPayload): { user: User; restaurant: Restaurant } {
    const {
      restaurantName,
      ownerName,
      phone,
      email,
      password,
      confirmPassword,
      address,
      restaurantType,
      customType
    } = payload;

    // Validations
    if (!restaurantName.trim()) throw new Error('Restaurant name is required');
    if (!ownerName.trim()) throw new Error('Owner name is required');
    if (!email.trim() || !email.includes('@')) throw new Error('Valid email address is required');
    if (!phone.trim()) throw new Error('Phone number is required');
    if (!password || password.length < 6) throw new Error('Password must be at least 6 characters long');
    if (password !== confirmPassword) throw new Error('Passwords do not match');

    const cleanEmail = email.trim().toLowerCase();
    const existingUsers = this.getUsers();

    if (existingUsers.some((u) => u.email.toLowerCase() === cleanEmail)) {
      throw new Error(`An account with email "${email}" already exists`);
    }

    const restType = restaurantType === 'Other' && customType?.trim() ? customType.trim() : restaurantType;
    const now = new Date().toISOString();
    const restaurantId = `rest_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    const newRestaurant: Restaurant = {
      id: restaurantId,
      name: restaurantName.trim(),
      phone: phone.trim(),
      email: cleanEmail,
      address: address.trim(),
      type: restType,
      createdAt: now,
      updatedAt: now
    };

    const newOwner: User = {
      id: `usr_owner_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      restaurantId,
      name: ownerName.trim(),
      phone: phone.trim(),
      email: cleanEmail,
      role: 'owner',
      status: 'active',
      createdAt: now,
      updatedAt: now
    };

    // Save Restaurant
    const restaurants = [...this.getRestaurants(), newRestaurant];
    localStorage.setItem(STORAGE_KEY_RESTAURANTS, JSON.stringify(restaurants));

    // Save Owner User
    const users = [...existingUsers, newOwner];
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));

    // Save Password
    const credentials = { ...this.getCredentials(), [cleanEmail]: hashPassword(password) };
    localStorage.setItem(STORAGE_KEY_CREDENTIALS, JSON.stringify(credentials));

    // Set Active Session
    this.createSession(newOwner, newRestaurant);

    return { user: newOwner, restaurant: newRestaurant };
  }

  /**
   * Signs in an existing user with email and password.
   */
  static signIn(email: string, pass: string): { user: User; restaurant: Restaurant } {
    if (!email || !email.trim()) throw new Error('Email is required');
    if (!pass) throw new Error('Password is required');

    const cleanEmail = email.trim().toLowerCase();
    const users = this.getUsers();
    const user = users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      throw new Error('Invalid email or password');
    }

    if (user.status !== 'active') {
      throw new Error('Account is deactivated. Please contact your restaurant manager.');
    }

    const credentials = this.getCredentials();
    const storedHash = credentials[cleanEmail];
    const inputHash = hashPassword(pass);

    if (storedHash !== inputHash) {
      throw new Error('Invalid email or password');
    }

    const restaurants = this.getRestaurants();
    const restaurant = restaurants.find((r) => r.id === user.restaurantId);

    if (!restaurant) {
      throw new Error(`Associated restaurant workspace not found for user`);
    }

    this.createSession(user, restaurant);
    return { user, restaurant };
  }

  /**
   * Persists active session into localStorage.
   */
  private static createSession(user: User, restaurant: Restaurant): void {
    const sessionData = {
      userId: user.id,
      restaurantId: restaurant.id,
      user,
      restaurant,
      timestamp: new Date().toISOString()
    };
    try {
      localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(sessionData));
    } catch (e) {
      console.warn('Error persisting session', e);
    }
  }

  /**
   * Retrieves active session from localStorage.
   */
  static getCurrentSession(): { user: User; restaurant: Restaurant } | null {
    try {
      const sessionRaw = localStorage.getItem(STORAGE_KEY_SESSION);
      if (sessionRaw) {
        const parsed = JSON.parse(sessionRaw);
        if (parsed?.user && parsed?.restaurant) {
          // Refresh user and restaurant objects from current storage in case of edits
          const users = this.getUsers();
          const restaurants = this.getRestaurants();
          const currentUser = users.find((u) => u.id === parsed.user.id) || parsed.user;
          const currentRestaurant = restaurants.find((r) => r.id === parsed.restaurant.id) || parsed.restaurant;
          return { user: currentUser, restaurant: currentRestaurant };
        }
      }
    } catch (e) {
      console.warn('Error reading active session', e);
    }
    return null;
  }

  /**
   * Signs out current user.
   */
  static signOut(): void {
    try {
      localStorage.removeItem(STORAGE_KEY_SESSION);
    } catch (e) {
      console.warn('Error signing out', e);
    }
  }

  /**
   * Returns staff users belonging to a specific restaurant.
   */
  static getStaffByRestaurant(restaurantId: string): User[] {
    const users = this.getUsers();
    return users.filter((u) => u.restaurantId === restaurantId);
  }

  /**
   * Adds a new staff member to a restaurant.
   */
  static addStaffMember(restaurantId: string, payload: AddStaffPayload): User {
    const { name, email, phone, role, password } = payload;

    if (!name.trim()) throw new Error('Staff name is required');
    if (!email.trim() || !email.includes('@')) throw new Error('Valid email address is required');
    if (!phone.trim()) throw new Error('Phone number is required');

    const cleanEmail = email.trim().toLowerCase();
    const users = this.getUsers();

    if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
      throw new Error(`An account with email "${email}" already exists`);
    }

    const now = new Date().toISOString();
    const newStaff: User = {
      id: `usr_${role}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      restaurantId,
      name: name.trim(),
      phone: phone.trim(),
      email: cleanEmail,
      role,
      status: 'active',
      createdAt: now,
      updatedAt: now
    };

    const defaultPass = password || 'password123';
    const credentials = { ...this.getCredentials(), [cleanEmail]: hashPassword(defaultPass) };

    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify([...users, newStaff]));
    localStorage.setItem(STORAGE_KEY_CREDENTIALS, JSON.stringify(credentials));

    return newStaff;
  }

  /**
   * Updates staff user attributes (status, role, name, phone).
   */
  static updateStaffMember(updatedUser: User): User {
    const users = this.getUsers();
    const now = new Date().toISOString();
    const finalUser = { ...updatedUser, updatedAt: now };
    const newUsers = users.map((u) => (u.id === finalUser.id ? finalUser : u));

    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(newUsers));
    return finalUser;
  }

  /**
   * Removes staff user from workspace.
   */
  static deleteStaffMember(userId: string): void {
    const users = this.getUsers();
    const filtered = users.filter((u) => u.id !== userId);
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(filtered));
  }
}
