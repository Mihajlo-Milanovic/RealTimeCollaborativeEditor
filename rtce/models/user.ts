export class UIUser {
  private static instance: UIUser;
  
  id: string | null = null;
  email: string | null = null;
  username: string | null = null;

  private constructor() {}

  static getInstance(): UIUser {
    if (!UIUser.instance) {
      UIUser.instance = new UIUser();
    }
    return UIUser.instance;
  }

  fillFromSession(sessionUser: any) {
    if (!sessionUser) {
      this.reset();
      return;
    }
    this.id = sessionUser.id ?? null;
    this.email = sessionUser.email ?? null;
    this.username = sessionUser.username ?? null;
  }

  reset() {
    this.id = null;
    this.email = null;
    this.username = null;
  }
}

export default UIUser;