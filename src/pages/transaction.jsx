import { useState, useRef } from 'react';
import { Input, Button, } from 'antd';
import TransactionTable from './transaction_table';

function Transaction() {
  let [address, setAddress] = useState("0xeb2a81e229b68c1c22b6683275c00945f9872d90");
  let transactionTableRef = useRef();

  function handleChange(evt) {
    setAddress(evt.target.value)
  }

  function listData() {
    transactionTableRef.current.listData(address);
  }

  return (
    <div className="flexCenterClu padding20">
      <div style={{width: "80%"}}>
        <div className="flexLeft padding15">
          <div className="fontSize20 marginRight20">Address:</div>
          <div style={{width: 370}}>
            <Input onChange={handleChange}
                   value={address}
                   placeholder="please enter address"/>
          </div>
          <div className="marginLeft10">
            <Button type="primary" onClick={listData}>OK</Button>
          </div>
        </div>

        <TransactionTable address={address} ref={transactionTableRef}/>
      </div>
    </div>
  );
}

export default Transaction;
