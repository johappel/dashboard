'use client';

import { useEffect, useState } from 'react';

// Custom NostrManager that combines nostr-tools with localStorage functionality
class NostrManager {
  private pool: any = null;
  private relays: string[] = [];
  private subscriptions: any[] = [];
  private eventListeners: Map<string, Set<(event: any) => void>> = new Map();

  constructor() {
    if (typeof window !== 'undefined') {
      // Clear potentially corrupted localStorage and start fresh
      this.clearLocalStorage();
      this.relays = ['wss://relay.damus.io'];
    }
  }

  private loadFromLocalStorage() {
    try {
      const stored = localStorage.getItem('nostr-relays');
      if (stored) {
        const parsed = JSON.parse(stored);
        // Validate that we have an array of valid URLs
        if (Array.isArray(parsed) && parsed.length > 0) {
          const validRelays = parsed.filter(url => this.isValidRelayUrl(url));
          if (validRelays.length > 0) {
            this.relays = validRelays;
            return;
          }
        }
      }
      // If no valid relays found, use defaults
      console.log('No valid relays in localStorage, using defaults');
    } catch (error) {
      console.warn('Failed to load relays from localStorage:', error);
    }
  }

  private saveToLocalStorage() {
    try {
      localStorage.setItem('nostr-relays', JSON.stringify(this.relays));
    } catch (error) {
      console.warn('Failed to save relays to localStorage:', error);
    }
  }

  private isValidRelayUrl(url: string): boolean {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.protocol === 'wss:' || parsedUrl.protocol === 'ws:';
    } catch {
      return false;
    }
  }

  async initialize() {
    if (typeof window === 'undefined') {
      throw new Error('Can only initialize in browser environment');
    }

    const { SimplePool } = await import('nostr-tools');
    this.pool = new SimplePool();

    // Ensure we have the default relay
    if (this.relays.length === 0) {
      this.relays = ['wss://relay.snort.social'];
    }

    this.saveToLocalStorage();

    console.log('NostrManager initialized with localStorage integration');
    console.log('Active relays:', this.relays);
  }

  addRelay(url: string) {
    if (this.isValidRelayUrl(url) && !this.relays.includes(url)) {
      this.relays.push(url);
      this.saveToLocalStorage();
    } else {
      console.warn(`Invalid or duplicate relay URL: ${url}`);
    }
  }

  getRelays(): string[] {
    return [...this.relays];
  }

  async subscribeToKind1(callback: (event: any) => void) {
    if (!this.pool) {
      throw new Error('NostrManager not initialized');
    }

    // Completely rebuild the relays array to ensure no empty strings
    this.relays = this.relays.filter(relay => relay && relay.trim() !== '' && this.isValidRelayUrl(relay));

    if (this.relays.length === 0) {
      this.relays = ['wss://relay.damus.io'];
      this.saveToLocalStorage();
    }

    console.log('Final relays for subscription:', this.relays);
    console.log('Relays length:', this.relays.length);

    // Subscribe to kind 1 events (text notes/posts)
    const filters = { kinds: [1], limit: 50 };

    const subscriptions = this.relays.map((relay, index) => {
      console.log(`Creating subscription ${index} for relay: "${relay}" (length: ${relay.length})`);
      try {
        // Try individual relay subscription
        return this.pool.subscribeMany([relay], filters, {
          onevent: callback,
          oneose: () => console.log(`End of stored events from ${relay}`),
          onclose: () => console.log(`Connection to ${relay} closed`)
        });
      } catch (error) {
        console.error(`Failed to create subscription for ${relay}:`, error);
        return null;
      }
    }).filter(sub => sub !== null);

    this.subscriptions.push(...subscriptions);

    return {
      unsubscribe: () => {
        subscriptions.forEach(sub => sub?.close?.());
      }
    };
  }

  disconnect() {
    this.subscriptions.forEach(sub => sub.close?.());
    this.subscriptions = [];
  }

  clearLocalStorage() {
    try {
      localStorage.removeItem('nostr-relays');
      this.relays = [];
      console.log('localStorage cleared');
    } catch (error) {
      console.warn('Failed to clear localStorage:', error);
    }
  }
}

interface NostrEvent {
  id: string;
  content: string;
  created_at: number;
  pubkey: string;
  kind: number;
  tags: string[][];
}

export default function TestPage() {
  const [nostrManager, setNostrManager] = useState<NostrManager | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState<NostrEvent[]>([]);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    const initializeNostr = async () => {
      try {
        setIsLoading(true);

        if (typeof window === 'undefined') {
          throw new Error('Can only run in browser environment');
        }

        const manager = new NostrManager();
        await manager.initialize();

        setNostrManager(manager);
        setError(null);

        // Start subscription to kind 1 events
        let subscription: any = null;

        try {
          subscription = await manager.subscribeToKind1((event: NostrEvent) => {
            console.log('Received event:', event);

            setEvents(prevEvents => {
              // Check if event already exists
              const exists = prevEvents.some(e => e.id === event.id);
              if (exists) return prevEvents;

              // Add new event at the beginning (newest first)
              return [event, ...prevEvents];
            });
          });

          setIsSubscribed(true);
          console.log('Successfully subscribed to Kind 1 events');
        } catch (subError) {
          console.error('Failed to subscribe to events:', subError);
          setError(`Subscription failed: ${subError instanceof Error ? subError.message : 'Unknown error'}`);
        }

        // Cleanup subscription on unmount
        return () => {
          if (subscription) {
            subscription.unsubscribe();
          }
        };
      } catch (err) {
        console.error('NostrManager initialization failed:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    const cleanup = initializeNostr();

    return () => {
      cleanup?.then(cleanupFn => cleanupFn?.());
    };
  }, []);

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString('de-DE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const truncateContent = (content: string, maxLength: number = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <div className="font-sans flex flex-col h-screen w-full overflow-hidden">
      <main className="flex flex-col gap-[32px] items-center sm:items-start p-4 flex-1 overflow-auto">
        <h1>Testseite - NostrManager mit localStorage</h1>

        {isLoading && (
          <div className="text-blue-600 bg-blue-50 p-4 rounded-md">
            ⏳ NostrManager wird initialisiert...
          </div>
        )}

        {error && (
          <div className="text-red-600 bg-red-50 p-4 rounded-md">
            ❌ Fehler: {error}
          </div>
        )}

        {nostrManager && !error && !isLoading && (
          <div className="w-full max-w-4xl">
            <div className="text-green-600 bg-green-50 p-4 rounded-md mb-6">
              ✅ NostrManager erfolgreich initialisiert!<br/>
              🏪 localStorage Integration aktiv<br/>
              📡 Relay-Konfiguration gespeichert<br/>
              🔄 Verwendet nostr-tools direkt<br/>
              {isSubscribed && <span className="text-green-800">📡 Abonniert Kind 1 Events</span>}
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                📨 Nostr Events (Kind 1 - Text Notes)
              </h2>

              {events.length === 0 ? (
                <div className="text-gray-500 text-center py-8">
                  ⏳ Warte auf Events... (Kind 1 Events werden von Relays empfangen)
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {events.map((event) => (
                    <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <div className="text-sm text-gray-600 font-mono">
                          {event.pubkey.substring(0, 8)}...
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatTimestamp(event.created_at)}
                        </div>
                      </div>
                      <div className="text-gray-800">
                        {truncateContent(event.content)}
                      </div>
                      <div className="text-xs text-gray-400 mt-2 font-mono">
                        Event ID: {event.id.substring(0, 16)}...
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
