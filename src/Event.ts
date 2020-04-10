export type EventHandler = (...args: any[]) => Promise<void> | void;

export interface Event {
  name: string;
  handler: EventHandler;
}
