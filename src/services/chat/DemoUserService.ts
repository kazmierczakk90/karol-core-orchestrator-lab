
export class DemoUserService {
  private static readonly DEMO_USER_UUID = '00000000-0000-0000-0000-000000000001';
  private static readonly DEMO_EMAIL = 'demo@karol-core.dev';

  static getDemoUser() {
    return {
      id: this.DEMO_USER_UUID,
      email: this.DEMO_EMAIL
    };
  }

  static isDemoUser(userId: string): boolean {
    return userId === this.DEMO_USER_UUID;
  }

  static getDemoUserUUID(): string {
    return this.DEMO_USER_UUID;
  }
}
