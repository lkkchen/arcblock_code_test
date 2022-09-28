import request from '../libs/api';

const listTransactions = (data) => {
  return new Promise(function (resolve) {
    request({
      method: 'get',
      url: '/txs',
      data,
    }, function (result) {
      resolve(result)
    }, function () {
      resolve();
    });
  });
};

export default listTransactions;
