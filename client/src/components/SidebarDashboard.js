import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import _ from 'lodash';

function SidebarDashboard(props) {
    const [ sidebarMenu] = useState([ 'car', 'rentItem', 'rentList', /*sidebar-menu*/ ])
    const role = _.get(props, 'user.role');

    return (
        <>
            <div style={{ marginTop:'10px' }}>
                <p style={{ margin:'0px', textAlign:'left', padding:'0px 15px', letterSpacing:'1px' }}> <b> Data </b> </p>
            </div>

            <div className='d-flex justify-content-center' style={{ textAlign:'center', paddingTop:'10px', width:'100%', paddingLeft:'15px', paddingRight:'5px' }}>
                <Link to={`/dashboard/users`} style={{ width:'100%' }}> <Button style={{ width:'100%' }} variant="light" className='shadow-sm'> Users </Button> </Link>
            </div>
            <div className='d-flex justify-content-center' style={{ textAlign:'center', paddingTop:'10px', width:'100%', paddingLeft:'15px', paddingRight:'5px' }}>
                <Link to={`/dashboard/car`} style={{ width:'100%' }}> <Button style={{ width:'100%' }} variant="light" className='shadow-sm'> Cars </Button> </Link>
            </div>
            <div className='d-flex justify-content-center' style={{ textAlign:'center', paddingTop:'10px', width:'100%', paddingLeft:'15px', paddingRight:'5px' }}>
                <Link to={`/dashboard/car-list`} style={{ width:'100%' }}> <Button style={{ width:'100%' }} variant="light" className='shadow-sm'> Car Rental List </Button> </Link>
            </div>
            <div className='d-flex justify-content-center' style={{ textAlign:'center', paddingTop:'10px', width:'100%', paddingLeft:'15px', paddingRight:'5px' }}>
                <Link to={`/dashboard/customers`} style={{ width:'100%' }}> <Button style={{ width:'100%' }} variant="light" className='shadow-sm'> Customers </Button> </Link>
            </div>

            {
                (role === 'admin' || role === 'dataAdmin') &&
                <>
                    <div style={{ marginTop:'10px' }}>
                        <p style={{ margin:'0px', textAlign:'left', padding:'0px 15px', letterSpacing:'1px' }}> <b> all models (admin) </b> </p>
                    </div>
                
                    { 
                        sidebarMenu.map((menu, index) => {
                            return <div key={index} className='d-flex justify-content-center' style={{ textAlign:'center', paddingTop:'10px', width:'100%', paddingLeft:'15px', paddingRight:'5px' }}>
                                <Link to={`/dashboard/${ menu.toLowerCase() }`} style={{ width:'100%' }}> <Button style={{ width:'100%' }} variant="light" className='shadow-sm'> { menu } </Button> </Link>
                            </div>
                        })
                     }
                    
                    <div style={{ marginTop:'10px' }}>
                        <p style={{ margin:'0px', textAlign:'left', padding:'0px 15px', letterSpacing:'1px' }}> <b> all models detail (admin) </b> </p>
                    </div>
        
                    { 
                        sidebarMenu.map((model, index) => {
                            return <div key={index} className='d-flex justify-content-center' style={{ textAlign:'center', paddingTop:'10px', width:'100%', paddingLeft:'15px', paddingRight:'5px' }}>
                                <Link to={`/dashboard/${model.toLowerCase()}-detail`} style={{ width:'100%' }}> <Button style={{ width:'100%' }} variant="light" className='shadow-sm'> { model } Detail </Button> </Link>
                            </div>
                        })
                    }
                </>
            }

        </>
    );
}

const mapStateToProps = ({ user }) => ({
    user
});

const mapDispatchToProps = {

};

export default connect(mapStateToProps, mapDispatchToProps)(SidebarDashboard);
