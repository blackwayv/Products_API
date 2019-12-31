const db = require('./db');

module.exports.list = (page, count, callback) => {
  let start = ((Number(page) - 1) * Number(count)) + 1;
  let end = start + Number(count);
  db.query(`SELECT * FROM products WHERE id >= ${start} AND id < ${end}`)
    .then(res => callback(res.rows))
    .catch(err => console.error(err));
};

module.exports.info = (product_id, callback) => {
  let result = {};
  db.query(`SELECT * FROM products WHERE id = ${product_id}`)
    .then(res => {
      result = res.rows[0];
      return db.query(`SELECT * FROM features WHERE product_id = ${product_id}`)
    })
    .then(res => {
      result.features = [];
      res.rows.forEach((row) => {
        let feature = {};
        feature.feature = row.feature;
        feature.value = row.value;
        result.features.push(feature);
      });
      callback(result);
    })
    .catch(err => console.error(err));
};

module.exports.styles = (product_id, callback) => {
  let result = { product_id, results: [] };
  db.query(`SELECT * FROM styles WHERE product_id = ${product_id}`)
    .then(res => {
      let promises = res.rows.map(row => {
        let style = {
          style_id: row.id,
          name: row.name,
          original_price: row.default_price,
          sale_price: row.sale_price,
          'default?': row.default_style,
          photos: [],
          skus: {}
        };
        return db.query(`SELECT * FROM photos WHERE style_id = ${row.id}`)
        .then(res => {
          res.rows.forEach(photoRow => {
            style.photos.push({
              thumbnail_url: photoRow.thumbnail_url,
              url: photoRow.url
            })
          })
          return db.query(`SELECT * FROM skus WHERE style_id = ${row.id}`)
        })
        .then(res => {
          res.rows.forEach(skuRow => {
            style.skus[skuRow.size] = skuRow.quantity;
          });
          return style;
        })
      })
      return Promise.all(promises);
    })
    .then(res => {
      result.results = res;
      callback(result);
    })
    .catch(err => console.error(err));
};

module.exports.related = (product_id, callback) => {
  let result = [];
  db.query(`SELECT * FROM related WHERE current_id = ${product_id}`)
    .then(res => {
      res.rows.forEach(row => result.push(row.related_id))
      callback(result);
    })
    .catch(err => console.error(err));
};