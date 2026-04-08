// utils/cookieService.ts

interface CookieOptions {
  expires?: Date;
  maxAge?: number; // in seconds
  domain?: string;
  path?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: "strict" | "lax" | "none";
}

class CookieService {
  /**
   * Set a cookie
   * @param key - Cookie name
   * @param value - Cookie value
   * @param options - Cookie options
   */
  setCookie(key: string, value: string, options: CookieOptions = {}): void {
    if (typeof window === "undefined") {
      // Server-side: This should be handled by Next.js API routes or middleware
      console.warn(
        "setCookie called on server-side. Use Next.js cookies() API instead."
      );
      return;
    }

    const {
      expires,
      maxAge,
      domain,
      path = "/",
      secure = process.env.NODE_ENV === "production",
      sameSite = "lax",
    } = options;

    let cookieString = `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;

    if (expires) {
      cookieString += `; expires=${expires.toUTCString()}`;
    }

    if (maxAge !== undefined) {
      cookieString += `; max-age=${maxAge}`;
    }

    if (domain) {
      cookieString += `; domain=${domain}`;
    }

    cookieString += `; path=${path}`;

    if (secure) {
      cookieString += `; secure`;
    }

    cookieString += `; samesite=${sameSite}`;

    document.cookie = cookieString;
  }

  /**
   * Get a cookie value by key
   * @param key - Cookie name
   * @returns Cookie value or null if not found
   */
  getCookie(key: string): string | null {
    if (typeof window === "undefined") {
      // Server-side: This should be handled by Next.js API routes or middleware
      console.warn(
        "getCookie called on server-side. Use Next.js cookies() API instead."
      );
      return null;
    }

    const name = encodeURIComponent(key) + "=";
    const cookies = document.cookie.split(";");

    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.indexOf(name) === 0) {
        return decodeURIComponent(cookie.substring(name.length));
      }
    }

    return null;
  }

  /**
   * Delete a cookie by key
   * @param key - Cookie name
   * @param options - Cookie options (domain and path should match the original cookie)
   */
  deleteCookie(
    key: string,
    options: Pick<CookieOptions, "domain" | "path"> = {}
  ): void {
    const { domain, path = "/" } = options;

    this.setCookie(key, "", {
      expires: new Date(0),
      domain,
      path,
    });
  }

  /**
   * Get all cookies as an object
   * @returns Object with all cookies
   */
  getAllCookies(): Record<string, string> {
    if (typeof window === "undefined") {
      console.warn(
        "getAllCookies called on server-side. Use Next.js cookies() API instead."
      );
      return {};
    }

    const cookies: Record<string, string> = {};
    const cookieArray = document.cookie.split(";");

    for (let cookie of cookieArray) {
      cookie = cookie.trim();
      if (cookie) {
        const [key, value] = cookie.split("=");
        if (key && value) {
          cookies[decodeURIComponent(key)] = decodeURIComponent(value);
        }
      }
    }

    return cookies;
  }

  /**
   * Check if a cookie exists
   * @param key - Cookie name
   * @returns true if cookie exists, false otherwise
   */
  hasCookie(key: string): boolean {
    return this.getCookie(key) !== null;
  }

  /**
   * Clear all cookies (client-side only)
   * Note: This will only clear cookies for the current path and domain
   */
  clearAllCookies(): void {
    if (typeof window === "undefined") {
      console.warn("clearAllCookies called on server-side.");
      return;
    }

    const cookies = this.getAllCookies();
    for (const key in cookies) {
      this.deleteCookie(key);
    }

    // Fallback: force delete known critical cookies directly just in case they were missed by getAllCookies.
    this.deleteCookie("authToken");
    this.deleteCookie("user");
  }
}

// Create and export a singleton instance
export const cookieService = new CookieService();
