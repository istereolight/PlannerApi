const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const fs = require('fs');
const cors = require('cors');
const multer = require('multer');
const { error } = require('console');


const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.set('view engine', 'jade');
app.use(cors());

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, __dirname + '/database');
  },
  filename: (req, file, callback) => {
    const filename = `data.json`;
    callback(null, filename);
  }
})

const upload =  multer({ storage: storage });

app.post('/upload', upload.any(), (req, res) => {
  if (!req.files) {
    return res.status(400).json({error: 'Предоставьте файл для загрузки!'})
  }
  res.status(200).json({status:'success'})
})

app.get('/cells', (req, res) => {
  try {
    const json = fs.readFileSync('./database/data.json')
    res.send(json);
  } catch {
    console.error('Error in cells update', error)
    res.status(500).json({error: 'Internal server error'})
  }
})

app.post('/update', (req, res) => {
  const {cells} = req.body;
  if (!cells) {
    return res.status(400).json({error: 'Заполните все поля!'})
  }
  try {
    fs.writeFileSync('./database/data.json', cells);
    res.status(200).json({status: 'success'})
  } catch(error) {
    console.error('Error in cells update', error)
    res.status(500).json({error: 'Internal server error'})
  }
})

app.get('/download', (req, res) => {
  try {
    res.download('./database/data.json')
  } catch {
    console.error('Error downloading file', error)
    res.status(500).json({error: 'Internal server error'})
  }
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
