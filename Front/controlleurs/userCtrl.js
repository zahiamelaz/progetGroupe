const fetch = require('node-fetch');
const LocalStorage = require('node-localstorage').LocalStorage;
const localStorage = new LocalStorage('./scratch');

// FUNCTIONS //
exports.addUser = async (req, res) => {
    fetch('http://localhost:8080/api/register', {
        // Adding method type
        method: "POST",
        // Adding contents to send
        body: JSON.stringify({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
        }),
            // Adding headers to the request
            headers: {
                "Accept": 'application/json',
                "Content-Type": "application/json"
            }
    })
    .then(response => response.json())
    .then(json => {
        if (json.error) {
            console.log('------- front ------', json)
            res.render('register', json)
        } else {
            res.redirect('/login');
        }
    })
}
exports.logUser = async (req, res, next) => {

    await fetch("http://localhost:8080/api/login", {
        // Adding method type
        method: "POST",
        // Adding headers to the request
        headers: {
            "Accept": 'application/json',
            'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        // Adding contents to send
        body: JSON.stringify({
            email: req.body.email,
            password: req.body.password,
        }),
    })
    // Converting to JSON
    .then((res) => {
        return res.json()
    })
    // Displaying results to console
    .then(json => {
        console.log('toto', json);
        localStorage.setItem('token', json.token);
        const tokenFromLocalStorage = localStorage.getItem('token')
        console.log(tokenFromLocalStorage);
        if (json.token && tokenFromLocalStorage)
            res.redirect('/profile')
        else
            res.render('login',json)
    })
    .catch((err) => {
        console.error(err);
    })
}

exports.getUserByToken = async (req, res, next) => {
    // console.log('---toto---', req.params.id)
    console.log('---zak---', req.params.id)
    // il faut recuperer le id depuis le token 
    // const idByToken = 
    const response = await fetch(`http://localhost:8080/api/user/${req.params.id}`, {
        headers: {
            'Authorization': localStorage.getItem('token')// Token à récupérer 
        }
    });
    const myJson = await response.json();
    res.render('profile', { user: myJson });
    
    return next();

}
exports.updateUser = async (req, res, next) => {
    console.log('---bcdh---',req);
    const response = await fetch('http://localhost:8080/api/updateUser', {
       // Adding method type
    method: "PUT",

    // Adding body or contents to send
    body: JSON.stringify({
      username: req.body.username,
      
    }),

    // Adding headers to the request
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      Authorization: localStorage.getItem("token"), //Token à récupérer
    },
  })
    // Converting to JSON
    .then((response) => response.json())

    // Displaying results to console
    .then((json) => {
      res.render("profile", { user: json });
    });
};



// exports.getAll = async (req, res) => {

//     const response = await fetch('http://localhost:8080/api/allusers');
//     const myJson = await response.json();
//     console.log( myJson); 

//     return res.render('profile',{
//         allU : myJson
//     })
// }  





