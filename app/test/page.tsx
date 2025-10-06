import {NostrFramework} from '@johappel/nostr-framework';

async function initializeNostr() { 
  const framework = new NostrFramework({ debug: true });
  await framework.initialize();
  framework.relay.addRelays(['wss://relay.damus.io']);

  await framework.relay.subscribe([{ kinds: [1], limit: 10 }], (event) => {
    console.log('Received event:', event);
  });
  return framework;
}

// Initialize the framework
const framework = await initializeNostr();

export default function TestPage() {
  return (
    <div className="font-sans flex flex-col h-screen w-full overflow-hidden">
      <main className="flex flex-col gap-[32px] items-center sm:items-start p-4 flex-1 overflow-auto">
        Testseite
      </main>
    </div>
  );
}
