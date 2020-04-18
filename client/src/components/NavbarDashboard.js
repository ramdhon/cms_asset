import React from 'react';
import { Navbar, Nav, Button, Row, Col, Container } from 'react-bootstrap';
import { Link, withRouter } from 'react-router-dom';

function NavbarHeader(props) {
    const [sideBarOn, setSideBarOn] = props.sideBarCall;

    function logout(e){
        e.preventDefault()
        localStorage.clear()
        props.auth.setUser(null);
        props.history.push('/')
    }

    function handleSideBar(e) {
        setSideBarOn(!sideBarOn);
    }
    return (
        <>
            <Container fluid>
                <Row className='shadow-sm'>
                    {
                        sideBarOn &&
                            <Col lg={2} style={{ textAlign:'center', background:'#00b894' }} className='d-flex align-items-center justify-content-center'>
                                <div className="LogoDashboard"> <Link to="/dashboard"><h4 style={{  color:'white', verticalAlign:'center', fontWeight:'200', letterSpacing:'2px'}}><b>Trans</b>-Pacific</h4> </Link></div>
                            </Col>
                    }
                    <Col lg={sideBarOn ? 10 : 12}>
                        <Navbar>
                            <Button onClick={handleSideBar} variant='light'> <i className="fas fa-bars"></i> </Button>
                            <Nav className='d-flex align-items-center'>
                                <h5> <b> Welcome, </b> { props.auth.user ? props.auth.user.name : null } </h5>
                            </Nav>
                            <Navbar.Toggle aria-controls="basic-navbar-nav" />
                            <Navbar.Collapse id="basic-navbar-nav">
                                <Nav className="ml-auto">
                                    <Button variant="light" className='mr-2' onClick={ logout }>LOGOUT</Button>
                                </Nav>
                            </Navbar.Collapse>
                        </Navbar>
                    </Col>
                </Row>
            </Container>
        </>
    );
}
export default  withRouter(NavbarHeader)