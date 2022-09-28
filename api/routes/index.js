const middleware = require('@blocklet/sdk/lib/middlewares');
const router = require('express').Router();
const logger = require('../libs/logger');

const { listTransaction } = require('../services/etherscan_service');

router.use('/user', middleware.user(), (req, res) => res.json(req.user || {}));
router.use('/txs', (req, res) => {
  let page = 1, pageSize = 50;
  // 暂时没有研究透 etherscan 是怎么传参数分页的 所以这里先固定50
  if(req.query.p && !isNaN(req.query.p)){
    page = parseInt(req.query.p)
  }
  const params = {
    address: req.query.a,
    page: page,
    pageSize: pageSize,
  };
  listTransaction(params).then((result) => {
    res.send({code: 0, data: result});
  }).catch((err) => {
    logger.error(err.stack);
    res.send({code: 500, msg: "Server Error"});
  });
});

module.exports = router;
