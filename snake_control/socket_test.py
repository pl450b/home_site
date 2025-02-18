import asyncio
import websockets
import random

# Set of connected clients
connected_clients = set()

# queue
cmdQueue = []

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
    while True:
        if connected_clients:  # Only send if clients are connected_clients
            while not cmdQueue:
                await asyncio.sleep(0.1)
            message = cmdQueue.pop()
            await asyncio.gather(*(client.send(message) for client in connected_clients))

        await asyncio.sleep(0.1)  # Broadcast every 5 seconds

# Function to grap user input and send to queue for broadcasting
async def poll_user():
    while(1):
        user_input = await asyncio.to_thread(input, "Enter command: ")
        cmdQueue.append(user_input)

# Goofy function for auto moving
async def auto_move():
    while(1):
        cmdQueue.append('w')
        await asyncio.sleep(0.5)
        for i in range(random.randint(1,30)):
            cmdQueue.append('0');
            await asyncio.sleep(0.5)

        cmdQueue.append('a')
        await asyncio.sleep(0.5)
        for i in range(random.randint(1,30)):
            cmdQueue.append('0');
            await asyncio.sleep(0.5)
        
        cmdQueue.append('s')
        await asyncio.sleep(0.5)
        for i in range(random.randint(1,30)):
            cmdQueue.append('0');
            await asyncio.sleep(0.5)
        
        cmdQueue.append('d')
        await asyncio.sleep(0.5)
        for i in range(random.randint(1,30)):
            cmdQueue.append('0');
            await asyncio.sleep(0.5)
        
# Main server function
async def main():
    async with websockets.serve(handler, "", 8080):  # Start WebSocket server
        print("WebSocket server running on ws://0.0.0.0:8080")

        # Start broadcasting task
        broadcast_task = asyncio.create_task(broadcast_messages())
        
        # Start poll task
        # poll_task = asyncio.create_task(poll_user())
        auto_task = asyncio.create_task(auto_move())
        # Keep the server running indefinitely
        await asyncio.get_running_loop().create_future()

# Run the server
if __name__ == "__main__":
    asyncio.run(main())

