import asyncio
from websockets.asyncio.server import serve

async def handler(websocket):
    while True:
        tx_data = input("Enter data to send: ")
        print("Sending: ", tx_data)
        await websocket.send(tx_data)

async def main():
    async with serve(handler, "", 8080):
        await asyncio.get_running_loop().create_future()  # run forever

if __name__ == "__main__":
    asyncio.run(main()) 
