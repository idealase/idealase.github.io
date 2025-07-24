import React, { useEffect } from 'react';
import styled from 'styled-components';
import Contact from './Contact';

const ContactPageContainer = styled.div`
  min-height: 100vh;
  background-color: #1d1d1d;
  padding-top: 2rem;
`;

const ContactPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Contact - sandford.systems';
  }, []);

  return (
    <ContactPageContainer>
      <Contact />
    </ContactPageContainer>
  );
};

export default ContactPage;