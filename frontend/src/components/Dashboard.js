import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Routes, Route, LINK, Navigate } from 'react-router-dom'


const Dashboard = () => {  

    const defaultAccount = useSelector((state) => state.defaultAccount)

    const [localDefaultAccount, setLocalDefaultAccount] = useState(null)
    
    /*
    useEffect(() => {
        
        if(!defaultAccount) {
            setLocalDefaultAccount(defaultAccount)
        }

    },[])
    
    */

  return (

    <>
        {
            //!defaultAccount ? !localDefaultAccount ? <Navigate to="/"/> : <div>Welcome to your dashboard</div> : <div>Welcome to your dashboard2</div>
            (!defaultAccount ? <Navigate to="/"/> : <div>Welcome to your dashboard!</div>)
        }
    </>
    
  )
}

export default Dashboard