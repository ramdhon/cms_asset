import React from 'react';
import { Navbar, Nav, Button, Row, Col, Container, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link, withRouter } from 'react-router-dom';
import Swal from "sweetalert2";

function NavbarHeader(props) {
    const [sideBarOn, setSideBarOn] = props.sideBarCall;

    function logout(e){
        e.preventDefault()
        Swal.fire({
            title: 'Logout?',
            text: "Are you sure to log out?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.value) {
                localStorage.clear()
                props.auth.setUser(null);
                props.history.push('/')
            }
        })
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
                            <OverlayTrigger
                                placement="right"
                                delay={{ show: 250, hide: 0 }}
                                overlay={(props) => (
                                    <Tooltip {...props}>
                                        {
                                            sideBarOn ?
                                                'Close Menu'
                                            :
                                                'Open Menu'
                                        }
                                    </Tooltip>
                                )}
                            >
                                <Button onClick={handleSideBar} variant='light'>
                                    {
                                        sideBarOn ?
                                            <i className="fas fa-angle-left"></i>
                                        :
                                            <i className="fas fa-bars"></i>
                                    }
                                </Button>
                            </OverlayTrigger>
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