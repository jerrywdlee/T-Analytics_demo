var express = require('express');
var bodyParser = require('body-parser')
var app = express();

app.set('views', 'views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


app.get('/', function(req, res){

    //set default variables
    var totalStudents = 80,
        pageSize = 8,
        pageCount = 80/8,
        currentPage = 1,
        students = [],
        studentsArrays = [],
        studentsList = [];

    //genreate list of students
    for (var i = 1; i < totalStudents; i++) {
        students.push({name: 'Student Number ' + i});
    }

    //split list into groups
    while (students.length > 0) {
        studentsArrays.push(students.splice(0, pageSize));
    }

    //set current page if specifed as get variable (eg: /?page=2)
    if (typeof req.query.page !== 'undefined') {
        currentPage = +req.query.page;
    }

    //show list of students from group
    studentsList = studentsArrays[+currentPage - 1];

    //render index.ejs view file
    res.render('_simple_nodeJs_pagination.ejs', {
        students: studentsList,
        pageSize: pageSize,
        totalStudents: totalStudents,
        pageCount: pageCount,
        currentPage: currentPage
    });
});

app.get('/ajax/pagination', function(req, res){
    var students = create_students();
    var pageSize = 20;
    var currentPage = 1;
    //set current page if specifed as get variable (eg: /?page=2)
    if (typeof req.query.pageNumber !== 'undefined') {
        currentPage = +req.query.pageNumber;
    }
    if (req.query.pageSize) {
        pageSize = +req.query.pageSize;
    }
    var pageCount = Math.ceil(students.length/pageSize)

    //show list of students from group
    var studentsList = page_offset(pageSize, currentPage, students)

    /*
    res.send(JSON.stringify({
      pageSize : pageSize,
      currentPage : currentPage,
      pageCount : pageCount,
      studentsList : studentsList
    }))*/
    res.send({
      pageSize : pageSize,
      currentPage : currentPage,
      pageCount : pageCount,
      studentsList : studentsList
    })

});

app.post('/ajax/pagination', function(req, res){
  var students = create_students();
  var pageSize = req.body.pageSize? req.body.pageSize : 20;
  var currentPage = req.body.pageNumber? req.body.pageNumber : 1;
  var pageCount = Math.ceil(students.length/pageSize)
  //show list of students from group
  var studentsList = page_offset(pageSize, currentPage, students)
  res.send({
    pageSize : pageSize,
    currentPage : currentPage,
    pageCount : pageCount,
    studentsList : studentsList
  })
})

app.post('/ajax_test',function (req, res) {
  /*
  req.on('data', function(chunk) {
      console.log(chunk);
      res.send(chunk)
  });*/
  // must use body-parser
  console.log(req.body);// { name: 'Ajax Post', url: 'www.google.com' }
  res.send(req.body)
})

app.get('/ajax_test',function (req, res){
  console.log(req.query)// { name: 'Ajax Get', url: 'www.google.com' }
  res.send(req.query)
})

//app.post('/ajax/')

var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});

var create_students = function () {
  //set default variables
  var totalStudents = 80,
      pageSize = 8,
      pageCount = 80/8,
      currentPage = 1,
      students = [],
      studentsArrays = [],
      studentsList = [];

  //genreate list of students
  for (var i = 1; i < totalStudents; i++) {
      students.push({name: 'Student Number ' + i});
  }
  return students;
}

var page_offset = function (pageSize, currentPage, array) {
  //split list into groups
  var studentsArrays = []
  while (array.length > 0) {
      studentsArrays.push(array.splice(0, pageSize));
  }
  return studentsArrays[currentPage-1]
}
