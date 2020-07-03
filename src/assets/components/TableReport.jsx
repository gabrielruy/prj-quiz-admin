import React from 'react';
import { Table } from 'antd';
import { ExportReactCSV } from './ExportReactCSV';

import api from '../../services/api';

class TableReport extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: 'Título',
        dataIndex: 'reportName',
        width: '90%',
      },
      {
        dataIndex: 'operation',
        render: (text, record) => (
          <ExportReactCSV csvData={this.state.users} fileName={record.fileName} />
        )
      },
    ];
  
    this.state = {
      users: [],
    }
  }

  componentDidMount() {
    api.get(`/users`)
      .then((response) => {
        const usersFromApi = response.data.map((item) => ({
          id: item.id,
          name: item.name,
          email: item.email,
          lastLogin: item.lastLogin,
        }))
        this.setState({ users: usersFromApi });
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    const dataSource = [
      {
        key: '1',
        reportName: 'Usuários cadastrados e último acesso',
        fileName: 'users_access.xlsx'
      },
    ];

    const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
        }),
      };
    });
    return (
      <div style={{ marginTop: '20px' }}>
        <Table
          bordered
          dataSource={dataSource}
          columns={columns}
          pagination={false}
        />
      </div>
    );
  }
}

export default TableReport;
