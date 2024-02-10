enum FetchMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

class FetchService {
  private apiUrl: string;

  constructor() {
    this.apiUrl = process.env.NEXT_PUBLIC_API_URL;
  }

  async get<T>(
    path: string,
    headers?: Record<string, string> | undefined
  ): Promise<T> {
    return this.fetch<T>(FetchMethod.GET, path, undefined, headers);
  }

  async post<T>(
    path: string,
    body?: Record<string, any>,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.fetch<T>(FetchMethod.POST, path, body, headers);
  }

  async put<T>(
    path: string,
    body?: Record<string, any>,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.fetch<T>(FetchMethod.PUT, path, body, headers);
  }

  async patch<T>(
    path: string,
    body?: Record<string, any>,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.fetch<T>(FetchMethod.PATCH, path, body, headers);
  }

  async delete<T>(path: string, headers?: Record<string, string>) {
    return this.fetch<T>(FetchMethod.DELETE, path, undefined, headers);
  }

  async fetch<T>(
    method: FetchMethod,
    path: string,
    body?: Record<string, any>,
    headers?: Record<string, string>
  ): Promise<T> {
    const url = this.apiUrl + path;

    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers,
    };

    // TODO: add isAuth logic
    // if (isAuth) {
    //   const session = await getServerSession(authOptions)
    //   const accessToken = session?.tokens.accessToken
    //   requestHeaders['Authorization'] = `Bearer ${accessToken}`
    // }

    const response = await fetch(url, {
      method,
      body: body ? JSON.stringify(body) : null,
      headers: requestHeaders,
      cache: 'no-store',
    });

    const data: T = await response.json();

    if (!response.ok) {
      throw data;
    }

    return data;
  }
}

export const fetchService = new FetchService();
