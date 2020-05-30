import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Button, Accordion, Card } from 'react-bootstrap';
import { Link, withRouter } from 'react-router-dom';
import _ from 'lodash';

function SidebarDashboard(props) {
    const [ sidebarMenu] = useState([ 'car', 'rentItem', 'rentList', /*sidebar-menu*/ ])
    const [ activeKey, setActiveKey ] = useState(0);
    const role = _.get(props, 'user.role');
    const pathname = _.get(props, 'location.pathname');

    return (
        <>
            <Accordion defaultActiveKey="0">
                <Card>
                    <Card.Header>
                    <Accordion.Toggle onClick={(e) => setActiveKey(0)} as={Button} block variant="light" eventKey="0">
                        <p style={{ margin:'0px', textAlign:'left', padding:'0px 15px', letterSpacing:'1px' }}>
                            {
                                activeKey === 0 ?
                                    <i style={{ position: 'relative', right: 5 }} className="fas fa-angle-up"></i>
                                :
                                    <i style={{ position: 'relative', right: 5 }} className="fas fa-angle-down"></i>
                            }
                            <b> Data </b>
                        </p>
                    </Accordion.Toggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey="0">
                    <Card.Body>
                        <div className='d-flex justify-content-center' style={{ textAlign:'center', paddingTop:'10px', width:'100%', paddingLeft:'15px', paddingRight:'5px' }}>
                            <Link to={`/dashboard/users`} style={{ width:'100%' }}> <Button style={{ width:'100%' }} variant={pathname === '/dashboard/users' ? 'primary' : 'light'} className='shadow-sm'> Users </Button> </Link>
                        </div>
                        <div className='d-flex justify-content-center' style={{ textAlign:'center', paddingTop:'10px', width:'100%', paddingLeft:'15px', paddingRight:'5px' }}>
                            <Link to={`/dashboard/car`} style={{ width:'100%' }}> <Button style={{ width:'100%' }} variant={pathname === '/dashboard/car' ? 'primary' : 'light'} className='shadow-sm'> Cars </Button> </Link>
                        </div>
                        <div className='d-flex justify-content-center' style={{ textAlign:'center', paddingTop:'10px', width:'100%', paddingLeft:'15px', paddingRight:'5px' }}>
                            <Link to={`/dashboard/car-list`} style={{ width:'100%' }}> <Button style={{ width:'100%' }} variant={pathname === '/dashboard/car-list' ? 'primary' : 'light'} className='shadow-sm'> Car Rental List </Button> </Link>
                        </div>
                        <div className='d-flex justify-content-center' style={{ textAlign:'center', paddingTop:'10px', width:'100%', paddingLeft:'15px', paddingRight:'5px' }}>
                            <Link to={`/dashboard/customers`} style={{ width:'100%' }}> <Button style={{ width:'100%' }} variant={pathname === '/dashboard/customers' ? 'primary' : 'light'} className='shadow-sm'> Customers </Button> </Link>
                        </div>
                    </Card.Body>
                    </Accordion.Collapse>
                </Card>
                <Card>
                    <Card.Header>
                    <Accordion.Toggle onClick={() => setActiveKey(1)} as={Button} block variant="light" eventKey="1">
                        <p style={{ margin:'0px', textAlign:'left', padding:'0px 15px', letterSpacing:'1px' }}>
                            {
                                activeKey === 1 ?
                                    <i style={{ position: 'relative', right: 5 }} className="fas fa-angle-up"></i>
                                :
                                    <i style={{ position: 'relative', right: 5 }} className="fas fa-angle-down"></i>
                            }
                            <b> Admin Data </b>
                        </p>
                    </Accordion.Toggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey="1">
                    <Card.Body>
                        {
                            (role === 'admin' || role === 'dataAdmin') ?
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
                                </> :
                                <span>Unauthorized user to access</span>
                        }
                    </Card.Body>
                    </Accordion.Collapse>
                </Card>
            </Accordion>
        </>
    );
}

const mapStateToProps = ({ user }) => ({
    user
});

const mapDispatchToProps = {

};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SidebarDashboard));
