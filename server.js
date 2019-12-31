const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const port = 3000;
const controllers = require('./controllers');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.listen(port, () => console.log(`Product Overview API listening on port ${port}!`));


app.get('/products/list', (req, res) => {
  //req.query
  controllers.list(req.query.page, req.query.count, (result) => {
    res.send(result);
  });
});

app.get('/products/:product_id', (req, res) => {
  controllers.info(req.params.product_id, (result) => {
    res.send(result);
  })
})

app.get('/products/:product_id/styles', (req, res) => {
  controllers.styles(req.params.product_id, (result) => {
    res.send(result);
  })
})

app.get('/products/:product_id/related', (req, res) => {
  controllers.related(req.params.product_id, (result) => {
    res.send(result);
  })
})