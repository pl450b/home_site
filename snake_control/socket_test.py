import asyncio
import websockets

# Set of connected clients
connected_clients = set()

# Function to handle each client connection
async def handler(websocket):
    # Add new client
    connected_clients.add(websocket)
    print(f"Client connected: {websocket.remote_address}")

    try:
        # Keep the connection open and listen for messages
        async for message in websocket:
            print(f"Received: {message}")
    except websockets.exceptions.ConnectionClosed:
        pass
    finally:
        # Remove client when disconnected
        connected_clients.remove(websocket)
        print(f"Client disconnected: {websocket.remote_address}")

# Function to periodically send messages to all connected clients
async def broadcast_messages():
    counter = 0
    while True:
        if connected_clients:  # Only send if clients are connected
            message = f"Server message {counter}"
            await asyncio.gather(*(client.send(message) for client in connected_clients))
            print(f"Broadcasted: {message}")
            counter += 1

        await asyncio.sleep(5)  # Broadcast every 5 seconds

# Main server function
async def main():
    async with websockets.serve(handler, "", 8080):  # Start WebSocket server
        print("WebSocket server running on ws://0.0.0.0:8080")

        # Start broadcasting task
        broadcast_task = asyncio.create_task(broadcast_messages())

        # Keep the server running indefinitely
        await asyncio.get_running_loop().create_future()

# Run the server
if __name__ == "__main__":
    asyncio.run(main())

