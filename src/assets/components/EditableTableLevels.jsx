import React from 'react';
import { Table, Button, Popconfirm, Form, Input, Modal } from 'antd';

import api from '../../services/api';

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

class EditableTableLevels extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: 'Palavra / Conteúdo',
        dataIndex: 'word',
        width: '40%',
        editable: true,
      },
      {
        title: 'Tradução / Dica',
        dataIndex: 'translation',
        width: '40%',
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
      dataSource: [],
      visibleError: false,
    };
  }

  componentDidMount() {
    api.get(`/studies?contentId=${this.props.contentId}&levelId=${this.props.levelId}`)
      .then((response) => {
        this.setState({ dataSource: response.data });
      })
      .catch((error) => {
        console.log(error);
    });
  }

  handleDataSource = (dataSource) => {
    this.setState({ dataSource });
  }

  handleAdd = (row) => {
    api.put(`/studies/${row.id}`, {
      contentId: row.contentId,
      levelId: row.levelId,
      word: row.word,
      translation: row.translation
    })
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
      this.handleVisibleError(true);
    });
  };

  handleDelete = (id) => {
    api.delete(`/studies/${id}`)
      .then(() => {
        this.handleDataSource(this.state.dataSource.filter(item => item.id !== id));
      })
      .catch(() => {
        this.handleVisibleError(true);
    });
  };

  handleVisibleError = visibleError => {
    this.setState({
      visibleError,
    })
  };

  handleCellSave = (row) => {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex(item => row.id === item.id);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });

    this.handleDataSource(newData);
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
          handleCellSave: this.handleCellSave,
        }),
      };
    });
    return (
      <div style={{ marginTop: '10px' }}>
        <Table
          components={components}
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={dataSource}
          columns={columns}
          pagination={false}
        />
        <Modal
          title="Erro ao editar/deletar"
          visible={this.state.visibleError}
          closable={false}
          footer={[
            <Button key="ok" type="primary" onClick={() => this.handleVisibleError(false)}>
              Ok
            </Button>,
          ]}
        >
          <p>Não foi possível editar/deletar o conteúdo de estudo.</p>
        </Modal>
      </div>
    );
  }
}

export default EditableTableLevels;
