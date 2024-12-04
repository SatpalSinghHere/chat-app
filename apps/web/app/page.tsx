'use client'
import { useState } from 'react'
import { useSocket } from '../context/SocketProvider'
import classes from './page.module.css'


export default function Page() {
  const { sendMessage } = useSocket()
  const [message, setMessage] = useState('')

  return (
    <div>
      <div className='bg-bgImage fixed w-[120%] h-[120%] blur-xl -top-10 -left-10 flex items-center justify-center'></div>
      
      
        <div className='opacity-100 relative'>
          <div>
            <h2>All messages will appear here :</h2>
          </div>
          <div className='opacity-100'>
            <input onChange={e => setMessage(e.target.value)} className={classes['chat-input']} type="text" />
            <button onClick={e => sendMessage(message)} className={classes['send-button']}>Send</button>
          </div>
        </div>
      
    </div>
  )
}