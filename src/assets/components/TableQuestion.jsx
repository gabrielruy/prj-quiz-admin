import React from 'react';
import { Table, Button, Popconfirm, Modal, Row, Col, Input, Radio } from 'antd';

import api from '../../services/api';

class TableQuestion extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: 'Enunciado do Teste',
        dataIndex: 'question',
        width: '80%',
      },
      {
        dataIndex: 'operation',
        render: (text, record) => (
          <Button shape="circle" icon="edit" theme="twoTone" className="display-center" onClick={() => {this.showQuestionModal(record)}} />
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
      visibleTest: false,
      dataSource: [],
      selectedRadio: undefined,
      selectedQuestion: [],
    };
  }

  showQuestionModal = (record) => {
    if (record.answer == record.option1) {
      this.state.selectedRadio = 1;
    } else if (record.answer == record.option2) {
      this.state.selectedRadio = 2;
    } else if (record.answer == record.option3) {
      this.state.selectedRadio = 3;
    } else if (record.answer == record.option4) {
      this.state.selectedRadio = 4;
    } else if (record.answer == record.option5) {
      this.state.selectedRadio = 5;
    }
    
    this.setState({ 
      selectedQuestion: record,
      visibleTest: true,
    });
  }

  handleTestOk = (e) => {
    if (this.isValidTest(this.state.selectedQuestion) && this.state.selectedRadio) {
      const answer = this.getAnswer();

      api.put(`/tests/${this.state.selectedQuestion.id}`, {
        question: this.state.selectedQuestion.question,
        option1: this.state.selectedQuestion.option1,
        option2: this.state.selectedQuestion.option2,
        option3: this.state.selectedQuestion.option3,
        option4: this.state.selectedQuestion.option4,
        option5: this.state.selectedQuestion.option5,
        answer: answer,
        levelId: this.props.levelId,
        contentId: this.props.contentId
      })
      .then((response) => {
        this.setState({ visibleTest: false });
        console.log(response)
      })
      .catch((error) => {
        this.handleVisibleError(true);
        console.log(error);
      });
    } else {
      this.handleVisibleError(true);
    }
  };

  handleCancel = (e) => {
    this.setState({ visibleTest: false });
  };

  handleInputTest = (position, event) => {
    const newValue = this.state.selectedQuestion;
    if (position == 1) {
      newValue.option1 = event.target.value;
    } else if (position == 2) {
      newValue.option2 = event.target.value;
    } else if (position == 3) {
      newValue.option3 = event.target.value;
    } else if (position == 4) {
      newValue.option4 = event.target.value;
    } else if (position == 5) {
      newValue.option5 = event.target.value;
    }

    this.setState({ selectedQuestion: newValue });
  }

  handleInputQuestion = (event) => {
    const newValue = this.state.selectedQuestion;
    newValue.question = event.target.value;
    this.setState({ selectedQuestion: newValue });
  }

  onChangeRadio = e => {
    this.setState({ selectedRadio: e.target.value });
    console.log("Selected value on radio: " , e.target.value);
  }

  isValidTest(array) {
    if (array.option1.length > 1 && array.option2.length > 1 && array.option3.length > 1 && array.option4.length > 1 && array.option5.length > 1) {
      return true
    }
    return false;
  }

  getAnswer() {
    if (this.state.selectedRadio == 1) {
      return this.state.selectedQuestion.option1;
    } else if (this.state.selectedRadio == 2) {
      return this.state.selectedQuestion.option2;
    } else if (this.state.selectedRadio == 3) {
      return this.state.selectedQuestion.option3;
    } else if (this.state.selectedRadio == 4) {
      return this.state.selectedQuestion.option4;
    } else if (this.state.selectedRadio == 5) {
      return this.state.selectedQuestion.option5;
    }
  }

  handleDelete = (id) => {
    api.delete(`/tests/${id}`)
      .then(() => {
        this.handleDataSource(this.state.dataSource.filter(item => item.id !== id));
      })
      .catch(() => {
        this.handleVisibleError(true);
    });
  };

  componentDidMount() {
    api.get(`/tests?contentId=${this.props.contentId}&levelId=${this.props.levelId}`)
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

  handleVisibleError = visibleError => {
    this.setState({
      visibleError,
    })
  };

  render() {
    const { dataSource } = this.state;
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
          visible={this.state.visibleTest}
          onOk={this.handleTestOk}
          onCancel={this.handleCancel}
          okText='Salvar'
          cancelText='Cancelar'
          width={980}
        >
          <Row gutter={16}>
            <Col span={24}>
              <Input placeholder="Question" className="input" value={this.state.selectedQuestion.question} onChange={this.handleInputQuestion} />
            </Col>
          </Row>
          <Radio.Group  value={this.state.selectedRadio} onChange={this.onChangeRadio}>
            <Row gutter={16}>
              <Col span={24}>
                <Radio className="checkbox" value={1} style={{width: '100%'}}>
                  <Input placeholder="Answer" className="input" 
                    value={this.state.selectedQuestion.option1} onChange={(event) => {this.handleInputTest(1, event)}} />
                </Radio>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Radio className="checkbox" value={2} style={{width: '100%'}}>
                  <Input placeholder="Answer" className="input" 
                    value={this.state.selectedQuestion.option2} onChange={(event) => {this.handleInputTest(2, event)}} />
                </Radio>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Radio className="checkbox" value={3} style={{width: '100%'}}>
                  <Input placeholder="Answer" className="input" 
                    value={this.state.selectedQuestion.option3} onChange={(event) => {this.handleInputTest(3, event)}} />
                </Radio>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Radio className="checkbox" value={4} style={{width: '100%'}}>
                  <Input placeholder="Answer" className="input" 
                    value={this.state.selectedQuestion.option4} onChange={(event) => {this.handleInputTest(4, event)}} />
                </Radio>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Radio className="checkbox" value={5} style={{width: '100%'}}>
                  <Input placeholder="Answer" className="input" 
                    value={this.state.selectedQuestion.option5} onChange={(event) => {this.handleInputTest(5, event)}} />
                </Radio>
              </Col>
            </Row>
          </Radio.Group>
        </Modal>

        
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
            <p>Não foi possível editar/deletar o conteúdo de teste.</p>
            <p>Verifique o preenchimento correto de todas as informações.</p>
        </Modal>
      </div>
    );
  }
}

export default TableQuestion;
