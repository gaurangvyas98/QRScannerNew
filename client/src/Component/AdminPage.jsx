import React, { useEffect, useState } from 'react'
import gelogo from './ge_logo.png'

export default function AdminPage() {
    const [data, setData] = useState([])
    const [searchTerm, setSearchTerm] = useState([])
    useEffect(() => {
        fetch('/getAllData',{
            method: "GET",
            headers: {
                'Content-Type': "application/json"
            }
        }).then(res => res.json())
        .then(res => {
            setData(res.entries)
        })
        .catch(err =>{
            console.log(err)
        })
    }, [])
    // console.log(data.BookAuthor._)
    return (  
        <div>
        <nav className="navbar navbar-light bg-light">
            <div className="container-fluid mx-auto nav-container">
              <a className="navbar-brand">
                <img src={gelogo} alt="gelogo" width="30" height="24" className="d-inline-block text-center mx-2"/>
                GE Healthcare | QRCodeDemo
              </a>
            </div>
        </nav>
        <div className="searchInput">
            <input type="text" placeholder="Enter string to search" 
                onChange={e=>setSearchTerm(e.target.value)} />
        </div>
        <table className="table table-striped table-hover">
        <thead>
            <tr>
                <th scope="col">#</th>
                <th scope="col">Product Type</th>
                <th scope="col">Facility Name</th>
                <th scope="col">Serial Number</th>
                <th scope="col">QR Code</th>
            </tr>
        </thead>
        <tbody>
        {data.filter(val=>{
            var productType = val.BookAuthor._
            var facilityName = val.BookTitle._
            if(searchTerm == ""){
                return val;
            }
            else if(productType.toLowerCase().includes(searchTerm.toLowerCase()) || facilityName.toLowerCase().includes(searchTerm.toLowerCase())){
                return val
            }
        }).map((res,index)=>{
            return(
                <tr key={index}>
                    <th scope="row">{index+1}</th>
                    <td>{res.BookAuthor._}</td>
                    <td>{res.BookTitle._}</td>
                    <td>{res.BookPrice._}</td>
                </tr>
            )
        })}
        </tbody>
        </table>
        </div>  
    )
}



// {data.map((res, index) => {
//     return(
    // <tr>
    //     <th scope="row">{index}</th>
    //     <td>{res.BookAuthor._}</td>
    //     <td>{res.BookTitle._}</td>
    //     <td>{res.BookPrice._}</td>
    // </tr>
//     )
//     }
// }

// data.filter(val => {
    // var productType = val.BookAuthor._
    // if(searchTerm == ""){
    //     return val;
    // }
//     else if(productType.toLowerCase().includes(searchTerm.toLowerCase())){
//         return val
//     }
//     }
// })