import React from 'react';
import { Row, Col, Table } from 'react-bootstrap';

function RentitemDetail(props) {
    
    const modelInfo = {"Daily":"Number","Weekly":"Number","Monthly":"Number","Anually":"Number","Currency":"String","Tax":"Number","Discount":"Number","CarId":"ObjectId"} 


    return (
        <div style={{ padding:'30px' }}>
            <h3> <span style={{ color:'grey' }}>#</span> Model Rentitem </h3>
            <div className='border shadow-sm mt-3' style={{ borderRadius:'5px', padding:'15px 20px' }}>
                <Row style={{ padding:'0px 5px' }}>
                    <Col>
                        <h5> <b>{ Object.keys(modelInfo).length } fields</b> </h5>
                    </Col>
                </Row>
            </div>
            <div className='shadow-sm mt-3'>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Key Name</th>
                            <th>Data Type</th>
                        </tr>
                    </thead>
                    <tbody>

                        { Object.keys(modelInfo).map( (el, index)=> {
                            return <tr key={ index }>
                                <td>{ index+1 }</td>
                                <td>{ el }</td>
                                <td><b>{ modelInfo[el] }</b></td>
                            </tr>
                        })}
                    </tbody>
                </Table>
            </div>
        </div>
    );
}

export default RentitemDetail