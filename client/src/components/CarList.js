import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Row, Col, Modal, Form, Spinner, ButtonToolbar, ButtonGroup, InputGroup, FormControl } from 'react-bootstrap';
import Swal from 'sweetalert2';
import _ from 'lodash';

import RowTable from './RowTableModelCarList';
import axios from '../api/database';
import Toast from './ToastComponent';
import { server } from '../api/database';
import ImageModal from './ImageModal';
import { printStr } from '../helpers';

function CarList (props) {
    const [ showModal, setShowModal ] = useState(false);
    const [ rowTable, setRowTable ] = useState([]);
    const stateType ={"brand":"string","type":"string","year":"number","policeNo":"string","color":"string","vin":"string","status":"string","daily":"number","weekly":"number","monthly":"number","annually":"number","tax":"number"};
    const [ search, setSearch ] = useState('');
    const [ daily, setDaily] = useState(0);
    const [ weekly, setWeekly] = useState(0);
    const [ monthly, setMonthly] = useState(0);
    const [ annually, setAnnually] = useState(0);
    const [ currency, setCurrency] = useState('IDR');
    const [ tax, setTax] = useState(0);
    const [ carId, setCarId] = useState('');
    
    const [ validated, setValidated] = useState(false);

    const dataPerPage = 5;
    const [ page, setPage ] = useState(1);
    const [ pageDataRow, setPageDataRow ] = useState([]);

    const [ selectedCar, setSelectedCar ] = useState({});

    const [ carList, setCarList ] = useState([]);
        
    const [ modalImage, setModalImage ] = useState(false);
    const [ imageLink, setImageLink ] = useState('');
    
    const [ id , setId ] = useState('');
    const [ loading, setLoading ] = useState(false);

    const funcLoop = [setDaily,setWeekly,setMonthly,setAnnually,setCurrency,setTax];

    const stateObj = { daily,weekly,monthly,annually,currency,tax };

    //toast
    const [ textToast, setTextToast ] = useState('');
    const [ statusToast, setStatusToast ] = useState(false);
    const [ showToast, setShowToast ] = useState(false);

    function setDataPage(data = [...rowTable], currentPage = page, totalPageValue = totalPage()) {
        const index = currentPage - 1;

        if (index < 0) {
            return;
        }

        if (index > totalPageValue - 1) {
            return;
        }

        const start = index * dataPerPage;
        const end = currentPage === totalPageValue ? data.length : currentPage * dataPerPage;
        const sliced = _.slice(data, start, end);

        setPageDataRow(sliced);
    }

    function setThePage(page) {
        const totalPageValue = totalPage();

        if (page < 0) {
            setPage(1);
            setDataPage(undefined, 1);
            return;
        }

        if (page === 0) {
            setPage(1);
            setDataPage(undefined, 1);
            return;
        }
        
        if (page > totalPageValue) {
            setPage(totalPageValue);
            setDataPage(undefined, totalPageValue);
            return;
        }
        
        setPage(page);
        setDataPage(undefined, page);
    }
    
    function onChangePagination(e) {
        setThePage(e.target.value);
    }

    function prevPage() {
        setThePage(page - 1);
    }

    function nextPage() {
        setThePage(page + 1);
    }

    function totalPage() {
        return Math.ceil(rowTable.length / dataPerPage)
    }

    function toastUp() {
        setShowToast(true);
        setTimeout(() => {
            setShowToast(false);
        }, 1500)
    }

    function submitForm(e){
        e.preventDefault()
        const form = e.currentTarget;
        
        if (!form.checkValidity() || !carId) {
            e.stopPropagation();
            return setValidated(true);
        }

        if(id){
            axios.patch(`/rentitems/${id}`, { ...stateObj, carId }  ,{ headers:{ token:localStorage.getItem('token')}})
            .then(({data}) => {
                let tempTable = rowTable.map((el,index) => {
                    if(el._id === data.updatedRentitem._id){
                        el = data.updatedRentitem
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
            axios.post('/rentitems', { ...stateObj, carId }, { headers: { token:localStorage.getItem('token')}})
            .then(({data}) => {
                setRowTable([...rowTable, data.newRentitem])
                setTextToast('success add')
                setStatusToast(true)
                toastUp();
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
                axios.delete(`/rentitems/${id}`, { headers: { token:localStorage.getItem('token')}})
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
        Object.keys(stateObj).forEach((el_state,index) => {
            if(''+stateType[el_state] === 'boolean'){
                funcLoop[index](false)
            } else if (''+stateType[el_state] === 'number'){
                funcLoop[index](0)
            } else {
                funcLoop[index]('')
            }
        })
        setId('')
        setCarId('')
        setValidated(false);
    }
    
    function editData(rowData){
        Object.keys(stateObj).forEach((el, index) => {
            funcLoop[index](rowData[el])
        })
        setCarId(rowData.carId)
        setId(rowData._id)
        handleShow(rowData._id)
    }

    function fetchCar(rowId) {
        axios.get('/cars', { headers: { token: localStorage.getItem('token')}})
            .then(({ data }) => {
                if (data.Cars) {
                    let tmp = [...data.Cars];
                    
                    rowTable.forEach((el) => {
                        tmp = tmp.filter((sub_el) => {
                            return rowId ? el._id === rowId || sub_el._id !== el.carId : sub_el._id !== el.carId
                        });
                    })
                    setCarList(tmp);
                }
            })
            .catch((err) => {
                setTextToast(err.response.data.message)
                setStatusToast(false)
                toastUp();
            })
    }

    function handleShow(id) {
        setShowModal(true);
        if (typeof id === 'string') {
            fetchCar(id);
        } else {
            fetchCar();
        }
    }
    
    function submitSearch(e){
        e.preventDefault();

        axios.get('/rentitems?populateCar=true', { headers: { token: localStorage.getItem('token')}})
            .then(({data}) => {
                if(data.Rentitems){
                    const regex = new RegExp(search, 'i');
                    let tmp = data.Rentitems.map((el) => {
                        const { _id, created, updated } = el;

                        Object.assign(el, el.carId);
                        el._id = _id;
                        el.created = created;
                        el.updated = updated;
                        el.carId = el.carId._id;
                        return el;
                    }).filter((el) => {
                        return (
                            regex.test(String(el.daily)) ||
                            regex.test(String(el.weekly)) ||
                            regex.test(String(el.annually)) ||
                            regex.test(String(el.tax)) ||
                            regex.test(String(el.discount)) ||
                            regex.test(String(el.year)) ||
                            regex.test(el.brand) ||
                            regex.test(el.type) ||
                            regex.test(el.policeNo) ||
                            regex.test(el.vin) ||
                            regex.test(el.status)
                        )
                    });
                    setRowTable(tmp);
                    setDataPage(tmp, 1, Math.ceil(tmp.length / dataPerPage));
                    setPage(1);
                }
            })
            .catch(err =>{
                setTextToast(err.response.data.message)
                setStatusToast(false)
                toastUp();
            })
        // axios.get(`/rentitems?search=${search}`, { headers:{ token:localStorage.getItem('token')}})
        //     .then(({ data }) =>{
        //         setRowTable(data.Rentitems ? [...data.Rentitems] : [])
        //     })
        //     .catch(err => {
        //         setTextToast(err.response.data.message)
        //         setStatusToast(false)
        //         toastUp();
        //     })
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
        axios.get('/rentitems?populateCar=true', { headers: { token: localStorage.getItem('token')}})
        .then(({data}) => {
            if(data.Rentitems){
                const tmp = data.Rentitems.map((el) => {
                    const { _id, created, updated } = el;

                    Object.assign(el, el.carId);
                    el._id = _id;
                    el.created = created;
                    el.updated = updated;
                    el.carId = el.carId._id;
                    return el;
                })
                setRowTable(tmp);
                setDataPage(tmp, 1, Math.ceil(tmp.length / dataPerPage));
                setPage(1);
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
        const obj = carList.find((el) => el._id === carId);
        setSelectedCar( obj || {
            brand: null,
            type: null,
            year: null,
            policeNo: null,
            vin: null,
            price: null,
            currency: 'IDR',
            status: null
        })
    }, [carId, carList])

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
                                <h3> <span style={{ color:'grey' }}>#</span> Car Rental List </h3>
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
                
                        <Row className='d-flex justify-content-center'>
                            <ButtonToolbar>
                                <ButtonGroup>
                                    <Button disabled={page === 1} variant='outline-primary' onClick={prevPage}><i className='fas fa-angle-left'></i> Previous</Button>
                                </ButtonGroup>
                                <InputGroup className='mx-2'>
                                    <FormControl
                                        type='number'
                                        placeholder='Page'
                                        onChange={onChangePagination}
                                        value={page}
                                    />
                                    <InputGroup.Append>
                                        <InputGroup.Text>/ {totalPage()}</InputGroup.Text>
                                    </InputGroup.Append>
                                </InputGroup>
                                <ButtonGroup>
                                    <Button disabled={page === totalPage()} onClick={nextPage}>Next <i className='fas fa-angle-right'></i></Button>
                                </ButtonGroup>
                            </ButtonToolbar>
                        </Row>

                        <div className='shadow-sm mt-3' style={{ overflowX: 'scroll' }} >
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        { [...Object.keys(stateType), 'Currency', 'CreatedAt', 'UpdatedAt', 'Actions'].map((el, index) =>{
                                            return <th key={ index }> {el} </th>
                                        })}
                                    </tr>
                                </thead>
                                <tbody>
                                    { pageDataRow.map( (row, index) => {
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
                <Modal.Title>Add Car List</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Form noValidate validated={validated} onSubmit={ submitForm }>
                <Form.Group className='mt-2'>
                    <Form.Label>Select Car</Form.Label>
                    <Form.Control required disabled={!carList.length} as="select" placeholder={`Enter Car Id`} onChange={ e => setCarId( e.target.value)} value={ carId }>
                        <option value={''}>Select a car</option>
                        {
                            carList.map((el, index) => (
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
                        !carList.length &&
                            <span>No available cars.</span>
                    }
                </Form.Group>
                {
                    Object.keys(selectedCar).map((el, index) => (
                        el !== 'created' && el !== 'updated' && el !== 'refId' && el !== '__v' ?
                        <Form.Group key={index} className='mt-2'>
                            <Form.Label>{el}</Form.Label>
                            <Form.Control disabled type="text" placeholder={el} value={printStr(selectedCar[el])} />
                        </Form.Group>
                        : null
                    ))
                }
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
                                <Form.Control
                                    required
                                    type='number'
                                    placeholder={`Enter ${ el }`}
                                    onChange={ e => funcLoop[index]( e.target.value)}
                                    value={ stateObj[el] }
                                />
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
                            <Form.Control required disabled={el === 'currency'} type="text" placeholder={`Enter ${ el }`} onChange={ e => funcLoop[index]( e.target.value)} value={ stateObj[el] }/>
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
                        {
                            validated && !carId ?
                                <span className="mx-3 my-2">Please select the car, if available!</span>
                            :
                                null
                        }
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

export default CarList