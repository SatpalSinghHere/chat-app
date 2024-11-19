import { Redis } from "ioredis";
import 'dotenv/config'
import { Server } from "socket.io";

// const pub = new Redis('rediss://default:AXMoAAIjcDE2MDllNTk4OWViODU0NTBjYTQ3ZGY5MTNlNWE4OGZiNHAxMA@fancy-ghost-29480.upstash.io:6379')
const pub = new Redis({
    port: 6379, // Redis port
    host: "fancy-ghost-29480.upstash.io", // Redis host
    // username: "default", // needs Redis >= 6
    password: 'AXMoAAIjcDE2MDllNTk4OWViODU0NTBjYTQ3ZGY5MTNlNWE4OGZiNHAxMA',
    maxRetriesPerRequest : 50,
    tls: {
        // requestCert: false,
        rejectUnauthorized: false
    },
    keepAlive: 1000,
    lazyConnect: true
    
  })
const sub = new Redis({
    port: 6379, // Redis port
    host: "fancy-ghost-29480.upstash.io", // Redis host
    // username: "default", // needs Redis >= 6
    password: 'AXMoAAIjcDE2MDllNTk4OWViODU0NTBjYTQ3ZGY5MTNlNWE4OGZiNHAxMA',
    maxRetriesPerRequest : 50,
    tls: {
        // requestCert: false,
        rejectUnauthorized: false
    },
    keepAlive: 1000,
    lazyConnect: true
    
  })

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
        sub.subscribe("MESSAGES")
    }

    public initListeners (){
        const io = this._io
        console.log("Init Socket listeners...")
        io.on('connect', (socket)=> {
            console.log('new socket connected ', socket.id)

            socket.on("event:message", async({message}:{message: string})=>{
                console.log("New message received: ", message)
                await pub.publish('MESSAGES', JSON.stringify({message}))
            })
        })

        sub.on('message', (channel, message)=>{
            if(channel === 'MESSAGES'){
                io.emit("message", message)
            }
        })
    }

    get io(): Server{
        return this._io
    }
}

export default SocketService