
const requestEtherScan = require("../libs/etherscan_request");

describe("test requestEtherScan()", () => {

  test("Should length be 50", (done) => {
    requestEtherScan({
      address: "0xeb2a81e229b68c1c22b6683275c00945f9872d90",
      pageIdx: 1,
      pageSize: 50,
    }).then((res) => {
      expect(res.list.length).toBe(50);
      done();
    })
  }, 10000)


});
