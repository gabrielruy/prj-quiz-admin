import React from 'react';
import { Table, Button, Popconfirm, Form } from 'antd';

import { EditableCell, EditableRow } from './EditableCells';

const EditableFormRow = Form.create()(EditableRow);

class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: 'Nome',
        dataIndex: 'name',
        width: '80%',
        editable: true,
      },
      {
        dataIndex: 'operation',
        render: (text, record) =>
          (this.state.dataSource.length >= 1 ? (
            <Popconfirm title="Confirma a edição?" onConfirm={() => this.handleDelete(record.key)}>
              <Button shape="circle" icon="save" theme="twoTone" className="display-center" />
            </Popconfirm>
          ) : null),
      },
      {
        dataIndex: 'operation',
        render: (text, record) =>
          (this.state.dataSource.length >= 1 ? (
            <Popconfirm title="Confirma a deleção?" onConfirm={() => this.handleDelete(record.key)}>
              <Button shape="circle" icon="delete" theme="twoTone" />
            </Popconfirm>
          ) : null),
      },
    ];

    this.state = {
      dataSource: [
        {
          key: '0',
          name: 'Vocabulário',
        },
        {
          key: '1',
          name: 'Gramática',
        },
      ],
      count: 2,
    };
  }

  handleDelete = (key) => {
    const dataSource = [...this.state.dataSource];
    this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
  };

  handleAdd = () => {
    const { count, dataSource } = this.state;
    const newData = {
      key: count,
      name: `Edward King ${count}`,
      age: 32,
      address: `London, Park Lane no. ${count}`,
    };
    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1,
    });
  };

  handleSave = (row) => {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    this.setState({ dataSource: newData });
  };

  render() {
    const { dataSource } = this.state;
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
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
          handleSave: this.handleSave,
        }),
      };
    });
    return (
      <div style={{ marginTop: '20px' }}>
        <Table
          components={components}
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={dataSource}
          columns={columns}
        />
      </div>
    );
  }
}

export default EditableTable;
