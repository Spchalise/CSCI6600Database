var express = require('express')
var app = express();
var mysql = require('mysql');
var dbconfig = require('../config/database');
var connection = mysql.createConnection(dbconfig.connection);

connection.query('USE ' + dbconfig.database);
// SHOW LIST OF USERS
app.get('/list', function(req, res, next) {
	console.log( req.body);
        connection.query('SELECT * FROM assignment',function(err, rows, fields) {
			if (err) {
				req.flash('error', err)
				res.render('assignment/list', {
					title: 'Assignment List', 
					data: ''
				})
			} else {
				console.log("inside list ", rows);
				// render to views/user/list.ejs template file
				res.render('assignment/list', {
					title: 'Assignment List', 
					data: rows
				})
			}
		})
	})

// SHOW ADD Student FORM
app.get('/add', function(req, res, next){	
	res.render('assignment/add', {
		title: 'Grade Assignment',
		assignmentID: '',
		courseID: '',
		studentID: '',
		points: ''	
	})
})

// ADD NEW Student POST ACTION
app.post('/add', function(req, res, next){	
		var assignment = {
			assignmentID: req.body.assignmentID,
			courseID: req.body.courseID,
			studentID:req.body.studentID,
			points: req.body.points
		}
		console.log("Assignment grade display here ", assignment);
		
		connection.query('INSERT INTO assignment SET ?', assignment, function(err, result) {
			console.log("err",err);
				if (err) {
					req.flash('error', err)
					
					// render to views/user/add.ejs
					res.render('assignment/add', {
						title: 'Add New Student',
						assignmentID: assignment.assignmentID,
						courseID: assignment.courseID,
						studentID: assignment.studentID,
						points: assignment.points			
					})
				} else {				
					req.flash('success', 'Data added successfully!')
				
					res.render('assignment/add', {
						title: 'Grade Assignment',
						assignmentID: '',
						courseID: '',
						studentID: '',
						points: ''	
					})
				}
			})

})

app.get('/edit/:studentID', function(req, res, next){
	console.log(req.params, "test")
	connection.query('SELECT * FROM assignment WHERE studentID = ?', [req.params.studentID], function(err, rows, fields) {
			if(err) throw err
			
			if (rows.length <= 0) {
				req.flash('error', 'Student not found with studentID = ' + req.params.studentID)
				res.redirect('/assignment/list')
			} 
			else { 
				console.log("rows -->",rows[0])
				res.render('assignment/edit', {
					title: 'Edit Assignment', 
					assignmentID: rows[0].assignmentID,
					courseID: rows[0].courseID,
					studentID: rows[0].studentID,
					points: rows[0].points	
					
								
				})
			}			
		})
})

// EDIT USER POST ACTION
app.post('/edit/:studentID', function(req, res, next) {
    
	var assignment = {
		assignmentID: req.body.assignmentID,
		courseID: req.body.courseID,
		studentID:req.body.studentID,
		points: req.body.points
	}
    if(req.body.points){
        connection.query('UPDATE assignment SET ? WHERE studentID = ' + req.params.studentID, assignment, function(err, result) {
    
            //if(err) throw err
            if (err) {
                req.flash('error', err)
            
            } else {                
                req.flash('success', 'Data edited successfully!')
                
				res.render('assignment/add', {
					title: 'Edit Assignment',
					assignmentID: '',
					courseID: '',
					studentID: '',
					points: ''	
				})
            }
        })
    }else{
        alert("Please select studentID");
    }
    

})

//delet
app.post('/delete/(:studentID)', function(req, res, next) {
    var assignment= { studentID: req.params.studentID }
    
        console.log("assignment", assignment);
    connection.query('DELETE FROM assignment WHERE studentID = ' + req.params.studentID, assignment, function(err, result) {
            if (err) {
                req.flash('error', err)
                res.redirect('/assignment/list')
            } else {
                req.flash('success', 'Student deleted successfully! studentID = ' + req.params.studentID)
                res.redirect('/assignment/list')
            }
        })
})
module.exports = app