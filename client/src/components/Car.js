import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Row, Col, Modal, Form, Spinner } from 'react-bootstrap';
import Swal from 'sweetalert2';

import RowTable from './RowTableModelCar';
import axios from '../api/database';
import Toast from './ToastComponent';
import { server } from '../api/database';
import ImageModal from './ImageModal'

function Car (props) {
    const [ showModal, setShowModal ] = useState(false);
    const [ rowTable, setRowTable ] = useState([]);
    const stateType ={"brand":"string","type":"string","year":"number","policeNo":"string","vin":"string","price":"number","currency":"string","status":"string","purchasedYear":"number","machineNo":"string","color":"string","location":"string"};
    const [ search, setSearch ] = useState('');
    const [ brand, setBrand] = useState('');
    const [ type, setType] = useState('');
    const [ year, setYear] = useState(0);
    const [ policeNo, setPoliceNo] = useState('');
    const [ vin, setVin] = useState('');
    const [ price, setPrice] = useState(0);
    const [ currency, setCurrency] = useState('');
    const [ status, setStatus] = useState('');
    const [ purchasedYear, setPurchaseYear] = useState('');
    const [ machineNo, setMachineNo] = useState('');
    const [ color, setColor] = useState('');
    const [ location, setLocation] = useState('');
    
    const [ validated, setValidated ] = useState(false);

    const [ modalImage, setModalImage ] = useState(false);
    const [ imageLink, setImageLink ] = useState('');    
    const [ id , setId ] = useState('');
    const [ loading, setLoading ] = useState(false);
    const funcLoop = [setBrand,setType,setYear,setPoliceNo,setVin,setPrice,setCurrency,setStatus,setPurchaseYear,setMachineNo,setColor,setLocation];

    const stateObj = { brand,type,year,policeNo,vin,price,currency,status,purchasedYear,machineNo,color,location };


    //toast
    const [ textToast, setTextToast ] = useState('')
    const [ statusToast, setStatusToast ] = useState(false)
    const [ showToast, setShowToast ] = useState(false) 

    function toastUp() {
        setShowToast(true);
        setTimeout(() => {
            setShowToast(false);
        }, 1500)
    }

    function submitForm(e){
        e.preventDefault()
        const form = e.currentTarget;
        
        if (!form.checkValidity()) {
            e.stopPropagation();
            return setValidated(true);
        }
       
        if(id){
            axios.patch(`/cars/${id}`, stateObj  ,{ headers:{ token:localStorage.getItem('token')}})
            .then(({data}) => {
                let tempTable = rowTable.map((el,index) => {
                    if(el._id === data.updatedCar._id){
                        el = data.updatedCar
                    }
                    return el;
                })
                setRowTable(tempTable)
                setTextToast('data updated')
                setStatusToast(true)
                toastUp();
            })
            .catch(err =>{
                setTextToast(err.response.data.message)
                setStatusToast(false)
                toastUp();
            })
        } else {
            axios.post('/cars', stateObj, { headers: { token:localStorage.getItem('token')}})
            .then(({data}) => {
                setRowTable([...rowTable, data.newCar])
                setTextToast('success add')
                setStatusToast(true)
                toastUp();
            })
            .catch(err => {
                setTextToast(err.response.data.message)
                setStatusToast(false)
                toastUp();
            })
        }
        handleClose();
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
                axios.delete(`/cars/${id}`, { headers: { token:localStorage.getItem('token')}})
                    .then(({data}) => {
                        let tempTable = rowTable.filter((el,index) => {
                            return el._id !== id
                        })
                        setRowTable(tempTable)
                        setTextToast('delete success')
                        setStatusToast(true)
                        toastUp();
                    })
                    .catch(err => {
                        setTextToast(err.response.data.message)
                        setStatusToast(false)
                        toastUp();
                    })
            }
        });
    }

    function handleClose() {
        setShowModal(false);
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

    function handleShow() {
        setShowModal(true);
    }
    
    function submitSearch(e){
        e.preventDefault()
        axios.get(`/cars?search=${search}`, { headers:{ token:localStorage.getItem('token')}})
        .then(({ data }) =>{
            setRowTable(data.Cars ? [...data.Cars] : [])
        })
        .catch(err => {
            setTextToast(err.response.data.message)
            setStatusToast(false)
            toastUp();
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
        axios.get('/cars', { headers: { token: localStorage.getItem('token')}})
        .then(({data}) => {
            if(data.Cars){
                setRowTable(data.Cars)
            }
        })
        .catch(err =>{
            setTextToast(err.response.data.message)
            setStatusToast(false)
            toastUp();
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
                                <h3> <span style={{ color:'grey' }}>#</span> Car </h3>
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
                                        { ['ID',...Object.keys(stateType), 'CreatedAt', 'UpdatedAt', 'Actions'].map((el, index) =>{
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
                                        type={ stateType }
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
                <Modal.Title>Add Car </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Form noValidate validated={validated} onSubmit={ submitForm }>
                { Object.keys(stateObj).map((el, index) => {
                    if ( stateType[el] === 'boolean') {
                        return (<Form.Group key={ index }>
                        <Form.Label>{`Enter ${ el }`}</Form.Label>
                            <Form.Control required as="select" onChange={ e => funcLoop[index]( e.target.value)} value={ stateObj[el]} >
                                <option value='true'>true</option>
                                <option value='false'>false</option>
                            </Form.Control> 
                        </Form.Group>)
                    } else if(el === 'status'){
                        return ( 
                            <Form.Group key={ index } >
                                <Form.Label>Enter {el}</Form.Label>
                                <Form.Control required as="select" onChange={ e => funcLoop[index]( e.target.value)} value={ stateObj[el]}>
                                    <option value=''>Select status</option>
                                    <option value='On field'>On Field</option>
                                    <option value='On pool'>On Pool</option>
                                    <option value='On customer'>On Customer</option>
                                </Form.Control>
                            </Form.Group>
                        )
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
                                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                <Form.Control.Feedback type="invalid">
                                    Please enter the {el}.
                                </Form.Control.Feedback>
                            </Form.Group> )
                    }
                    else {
                        return (
                        <Form.Group key={ index } className='mt-2'>
                            <Form.Label>Enter {el}</Form.Label>
                            <Form.Control required type="text" placeholder={`Enter ${ el }`} onChange={ e => funcLoop[index]( e.target.value)} value={ stateObj[el] }/>
                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                            <Form.Control.Feedback type="invalid">
                                Please enter the {el}.
                            </Form.Control.Feedback>
                        </Form.Group> )
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
        </>
    );
}

export default Car