import React from 'react';
import { Navbar, Nav, Button, Row, Col, Container, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Swal from 'sweetalert2';

import { setUser, setSidebarOn } from '../store/actions';

function NavbarHeader(props) {
    const { sidebarOn, setSidebarOn } = props;

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
                props.setUser(null);
                props.history.push('/')
            }
        })
    }

    function handleSideBar(e) {
        setSidebarOn(!sidebarOn);
    }
    return (
        <>
            <Container fluid>
                <Row className='shadow-sm'>
                    {
                        sidebarOn &&
                            <Col lg={2} style={{ textAlign:'center', background:'#ff2323' }} className='d-flex align-items-center justify-content-center'>
                                <div className="LogoDashboard"> <Link to="/dashboard"><h4 style={{  color:'white', verticalAlign:'center', fontWeight:'200', letterSpacing:'2px'}}><b>Trans</b>-Pacific</h4> </Link></div>
                            </Col>
                    }
                    <Col lg={sidebarOn ? 10 : 12}>
                        <Navbar>
                            <OverlayTrigger
                                placement="right"
                                delay={{ show: 250, hide: 0 }}
                                overlay={(props) => (
                                    <Tooltip {...props}>
                                        {
                                            sidebarOn ?
                                                'Close Menu'
                                            :
                                                'Open Menu'
                                        }
                                    </Tooltip>
                                )}
                            >
                                <Button onClick={handleSideBar} variant='light'>
                                    {
                                        sidebarOn ?
                                            <i className="fas fa-angle-left"></i>
                                        :
                                            <i className="fas fa-bars"></i>
                                    }
                                </Button>
                            </OverlayTrigger>
                            <Nav className='d-flex align-items-center'>
                                <h5> <b> Welcome, </b> { props.user ? props.user.name : null } </h5>
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

const mapStateToProps = ({ user, sidebarOn }) => ({
    user,
    sidebarOn
});

const mapDispatchToProps = {
    setUser,
    setSidebarOn
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(NavbarHeader));
