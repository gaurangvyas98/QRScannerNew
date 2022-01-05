import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useParams } from 'react-router-dom';
import gelogo from './ge_logo.png'

export default function DetailsPage() {

    const [data, setData] = useState();
    // const [qid, setQid] = useState();

    var { id } = useParams();
    console.log(id)
    // setQid(id);
    
    useEffect(() => {
        axios.get("/QRScanned", {
            params: {
              uniqueId: id
            }}).then((response) => {
                setData(response.data.entries[0])       
                console.log('Data has been received!!', response.data.entries[0]);
              })
              .catch(() => {
                alert('Error retrieving data!!!');
              });

    }, [])
    console.log('222', data);

    if(data){
        return(
        <>
        <nav className="navbar navbar-light bg-light">
            <div className="container-fluid mx-auto nav-container">
              <a className="navbar-brand" href="/">
                <img src={gelogo} alt="gelogo" width="30" height="24" className="d-inline-block text-center mx-2"/>
                GE Healthcare | QRCodeDemo
              </a>
            </div>
        </nav>
        <div className="detailsContainer">
            <h2 style={{textAlign: "center"}}>Below are the details of machine</h2><br />
            <div className="detailsDiv">
               <h4>Product Type :</h4><h5> {data.BookAuthor._}</h5> 
            </div>
            <div className="detailsDiv">
               <h4>Facility Name :</h4><h5> {data.BookTitle._}</h5> 
            </div>
            <div className="detailsDiv">
               <h4>Serial Number :</h4><h5> {data.BookPrice._}</h5> 
            </div>
            <br />
            <div className="detailsDiv">
                <button type="button" className="btn btn-primary" style={{margin: "0 auto", display: "flex"}}>
                    <a href={data.BuyURL._} target="_blank" style={{textDecoration: "none", color: "white"}}>Start SightCall</a>
                </button>
            </div>
        </div>
        </>

        )
    }
    else{
        return(
            <h1>
                LOADING.....
            </h1>
        )
    }
}