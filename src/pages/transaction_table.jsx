import {useEffect, useState, forwardRef, useImperativeHandle} from 'react'
import { Table } from 'antd';
import listTransactions from '../requests/transaction';

const fieldMap = {
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
const columns = Object.entries(fieldMap).map(item=>({
  title: item[1],
  dataIndex: item[1],
  key: item[1],
  ellipsis: true,
}));

function Transaction_table(props, ref) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 50,
      position: ["topLeft"],
      showSizeChanger: false,
      showTotal: (t) => (`Total: ${t}`),
    },
  });

  function getDataList(){
    const params = {
      a: props.address,
      p: tableParams.pagination.current,
      s: tableParams.pagination.pageSize,
    };
    setLoading(true);
    listTransactions(params).then((result) => {
      setLoading(false);
      if(!result){
        return;
      }
      setData(result.list);
      setTableParams({
        ...tableParams,
        pagination: {
          ...tableParams.pagination,
          total: result.total,
        },
      });
    });
  }

  function handleTableChange (pagination, filters, sorter) {
    setTableParams({
      pagination: {
        ...pagination,
        showTotal: (t) => (`Total: ${t}`),
      },
      filters,
      ...sorter,
    });
  }

  useImperativeHandle(ref, () => ({
    listData(){
      getDataList();
    }
  }));

  useEffect(() => {
    getDataList();
  }, [JSON.stringify(tableParams)]);

  return (
    <Table size="middle"
           rowKey={(record) => record.txHash}
           dataSource={data}
           pagination={tableParams.pagination}
           loading={loading}
           onChange={handleTableChange}
           columns={columns}/>
  );
}

export default forwardRef(Transaction_table);
