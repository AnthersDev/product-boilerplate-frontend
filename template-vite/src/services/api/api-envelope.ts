/** Response body shape used by Marmeto backends. Anthers `LoginPage` relies on `status`. */
export interface ApiEnvelope<T> {
  status: boolean;
  message?: string;
  data: T;
}
