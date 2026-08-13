import axios from 'axios'
import React from 'react'

async function emitEventHandler( event:string, data:any, socketId?:string,) {
 try {
    const result = await axios.post(`${process.env.NEXT_PUBLIC_SOCKET_SEVER}/notify`, 
        {socketId,event,data}
    )
    console.log(result)
 } catch (error) {
       console.log(error)
 }
}

export default emitEventHandler