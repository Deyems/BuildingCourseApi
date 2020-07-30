const Joi  = require('joi');
//A class is returned from the joi module
const express = require('express');

const courses = [
    {id: 1, name: 'course1'},
    {id: 2, name: 'course2'},
    {id: 3, name: 'course3'},
];

const app = express();
app.use(express.json());

app.get('/', (req,res) => {
    res.end('Hello My World!');
});

//GET ALL Courses
app.get('/api/courses',  (req,res) => {
    res.send(courses);
    // res.send([1,2,3]);
});

//GET Single Courses
app.get('/api/courses/:id',  (req,res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) return res.status(404).send('The course was not found');
    res.send(course);
});

//Multiple ROUTE parameters
app.get('/api/posts/:year/:month',  (req,res) => {
    // console.log(req.params);
    // res.write(req.param.id);
    res.send(req.query);
});


//A TRIVIAL WAY TO VALIDATE
// app.post('/api/courses',(req,res) => {
//     //ALWAYS VALIDATE YOUR INPUT
//     if(!req.body.name || req.body.name.length < 3){
//         res.status(400).send('Enter a valid name not less than 3 characters');
//         return;
//     }
//     const course = {
//         id: courses.length+1,
//         name: req.body.name,
//     }
//     courses.push(course);
//     res.send(course);
// });

//WHAT REAL WORLD APPS ARE BASICALLY USING
app.post('/api/courses',(req,res) => {
    //ALWAYS VALIDATE YOUR INPUT
    //Create your Schema for the JOI module
    // const schema = Joi.object({
    //     name: Joi.string().min(3).required()
    // });

    //Validate your Module
    const {error} = validateCourse(req.body);
    // console.log(;

    if(error){
        return res.status(400).send(error.details[0].message);
    }

    const course = {
        id: courses.length+1,
        name: req.body.name,
    }
    courses.push(course);
    res.send(course);
});

app.put('/api/courses/:id',(req,res) => {
//Look up the course
//If not existing, return 404
const course = courses.find(c => c.id === parseInt(req.params.id));
if(!course) return res.status(404).send(`The course with the id:  is not found`);

//Validate
//If invalid, return 400 - Bad request
// const schema = Joi.object({
//     name: Joi.string().min(3).required()
// });


// const result = schema.validate(req.body);
// if(result.error){
// res.status(400).send(result.error.details[0].message);
// return;
// }
//Instead of the ABOVE, we can destructure 
//Our Object
    const {error} = validateCourse(req.body);
if(error){
    return res.status(400).send(error.details[0].message);
}

//Update course
//Return the updated course 
course.name = req.body.name;
    res.send(course);
});

//Responding to DELETE Request
app.delete('/api/courses/:id',(req,res) => {
    //Look up the course
    //Not exist? Return 404 error
    //Delete if exist
    //Return deleted course

    const deletedcourse = courses.find(c => c.id === parseInt(req.params.id));
    // console.log(deletedcourse);

    if(!deletedcourse){
        return res.status(404).send('No course with this ID');
    }
    let idx = courses.indexOf(deletedcourse);
    courses.splice(idx,1);
    res.send(deletedcourse);
});


const validateCourse = (course) => {
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });

    return schema.validate(course);
}

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
