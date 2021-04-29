var express = require('express')
var app = express();
var mysql = require('mysql');
var dbconfig = require('../config/database');
var connection = mysql.createConnection(dbconfig.connection);

connection.query('USE ' + dbconfig.database);
// SHOW LIST OF USERS
app.get('/list', function(req, res, next) {
	console.log( req.body);
        connection.query('SELECT * FROM student',function(err, rows, fields) {
		   //console.log("STUDNETS info ", rows);
			//if(err) throw err
			if (err) {
				req.flash('error', err)
				res.render('student/list', {
					title: 'Student List', 
					data: ''
				})
			} else {
				console.log("inside list ", rows);
				// render to views/user/list.ejs template file
				res.render('student/list', {
					title: 'Student List', 
					data: rows
				})
			}
		})
	})

// SHOW ADD Student FORM
app.get('/add', function(req, res, next){	
	// render to views/user/add.ejs
	res.render('student/add', {
		title: 'Add New Student',
		firstname: '',
		lastname: '',
		date_of_birth: '',
		studentDepartment: '',
		email: ''		
	})
})

// ADD NEW Student POST ACTION
app.post('/add', function(req, res, next){	
		var student = {
			firstname: req.body.firstname,
			lastname: req.body.lastname,
			date_of_birth:req.body.date_of_birth,
			email: req.body.email,
			studentDepartment: req.body.studentDepartment
		}
		console.log("student values display here ", student);
		
		connection.query('INSERT INTO student SET ?', student, function(err, result) {
			console.log("err",err);
				//if(err) throw err
				if (err) {
					req.flash('error', err)
					
					// render to views/user/add.ejs
					res.render('student/add', {
						title: 'Add New Student',
						firstname: student.firstname,
						lastname: student.lastname,
						date_of_birth: student.date_of_birth,
						studentDepartment: student.studentDepartment,
						email: student.email					
					})
				} else {				
					req.flash('success', 'Data added successfully!')
					
					// render to views/user/add.ejs
					//res.render('student/list')
					res.render('student/add', {
						title: 'Add New Student',
						firstname: '',
						lastname: '',
						date_of_birth: '',
						studentDepartment: '',
						email: ''		
					})
				}
			})

})

app.get('/edit/:studentID', function(req, res, next){
	console.log(req.params, "test")
	connection.query('SELECT * FROM student WHERE studentID = ?', [req.params.studentID], function(err, rows, fields) {
			if(err) throw err
			
			// if user not found
			if (rows.length <= 0) {
				req.flash('error', 'Student not found with studentID = ' + req.params.studentID)
				res.redirect('/student/list')
			} 
			else { // if user found
				// render to views/user/edit.ejs template file

				console.log("rows -->",rows[0])
				res.render('student/edit', {
					title: 'Edit Student', 
					studentID: rows[0].studentID,
					firstname: rows[0].firstname,
					lastname: rows[0].lastname,
					date_of_birth: formattedDate(new Date(rows[0].date_of_birth)),
					studentDepartment: rows[0].studentDepartment,
					email: rows[0].email	
					
								
				})
			}			
		})
})



// EDIT USER POST ACTION
app.post('/edit/:studentID', function(req, res, next) {
    
    var student = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        date_of_birth:req.body.date_of_birth,
        email: req.body.email,
        studentDepartment: req.body.studentDepartment
    }
    if(req.body.date_of_birth){
        connection.query('UPDATE student SET ? WHERE studentID = ' + req.params.studentID, student, function(err, result) {
    
            //if(err) throw err
            if (err) {
                req.flash('error', err)
            
            } else {                
                req.flash('success', 'Data edited successfully!')
                
                res.render('student/add', {
                    title: 'Add New User',
                    firstname: '',
                        lastname: '',
                        date_of_birth: '',
                        studentDepartment: '',
                        email: ''                       
                })
            }
        })
    }
    

})

//delet
app.post('/delete/(:studentID)', function(req, res, next) {
    var student = { studentID: req.params.studentID }
    
        console.log("student", student);
    connection.query('DELETE FROM student WHERE studentID = ' + req.params.studentID, student, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                // redirect to users list page
                res.redirect('/student/list')
            } else {
                req.flash('success', 'Student deleted successfully! studentID = ' + req.params.studentID)
                // redirect to users list page
                res.redirect('/student/list')
            }
        })
})

function formattedDate(date){
    if (date) {
      const datePart = date.getDate();
      const monthPart = date.getMonth() + 1;
      const yearPart = date.getFullYear();

      return (yearPart) + '-' + (monthPart < 10 ? '0' + monthPart : monthPart) + '-' + (datePart < 10 ? '0' + datePart : datePart);

    }
}

module.exports = app
