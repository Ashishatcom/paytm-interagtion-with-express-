var express = require('express');
var router = express.Router();
var checksum = require('../model/checksum');
var configdata = require('../config/config');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('from',{'data':configdata})
});
router.post('/topay',function(req, res) {
  var paramlist = req.body;
  var paramarray = new Array();
  for (name in paramlist)
  {
    if (name == 'PAYTM_MERCHANT_KEY') {
         var PAYTM_MERCHANT_KEY = paramlist[name] ; 
      }else
      {
      paramarray[name] = paramlist[name] ;
      }
  }
  paramarray['CALLBACK_URL'] = 'http://localhost:3000/users/response';  
  checksum.genchecksum(paramarray, PAYTM_MERCHANT_KEY, function (err, result) 
  {
     res.render('redirect.ejs',{ 'restdata' : result });
  });
});

	router.post('/response', function(req,res){
   var paramlist = req.body;
        var paramarray = new Array();
        if(checksum.verifychecksum(paramlist, configdata.PAYTM_MERCHANT_KEY))
        {   
               res.render('response.ejs',{ 'restdata' : "true" ,'paramlist' : paramlist});
        }else
        {
          res.render('response.ejs',{ 'restdata' : "false" , 'paramlist' : paramlist});
        };
  });

module.exports = router;
