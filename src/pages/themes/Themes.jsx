import React from 'react';
import { Input, Button, Row, Col } from 'antd';

import EditableTable from '../../assets/components/EditableTable';

const Themes = () => (
  <div>
    <Row gutter={16}>
      <Col span={20}>
        <Input placeholder="Insira o tema para pesquisar ou adicionar" />
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
        <EditableTable />
      </Col>
    </Row>
  </div>
);

export default Themes;
