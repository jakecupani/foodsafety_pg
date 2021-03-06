const express = require('express');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/*
 * The 'express.static' middleware provides some services Express can use to
 * serve files from a directory - in this case, the 'public' subdirectory of
 * this project.
 *
 * The 'app.use' function attaches middleware to our Express application, so
 * that when the application is running, it can serve static files. In this
 * case, we mount it over the entire app: any web request that GETs a path that
 * exists in the 'public' directory will be handled by the middleware. The
 * middleware also serves the 'index.html' file in a directory (if it exists)
 * whenever a client requests the directory itself.
 *
 * The 'public' directory for this project, in turn, contains all the HTML,
 * Javascript, and CSS files needed to run a simple chat client connected to
 * this server. Accessing this server's root URL will serve 'public/index.html',
 * which contains our chat client. This gives users an easy way to connect to
 * the server and interact with other users.
 *
 * See also:
 *  - Express: Serving static files in Express
 *    https://expressjs.com/en/starter/static-files.html
 *  - Express: express.static()
 *    https://expressjs.com/en/4x/api.html#express.static
 *  - Express: Using middleware
 *    https://expressjs.com/en/guide/using-middleware.html
 *  - Express: app.use()
 *    https://expressjs.com/en/4x/api.html#app.use
 */
app.use(express.static('src'));

// this is a single route, in the simplest possible format
// the simplest format is not necessarily the best one.
// this is, right now, an introduction to Callback Hell
// but it is okay for a first-level example
app.get('/api', (req, res) => {
  const baseURL = 'https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json';
  fetch(baseURL)
    .then((r) => r.json())
    .then(res => {
      let mapdata = res.map(function (data) { return data });
      mapdata.map(el => {
        if (el.inspection_results === "------") {
          el.inspection_results = "No inspection results available.";
        }
      });
      // console.log(mapdata);
      return mapdata;
    })
    .then((data) => {
      res.send({ data: data });
    })
    .catch((err) => {
      console.log(err);
      res.redirect('/error');
    });
});

let messages = [];
app.get('/messages', function (req, res) {
  res.json(messages);
});

app.post('/messages', function (req, res) {
  // messages.push(request.body)
  var user_name = req.body.user;
  var message = req.body.message;
  console.log("User name = " + user_name + ", message is " + message);
  res.end("yes");
});

app.put('/messages/:user', function (req, res) {
  let user = Number(req.body.user);
  let msg = request.body.message;
  let temp = messages.find((el) => el.user === user);
  let index = messages.indexOf(temp);

  if (!temp) {
    response.status(500).send('Your message was not found.');
  } else {
    messages[index].message = msg;
    response.send('Message updated.')
  }

});

app.listen(PORT, () => {
  console.log(`Our app is running on port ${PORT}`);
});
