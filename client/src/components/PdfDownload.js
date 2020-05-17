import React from 'react';
import ReactToPdf from 'react-to-pdf';
import moment from 'moment';
import _ from 'lodash';
import Calendar from 'react-calendar';
import { Button, Container, Form, Row, Col, Table } from 'react-bootstrap';

import { formatNumber } from '../helpers'

function PdfDownload({ data }) {
  const ref = React.createRef();
  const options = {
    orientation: 'potrait',
    unit: 'in',
    format: 'a4'
  };
  
  function strItemForm(input) {
    return input || '_______________________';
  }

  function dateItemForm(input) {
    return !input ? moment(input).format('dddd, MMMM Do YYYY') : moment(new Date()).format('dddd, MMMM Do YYYY')
  }

  function subTotal() {
    return data.price - data.discount;
  }

  function taxPrice() {
    return data.tax / 100 * data.price;
  }

  function otherPriceConverter() {
    return _.map(_.get(data, 'otherExpenses', []), item => item.price);
  }

  function otherTotal() {
    return _.reduce(otherPriceConverter(), (sum, n) => sum + n) || 0;
  }

  function total() {
    return subTotal() + otherTotal() + taxPrice() + data.delivery || 0 - data.discountFinal || 0
  }

  return (
    <Container fluid>
      <Row>
        <Col className="p-4" md="8" style={{ background: '#D3D3D3' }}>
          <Container className="py-5 px-5 d-flex flex-column" style={{ width: '210mm', height: '297mm', background: '#FFFFFF' }} ref={ref}>
            <Row>
              <Col></Col>
              <Col>
                <Row className="justify-content-center">
                  <h3>INVOICE</h3>
                </Row>
              </Col>
              <Col>
                <Row className="justify-content-end">
                  <strong><em>TRANS PACIFIC GLOBAL, PT</em></strong>
                </Row>
              </Col>
            </Row>
            <Row>
              <div className="my-2" style={{ height: '1px', width: '100%', background: '#D3D3D3' }} />
            </Row>
            <Row style={{ fontSize: 12 }}>
              <Col className="d-flex flex-column" md="2">
                <span>Nomor Inv</span>
                <span>Customer</span>
                <span>Kepada</span>
                <span>Alamat</span>
              </Col>
              <Col className="d-flex flex-column" md="5">
                <span>: {strItemForm(data._id)}</span>
                <span>: {strItemForm(data.customer)}</span>
                <span>: {strItemForm(data.pic)}</span>
                <span>: {strItemForm(data.address)}</span>
              </Col>
              <Col className="d-flex flex-column" md="2">
                <span>Tanggal</span>
                <span>Mata Uang</span>
                <span>Term</span>
                <span>Pool</span>
              </Col>
              <Col className="d-flex flex-column" md="3">
                <span>: {dateItemForm()}</span>
                <span>: {strItemForm(data.currency)}</span>
                <span>: {strItemForm(data.type)}</span>
                <span>: {strItemForm(data.location)}</span>
              </Col>
            </Row>
            <Row>
              <div className="my-2" />
            </Row>
            <Row className="flex-grow-1" style={{ fontSize: 12 }}>
              <Table striped size="sm">
                <thead>
                  <tr>
                    <th>Jenis Kendaraan</th>
                    <th>Tanggal Sewa</th>
                    <th>Jumlah</th>
                    <th>Harga</th>
                    <th>Disc.</th>
                    <th>Sub Total</th>
                    <th>Pajak</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{strItemForm(`${data.brand} ${data.model} ${data.color || ''} ${data.policeNo}`)}</td>
                    <td>{dateItemForm(data.startPeriod)} - {dateItemForm(data.endPeriod)}</td>
                    <td>{formatNumber(1)}</td>
                    <td>{strItemForm(formatNumber(data.price))}</td>
                    <td>{strItemForm(formatNumber(data.discount))}</td>
                    <td>............</td>
                    <td>{strItemForm(formatNumber(data.tax))} %</td>
                  </tr>
                </tbody>
              </Table>
            </Row>
            <Row>
              <div className="my-2" style={{ height: '1px', width: '100%', background: '#D3D3D3' }} />
            </Row>
            <Row style={{ fontSize: 12 }}>
              <span>Terbilang: ________________</span>
            </Row>
            <Row>
              <div className="my-2" />
            </Row>
            <Row style={{ fontSize: 12 }}>
              <Col className="d-flex flex-column border py-3" md="5">
                <span>Pembayaran:</span>
                <span>- Tunai</span>
                <br />
                <span>- Transfer Atas Nama:</span>
                <span>PT. Trans Pacific Global</span>
                <span>Bank XXX Cab. XXX</span>
                <span>No. Rekening: xxx-xxxx-xxx</span>
              </Col>
              <Col md="7">
                <Row>
                  <Col className="d-flex flex-column" md="5">
                    <span>Discount Final</span>
                    <span>Pajak</span>
                    <span>Biaya Pengantaran</span>
                    <span>Total</span>
                  </Col>
                  <Col className="d-flex flex-column" md="2">
                    <span>: Rp</span>
                    <span>: Rp</span>
                    <span>: Rp</span>
                    <span>: Rp</span>
                  </Col>
                  <Col className="d-flex flex-column" md="5">
                    <Row className="justify-content-end">
                      <span>{strItemForm(formatNumber(data.discountFinal || 0))}</span>
                    </Row>
                    <Row className="justify-content-end">
                      <span>{strItemForm(formatNumber(taxPrice()))}</span>
                    </Row>
                    <Row className="justify-content-end">
                      <span>{strItemForm(formatNumber(data.delivery || 0))}</span>
                    </Row>
                    <Row className="justify-content-end">
                      <span>{strItemForm(formatNumber(total()))}</span>
                    </Row>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <div className="my-2" />
            </Row>
            <Row className="justify-content-around" style={{ fontSize: 12 }}>
              <Col md="4" style={{ height: '30mm' }} className="border-bottom">
                <Row className="justify-content-center">
                  <span>Customer</span>
                </Row>
              </Col>
              <Col md="4" style={{ height: '30mm' }} className="border-bottom d-flex flex-column justify-content-between">
                <Row className="justify-content-center">
                  <span>PT. Trans Pacific Global</span>
                </Row>
                <Row className="justify-content-center">
                  <span>Employee Name</span>
                </Row>
              </Col>
            </Row>
            <Row className="justify-content-around" style={{ fontSize: 12 }}>
              <Col md="4">
                <Row className="justify-content-center">
                  <span>Someone You Know</span>
                </Row>
              </Col>
              <Col md="4">
                <Row className="justify-content-center">
                  <span>Finance</span>
                </Row>
              </Col>
            </Row>
            <Row>
              <div className="my-2" />
            </Row>
            <Row style={{ fontSize: 12 }}>
              <span>Halaman 1 / 1</span>
            </Row>
          </Container>
        </Col>
        <Col className="p-3" md="4">
          <Container fluid>
            <ReactToPdf targetRef={ref} filename={`invoice-_customer_.pdf`} options={options}>
              {({toPdf}) => (
                <Row className="justify-content-end">
                  <Button onClick={toPdf}><i style={{ position: 'relative', right: 5 }} className="fas fa-file"></i>Generate pdf</Button>
                </Row>
              )}
            </ReactToPdf>
            <Form>
              <Form.Group className='mt-2'>
                <Form.Label>Enter Customer PIC</Form.Label>
                <Form.Control required type="text" placeholder={`Enter name`} onChange={ e => data.pic = e.target.value } value={ data.pic }/>
                <Form.Control.Feedback type="invalid">
                  Please enter customer name.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className='mt-2'>
                <Form.Label>Enter Customer Address</Form.Label>
                <Form.Control required as="textarea" rows="5" placeholder={`Enter name`} onChange={ e => data.address = e.target.value } value={ data.address }/>
                <Form.Control.Feedback type="invalid">
                  Please enter customer name.
                </Form.Control.Feedback>
              </Form.Group>
            </Form>
            <span>{JSON.stringify(data)}</span>
          </Container>
        </Col>
      </Row>
    </Container>
  );
};

export default PdfDownload;