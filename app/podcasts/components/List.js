import React from 'react';
import styled from 'styled-components';
import { Button } from './Button';

const Col = styled.div`
  flex-direction: column;
  flex: 1;
`;

const Subtitle = styled.h2`
  text-transform: uppercase;
  font-size: calc(12px + 0.4vw * 2.5);
  &:before {
    content: url('./images/Arrow_Left_Top.png');
    position: relative;
    top: 12px;
    display: inline-block;
    vertical-align: 0%;
    transform: scale(0.6);
    right: 0px;
  }
  &:after {
    content: url('./images/Arrow_Right_Top.png');
    position: relative;
    top: 12px;
    display: inline-block;
    vertical-align: 0%;
    transform: scale(0.6);
    left: 0px;
  }
`;

const List = (props) => (
  <Col>
    <Subtitle>{props.title}</Subtitle>
    {props.children}
  </Col>
);

const ListItem = Button.extend`
  display: inline-block;
  margin: 5px;
  width: auto;
  min-width: 280px;
  @media screen and (max-width: 600px) {
    min-width: 100px;
  }
`;

export { List, ListItem };


