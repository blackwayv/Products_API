const models = require('./models');

module.exports.list = (page = 1, count = 5, callback) => {
  models.list(page, count, (res) => {
    callback(res);
  });
};

module.exports.info = (product_id, callback) => {
  models.info(product_id, (res) => {
    callback(res);
  });
};

module.exports.styles = (product_id, callback) => {
  models.styles(product_id, (res) => {
    callback(res);
  });
};

module.exports.related = (product_id, callback) => {
  models.related(product_id, (res) => {
    callback(res);
  });
};