import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Row, Col, Modal, Form, Spinner } from 'react-bootstrap';
import Swal from 'sweetalert2';

import RowTable from './RowTableModelUser';
import axios from '../api/database';
import Toast from './ToastComponent';
import { server } from '../api/database';
import ImageModal from './ImageModal'

function User (props) {

    const [ decode, setDecode ] = useState({});
    const [ showModal, setShowModal ] = useState(false)
    const [ showModalPass, setShowModalPass ] = useState(false)
    const [ rowTable, setRowTable ] = useState([])
    const stateType ={"name":"string","email":"string","password":"string","role":"string","department":"string"}
    const [ search, setSearch ] = useState('')
    const [ name, setName] = useState('') 
    const [ email, setEmail] = useState('') 
    const [ password, setPassword] = useState('') 
    const [ role, setRole] = useState('') 
    const [ department, setDepartment] = useState('') 
    
    const [ confirmPassword, setConfirmPassword] = useState('') 

    const [ modalImage, setModalImage ] = useState(false)
    const [ imageLink, setImageLink ] = useState('')
    
    const [ id , setId ] = useState('')
    const [ loading, setLoading ] = useState(false)

    const funcLoop = [setName,setEmail,setPassword,setRole,setDepartment,setConfirmPassword] 

    const stateObj = { name,email,password,role,department,confirmPassword } 


    //toast
    const [ textToast, setTextToast ] = useState('')
    const [ statusToast, setStatusToast ] = useState(false)
    const [ showToast, setShowToast ] = useState(false) 

   function submitForm(e){
        e.preventDefault()
       
        if(id){
            axios.patch(`/admin/users/${id}`, stateObj  ,{ headers:{ token:localStorage.getItem('token')}})
            .then(({data}) => {
                let tempTable = rowTable.map((el,index) => {
                    if(el._id === data.updatedUser._id){
                        if (decode._id === data.updatedUser._id && data.updatedUser.role !== el.role && data.updatedUser.email !== el.email ) {
                            localStorage.clear()
                            props.history.push('/')
                        }
                        el = data.updatedUser
                    }
                    return el;
                })
                setRowTable(tempTable)
                setTextToast('data updated')
                setStatusToast(true)
                setShowToast(true)
            })
            .catch(err =>{
                setTextToast(err.response.data.message)
                setStatusToast(false)
                setShowToast(true)
            })
        } else {
            axios.post('/admin/users', stateObj, { headers: { token:localStorage.getItem('token')}})
            .then(({data}) => {
                setRowTable([...rowTable, data.newUser])
                setTextToast('success add')
                setStatusToast(true)
                setShowToast(true)
            })
            .catch(err => {
                setTextToast(err.response.data.message)
                setStatusToast(false)
                setShowToast(true)
            })    
        }
        handleClose()
    }

    function resetPassword(e) {
        e.preventDefault()

        if (password === confirmPassword) {
            axios.patch(`/admin/users/${id}/resetPassword`, { password }  ,{ headers:{ token:localStorage.getItem('token')}})
                .then(({data}) => {
                    let tempTable = rowTable.map((el,index) => {
                        if(el._id === data.updatedUser._id){
                            el = data.updatedUser
                        }
                        return el;
                    })
                    setRowTable(tempTable)
                    setTextToast('password successfully reset')
                    setStatusToast(true)
                    setShowToast(true)
                    if (decode._id === data.updatedUser._id) {
                        localStorage.clear()
                        props.history.push('/')
                    }
                })
                .catch(err =>{
                    setTextToast(err.response.data.message)
                    setStatusToast(false)
                    setShowToast(true)
                })
        } else {
            setTextToast('your password is not matched!')
            setStatusToast(false)
            setShowToast(true)
        }
        handleClose()
    }

    function deleteData(id){
        Swal.fire({
            title: 'Delete data?',
            text: "You are about to delete selected data, are you sure?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.value) {
                axios.delete(`/admin/users/${id}`, { headers: { token:localStorage.getItem('token')}})
                    .then(({data}) => {
                        let tempTable = rowTable.filter((el,index) => {
                            return el._id !== id
                        })
                        setRowTable(tempTable)
                        setTextToast('delete success')
                        setStatusToast(true)
                        setShowToast(true)
                    })
                    .catch(err => {
                        setTextToast(err.response.data.message)
                        setStatusToast(false)
                        setShowToast(true)
                    })
            }
        });
    }

    function handleClose() {
        setShowModal(false);
        setShowModalPass(false);
        let tempKey = Object.keys(stateType)
        funcLoop.forEach((func,index) => {
            if(''+stateType[tempKey[index]] === 'boolean'){
                func(false)
            } else if (''+stateType[tempKey[index]] === 'number'){
                func(0)
            } else {
                func('')
            }
        })
        setId('')
    }
    
    function editData(rowData){
        Object.keys(stateObj).forEach((el, index) => {
            funcLoop[index](rowData[el])
        })
        setId(rowData._id)
        handleShow()
    }

    function handleShowPass(id) {
        Swal.fire({
            title: 'Reset Password?',
            text: "You are about to reset password, are you sure?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.value) {
                setId(id);
                setShowModalPass(true);
            }
        });
    }

    function handleShow() {
        setShowModal(true);
    }
    
    function submitSearch(e){
        e.preventDefault()
        axios.get(`/admin/users/?search=${search}`, { headers:{ token:localStorage.getItem('token')}})
        .then(({ data }) =>{
            setRowTable(data.users ? [...data.users] : [])
        })
        .catch(err => {
            setTextToast(err.response.data.message)
            setStatusToast(false)
            setShowToast(true)
        })
    }

     //function-upload-image
    function uploadImage(e, functionSetImage){
        e.preventDefault()
        let formData = new FormData();
        formData.append('file', e.target.files[0]);
        console.log(e.target.files[0])
        axios.post('/upload', formData, { headers: {token:localStorage.getItem('token')}})
        .then(({data}) =>{
            functionSetImage(data.image)
        })
        .catch(err => {
            console.log(err)
        })

    }

    function fetchData(){
        setLoading(true)
        axios.get('/admin/users', { headers: { token: localStorage.getItem('token')}})
        .then(({data}) => {
            if(data.users){
                setRowTable(data.users)
            }
        })
        .catch(err =>{
            setTextToast(err.response.data.message)
            setStatusToast(false)
            setShowToast(true)
        })
        .finally(() => {
            setLoading(false)
        })
    }

    useEffect(() => {
        if(!search){
            fetchData()
        }
    }, [search])

    useEffect(() => {
        fetchData()
        axios.get('/user/decode', { headers: { token:localStorage.getItem('token')}})
            .then(({data}) => {
                setDecode(data.decoded)
            })
            .catch(err=> {
                console.log(err)
            })
    }, [])

    return (
        <>
            <Toast text={textToast} status={ statusToast } show={ showToast} set={ setShowToast }/>
            { loading ?
                <div className='d-flex justify-content-center align-items-center'>
                    <Spinner animation="border" role="status">
                        <span className="sr-only">Loading...</span>
                    </Spinner>
                </div>
                :    
                <Container fluid>
                    <div style={{ padding:'30px' }}>
                        <Row>
                            <Col>
                                <h3> <span style={{ color:'grey' }}>#</span> User </h3>
                            </Col>
                            <Col className='d-flex justify-content-end'>
                                <Button variant='outline-primary' onClick={ handleShow }> <i className="fas fa-plus"></i> Add New </Button>
                            </Col>
                        </Row>

                        <Form className='ml-3' onSubmit={ submitSearch }>
                            <Row className='mt-3'>
                                <Col lg={3} style={{ padding:0 }}>
                                    <Form.Group className='shadow-sm'>
                                        <Form.Control type="text" placeholder="Search..." onChange={(e) => setSearch(e.target.value)}/>
                                    </Form.Group>
                                </Col>
                                <Col lg={1}>
                                    <Form.Group>
                                        <Button type='submit' className='shadow-sm'><i className="fas fa-search"></i></Button>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Form>
                
                        <div className='shadow-sm mt-3' style={{ overflowX: 'scroll' }}>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        { ['ID',...Object.keys(stateType), 'LoggedInAt', 'CreatedAt', 'UpdatedAt', 'Actions'].map((el, index) =>{
                                            return <th key={ index }> {el} </th>
                                        })}
                                    </tr>
                                </thead>
                                <tbody>
                                    { rowTable.map( (row, index) => {
                                        return <RowTable 
                                        value={ row } 
                                        imageLink={setImageLink} 
                                        index={index} 
                                        key={ index } 
                                        showImage={(e) => setModalImage(e)}//setModalImage} 
                                        key_model={ Object.keys(stateType) } 
                                        edit={ editData } 
                                        delete={ deleteData }
                                        handleShowPass={ handleShowPass }
                                        type={ stateType }
                                        decode={ decode }
                                        />
                                    }) }
                                </tbody>
                            </Table>
                            {
                                !rowTable.length &&
                                <Row>
                                    <Col className='d-flex justify-content-center'>
                                        <h3> No Data </h3>
                                    </Col>
                                </Row>
                            }
                        </div>
                    </div>
                </Container>
        }

        <ImageModal  show={ modalImage } onHide={ setModalImage } title={ imageLink }/>

        <Modal show={showModal} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Add User </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Form onSubmit={ submitForm }>
                { Object.keys(stateObj).map((el, index) => {
                    if ( stateType[el] === 'boolean') {
                        return (<Form.Group key={ index }>
                        <Form.Label>{`Enter ${ el }`}</Form.Label>
                            <Form.Control required as="select" onChange={ e => funcLoop[index]( e.target.value)} value={ stateObj[el]} >
                                <option value='true'>true</option>
                                <option value='false'>false</option>
                            </Form.Control> 
                        </Form.Group>)
                    } else if(stateType[el] === 'text'){
                        return ( 
                            <Form.Group key={ index } >
                                <Form.Label>Enter {el}</Form.Label>
                                <Form.Control as="textarea" rows="3" onChange={ e => funcLoop[index]( e.target.value)} value={ stateObj[el]}/>
                            </Form.Group>
                        )
                    } else if(  stateType[el] === 'image' ){
                        return (
                            <div key={ index } className='shadow-sm p-2 border'>
                                <div style={{ overflow:'hidden', width:'100%', height:'200px', backgroundColor:'#dedede' }} className='mb-2'>
                                    <img width='100%' alt={`image_${index}`} src={ stateObj[el] ? `${server}/uploads/${stateObj[el]}` : null} />
                                </div>
                                <Form.Label>Attach {el}</Form.Label>
                                <input type='file' onChange={ (e) => uploadImage(e, funcLoop[index])} className='mb-2 border p-1' style={{ width:'100%' }}/>
                                <br />
                                <Button size='sm' variant='danger' onClick={ (e) =>{ funcLoop[index]('') }}> remove image </Button>
                            </div>
                        )
                    } else if( stateType[el] === 'number' ){
                        return (
                            <Form.Group key={ index } className='mt-2'>
                                <Form.Label>Enter {el}</Form.Label>
                                <Form.Control required type="number" placeholder={`Enter ${ el }`} onChange={ e => funcLoop[index]( e.target.value)} value={ stateObj[el] }/>
                            </Form.Group> )
                    }
                    else if ( !id || el !== 'password' ){
                        if ( el === 'role' ) {
                            return (
                                <Form.Group key={ index } className='mt-2'>
                                    <Form.Label>Enter {el}</Form.Label>
                                    <Form.Control as="select" placeholder={`Enter ${ el }`} onChange={ e => funcLoop[index]( e.target.value)} value={ stateObj[el] }>
                                        <option value="">Select one</option>
                                        <option value="user">user</option>
                                        <option value="dataAdmin">dataAdmin</option>
                                        <option value="admin">admin</option>
                                    </Form.Control>
                                </Form.Group>
                            )
                        } else if ( el === 'department' ) {
                            return (
                                <Form.Group key={ index } className='mt-2'>
                                    <Form.Label>Enter {el}</Form.Label>
                                    <Form.Control as="select" placeholder={`Enter ${ el }`} onChange={ e => funcLoop[index]( e.target.value)} value={ stateObj[el] }>
                                        <option value="">Select one</option>
                                        <option value="owner">Owner</option>
                                        <option value="marketingBusiness">Marketing and Business</option>
                                        <option value="finance">Finance</option>
                                        <option value="hrd">HRD</option>
                                        <option value="it">IT</option>
                                        <option value="operational">Operational</option>
                                    </Form.Control>
                                </Form.Group>
                            )
                        } else {
                            return (
                                <Form.Group key={ index } className='mt-2'>
                                    <Form.Label>Enter {el}</Form.Label>
                                    <Form.Control type="text" placeholder={`Enter ${ el }`} onChange={ e => funcLoop[index]( e.target.value)} value={ stateObj[el] }/>
                                </Form.Group>
                            )
                        }
                    }
                    else {
                        return null
                    }
                    }) 
                }
                <Row className='mt-5'>
                    <Col className='d-flex justify-content-end'>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" type='submit' className='ml-2'>
                            Save Changes
                        </Button>
                    </Col>
                </Row>
                </Form>   
            </Modal.Body>
        </Modal>  

        <Modal show={showModalPass} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Reset Password</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Form onSubmit={ resetPassword }>
                <Form.Group className='mt-2'>
                    <Form.Label>New password</Form.Label>
                    <Form.Control type="text" placeholder={`Enter password`} onChange={ e => setPassword( e.target.value)} value={ password }/>
                </Form.Group>
                <Form.Group className='mt-2'>
                    <Form.Label>Confirm password</Form.Label>
                    <Form.Control type="text" placeholder={`Confirm password`} onChange={ e => setConfirmPassword( e.target.value)} value={ confirmPassword }/>
                </Form.Group>
                <Row className='mt-5'>
                    <Col className='d-flex justify-content-end'>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" type='submit' className='ml-2'>
                            Save Changes
                        </Button>
                    </Col>
                </Row>
                </Form>   
            </Modal.Body>
        </Modal>  
        </>
    );
}

export default User