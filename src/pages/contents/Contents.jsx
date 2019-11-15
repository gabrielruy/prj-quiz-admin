import React from 'react';
import { Input, Button, Row, Col, Select, Modal } from 'antd';

import EditableTableContent from '../../assets/components/EditableTableContent';
import api from '../../services/api';

const { Option } = Select;

class Contents extends React.Component {
  state = {
    dataSource: [],
    input: '',
    themes: [],
    selectedTheme: 0,
    visibleErrorCreate: false,
  }
  
  componentDidMount() {
    api.get(`/themes`)
      .then((response) => {
        let themesFromApi = response.data.map(theme => { return {id: theme.id, themeName: theme.name} });

        const dataSource = [];
        let themeName;
        response.data.forEach(theme => {
          themeName = theme.name;
          theme.contents.forEach(content => {
            dataSource.push({
              id: content.id,
              name: content.name,
              themeName,
            });
          });
        });

        this.setState({
          themes: [{id: 0, themeName: '(Selecione um tema)'}].concat(themesFromApi),
          dataSource,
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  handleDataSource = (dataSource) => {
    this.setState({ dataSource });
  }

  handleInput = (event) => {
    this.setState({ input: event.target.value });
  }

  handleSearch = () => {
    if (this.state.selectedTheme > 0) {
      this.searchWithContentNameAndThemeId();
    } else {
      api.get(`/contents?name=${this.state.input}`)
      .then((response) => {
        const contentsFromApi = response.data.map((item) => ({
          id: item.id,
          name: item.name,
          themeName: item.theme.name,
        }))

        this.setState({ dataSource: contentsFromApi });
      })
      .catch((error) => {
        console.log(error);
      });
    }
  };

  handleChangeOnTheme = (id) => {
    if (id == 0) {
      this.handleSearch();
    } else if (this.state.input.length > 0) {
      this.searchWithContentNameAndThemeId();
    } else {
      api.get(`/contents?themeId=${id}`)
      .then((response) => {
        const contentsFromApi = response.data.map((item) => ({
          id: item.id,
          name: item.name,
          themeName: item.theme.name,
        }))

        this.setState({ dataSource: contentsFromApi });
      })
      .catch((error) => {
        console.log(error);
      });
    }
  }

  handleAdd = () => {
    if (this.state.input.length > 1 && this.state.selectedTheme > 0) {
      api.post(`/contents`, {
        name: this.state.input,
        themeId: this.state.selectedTheme
      })
      .then((response) => {
        this.setState({input: ''});
        this.setState({selectedTheme: 0});
        this.handleSearch();
      })
      .catch((error) => {
        console.log(error);
      });
    } else {
      this.handleVisibleErrorCreate(true);
    }
  }

  handleVisibleErrorCreate = visibleErrorCreate => {
    this.setState({
      visibleErrorCreate,
    })
  };

  searchWithContentNameAndThemeId = () => {
    api.get(`/contents?themeId=${this.state.selectedTheme}&name=${this.state.input}`)
      .then((response) => {
        const contentsFromApi = response.data.map((item) => ({
          id: item.id,
          name: item.name,
          themeName: item.theme.name,
        }))

        this.setState({ dataSource: contentsFromApi });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    return (
      <div>
        <Row gutter={16}>
          <Col span={16}>
            <Input
              value={this.state.input}
              onChange={this.handleInput}
              onKeyDown={this.handleSearch}
              onKeyUp={this.handleSearch} 
              placeholder="Insira o conteúdo para pesquisar ou adicionar" />
          </Col>
          <Col span={5}>
            <Select
              showSearch
              style={{ width: 200 }}
              placeholder="Selecione um tema"
              optionFilterProp="children"
              filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              value={this.state.selectedTheme}
              onChange={(e) => {
                this.setState({ selectedTheme: e }, () => {
                  this.handleChangeOnTheme(this.state.selectedTheme);
                });
              }}
            >
              {this.state.themes.map((theme) => 
                <Option value={theme.id}>{theme.themeName}</Option>
              )}
            </Select>
          </Col>
          <Col span={1}>
            <Button type="primary" shape="circle" icon="plus" onClick={this.handleAdd}/>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={22}>
            <EditableTableContent 
              dataSource={this.state.dataSource}
              onHandleDataSource={this.handleDataSource}
            />
          </Col>
        </Row>
        <Modal
          title="Erro ao criar conteúdo"
          visible={this.state.visibleErrorCreate}
          closable={false}
          footer={[
            <Button key="ok" type="primary" onClick={() => this.handleVisibleErrorCreate(false)}>
              Ok
            </Button>,
          ]}
        >
          <p>Não foi possível criar o conteúdo.</p>
          <p>Informe um nome válido e selecione um tema.</p>
        </Modal>
      </div>
    );
  }
}

export default Contents;
