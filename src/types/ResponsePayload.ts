export interface ResponsePayload<T> {
  data: T | null;
  message?: string;
}
