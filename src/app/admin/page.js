"use client"

import {useState} from 'react';

import AdminPage from './AdminPage.js'
import Login from './login.js';

export default function Admin({}){

    const [logged, setLogged] = useState(false);

    if(logged){
        return (
            <AdminPage />
        )
    }

    return (
        <Login setLogged={setLogged}/>
    )
}

