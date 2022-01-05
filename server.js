// Import npm packages
const express = require('express');
const morgan = require('morgan');
const azure = require('azure-storage');
const path = require('path');
const { v1: uuidv1 } = require('uuid');
const QRCode = require('easyqrcodejs-nodejs');

const app = express();
const PORT = process.env.PORT || 8080; // Step 1


// Data parsing
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// HTTP request logger
app.use(morgan('tiny'));
// app.use('/api', routes);


// Routes
app.post('/save', (req, res) => {
    console.log(req.body)
    var strBody = req.body;
    // save into azure Storage
    var uniqId = uuidv1();
    insertIntoAzure(strBody, uniqId, res);
});

const generateQRandSave = async text => {
  const logoPath = path.join(__dirname, '\ge_logo.png');
  try{
    var options = {
      text: text,
      logo: logoPath
    };
    var qrcode = new QRCode(options);
    return await qrcode.toDataURL();
  }
  catch(err){
    console.log(err)
  }
}
 
async function  insertIntoAzure(inputObj, uniqId, res)  {
    let tableService = azure.createTableService("saqrdemo","/1gsWe9n9smSPdc1QCiGcBFqNnmWbzU+qpZxZGSktrmm6lylbkFnOvFChxuib+GejmlYqoZThpF5mG2ezscF5w==");
    
    // console.log('Author test :'+ inputObj.bkAuthor+ " "+ uniqId);
    
    var itemObj = {
      PartitionKey : {'_': 'QRDATA', '$':'Edm.String'},
      RowKey: {'_': uniqId, '$':'Edm.String'},
      BookAuthor: {'_': inputObj.facilityName, '$':'Edm.String'},
      BookPrice: {'_': inputObj.serialNumber, '$':'Edm.String'},
      BookTitle: {'_': inputObj.productType, '$':'Edm.String'},
      BuyURL: {'_': inputObj.url, '$':'Edm.String'}
    };
  
    await tableService.insertEntity('tblQRData', itemObj, { echoContent: true }, function (error, result, response) {
      if (!error) {
        console.log(response);
        if (response.statusCode == 201 && response.isSuccessful) {
          //create QR Code
          isSuccess = true;
          generateQRandSave("https://geqr.herokuapp.com/QRScanned/"+uniqId).then(str => {
            console.log("QRCode String", str);
            res.json({qr: str})
          });
          // res.end(qrCodeString);
        }
      } else {
        console.log(error);
        return res.json({'error': 'Oops! There was an error, please try again.'});
      }
    });
  }

//GET - QRScanned
app.get("/QRScanned", (req,res)=>{
  const qid = req.query.uniqueId;
  console.log(qid)
  //get Data
  let tableService = azure.createTableService("saqrdemo","/1gsWe9n9smSPdc1QCiGcBFqNnmWbzU+qpZxZGSktrmm6lylbkFnOvFChxuib+GejmlYqoZThpF5mG2ezscF5w==");
  //console.log('Trying to connect');
  if (tableService != null)  {
    //console.log('9390166268 to Table');
    var query = new azure.TableQuery()
    .where('PartitionKey eq ?', 'QRDATA')
    .and ('RowKey eq ?',''+qid);

    tableService.queryEntities('tblQRData',query, null, function(error, result, response) {
        if(!error) {
          //console.log('result.entries - ' + result.entries.length);//.entries.length);
          console.log(result.entries);
          if (result.entries.length> 0) {
              //returned the response as json
              res.json(result)
          }
          else {
            // res.json({'error': 'Oops!! Sorry we could find any data with QR code scanned.'});
            strQRScanHTMLCOde = 'Oops!! Sorry we could find any data with QR code scanned.';
            res.end(strQRScanHTMLCOde);
          }
        }
        else {
          // res.json({'error': 'Error! Please contact support team.'});
          strQRScanHTMLCOde = 'Error! Please contact support team.';
          res.end(strQRScanHTMLCOde);
          console.log(error);
        }
      });
    tableService = null;  
  }
})


//GET - ADMIN DATA
app.get("/getAllData", (req,res)=>{
  //get Data
  let tableService = azure.createTableService("saqrdemo","/1gsWe9n9smSPdc1QCiGcBFqNnmWbzU+qpZxZGSktrmm6lylbkFnOvFChxuib+GejmlYqoZThpF5mG2ezscF5w==");
  
  if (tableService != null)  {
    var query = new azure.TableQuery()
    // .top(5)
    .where('PartitionKey eq ?', 'QRDATA');

    tableService.queryEntities('tblQRData',query, null, function(error, result, response) {
        if(!error) {
          console.log(result.entries);
          if (result.entries.length> 0) {
              //returned the response as json
              res.json(result)
          }
          else {
            res.json({'error': 'Oops!! Sorry there is no data in db.'});
            // strQRScanHTMLCOde = 'Oops!! Sorry we could find any data with QR code scanned.';
            // res.end(strQRScanHTMLCOde);
          }
        }
        else {
          res.json({'error': 'Error! Please contact support team.'});
          // strQRScanHTMLCOde = 'Error! Please contact support team.';
          // res.end(strQRScanHTMLCOde);
          console.log(error);
        }
      });
    tableService = null;  
  }
})

//FOR PRODUCTION
if(process.env.NODE_ENV=="production"){
  app.use(express.static('client/build'))
  const path = require('path')
  app.get("*",(req,res)=>{
      res.sendFile(path.resolve(__dirname,'client','build','index.html'))
  })
}


app.listen(PORT, console.log(`Server is starting at ${PORT}`));
