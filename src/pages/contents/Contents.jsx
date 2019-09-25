import React from 'react';
import { Input, Button, Row, Col, Select } from 'antd';

import EditableTableContent from '../../assets/components/EditableTableContent';

const { Option } = Select;

const Contents = () => (
  <div>
    <Row gutter={16}>
      <Col span={15}>
        <Input placeholder="Insira o conteúdo para pesquisar ou adicionar" />
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
        >
          <Option value="vocabulario">Vocabulário</Option>
          <Option value="gramatica">Gramática</Option>
        </Select>
      </Col>
      <Col span={1}>
        <Button type="primary" shape="circle" icon="search" />
      </Col>
      <Col span={2}>
        <Button type="primary" shape="circle" icon="plus" />
      </Col>
    </Row>
    <Row gutter={16}>
      <Col span={22}>
        <EditableTableContent />
      </Col>
    </Row>
  </div>
);

export default Contents;
