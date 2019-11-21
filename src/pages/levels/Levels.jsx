import React, { Component } from 'react';
import { Row, Col, Button, Collapse, Modal, Input, Checkbox, Select, Popconfirm } from 'antd';

import EditableTableLevels from '../../assets/components/EditableTableLevels';
import api from '../../services/api';

const { Panel } = Collapse;

class Levels extends Component {
  state = { 
    visibleStudy: false, 
    visibleTest: false,
    visibleStudyError: false,
    visibleTestError: false,
    contentId: 0,
    selectedTheme: 0,
    selectedLevel: 0,
    content: [],
    levels: [],
    themes: [],
    input: '',
    inputWord: '',
    inputTranslation: '',
    inputQuestion: '',
    inputAnswerOne: '',
    inputAnswerTwo: '',
    inputAnswerThree: '',
    inputAnswerFour: '',
    inputAnswerFive: '',
  };

  showStudyCRUD = () => {
    this.setState({
      visibleStudy: true,
    });
  };

  showTestCRUD = () => {
    this.setState({
      visibleTest: true,
    });
  };

  handleStudyOk = (e) => {
    if (this.state.inputWord.length > 1 && this.state.inputTranslation.length > 1 && this.state.selectedLevel > 0) {
      api.post(`/studies`, {
        word: this.state.inputWord,
        translation: this.state.inputTranslation,
        contentId: this.state.contentId,
        levelId: this.state.selectedLevel
      })
      .then((response) => {
        this.resetStates();
      })
      .catch((error) => {
        console.log(error);
      });
    } else {
      this.handleVisibleStudyError(true);
    }
  };

  handleTestOk = (e) => {
    if (this.state.inputQuestion.length > 1 && this.state.inputAnswerOne.length > 1 && this.state.inputAnswerTwo.length > 1
      && this.state.inputAnswerThree.length > 1 && this.state.inputAnswerFour.length > 1 && this.state.inputAnswerFive.length > 1) {
      console.log("Handle Test OK! " , e);
      console.log(this.state.inputQuestion);
      console.log(this.state.inputAnswerOne);
      console.log(this.state.inputAnswerTwo);
      console.log(this.state.inputAnswerThree);
      console.log(this.state.inputAnswerFour);
      console.log(this.state.inputAnswerFive);
    } else {
      this.handleVisibleTestError(true);
    }
  };

  handleCancel = (e) => {
    console.log(e);
    this.resetStates();
  };

  resetStates = () => {
    this.setState({
      selectedLevel: 0,
      visibleStudy: false,
      visibleTest: false,
      inputWord: '',
      inputTranslation: '',
    });
  }

  handleVisibleStudyError = visibleStudyError => {
    this.setState({
      visibleStudyError,
    })
  };

  handleVisibleTestError = visibleTestError => {
    this.setState({
      visibleTestError,
    })
  };

  componentDidMount() {
    const splitPathName = this.props.history.location.pathname.split("/");
    const id = splitPathName[splitPathName.length - 1];
    this.setState({ contentId: id });

    api.get(`/levels`)
      .then((response) => {
        this.setState({ levels: response.data });
      })
      .catch((error) => {
        console.log(error);
    });

    api.get(`/contents/${id}`)
      .then((response) => {
        this.setState({ content: response.data });
        this.setState({ selectedTheme: response.data.theme.id });
        this.setState({ input: response.data.name });
      })
      .catch((error) => {
        console.log(error);
    });

    api.get(`/themes`)
      .then((response) => {
        let themesFromApi = response.data.map(theme => { return {id: theme.id, themeName: theme.name} });

        this.setState({ themes: themesFromApi, });
      })
      .catch(error => {
        console.log(error);
    });
  }

  handleInput = (event) => {
    this.setState({ input: event.target.value });
  }

  handleInputWord = (event) => {
    this.setState({ inputWord: event.target.value });
  }

  handleInputTranslation = (event) => {
    this.setState({ inputTranslation: event.target.value });
  }

  handleInputQuestion = (event) => {
    this.setState({ inputQuestion: event.target.value });
  }

  handleInputAnswerOne = (event) => {
    this.setState({ inputAnswerOne: event.target.value });
  }

  handleInputAnswerTwo = (event) => {
    this.setState({ inputAnswerTwo: event.target.value });
  }

  handleInputAnswerThree = (event) => {
    this.setState({ inputAnswerThree: event.target.value });
  }

  handleInputAnswerFour = (event) => {
    this.setState({ inputAnswerFour: event.target.value });
  }

