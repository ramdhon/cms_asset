import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Row, Col, Modal, Form, Spinner } from 'react-bootstrap';
import Swal from 'sweetalert2';
import Calendar from 'react-calendar';

import RowTable from './RowTableModelCustomer';
import axios from '../api/database';
import Toast from './ToastComponent';
import { server } from '../api/database';
import ImageModal from './ImageModal';
import PdfDownload from './PdfDownload.js';
import { printStr } from '../helpers';

function Customer (props) {
    const [ showModal, setShowModal ] = useState(false)
    const [ rowTable, setRowTable ] = useState([])
    const stateType ={"brand":"string","model":"string","color":"string","policeNo":"string","vin":"string","customer":"string","type":"string","startPeriod":"date","endPeriod":"date","discount":"number","customerStatus":"string"}
    const [ search, setSearch ] = useState('')
    const [ customer, setCustomer] = useState('') 
    const [ type, setType] = useState('') 
    const [ startPeriod, setStartPeriod] = useState(new Date()) 
    const [ endPeriod, setEndPeriod] = useState(new Date()) 
    const [ discount, setDiscount] = useState(0) 
    const [ customerStatus, setCustomerStatus] = useState('') 
    const [ rentItemId, setRentItemId] = useState('') 
    
    const [ validated, setValidated] = useState(false)

    const [ selectedItem, setSelectedItem ] = useState({})
    const [ selectedRow, setSelectedRow ] = useState({})

    const [ rentItemList, setRentItemList ] = useState([])
    
    const [ calendarShow, setCalendarShow ] = useState({
        startPeriod: false,
        endPeriod: false
    });

    const [ modalImage, setModalImage ] = useState(false)
    const [ imageLink, setImageLink ] = useState('')
    
    const [ showModalPrint, setShowModalPrint ] = useState(false);

    const [ id , setId ] = useState('')
    const [ loading, setLoading ] = useState(false)

    const funcLoop = [setCustomer,setType,setStartPeriod,setEndPeriod,setDiscount,setCustomerStatus] 

    const stateObj = { customer,type,startPeriod,endPeriod,discount,customerStatus } 


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
            axios.patch(`/rentlists/${id}`, { ...stateObj, rentItemId }  ,{ headers:{ token:localStorage.getItem('token')}})
            .then(({data}) => {
                let tempTable = rowTable.map((el,index) => {
                    if(el._id === data.updatedRentlist._id){
                        el = data.updatedRentlist
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
            .finally(() => {
                fetchData();
            })
        } else {
            axios.post('/rentlists', { ...stateObj, rentItemId }, { headers: { token:localStorage.getItem('token')}})
            .then(({data}) => {
                setRowTable([...rowTable, data.newRentlist])
                setTextToast('success add')
                setStatusToast(true)
                toastUp();
                return axios.patch(`/cars/${selectedItem.carId}?editGranted=true`, { status: 'On customer' }, { headers:{ token:localStorage.getItem('token')}})
            })
            .then(({data}) => {
                fetchData();
            })
            .catch(err => {
                setTextToast(err.response.data.message)
                setStatusToast(false)
                toastUp();
            })
            .finally(() => {
                fetchData();
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
                axios.delete(`/rentlists/${id}`, { headers: { token:localStorage.getItem('token')}})
                    .then(({data}) => {
                        const deleted = rowTable.find((el,index) => {
                            return el._id === id
                        })
                        let tempTable = rowTable.filter((el,index) => {
                            return el._id !== id
                        })
                        setRowTable(tempTable)
                        setTextToast('delete success')
                        setStatusToast(true)
                        toastUp();
                        return axios.patch(`/cars/${deleted.carId}?editGranted=true`, { status: 'On pool' }, { headers:{ token:localStorage.getItem('token')}})
                    })
                    .then(({data}) => {
                        //
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
        Object.keys(stateObj).forEach((el_state,index) => {
            if(''+stateType[el_state] === 'boolean'){
                funcLoop[index](false)
            } else if (''+stateType[el_state] === 'number'){
                funcLoop[index](0)
            } else if (''+stateType[el_state] === 'date'){
                funcLoop[index](new Date());
            } else {
                funcLoop[index]('')
            }
        })
        setId('')
        setRentItemId('')
        setValidated(false);
    }
    
    function editData(rowData){
        Object.keys(stateObj).forEach((el, index) => {
            if (''+stateType[el] === 'date') {
                funcLoop[index](new Date(rowData[el]));
            } else {
                funcLoop[index](rowData[el])
            }
        })
        setRentItemId(rowData.rentItemId)
        setId(rowData._id)
        handleShow(rowData._id)
    }

    function handleShow(id) {
        setShowModal(true);
        if (typeof id === 'string') {
            fetchRentItems(id);
        } else {
            fetchRentItems();
        }
    }

    function handleShowPrint(rowData) {
        Object.keys(stateObj).forEach((el, index) => {
            funcLoop[index](rowData[el])
        });
        setSelectedRow(rowData);
        setRentItemId(rowData.rentItemId);
        setId(rowData._id);

        setShowModalPrint(true);

        if (typeof rowData._id === 'string') {
            fetchRentItems(rowData._id);
        } else {
            fetchRentItems();
        }
    }

    function handleClosePrint() {
        setShowModalPrint(false);
        Object.keys(stateObj).forEach((el_state,index) => {
            if(''+stateType[el_state] === 'boolean'){
                funcLoop[index](false)
            } else if (''+stateType[el_state] === 'number'){
                funcLoop[index](0)
            } else if (''+stateType[el_state] === 'date'){
                funcLoop[index](new Date());
            } else {
                funcLoop[index]('')
            }
        });
        setId('');
        setRentItemId('');
    }
    
    function submitSearch(e){
        e.preventDefault()
        axios.get(`/rentlists?populateCar=true&populateItem=true`, { headers:{ token:localStorage.getItem('token')}})
            .then(({ data }) =>{
                const regex = new RegExp(search, 'i');
                const tmp = data.Rentlists.map((el) => {
                    const { _id, created, updated, type } = el;

                    Object.assign(el, el.rentItemId.carId);
                    Object.assign(el, el.rentItemId);
                    el._id = _id;
                    el.created = created;
                    el.updated = updated;
                    el.type = type;
                    el.model = el.rentItemId.carId.type;
                    el.carId = el.rentItemId.carId._id;
                    el.rentItemId = el.rentItemId._id;
                    delete el.rentItemId;

                    return el;
                }).filter((el) => {
                    return (
                        regex.test(String(el.customer)) ||
                        regex.test(String(el.type)) ||
                        regex.test(String(el.startPeriod)) ||
                        regex.test(String(el.endPeriod)) ||
                        regex.test(el.brand) ||
                        regex.test(el.model) ||
                        regex.test(el.policeNo) ||
                        regex.test(el.vin)
                    )
                });
                setRowTable(tmp);
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
        axios.get('/rentlists?populateCar=true&populateItem=true', { headers: { token: localStorage.getItem('token')}})
            .then(({data}) => {
                if(data.Rentlists){
                    const tmp = data.Rentlists.map((el) => {
                        const { _id, created, updated, type } = el;

                        Object.assign(el, el.rentItemId.carId);
                        Object.assign(el, el.rentItemId);
                        el._id = _id;
                        el.created = created;
                        el.updated = updated;
                        el.type = type;
                        el.model = el.rentItemId.carId.type;
                        el.carId = el.rentItemId.carId._id;
                        el.rentItemId = el.rentItemId._id;

                        return el;
                    })
                    setRowTable(tmp);
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

    function fetchRentItems(rowId) {
        axios.get('/rentitems?populateCar=true', { headers: { token: localStorage.getItem('token')}})
            .then(({ data }) => {
                if (data.Rentitems) {
                    let tmp = data.Rentitems.map((el) => {
                        const { _id, created, updated } = el;

                        Object.assign(el, el.carId);
                        el._id = _id;
                        el.created = created;
                        el.updated = updated;
                        el.carId = el.carId._id;
                        return el;
                    })

                    const el = rowTable.find((el) => el._id === rowId);
                    tmp = tmp.filter((sub_el) => {
                        return rowId ? el.carId === sub_el.carId || sub_el.status === 'On pool' : sub_el.status === 'On pool'
                    });

                    setRentItemList(tmp);
                }
            })
            .catch((err) => {
                setTextToast(err.response.data.message)
                setStatusToast(false)
                toastUp();
            })
    }

    function status(rowData) {
        const id = rowData.carId;
        axios.patch(`/cars/${id}?editGranted=true`, { status: 'On pool' }, { headers:{ token:localStorage.getItem('token')}})
            .then(({data}) => {
                fetchData();
            })
            .catch(err =>{
                setTextToast(err.response.data.message)
                setStatusToast(false)
                toastUp();
            })
    }

    function handleShowCalendar(state) {
        setCalendarShow({
            ...calendarShow,
            [state]: true
        });
    }
    function handleCloseCalendar(state) {
        setCalendarShow({
            ...calendarShow,
            [state]: false
        });
    }

    useEffect(() => {
        if(!search){
            fetchData()
        }
    }, [search])

    useEffect(() => {
        const obj = rentItemList.find((el) => el._id === rentItemId);
        setSelectedItem( obj || {
            brand: null,
            type: null,
            year: null,
            policeNo: null,
            vin: null,
            price: null,
            currency: 'IDR',
            status: null,
            daily: null,
            weekly: null,
            monthly: null,
            annually: null,
            tax: null,
        })
    }, [rentItemId, rentItemList])

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
                                <h3> <span style={{ color:'grey' }}>#</span> Customer </h3>
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
                                        { [...Object.keys(stateType), 'CreatedAt', 'UpdatedAt', 'Actions'].map((el, index) =>{
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
                                        status={ status }
                                        edit={ editData } 
                                        delete={ deleteData }
                                        handleShowPrint={ handleShowPrint }
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

        <Modal show={showModalPrint} onHide={handleClosePrint} dialogClassName="modal-w-90">
            <Modal.Header closeButton>
                <Modal.Title>Preview Invoice</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ padding: 0 }}>
                <PdfDownload data={selectedRow} />
            </Modal.Body>
        </Modal>

        <Modal show={showModal} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Add Customer </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Form noValidate validated={validated} onSubmit={ submitForm }>
                <Form.Group className='mt-2'>
                    <Form.Label>Select Car</Form.Label>
                    <Form.Control required disabled={!rentItemList.length} as="select" placeholder={`Enter Car Id`} onChange={ e => setRentItemId( e.target.value)} value={ rentItemId }>
                        <option value={''}>Select a car</option>
                        {
                            rentItemList.map((el, index) => (
                                <option key={index} value={el._id}>
                                    {el.brand} - {el.type} - {el.policeNo} - {el.vin}
                                </option>
                            ))
                        }
                    </Form.Control>
                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    <Form.Control.Feedback type="invalid">
                        Please choose the car.
                    </Form.Control.Feedback>
                    {
                        !rentItemList.length &&
                            <span>No available cars.</span>
                    }
                </Form.Group>
                {
                    Object.keys(selectedItem).map((el, index) => (
                        el !== 'created' && el !== 'updated' && el !== 'refId' && el !== '__v' ?
                        <Form.Group key={index} className='mt-2'>
                            <Form.Label>{el}</Form.Label>
                            <Form.Control disabled type="text" placeholder={el} value={printStr(selectedItem[el])} />
                        </Form.Group>
                        : null
                    ))
                }
                {/* FIXME: this below loop need to be cheked there is some kind error of controlled uncontrolled component */}
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
                                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                <Form.Control.Feedback type="invalid">
                                    Please enter the {el}.
                                </Form.Control.Feedback>
                            </Form.Group> )
                    } else if( el === 'type' ){
                        return (
                            <Form.Group key={ index } className='mt-2'>
                                <Form.Label>Enter {el}</Form.Label>
                                <Form.Control required as="select" placeholder={`Enter ${ el }`} onChange={ e => funcLoop[index]( e.target.value)} value={ stateObj[el] }>
                                    <option value=''>Select one</option>
                                    <option value='daily'>Daily</option>
                                    <option value='weekly'>Weekly</option>
                                    <option value='monthly'>Monthly</option>
                                    <option value='annually'>Annually</option>
                                </Form.Control>
                                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                <Form.Control.Feedback type="invalid">
                                    Please choose the {el}.
                                </Form.Control.Feedback>
                            </Form.Group> )
                    } else if( stateType[el] === 'date' ){
                        return (
                            <Form.Group key={ index } className='mt-2'>
                                <Form.Label>Enter {el}</Form.Label>
                                <Form.Control disabled type="text" placeholder={`Enter ${ el }`} value={ stateObj[el] }/>
                                {
                                    !calendarShow[el] ?
                                        <Button className="my-3" variant="success" onClick={(e) => handleShowCalendar(el)}>
                                            Open Calendar
                                        </Button>
                                    :
                                        <>
                                            <Button className="my-3" variant="danger" onClick={(e) => handleCloseCalendar(el)}>
                                                Close Calendar
                                            </Button>
                                            <Calendar onChange={(date) => funcLoop[index](date)} value={stateObj[el]} />
                                        </>
                                }
                            </Form.Group> )
                    } else if( el === 'customerStatus' ){
                        return (
                            <Form.Group key={ index } className='mt-2'>
                                <Form.Label>Enter {el}</Form.Label>
                                <Form.Control required as="select" placeholder={`Enter ${ el }`} onChange={ e => funcLoop[index]( e.target.value)} value={ stateObj[el] }>
                                    <option value=''>Select one</option>
                                    <option value='completed'>Completed</option>
                                    <option value='active'>Active</option>
                                    <option value='canceled-changeType'>Canceled - Change Type</option>
                                    <option value='canceled-changeCar'>Canceled - Change Car</option>
                                    <option value='canceled-changePeriod'>Canceled - Change Period</option>
                                </Form.Control>
                                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                <Form.Control.Feedback type="invalid">
                                    Please choose the {el}.
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

export default Customer