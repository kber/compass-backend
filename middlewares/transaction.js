const compassBookshelf = require('../models/base');

const bookshelfTxPromise = () => {
  return new Promise(function (resolve, reject) {
    compassBookshelf.transaction(function (t) {
      resolve(t);
    }).catch(function (err) {
      reject(err);
    });
  });
};

function* transaction(next) {
  this.ctx.transacting = yield bookshelfTxPromise();
  this.ctx.rollback = false;
  try {
    yield next;
    this.ctx.transacting.commit();
  } catch(err) {
    this.ctx.rollback = true;
    throw err;
  }
}

module.exports = transaction;
