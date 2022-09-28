/**
 ****************************************************
 *******---************---***----*******---***----***
 ******---************---**---*********---**---******
 *****---************------***********------*********
 ****---************---**---*********---**---********
 ***----------*****---****----******---****----******
 ****************************************************
 * Created By: Ojasuo
 * Date Time: 2022/9/25 19:22
 */
const dataMap = require("../db/transactions_cache.json");
const requestEtherScan = require("../libs/etherscan_request");
const fs = require("fs");

class TransactionModel {
  cache = [];
  constructor() {
    // load db to memory from disk
    this.cache = dataMap; // key: address, val: transactions
  }

  async list({address, page, pageSize}){
    if(!address){
      return [];
    }
    if(address.length !== 42){
      return [];
    }
    if(!page) page = 1;
    if(!pageSize) pageSize = 50;

    let total = this.cache["total"] ? this.cache["total"] : 0;
    let transactions = this.cache[address];
    if(!transactions){
      transactions = [];
    }

    const startIdx = (page - 1) * pageSize;
    const lastIdx = startIdx+pageSize;
    const mList = transactions.slice(startIdx, lastIdx);
    let realList = mList.filter(it=>!!it);

    let needRequest = false;
    if(total){
      const allPageCount = Math.ceil(total / pageSize);
      if(allPageCount === page && !realList.length){
        needRequest = true;
      }
      if(realList.length < pageSize && page < allPageCount){
        needRequest = true;
      }
    }

    if(needRequest || !total){
      // request etherscan load more data
      const result = await requestEtherScan({address, pageIdx: page});

      result.list.forEach((item, idx) => {
        const nIdx = (result.page-1) * result.pageSize + idx;
        this.insert(address, nIdx, item)
      });
      this.cache['total'] = result.total;
      if(this.cache[address]){
        realList = this.cache[address].slice(startIdx, startIdx + pageSize);
      }
      await this.saveMemoryToDisk();
    }
    return {list: realList, page, pageSize, total: this.size()};
  }

  size(){
    return this.cache['total'] ? this.cache['total'] : 0;
  }

  insert(address, idx, data){
    if(!this.cache[address]){
      this.cache[address] = []
    }
    this.cache[address][idx] = data;
    if(idx === 0){
      this.cache[`${address}_latestTxHash`] = data["txHash"];
    }
  }

  getAddressLatestTxHash(address){
    return this.cache[`${address}_latestTxHash`] ? this.cache[`${address}_latestTxHash`] : null;
  }

  saveMemoryToDisk(){
    const data = JSON.stringify(this.cache);
    return new Promise((resolve, reject) => {
      fs.writeFile("./api/db/transactions_cache.json", data, (err) => {
        if(err){
          return reject(err.stack);
        }
        resolve();
      })
    });
  }
}



module.exports = new TransactionModel();
