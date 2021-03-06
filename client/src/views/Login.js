import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Container, Button, Form, Row, Col} from 'react-bootstrap';

import axios from '../api/database';
import { Link } from 'react-router-dom';
import Toast from '../components/ToastComponent';
import { setUser } from '../store/actions';

const styles= {
    headerForm : {
        paddingRight:'20px', paddingBottom: '20px', paddingTop:'20px', textAlign:'center'
    },
    fontHeader: {
        fontWeight:'200', letterSpacing:'2px'
    },
    formGroup: {
        backgroundColor:'white', borderRadius:'15px', padding:'40px'
    }
}

function Login(props) {

    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')

    const [ text, setText ] = useState('')
    const [ status, setStatus ] = useState(false)
    const [ showToast, setShowToast ] = useState(false) 

    function submitLogin(e){
        e.preventDefault()
        
        axios.post('/login', { email, password })
        .then(({ data }) => {
            localStorage.setItem('token', data.token)
            setText('Login Success')
            setStatus(true)
            setShowToast(true)
            setTimeout(function(){
                props.setUser({
                    name: data.user.name,
                    role: data.user.role
                })
            }, 1500)
        })
        .catch(err => {
            setText(err.response.data.message)
            setStatus(false)
            setShowToast(true)
        })
    }

    return (
        <>
        <Toast text={text} status={ status } show={ showToast} set={ setShowToast }/>
        <Container style={{ marginTop:'5%' }}>
            <Row className='justify-content-center'>
                <Col lg={6}>
                    <div  style={ styles.headerForm }>
                    <Link to='/'><h3 style={ styles.fontHeader }> Trans-Pacific <b>LOGIN</b> </h3></Link>
                    </div>
                </Col>
            </Row>
            <Row className='justify-content-center'>
                <Col lg={6}>
                    <div className='border shadow-sm' style={styles.formGroup}>
                        <Form onSubmit={ submitLogin }>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control required type="email" placeholder="Enter email" value={ email } onChange={(e) => setEmail(e.target.value)}/>
                                <Form.Text className="text-muted" >
                                    We'll never share your email with anyone else.
                                </Form.Text>
                            </Form.Group>
                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control required type="password" placeholder="Password" value={ password } onChange={(e) => setPassword(e.target.value)}/>
                            </Form.Group>
                            
                            <Row>
                                <Col lg={4}>
                                    <Button block variant="primary" type="submit" className='shadow-sm'>
                                        Login
                                    </Button>
                                </Col>
                                <Col lg={2} style={{ padding:0 }}>
                                    <Link to='/'>
                                        <Button block variant='secondary'> <i className="fas fa-home"></i> </Button>
                                    </Link>
                                </Col>
                                <Col lg={5} className='d-flex justify-content-center align-items-center'>
                                    <Link to='/register'> 
                                        <Form.Text className="text-muted" >
                                            don't have an account ?
                                        </Form.Text>
                                    </Link>
                                </Col>
                            </Row>
                            
                        </Form>
                        
                    </div>
                </Col>
            </Row>
        </Container>
        </>
    )
}

const mapStateToProps = ({ user }) => ({
    user
});

const mapDispatchToProps = {
    setUser
};

export default connect(mapStateToProps, mapDispatchToProps)(Login)
