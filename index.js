var express = require('express');
var cors = require('cors');
require('dotenv').config()
const bodyParser = require('body-parser');
const multer  = require('multer');
//Get field name from secrets
const myFieldName = process.env['UPLOAD_FIELD_NAME'];
//Upload variable for handling uploading of files with above name
const upload = multer({ dest: 'uploads/' }).single(myFieldName);

var app = express();

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

//Handle file upload
app.post('/api/fileanalyse', function (req, res, next) {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      return res.status(500).json({error: err});
    } else if (err) {
      // An unknown error occurred when uploading.
      return res.status(500).json({error: err});
    }
    next();
  });
}, function(req, res) {
  //If file is there extract infor and return json
  if (req.file) {
    const {originalname: name, mimetype: type, size} = req.file;
    return res.status(200).json({name, type, size});
  } else {
  //Else show error
    return res.status(500).json({error: 'No file!'});
  }
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});
