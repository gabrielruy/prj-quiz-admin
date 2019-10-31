import React from 'react';
import { Table, Button, Popconfirm, Form, Input, Modal } from 'antd';

import api from '../../config/axios';

const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  state = {
    editing: false,
  };

  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState({ editing }, () => {
      if (editing) {
        this.input.focus();
      }
    });
  };

  save = (e) => {
    const { record, handleCellSave } = this.props;
    this.form.validateFields((error, values) => {
      if (error && error[e.currentTarget.id]) {
        return;
      }
      this.toggleEdit();
      handleCellSave({ ...record, ...values });
    });
  };

  renderCell = (form) => {
    this.form = form;
    const { children, dataIndex, record, title } = this.props;
    const { editing } = this.state;
    return editing ? (
      <Form.Item style={{ margin: 0 }}>
        {form.getFieldDecorator(dataIndex, {
          rules: [
            {
              required: true,
              message: `${title} é obrigatório.`,
            },
          ],
          initialValue: record[dataIndex],
        })(<Input ref={node => (this.input = node)} onPressEnter={this.save} onBlur={this.save} />)}
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingRight: 24 }}
        onClick={this.toggleEdit}
      >
        {children}
      </div>
    );
  };

  render() {
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleCellSave,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editable ? (
          <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
        ) : (
          children
        )}
      </td>
    );
  }
}

class EditableTableTheme extends React.Component {
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
        render: (text, record) => (
          <Popconfirm title="Confirma a edição?" onConfirm={() => this.handleAdd(record)}>
              <Button shape="circle" icon="save" theme="twoTone" />
          </Popconfirm>
        )
      },
      {
        dataIndex: 'deletion',
        render: (text, record) => (
          <Popconfirm title="Confirma a deleção?" onConfirm={() => this.handleDelete(record.id)}>
            <Button shape="circle" icon="delete" theme="twoTone" />
          </Popconfirm>
        )
      },
    ];

    this.state = {
      visibleError: false,
    };
  }

  handleDelete = (id) => {
    api.delete(`/themes/${id}`)
      .then(() => {
        this.props.onHandleDataSource(this.props.dataSource.filter(item => item.id !== id));
      })
      .catch(() => {
        this.handleVisibleError(true);
    });
  };

  handleAdd = (row) => {
    api.put(`/themes/${row.id}`, {
      name: row.name
    })
    .then((response) => {
      this.setState({input: ''});
      this.handleSearch();
    })
    .catch((error) => {
      console.log(error);
    });
  };

  handleCellSave = (row) => {
    const newData = [...this.props.dataSource];
    const index = newData.findIndex(item => row.id === item.id);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });

    this.props.onHandleDataSource(newData);
  };

  handleVisibleError = visibleError => {
    this.setState({
      visibleError,
    })
  };

  render() {
    const { dataSource } = this.props;
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
          handleCellSave: this.handleCellSave,
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
        <Modal
          title="Erro ao deletar"
          visible={this.state.visibleError}
          closable={false}
          footer={[
            <Button key="ok" type="primary" onClick={() => this.handleVisibleError(false)}>
              Ok
            </Button>,
          ]}
        >
          <p>Não foi possível deletar o tema.</p>
          <p>Verifique se o mesmo tem conteúdos atrelados.</p>
        </Modal>
      </div>
    );
  }
}

export default EditableTableTheme;
