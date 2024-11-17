import { Server } from "socket.io";

class SocketService {
    private _io: Server
    constructor(){
        console.log("Init Socket Service ...")
        this._io = new Server({
            cors: {
                origin: '*',
                allowedHeaders: ['*']
            }
        })
    }

    public initListeners (){
        const io = this._io
        console.log("Init Socket listeners...")
        io.on('connect', (socket)=> {
            console.log('new socket connected ', socket.id)

            socket.on("event:message", async({message}:{message: string})=>{
                console.log("New message received: ", message)
            })
        })
    }

    get io(): Server{
        return this._io
    }
}

export default SocketService