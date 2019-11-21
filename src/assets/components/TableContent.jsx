import React from 'react';
import { withRouter } from 'react-router-dom';
import { Table, Button, Popconfirm, Modal } from 'antd';

import api from '../../services/api';

class TableContent extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: 'Nome',
        dataIndex: 'name',
        width: '55%',
      },
      {
        title: 'Tema',
        dataIndex: 'themeName',
        width: '25%',
      },
      {
        dataIndex: 'operation',
        render: (text, record) => (
          <Button shape="circle" icon="edit" theme="twoTone" className="display-center" onClick={() => this.showContentCrud(record.id)} />
        ),
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

  showContentCrud = (id) => {
    this.props.history.push({
      pathname: `/levels/${id}`, 
    });
  }

  handleDelete = (id) => {
    api.delete(`/contents/${id}`)
      .then(() => {
        this.props.onHandleDataSource(this.props.dataSource.filter(item => item.id !== id));
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

  render() {
    const { dataSource } = this.props;
    const components = {
      body: {
        
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
          pagination={false}
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
            <p>Não foi possível deletar o conteúdo.</p>
            <p>Verifique se o mesmo tem perguntas/testes atrelados.</p>
        </Modal>
      </div>
    );
  }
}

export default withRouter(TableContent);
