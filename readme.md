# Shady Station 56

Javascript game about building and maintenance of a space station.

## Game mechanics
All physical objects in the game world are called items. We attempt an entity-based simulation of game world, which is driven by time and user actions.

## Runtime
Standard RTS engine. Clients generate immutable actions and push them to server. Server keeps a push-only history of actions and synchronizes it between players via websocket updates. Game state is a function of action history, but clients keep a local, mutable cache/snapshot that is drawn to screen.

## Security
Currently no countermeasures are planned against cheating.