  handleInputAnswerFive = (event) => {
    this.setState({ inputAnswerFive: event.target.value });
  }

  handleSave = () => {
    api.put(`/contents/${this.state.contentId}`, {
      name: this.state.input,
      themeId: this.state.selectedTheme
    })
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
  };

  render() {
      return (
        <div>
          <Row gutter={16}>
            <Col span={14}>
              <Input
                value={this.state.input}
                onChange={this.handleInput}
              />
            </Col>
            <Col span={5}>
              <Select
                showSearch
                style={{ width: 200 }}
                optionFilterProp="children"
                filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                value={this.state.selectedTheme}
                onChange={(e) => {
                  this.setState({ selectedTheme: e });
                }}
              >
                {this.state.themes.map((theme) => 
                  <Option value={theme.id}>{theme.themeName}</Option>
                )}
              </Select>
            </Col>
            <Col span={1}>
              <Popconfirm title="Confirma a edição?" onConfirm={() => this.handleSave()}>
                <Button type="primary" shape="circle" icon="save" />
              </Popconfirm>
            </Col>
            <Col span={1}>
              <Button type="primary" shape="circle" icon="edit" onClick={this.showStudyCRUD}/>
            </Col>
            <Col span={1}>
              <Button type="primary" shape="circle" icon="book" onClick={this.showTestCRUD}/>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={22}>
              <Collapse bordered={false} className="input">
                {this.state.levels.map((level) => 
                  <Panel header={level.name} key={level.id}></Panel>
                )}
              </Collapse>
            </Col>
          </Row>


          <Modal
            visible={this.state.visibleStudy}
            onOk={this.handleStudyOk}
            onCancel={this.handleCancel}
            okText='Salvar'
            cancelText='Cancelar'
          >
            <Input placeholder="Word" className="input" onChange={this.handleInputWord} value={this.state.inputWord} />
            <Input placeholder="Translation" className="input" onChange={this.handleInputTranslation} value={this.state.inputTranslation} />
            <Select
                showSearch
                style={{ width: 200 }}
                optionFilterProp="children"
                filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                onChange={(e) => {
                  this.setState({ selectedLevel: e });
                }}
                placeholder="Selecione uma dificuldade"
                className="input"
              >
                {this.state.levels.map((level) => 
                  <Option value={level.id}>{level.name}</Option>
                )}
              </Select>
          </Modal>


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
                <Input placeholder="Question" className="input" onChange={this.handleInputQuestion} value={this.state.inputQuestion} />
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={1}>
                <Checkbox className="checkbox" />
              </Col>
              <Col span={23}>
                <Input placeholder="Answer" className="input" onChange={this.handleInputAnswerOne} value={this.state.inputAnswerOne} />
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={1}>
                <Checkbox className="checkbox" />
              </Col>
              <Col span={23}>
                <Input placeholder="Answer" className="input" onChange={this.handleInputAnswerTwo} value={this.state.inputAnswerTwo} />
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={1}>
                <Checkbox className="checkbox" />
              </Col>
              <Col span={23}>
                <Input placeholder="Answer" className="input" onChange={this.handleInputAnswerThree} value={this.state.inputAnswerThree} />
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={1}>
                <Checkbox className="checkbox" />
              </Col>
              <Col span={23}>
                <Input placeholder="Answer" className="input" onChange={this.handleInputAnswerFour} value={this.state.inputAnswerFour} />
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={1}>
                <Checkbox className="checkbox" />
              </Col>
              <Col span={23}>
                <Input placeholder="Answer" className="input" onChange={this.handleInputAnswerFive} value={this.state.inputAnswerFive} />
              </Col>
            </Row>
          </Modal>


          <Modal
            title="Erro ao criar conteúdo para estudo"
            visible={this.state.visibleStudyError}
            closable={false}
            footer={[
              <Button key="ok" type="primary" onClick={() => this.handleVisibleStudyError(false)}>
                Ok
              </Button>,
            ]}
          >
            <p>Não foi possível criar o conteúdo para estudo.</p>
            <p>Preencha corretamente todos os campos.</p>
          </Modal>

          <Modal
            title="Erro ao criar teste"
            visible={this.state.visibleTestError}
            closable={false}
            footer={[
              <Button key="ok" type="primary" onClick={() => this.handleVisibleTestError(false)}>
                Ok
              </Button>,
            ]}
          >
            <p>Não foi possível criar o teste.</p>
            <p>Preencha corretamente todos os campos.</p>
          </Modal>

        </div>
      
        //   <EditableTableLevels />
    );
  }
}

export default Levels;
