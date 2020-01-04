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
      return db.query(`SELECT feature, value FROM features WHERE product_id = ${product_id}`)
    })
    .then(res => {
      result.features = [];
      res.rows.forEach((row) => {
        let feature = {
          feature: row.feature,
          value: row.value
        };
        result.features.push(feature);
      });
      callback(result);
    })
    .catch(err => console.error(err));
};

module.exports.styles = (product_id, callback) => {
  let result = { product_id, results: [] };
  // db.query(`SELECT * FROM styles WHERE product_id = ${product_id}`)
  //   .then(res => {
  //     let promises = res.rows.map(row => {
  //       let style = {
  //         style_id: row.id,
  //         name: row.name,
  //         original_price: row.default_price,
  //         sale_price: row.sale_price,
  //         'default?': row.default_style,
  //         photos: [],
  //         skus: {}
  //       };
  //       return db.query(`SELECT thumbnail_url, url FROM photos WHERE style_id = ${row.id}`)
  //         .then(res => {
  //           res.rows.forEach(photoRow => {
  //             style.photos.push({
  //               thumbnail_url: photoRow.thumbnail_url,
  //               url: photoRow.url
  //             });
  //           })
  //           return db.query(`SELECT size, quantity FROM skus WHERE style_id = ${row.id}`)
  //         })
  //         .then(res => {
  //           res.rows.forEach(skuRow => {
  //             style.skus[skuRow.size] = skuRow.quantity;
  //           });
  //           return style;
  //         })
  //     })
  //     return Promise.all(promises);
  //   })
  //   .then(res => {
  //     result.results = res;
  //     console.log('how is this fast wtf???');
  //     callback(result);
  //   })
  //   .catch(err => console.error(err));
  db.query(`SELECT styles.*, skus.size, skus.quantity, photos.thumbnail_url, photos.url FROM styles LEFT JOIN skus ON skus.style_id = styles.id LEFT JOIN photos ON photos.style_id = styles.id WHERE styles.product_id = ${product_id};`)
  .then(res => {
    let style = {
      style_id: undefined,
      name: undefined,
      original_price: undefined,
      sale_price: undefined,
      'default?': undefined,
      photos: [],
      skus: {}
    };
    let urls = [];
    let thumbs = [];
    for (let i = 0; i < res.rows.length; ++i) {
      if (res.rows[i].id !== style.style_id && style.style_id !== undefined) {
        for (let j = 0; j < thumbs.length; ++j) {
          style.photos.push({
            thumbnail_url: thumbs[j],
            url: urls[j]
          });
        }
        result.results.push(style);
        style = {
          style_id: undefined,
          name: undefined,
          original_price: undefined,
          sale_price: undefined,
          'default?': undefined,
          photos: [],
          skus: {}
        };
        urls, thumbs = [];
      } 
      if (style.style_id === undefined) {
        style.style_id = res.rows[i].id;
        style.name = res.rows[i].name;
        style.original_price = res.rows[i].default_price;
        style.sale_price = res.rows[i].sale_price;
        style['default?'] = res.rows[i].default_style;
      }
      style.skus[res.rows[i].size] = res.rows[i].quantity;
      if (!thumbs.includes(res.rows[i].thumbnail_url)) {
        thumbs.push(res.rows[i].thumbnail_url);
      }
      if (!urls.includes(res.rows[i].url)) {
        urls.push(res.rows[i].url);
      }
      if (i === res.rows.length - 1) {
        for (let j = 0; j < thumbs.length; ++j) {
          style.photos.push({
            thumbnail_url: thumbs[j],
            url: urls[j]
          });
        }
        result.results.push(style);
      }
    }
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