
const requestEtherScan = require('../libs/etherscan_request');
const schedule = require('node-schedule');

const SCHEDULE_TASK = function(){
  console.log("--------SCHEDULE_TASK_START---------");

  // 每10分钟请求一次
  schedule.scheduleJob('* 0/10 * * * ?', function(){
    async function Running(){
      await requestEtherScan({address: "0xeb2a81e229b68c1c22b6683275c00945f9872d90", pageIdx: 1});
    }
    Running().catch((err) => {
      log(err.stack);
    });
  });

};

module.exports = SCHEDULE_TASK;

