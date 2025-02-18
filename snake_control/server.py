import asyncio
from websockets.asyncio.server import serve
from websockets.exceptions import ConnectionClosedOK
import json

connected_clients = set()
boxSize = 10

class socketData:
    def __init__(self):
        self.body = [[0,0], [0,0], [0,0], [0,0]]
        self.direction = "UP"
        self.lock = asyncio.Lock()

    async def move(self, direction):
        async with self.lock:   # aquire the lock
            if(direction == "UP"): self.direction = "UP"
            elif(direction == "DOWN"): self.direction = "DOWN"
            elif(direction == "LEFT"): self.direction = "LEFT"
            elif(direction == "RIGHT"): self.direction = "RIGHT"
            elif(direction == "FORWARD"):
                head = self.body[0]
                match self.direction:
                    case "UP": head[1] -= boxSize    
                    case "DOWN": head[1] += boxSize    
                    case "LEFT": head[0] -= boxSize    
                    case "RIGHT": head[0] += boxSize    
                self.body.insert(0, head)
                self.body.pop()
            else:
                print("Wrong input, must be: 'UP', 'DOWN', 'LEFT', 'RIGHT', 'FORWARD'")

    async def get_data(self):
        async with self.lock():
            ret_data = {
                "segments": self.body,
                "direction": self.direction
            }
        return json.dumps(ret_data)

dataStream = socketData()

async def pull_data():
    while True:
        movement = await input("Enter movement: ")
        await dataStream.move(movement)

async def tx_data(websocket):
    while True:
        await websocket.send(str(await dataStream.get_data()))

async def handler(websocket):
    connected_clients.add(websocket)
    
    while True:
        try:
            print("New client: ", websocket)
            await tx_data(websocket)
        except ConnectionClosedOK:
            connected_clients.remove(websocket)
            break

async def main():
    async with serve(handler, "", 8080):
        pull_task = asyncio.create_task(pull_data())

        await asyncio.get_running_loop().create_future()  # run forever

if __name__ == "__main__":
    asyncio.run(main()) 
