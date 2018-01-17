import styled, { keyframes } from 'styled-components';
import React from 'react';

const pulsate = keyframes`
    from {
        opacity: 0.3;
    }
    to {
        opacity: 0.9;
    }
`;
const Logo = styled.div`
    background: transparent url("./images/logo.png") center center no-repeat;    
    background-size: contain;
    height: 99px;
    position: relative;
    max-width: 269px;
    margin: 0 auto;
    &:before {
        transition: all .4s ease-in-out;
        content: "";
        position: absolute;
        height: 55px;
        width: 55px;
        left: 0;
        top: 22px;
        background: ${props => (props.loading ? '#000' : 'transparent')};
        opacity: ${props => (props.loading ? '0.8' : '1')};
        animation: ${props => (props.loading ? `${pulsate} 1s infinite ease-in-out alternate` : 'none')};
    }
`;

const OfflineIndicator = styled.div`
    background: #948d8d;
    line-height: 50px;
    font-size: .8rem;
    height: 50px;
    z-index: 2;
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    display: ${props => (props.offline ? 'block' : 'none')};
    transition: all .3s ease-in-out;
    &:before {
      content: "⚡️";
        margin-right: 5px;
    }
`;

// const Nav = styled.nav`
// `;

// const Section = styled.section` 
//   min-height: ${props => props.theme.post ? '75vh' : '90vh'};
//   display: ${props => props.hidden ? 'none' : 'flex'};
//   align-items: center;
//   justify-content: center;
//   text-align: ${props => props.textalign === 'left' ? 'left' : 'center'};
//   flex-direction: column;
//   margin-bottom: 1%;
//   color: #333;
//   padding: 10em;
  
//   @media screen and (max-width: 800px) {
//     padding: 5em;
//   }
//   @media screen and (max-width: 500px) {
//     margin-bottom: 3%;
//     padding: 1em;
//   }

//   &:nth-child(odd) {
//    background: #efefef;    
//   }
//   &:nth-child(even) {
//    background: #323232;
//    color: #efefef;
//  }
// `;

// const P = styled.p`
//   max-width: 700px;
//   line-height: 1.3;
//   font-size: ${props => props.size === 'small' ? '1.2em' : props.size === 'semi-small' ? '1.5em' : '2em'};
//   @media screen and (max-width: 800px) {
//     font-size: ${props => props.size === 'small' ? '1em' : props.size === 'semi-small' ? '1.25em' : '1.25em'};
//   }

// `;

// const Meta = styled.small`
//   color: #999;
// `;

// const Pre = styled.pre`
//   max-width: 100%;
//   overflow: scroll;
// `;


//export { Section, P, Pre, Meta };
export { Logo, OfflineIndicator };