import React from 'react';
import ReactToPdf from 'react-to-pdf';
import { Button, Container, Row, Col, Table } from 'react-bootstrap';

function PdfDownload(props) {
  const ref = React.createRef();
  const options = {
    orientation: 'potrait',
    unit: 'in',
    format: 'a4'
  };
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
                <span>: __________</span>
                <span>: __________</span>
                <span>: __________</span>
                <span>: __________</span>
              </Col>
              <Col className="d-flex flex-column" md="2">
                <span>Tanggal</span>
                <span>Mata Uang</span>
                <span>Term</span>
                <span>Pool</span>
              </Col>
              <Col className="d-flex flex-column" md="3">
                <span>: __________</span>
                <span>: __________</span>
                <span>: __________</span>
                <span>: __________</span>
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
                    <td>............</td>
                    <td>............</td>
                    <td>............</td>
                    <td>............</td>
                    <td>............</td>
                    <td>............</td>
                    <td>............</td>
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
                      <span>________________</span>
                    </Row>
                    <Row className="justify-content-end">
                      <span>________________</span>
                    </Row>
                    <Row className="justify-content-end">
                      <span>________________</span>
                    </Row>
                    <Row className="justify-content-end">
                      <span>________________</span>
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
          </Container>
        </Col>
      </Row>
    </Container>
  );
};

export default PdfDownload;