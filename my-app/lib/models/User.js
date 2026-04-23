export const USER_ROLE = {
  GUEST: 'guest',
  RECEPTIONIST: 'receptionist',
  MANAGER: 'manager',
  HOUSEKEEPER: 'housekeeper'
};

export class User {
  constructor(id, name, email, phone, role) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.role = role;
    this.createdAt = new Date();
    this.isActive = true;
  }

  hasPermission(requiredRole) {
    const roleHierarchy = {
      [USER_ROLE.GUEST]: 1,
      [USER_ROLE.HOUSEKEEPER]: 2,
      [USER_ROLE.RECEPTIONIST]: 3,
      [USER_ROLE.MANAGER]: 4
    };
    return roleHierarchy[this.role] >= roleHierarchy[requiredRole];
  }
}
