/// <reference lib="webworker" />


export {}; // VERY IMPORTANT (makes this file a module)

const ctx = self as unknown as SharedWorkerGlobalScope;

const connections: MessagePort[] = [];

ctx.onconnect = (event: MessageEvent) => {
  const port = event.ports[0];

  connections.push(port);
  console.log("Shared Worker Instance Created");


  port.onmessage = (msgEvent: MessageEvent) => {
    const message = msgEvent.data;

    // Broadcast to all connected tabs
    connections.forEach(p => {
      p.postMessage(message);
    });
  };

  port.start();
};
