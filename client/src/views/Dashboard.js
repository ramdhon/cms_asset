import React from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col } from 'react-bootstrap';

import NavbarDashboard from '../components/NavbarDashboard';
import SidebarDashboard from '../components/SidebarDashboard';
import { Route } from 'react-router-dom';
import DashboardContent from '../components/DashBoardContent';
import DashboardHome from '../components/DashboardHome';
import { setSidebarOn } from '../store/actions';

function Dashboard(props) {
    const { sidebarOn } = props;

    return (
        <>
            <NavbarDashboard {...props} className='fixed-top'/>
            <Container fluid style={{ position:'absolute', height:'95vh' }}>
                <Row style={{ height:'100%' }}>
                    {
                        sidebarOn &&
                            <Col lg={2} style={{ height:'100%', textAlign:'center',padding:'0px', backgroundColor:'#ededed', overflow:'scroll' }} className='shadow-sm'>
                                <SidebarDashboard {...props}/>
                            </Col>
                    }
                    <Col lg={sidebarOn ? 10 : 12}  style={{ overflow:'scroll'}}>
                        <Container fluid style={{ height:'95vh' }}>
                            {  props.history.location.pathname === '/dashboard' ? <DashboardHome /> : 
                                <Route path='/dashboard/:id' component={ DashboardContent }/>
                            }
                        </Container>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

const mapStateToProps = ({ sidebarOn }) => ({
    sidebarOn
})

const mapDispatchToProps = {
    setSidebarOn
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
