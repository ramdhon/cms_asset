import React, { useState } from 'react';
import ReactToPdf from 'react-to-pdf';
import moment from 'moment';
import _ from 'lodash';
import Calendar from 'react-calendar';
import { Button, Container, Form, Row, Col, Table } from 'react-bootstrap';

import { formatNumber, printStrForm, printDate, printStr, inWords } from '../helpers'

function PdfDownload({ data }) {
  const [hostName, setHostName] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [discountFinal, setDiscountFinal] = useState(0);
  const [delivery, setDelivery] = useState(0);

  const ref = React.createRef();
  const options = {
    orientation: 'potrait',
    unit: 'in',
    format: 'a4'
  };

  function timeDiff() {
    let perimeter;

    switch (data.type) {
      case 'annually':
        perimeter = 'years';
        break;
      case 'monthly':
        perimeter = 'months';
        break;
      case 'weekly':
      case 'daily':
        perimeter = 'days';
        break;
      default:
        return 0;
    }

    const momentStart = moment(data.startPeriod);
    const momentEnd = moment(data.endPeriod);

    if (data.type === 'weekly') {
      return momentEnd.diff(momentStart, perimeter, true) / 7;
    }

    return momentEnd.diff(momentStart, perimeter, true);
  }

  function handleDiscountFinal(e) {
    if (Number(e.target.value) > subTotal() + otherTotal() + delivery) {
      setDiscountFinal(0);
    } else {
      setDiscountFinal(e.target.value);
    }
  }

  function subTotal() {
    return (100 - data.discount) / 100 * data[data.type] * timeDiff();
  }

  function splitPointNumber(input) {
    const str = ''+input;
    const splitted = str.split('.');
    splitted[0] = splitted[0].split(',').join('');
    
    return _.map(splitted, item => Number(item));
  }

  function finalWords() {
    const formatted = formatNumber(finalTotal());
    const splitted = splitPointNumber(formatted);

    return `${inWords(splitted[0]) || 'nol'} koma ${inWords(splitted[1]) || 'nol'}`
  }

  function taxPrice() {
    return data.tax / 100 * total();
  }

  function otherPriceConverter() {
    return _.map(_.get(data, 'otherExpenses', []), item => Number(item.price));
  }

  function otherTotal() {
    return _.reduce(otherPriceConverter(), (sum, n) => sum + n) || 0;
  }

  function total() {
    return subTotal() + otherTotal() + Number(delivery) - Number(discountFinal)
  }

  function finalTotal() {
    return total() + taxPrice();
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
                <span>: {printStrForm(data._id)}</span>
                <span>: {printStrForm(data.customer)}</span>
                <span>: {printStrForm(name)}</span>
                <span>: {printStrForm(address)}</span>
              </Col>
              <Col className="d-flex flex-column" md="2">
                <span>Tanggal</span>
                <span>Mata Uang</span>
                <span>Term</span>
                <span>Pool</span>
              </Col>
              <Col className="d-flex flex-column" md="3">
                <span>: {printDate(null, false, true)}</span>
                <span>: {printStrForm(data.currency)}</span>
                <span>: {printStrForm(data.type)}</span>
                <span>: {printStrForm(data.location)}</span>
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
                    <td>{printStrForm(`${printStr(data.brand)} ${printStr(data.model)} ${printStr(data.year)} ${printStr(data.policeNo)}`)}</td>
                    <td>{printDate(data.startPeriod, false)} - {printDate(data.endPeriod, false)}</td>
                    <td>{formatNumber(1)}</td>
                    <td>{printStrForm(formatNumber(data[data.type]))}</td>
                    <td>{printStrForm(formatNumber(data.discount))} %</td>
                    <td>{printStrForm(formatNumber(subTotal()))}</td>
                    <td>{printStrForm(formatNumber(data.tax))} %</td>
                  </tr>
                </tbody>
              </Table>
            </Row>
            <Row>
              <div className="my-2" style={{ height: '1px', width: '100%', background: '#D3D3D3' }} />
            </Row>
            <Row style={{ fontSize: 12 }}>
              <span>Terbilang: <em>{finalWords()}</em></span>
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
                    <span><strong>Total</strong></span>
                  </Col>
                  <Col className="d-flex flex-column" md="2">
                    <span>: - Rp</span>
                    <span>: + Rp</span>
                    <span>: + Rp</span>
                    <span><strong>: Rp</strong></span>
                  </Col>
                  <Col className="d-flex flex-column" md="5">
                    <Row className="justify-content-end">
                      <span>{printStrForm(formatNumber(discountFinal || 0))}</span>
                    </Row>
                    <Row className="justify-content-end">
                      <span>{printStrForm(formatNumber(taxPrice()))}</span>
                    </Row>
                    <Row className="justify-content-end">
                      <span>{printStrForm(formatNumber(delivery || 0))}</span>
                    </Row>
                    <Row className="justify-content-end">
                      <span><strong>{printStrForm(formatNumber(finalTotal()))}</strong></span>
                    </Row>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <div className="my-2" />
            </Row>
            <Row className="justify-content-around" style={{ fontSize: 12 }}>
              <Col md="4" style={{ height: '30mm' }} className="border-bottom d-flex flex-column justify-content-between">
                <Row className="justify-content-center">
                  <span>Customer</span>
                </Row>
                <Row className="justify-content-center">
                  <span>{name}</span>
                </Row>
              </Col>
              <Col md="4" style={{ height: '30mm' }} className="border-bottom d-flex flex-column justify-content-between">
                <Row className="justify-content-center">
                  <span>PT. Trans Pacific Global</span>
                </Row>
                <Row className="justify-content-center">
                  <span>{hostName}</span>
                </Row>
              </Col>
            </Row>
            <Row className="justify-content-around" style={{ fontSize: 12 }}>
              <Col md="4">
                <Row className="justify-content-center">
                  <span>{data.customer}</span>
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
                <Form.Label>Enter Employee Name</Form.Label>
                <Form.Control required type="text" placeholder={`Enter name`} onChange={ e => setHostName(e.target.value) } value={ hostName }/>
                <Form.Control.Feedback type="invalid">
                  Please enter employee name.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className='mt-2'>
                <Form.Label>Enter Customer PIC</Form.Label>
                <Form.Control required type="text" placeholder={`Enter name`} onChange={ e => setName(e.target.value) } value={ name }/>
                <Form.Control.Feedback type="invalid">
                  Please enter customer name.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className='mt-2'>
                <Form.Label>Enter Customer Address</Form.Label>
                <Form.Control required as="textarea" rows="5" placeholder={`Enter name`} onChange={ e => setAddress(e.target.value) } value={ address }/>
                <Form.Control.Feedback type="invalid">
                  Please enter customer name.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className='mt-2'>
                <Form.Label>Enter Discount Final</Form.Label>
                <Form.Control required type="number" rows="5" placeholder={`Enter number`} onChange={ handleDiscountFinal } value={ discountFinal }/>
                <Form.Control.Feedback type="invalid">
                  Please enter final discount.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className='mt-2'>
                <Form.Label>Enter Delivery Fee</Form.Label>
                <Form.Control required type="number" rows="5" placeholder={`Enter number`} onChange={ e => setDelivery(e.target.value) } value={ delivery }/>
                <Form.Control.Feedback type="invalid">
                  Please enter delivery.
                </Form.Control.Feedback>
              </Form.Group>
            </Form>
            <Col>
              <span>{JSON.stringify(data)}</span>
            </Col>
          </Container>
        </Col>
      </Row>
    </Container>
  );
};

export default PdfDownload;