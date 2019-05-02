/*global require, console */

var request = require('request'), cookies = '';
request.post('https://www.hometeamsonline.com/sportswebsites/ajax/Login.asp', {form: {username: 'andrewmjohns@gmail.com', password: 'tT9aaK7WLQEEgv2'}}, function (error, response, body) {
    console.log('error:', error); // Print the error if one occurred
    cookies = response.headers['set-cookie']; // Print the response status code if a response was received
    
    request({url: 'https://www.hometeamsonline.com/admin/popups/RegistrationDownload.asp?formID=143959', headers: {Cookie: cookies}},
           function (error, response, body) {
            console.log(body);
        });
});