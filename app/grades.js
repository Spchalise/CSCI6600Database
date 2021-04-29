var express = require('express')
var app = express();
var mysql = require('mysql');
var dbconfig = require('../config/database');
var connection = mysql.createConnection(dbconfig.connection);
connection.query('USE ' + dbconfig.database);



// SHOW LIST OF USERS
app.get('/result', function(req, res, next) {
	console.log( req.body);
        var gradeFinalResults = "select courseID,t2.studentDepartment,t2.studentID,t2.total_marks,t2.firstname,t2.lastname,t2.email,(CASE WHEN t2.total_marks >= 90 THEN 'A' WHEN t2.total_marks >= 80 AND t2.total_marks < 90 THEN 'B' WHEN t2.total_marks >= 70 AND t2.total_marks < 80 THEN 'C' WHEN t2.total_marks >= 60 AND t2.total_marks < 70 THEN 'D' ELSE 'F' END) as grade from (select t1.courseID,student.studentDepartment,student.studentID,student.firstname,student.lastname,student.email,total_marks from student inner join (select assignment.courseID,studentID,avg(points) as total_marks from assignment inner join course on assignment.courseID=course.courseID group by assignment.courseID,studentID) as t1 ON student.studentID=t1.studentID) as t2";
        //connection.query('select * from student inner join (select assignment.courseID,studentID,avg(points) as total_marks from assignment inner join course on assignment.courseID=course.courseID group by assignment.courseID,studentID) as t1 ON student.studentID=t1.studentID ',function(err, rows, fields) {
        connection.query(gradeFinalResults,function(err, rows, fields) {
		   //console.log("STUDNETS info ", rows);
			//if(err) throw err
			if (err) {
				req.flash('error', err)
				res.render('grade/result', {
					title: ' Show Result List', 
					data: ''
				})
			} else {
				console.log("inside list-->> ", rows);
				// render to views/user/list.ejs template file
				res.render('grade/result', {
					title: 'Grade result', 
					data: rows
				})
			}
		})
	})
    module.exports = app