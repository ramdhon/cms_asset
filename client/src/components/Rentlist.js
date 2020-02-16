import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Row, Col, Modal, Form, Spinner } from 'react-bootstrap'
import RowTable from './RowTableNewModel';
import axios from '../api/database';
import Toast from './ToastComponent';
import { server } from '../api/database';
import ImageModal from './ImageModal'

function Rentlist (props) {

    const [ showModal, setShowModal ] = useState(false)
    const [ rowTable, setRowTable ] = useState([])
    const stateType ={"customer":"string","type":"string","startperiod":"string","endperiod":"string","rentitemid":"string"}
    const [ search, setSearch ] = useState('')
    const [ customer, setCustomer] = useState('') 
    const [ type, setType] = useState('') 
    const [ startperiod, setStartperiod] = useState('') 
    const [ endperiod, setEndperiod] = useState('') 
    const [ rentitemid, setRentitemid] = useState('') 
    
    const [ modalImage, setModalImage ] = useState(false)
    const [ imageLink, setImageLink ] = useState('')
    
    const [ id , setId ] = useState('')
    const [ loading, setLoading ] = useState(false)

    const funcLoop = [setCustomer,setType,setStartperiod,setEndperiod,setRentitemid] 

    const stateObj = { customer,type,startperiod,endperiod,rentitemid } 


    //toast
    const [ textToast, setTextToast ] = useState('')
    const [ statusToast, setStatusToast ] = useState(false)
    const [ showToast, setShowToast ] = useState(false) 

   function submitForm(e){
        e.preventDefault()
       
        if(id){
            axios.patch(`/rentlists/${id}`, stateObj  ,{ headers:{ token:localStorage.getItem('token')}})
            .then(({data}) => {
                let tempTable = rowTable.map((el,index) => {
                    if(el._id === data.updatedRentlist._id){
                        el = data.updatedRentlist
                    }
                    return el;
                })
                setRowTable(tempTable)
            })
            .catch(err =>{
                setTextToast(err.response.data.message)
                setStatusToast(false)
                setShowToast(true)
            })
        } else {
            axios.post('/rentlists', stateObj, { headers: { token:localStorage.getItem('token')}})
            .then(({data}) => {
                setRowTable([...rowTable, data.newRentlist])
                setTextToast('success add')
                setStatusToast(true)
                setShowToast(true)
            })
            .catch(err => {
                setTextToast(err.response.data.message)
                setStatusToast(false)
                setShowToast(true)
            })
    
            let tempRow = [ ...rowTable, stateObj ]
            setRowTable(tempRow)
        }
        handleClose()
    }

    function deleteData(id){
        axios.delete(`/rentlists/${id}`, { headers: { token:localStorage.getItem('token')}})
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

    function handleClose() {
        setShowModal(false);
        let tempKey = Object.keys(stateType)
        funcLoop.map((func,index) => {
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
        Object.keys(stateObj).map((el, index) => {
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
        axios.get(`/rentlists?search=${search}`, { headers:{ token:localStorage.getItem('token')}})
        .then(({ data }) =>{
            setRowTable([...data.Rentlists])
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
        axios.get('/rentlists', { headers: { token: localStorage.getItem('token')}})
        .then(({data}) => {
            if(data.Rentlists){
                setRowTable(data.Rentlists)
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
                                <h3> <span style={{ color:'grey' }}>#</span> Rentlist </h3>
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
                
                        <div className='shadow-sm mt-3'>
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
                        </div>
                    </div>
                </Container>
        }

        <ImageModal  show={ modalImage } onHide={ setModalImage } title={ imageLink }/>

        <Modal show={showModal} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Add Rentlist </Modal.Title>
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
                                    <img width='100%' src={ stateObj[el] ? `${server}/uploads/${stateObj[el]}` : null} />
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
                    else {
                        return (
                        <Form.Group key={ index } className='mt-2'>
                            <Form.Label>Enter {el}</Form.Label>
                            <Form.Control type="text" placeholder={`Enter ${ el }`} onChange={ e => funcLoop[index]( e.target.value)} value={ stateObj[el] }/>
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

export default Rentlist