const express = require('express')
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const { itemsAggregate, itemsFind } = require('./paginated');
 
// Aggregate
app.post('/users/aggregate', (req, res) => {
    const { limit, page } = req.body;

    itemsAggregate(limit, page).then((response) => {
        res.send({
          metadata: {...response.metadata[0]},
          data: response.data,
        });
    })
    .catch((e) => res.send(`Error: ${e}`).status(500));

});

// Find
app.post('/users/find', (req, res) => {
  const { limit, page } = req.body;

  itemsFind(limit, page).then((response) => {
      res.send({ ...response });
  })
  .catch((e) => res.send(`Error: ${e}`).status(500));

});
 
app.listen(3000, () => {
  console.log('Example app listening on port 3000!')
});