import React, { Component } from 'react';
import { Row, Col, Button, Collapse, Modal, Input, Select, Popconfirm, Radio } from 'antd';

import EditableTableLevels from '../../assets/components/EditableTableLevels';
import TableQuestion from '../../assets/components/TableQuestion';
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
    selectedLevelStudy: undefined,
    selectedLevelTest: undefined,
    content: [],
    levels: [],
    themes: [],
    input: '',
    inputWord: '',
    inputTranslation: '',
    inputQuestion: '',
    inputTest: [],
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
    if (this.state.inputWord.length > 1 && this.state.inputTranslation.length > 1 && this.state.selectedLevelStudy) {
      api.post(`/studies`, {
        word: this.state.inputWord,
        translation: this.state.inputTranslation,
        contentId: this.state.contentId,
        levelId: this.state.selectedLevelStudy
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
    if (this.isValidTestArray(this.state.inputTest) && this.state.selectedRadio && this.state.selectedLevelTest) {
      const answer = this.state.inputTest[this.state.selectedRadio - 1];

      api.post(`/tests`, {
        question: this.state.inputQuestion,
        option1: this.state.inputTest[0],
        option2: this.state.inputTest[1],
        option3: this.state.inputTest[2],
        option4: this.state.inputTest[3],
        option5: this.state.inputTest[4],
        answer: answer,
        contentId: this.state.contentId,
        levelId: this.state.selectedLevelTest
      })
      .then((response) => {
        this.resetStates();
      })
      .catch((error) => {
        console.log(error);
      });
    } else {
      this.handleVisibleTestError(true);
    }
  };

  handleCancel = (e) => {
    console.log(e);
    this.resetStates();
  };

  isValidTestArray(array) {
    for(let i=0; i<5; i++){
      if(array[i] && array[i].length < 2) {
        return false;
      }
    }
    return true;
  }

  resetStates = () => {
    this.setState({
      selectedLevelStudy: undefined,
      selectedLevelTest: undefined,
      visibleStudy: false,
      visibleTest: false,
      inputWord: '',
      inputTranslation: '',
      inputQuestion: '',
      selectedRadio: undefined,
      inputTest: [],
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

  handleInputTest = (position, event) => {
    const newInputTest = this.state.inputTest.slice();
    newInputTest[position - 1] = event.target.value
    this.setState({ inputTest: newInputTest });
  }

  onChangeRadio = e => {
    this.setState({ selectedRadio: e.target.value });
    console.log("Selected value on radio: " , e.target.value);
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
                  <Panel header={level.name} key={level.id}>
                    
                    <Collapse bordered={true} className="input">
                      <Panel header={"Estudo"} key={0}>
                        { level.id == 1
                          ? <EditableTableLevels contentId={this.state.contentId} levelId={level.id} />
                          : ( level.id == 2
                            ? <EditableTableLevels contentId={this.state.contentId} levelId={level.id} />
                            : ( level.id == 3
                              ? <EditableTableLevels contentId={this.state.contentId} levelId={level.id} />
                              : <EditableTableLevels contentId={this.state.contentId} levelId={level.id} />
                            )
                          )
                        }
                      </Panel>
                      <Panel header={"Teste"} key={1}>
                        { level.id == 1
                          ? <TableQuestion contentId={this.state.contentId} levelId={level.id} />
                          : ( level.id == 2
                            ? <TableQuestion contentId={this.state.contentId} levelId={level.id} />
                            : ( level.id == 3
                              ? <TableQuestion contentId={this.state.contentId} levelId={level.id} />
                              : <TableQuestion contentId={this.state.contentId} levelId={level.id} />
                            )
                          )
                        }
                      </Panel>
                    </Collapse>
                  </Panel>
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
                  this.setState({ selectedLevelStudy: e });
                }}
                value={this.state.selectedLevelStudy}
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
            <Radio.Group onChange={this.onChangeRadio} value={this.state.selectedRadio}>
              <Row gutter={16}>
                <Col span={24}>
                  <Radio className="checkbox" value={1} style={{width: '100%'}}>
                    <Input placeholder="Answer" className="input" 
                      value={this.state.inputTest[0]} onChange={(event) => {this.handleInputTest(1, event)}} />
                  </Radio>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={24}>
                  <Radio className="checkbox" value={2} style={{width: '100%'}}>
                    <Input placeholder="Answer" className="input" 
                      value={this.state.inputTest[1]} onChange={(event) => {this.handleInputTest(2, event)}} />
                  </Radio>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={24}>
                  <Radio className="checkbox" value={3} style={{width: '100%'}}>
                    <Input placeholder="Answer" className="input" 
                      value={this.state.inputTest[2]} onChange={(event) => {this.handleInputTest(3, event)}} />
                  </Radio>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={24}>
                  <Radio className="checkbox" value={4} style={{width: '100%'}}>
                    <Input placeholder="Answer" className="input" 
                      value={this.state.inputTest[3]} onChange={(event) => {this.handleInputTest(4, event)}} />
                  </Radio>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={24}>
                  <Radio className="checkbox" value={5} style={{width: '100%'}}>
                    <Input placeholder="Answer" className="input" 
                      value={this.state.inputTest[4]} onChange={(event) => {this.handleInputTest(5, event)}} />
                  </Radio>
                </Col>
              </Row>
            </Radio.Group>
            <Select
                showSearch
                style={{ width: 200 }}
                optionFilterProp="children"
                filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                onChange={(e) => {
                  this.setState({ selectedLevelTest: e });
                }}
                value={this.state.selectedLevelTest}
                placeholder="Selecione uma dificuldade"
                className="input"
              >
                {this.state.levels.map((level) => 
                  <Option value={level.id}>{level.name}</Option>
                )}
              </Select>
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
    );
  }
}

export default Levels;
