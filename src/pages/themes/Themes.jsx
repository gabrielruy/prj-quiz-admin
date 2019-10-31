import React from 'react';
import { Input, Button, Row, Col } from 'antd';

import EditableTableTheme from '../../assets/components/EditableTableTheme';
import api from '../../config/axios';

class Themes extends React.Component {
  state = {
    dataSource: [],
    input: '',
  }

  componentDidMount() {
    api.get(`/themes`)
      .then((response) => {
        this.setState({ dataSource: response.data });
      })
      .catch((error) => {
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
    api.get(`/themes?themeName=${this.state.input}`)
      .then((response) => {
        this.setState({ dataSource: response.data });
      })
      .catch((error) => {
        console.log(error);
    });
  };

  handleAdd = () => {
    if (this.state.input.length > 1) {
      api.post(`/themes`, {
        name: this.state.input
      })
      .then((response) => {
        this.setState({input: ''});
        this.handleSearch();
      })
      .catch((error) => {
        console.log(error);
      });
    }
  }

  render() {
    return (
      <div>
        <Row gutter={16}>
          <Col span={21}>
            <Input
              value={this.state.input}
              onChange={this.handleInput}
              onKeyDown={this.handleSearch}
              onKeyUp={this.handleSearch}
              placeholder="Insira o tema para pesquisar ou adicionar"
            />
          </Col>
          <Col span={2}>
            <Button type="primary" shape="circle" icon="plus" onClick={this.handleAdd}/>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={22}>
            <EditableTableTheme
              dataSource={this.state.dataSource}
              onHandleDataSource={this.handleDataSource}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

export default Themes;
