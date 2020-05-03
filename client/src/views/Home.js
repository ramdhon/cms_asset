import React, { useEffect } from 'react'
import { connect } from 'react-redux';

import Navbar from '../components/NavbarHeader';
import HomePage from '../components/Homepage';

function Home(props) {
    useEffect(() => {
        if(props.user){
            props.history.push('/dashboard')
        }
    // eslint-disable-next-line
    }, [props.user])

    return (
        <>
            <Navbar />
            <div className='d-flex justify-content-center align-items-center' style={{ height:'90vh' }}>
                <HomePage />
            </div>
        </>
    )
}

const mapStateToProps = ({ user }) => ({
    user
});

const mapDispatchToProps = {

};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
