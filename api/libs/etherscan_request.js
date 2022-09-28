const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const etherScanCookies = require('./etherscan_cookies');
const moment = require('moment');
const logger = require('../libs/logger');

const FieldMap = {
  0: 'txHash',
  1: 'method',
  2: 'blockNumber',
  3: 'time',
  4: 'Age',
  5: 'from',
  6: 'type',
  7: 'to',
  8: 'value',
  9: 'txnFee',
};

async function requestEtherScan({ address, pageIdx, pageSize }) {
  if (!pageIdx) pageIdx = 1;
  if (!pageSize) pageSize = 50;

  const result = {list: [], page: pageIdx, pageSize, total: 0};
  if (!address) {
    return result;
  }

  const browser = await puppeteer.launch({
    headless: true,
  });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36');
  for (let ck of etherScanCookies) {
    let expires = ck.expires;
    try {
      if(expires !== "Session"){
        let n_expires = moment(expires).valueOf();
        let nTime = moment().valueOf();
        if(nTime > n_expires){
          n_expires = nTime + 60 * 60;
        }
        ck.expires = n_expires;
        await page.setCookie(ck);
      }
    } catch (e) {
      logger.warn(`[WARN] invalid expires: ${expires}`);
    }
  }

  await page.goto(`https://cn.etherscan.com/txs?a=${address}&p=${pageIdx}`, {
    waitUntil: 'networkidle2'
  });

  const html = await page.content();
  const $ = cheerio.load(html);

  const isCheckingStr = $("#challenge-running").text();
  if(isCheckingStr.indexOf("connection is secure") !== -1){
    logger.error("[ERROR] cookie expired, need to copy a new cookie!!!");
    return result;
  }

  const totalDesc = $("#ContentPlaceHolder1_topPageDiv > p > span").text();
  const totalNumArr = totalDesc.split("").filter(it=>!isNaN(it));
  if(totalNumArr.length){
    result.total = parseInt(totalNumArr.join(""));
  }

  $("#paywall_mask>table>tbody>tr").map((idx, trVal) => {
    let item = {};
    $(trVal).find("td").map((idxTd, tdVal) => {
      if(idxTd === 0) {
        return;
      }
      let fieldName = FieldMap[idxTd-1];
      if(fieldName){
        item[fieldName] = $(tdVal).text();
      }
    });
    result.list.push(item);
  });

  await browser.close();
  return result;
}

module.exports = requestEtherScan;
