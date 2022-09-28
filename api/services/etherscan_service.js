/**
 ****************************************************
 *******---************---***----*******---***----***
 ******---************---**---*********---**---******
 *****---************------***********------*********
 ****---************---**---*********---**---********
 ***----------*****---****----******---****----******
 ****************************************************
 * Created By: Ojasuo
 * Date Time: 2022/9/25 16:38
 */
const requestEtherScan = require('../libs/etherscan_request');
const TransactionModel = require('../model/transaction');

/**
 * 检查是否有新的交易
 * */
let checkHasNewTransactionIsRunning = false;
async function checkHasNewTransaction(address){
  if(checkHasNewTransactionIsRunning){
    return;
  }
  checkHasNewTransactionIsRunning = true;

  const result = await requestEtherScan({address, pageIdx: 1});
  let nowLatestTxHash = null;
  if(result.list[0]){
    nowLatestTxHash = result.list[0].txHash;
  }

  // 如果最新的txHash，获取的和当前保存的一致 说明没有新的记录产生
  const savedLatestTxHash = TransactionModel.getAddressLatestTxHash(address);

  if(nowLatestTxHash === savedLatestTxHash){
    checkHasNewTransactionIsRunning = false;
    return;
  }

  // 保存新的记录
  const newDataList = [];
  for(const item of result.list){
    if(item.txHash === savedLatestTxHash){
      break;
    }
    newDataList.push(item);
  }

  TransactionModel.cache[address] = newDataList.concat(TransactionModel.cache[address]);
  await TransactionModel.saveMemoryToDisk();

  checkHasNewTransactionIsRunning = false;
}

async function listTransaction({ address, page, pageSize }) {
  const result = await TransactionModel.list({address, page, pageSize});
  setTimeout(() => {
    checkHasNewTransaction(address).catch(() => {
      checkHasNewTransactionIsRunning = false;
    });
  }, 1);
  return result;
}


module.exports = {
  listTransaction,
};







