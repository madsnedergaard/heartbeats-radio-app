import styled from 'styled-components';

const Button = styled.button`
  padding: 12px 15px;
  border: 2px solid #fff;
  display: inline-block;
  text-transform: uppercase;
  background-color: ${props => (props.selected ? '#fff' : 'transparent')};
  font-weight: bold;
  cursor: pointer;
  color: ${props => (props.selected ? '#000' : '#fff')};
  outline: 0;
  width: 125px;
`;

const PlayButton = Button.extend`
  background: transparent 5% center no-repeat;
  padding: ${props => (props.disabled ? '0' : '12px 15px 12px 35px')};
  background-size: ${props => (props.disabled ? '0' : '30px')};
  max-height: ${props => (props.disabled ? '1px' : '200px')};
  opacity: 1;
  transition: opacity .5s ease-in-out, color .5s ease-in-out, padding-top .5s ease-in-out, padding-bottom .5s ease-in-out, max-height .5s ease-in-out;
  background-image: url(${props => (props.playing ? './images/pause.png' : './images/play.png')});
  color: ${props => (props.disabled ? '#000' : '#fff')};
  border-color: ${props => (props.disabled ? '#000' : '#fff')};
  &:hover {
    cursor: ${props => (props.disabled ? 'default' : 'pointer')};
  }
`;

export { Button, PlayButton };