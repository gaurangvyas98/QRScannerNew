import React, { useState } from 'react'
import axios from 'axios'
import gelogo from './ge_logo.png'

export default function Home() {
  const [productType, setProductType] = useState('');
  const [facilityName, setFacilityName] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [url, setUrl] = useState('');

  const [qrCode, setQRCode] = useState();


  const submit = (event) => {
    event.preventDefault();
    if(!productType || !facilityName || !serialNumber || !url){
      alert("Enter all the fields")
    }
    else{
      const payload = {
        productType,
        facilityName,
        serialNumber,
        url
      };
      axios({
        url: '/save',
        method: 'POST',
        data: payload
      })
        .then((res) => {
          console.log('Data has been sent to the server',res);
          setQRCode(res.data.qr)   
          console.log("imageURL",qrCode);
        })
        .catch(() => {
          console.log('Internal server error');
        });
    }
  };

  const reset=(e)=>{
    e.preventDefault();
    setProductType('')
    setFacilityName('')
    setSerialNumber('')
    setUrl('')
  }

  return (
      <div className="app">
          <nav className="navbar navbar-light bg-light">
            <div className="container-fluid mx-auto nav-container">
              <a className="navbar-brand" href="/">
                <img src={gelogo} alt="gelogo" width="30" height="24" className="d-inline-block text-center mx-2"/>
                GE Healthcare | QRCodeScanner
              </a>
            </div>
          </nav>
          <form>
              <h3>Generate QR Code</h3><br />
              <div className="form-group row">
                <label className="col-sm-4 col-form-label">Product Type</label>
                <div className="col-sm-8">
                  <input type="text" className="form-control" value={productType}
                  onChange={e=>setProductType(e.target.value)} required />
                </div>
              </div>
              <div className="form-group row">
                <label className="col-sm-4 col-form-label">Facility Name</label>
                <div className="col-sm-8">
                  <input type="text" className="form-control"  value={facilityName}
                  onChange={e=>setFacilityName(e.target.value)} required />
                </div>
              </div>
              <div className="form-group row">
              <label className="col-sm-4 col-form-label">Serial Number</label>
                <div className="col-sm-8">
                <input type="text" className="form-control" value={serialNumber}
                  onChange={e=>setSerialNumber(e.target.value)} required />
                </div>
              </div>
              <div className="form-group row">
              <label className="col-sm-4 col-form-label">URL</label>
                <div className="col-sm-8">
                <input type="text" className="form-control" value={url}
                  onChange={e=>setUrl(e.target.value)} required />
                </div>
              </div>
              <br />
              <button onClick={submit} className="btn btn-primary mx-2">Generate</button>
              <button onClick={reset} className="btn mx-2" style={{backgroundColor: 'lightgrey'}}>Reset</button>
          </form>
          {
            qrCode ? (
              <div className="content-div text-center">
                <h4 >Below is the QR Code generated, please scan to test</h4>
                <img src={qrCode} alt="qrcode"></img> 
              </div> 
            ) : ''
          }
      </div>
 )
}
