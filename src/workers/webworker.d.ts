export interface WorkerNavigator {
  readonly serviceWorker: ServiceWorkerContainer;
}

export interface ServiceWorkerContainer {
  readonly controller: ServiceWorker;
  readonly ready: Promise<ServiceWorkerRegistration>;
  oncontrollerchange: ((this: ServiceWorkerContainer, event: Event) => any) | null;
  onerror: ((this: ServiceWorkerContainer, event?: Event) => any) | null;
  onmessage: ((this: ServiceWorkerContainer, event: ServiceWorkerMessageEvent) => any) | null;

  getRegistration(scope?: string): Promise<ServiceWorkerRegistration>;

  getRegistrations(): Promise<ServiceWorkerRegistration[]>;

  register(url: string, options?: ServiceWorkerRegistrationOptions): Promise<ServiceWorkerRegistration>;
}

export interface ServiceWorkerMessageEvent extends Event {
  readonly data: any;
  readonly lastEventId: string;
  readonly origin: string;
  readonly ports: ReadonlyArray<MessagePort> | null;
  readonly source: ServiceWorker | MessagePort | null;
}

export interface ServiceWorkerRegistrationOptions {
  scope?: string;
}

// Client API

export interface Client {
  readonly frameType: ClientFrameType;
}

export type ClientFrameType = 'auxiliary' | 'top-level' | 'nested' | 'none';

// Events

export interface ActivateEvent extends ExtendableEvent {
}

export interface InstallEvent extends ExtendableEvent {
  readonly activeWorker: ServiceWorker;
}

// Fetch API

export interface Body {
  readonly body: ReadableStream;
}

export interface Headers {
  entries(): string[][];

  keys(): string[];

  values(): string[];
}

export interface Response extends Body {
  readonly useFinalURL: boolean;

  clone(): Response;

  error(): Response;

  redirect(): Response;
}

// Notification API

export interface Notification {
  readonly actions: NotificationAction[];
  readonly requireInteraction: boolean;
  readonly silent: boolean;
  readonly tag: string;
  readonly renotify: boolean;
  readonly timestamp: number;
  readonly title: string;
  readonly vibrate: number[];

  close(): void;

  requestPermission(): Promise<string>;
}

export interface NotificationAction {
}

// ServiceWorkerGlobalScope

declare var clients: Clients;
declare var onactivate: ((event?: ActivateEvent) => any) | null;
declare var onfetch: ((event?: FetchEvent) => any) | null;
declare var oninstall: ((event?: InstallEvent) => any) | null;
declare var onnotificationclick: ((event?: NotificationEvent) => any) | null;
declare var onnotificationclose: ((event?: NotificationEvent) => any) | null;
declare var onpush: ((event?: PushEvent) => any) | null;
declare var onpushsubscriptionchange: (() => any) | null;
declare var onsync: ((event?: SyncEvent) => any) | null;
declare var registration: ServiceWorkerRegistration;

declare function skipWaiting(): void;
