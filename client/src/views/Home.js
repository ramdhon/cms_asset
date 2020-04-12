import React, { useEffect } from 'react'
import Navbar from '../components/NavbarHeader';
import HomePage from '../components/Homepage';

export default function Home(props) {
    useEffect(() => {
        if(props.auth.user){
            props.history.push('/dashboard')
        }
    // eslint-disable-next-line
    }, [props.auth.user])

    return (
        <>
            <Navbar />
            <div className='d-flex justify-content-center align-items-center' style={{ height:'90vh' }}>
                <HomePage />
            </div>
        </>
    )
}
