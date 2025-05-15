import Response from './response';

export interface TokenResponse extends Response {
  data: string | null | { token: string; refToken?: string };
}
