import React, { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const ContactSection = styled.section`
  padding: 4rem 2rem;
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h2`
  color: #e1e1e1;
  font-size: 2.5rem;
  margin-bottom: 2rem;
  text-align: center;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 3px;
    background: linear-gradient(to right, #5e81ac, #88c0d0);
  }
`;

const ContactForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background-color: rgba(35, 35, 35, 0.6);
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  color: #e1e1e1;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const Input = styled.input`
  padding: 0.75rem;
  background-color: rgba(50, 50, 50, 0.8);
  border: 1px solid rgba(100, 100, 100, 0.5);
  color: #e1e1e1;
  border-radius: 4px;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #88c0d0;
    box-shadow: 0 0 0 2px rgba(136, 192, 208, 0.3);
  }
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  background-color: rgba(50, 50, 50, 0.8);
  border: 1px solid rgba(100, 100, 100, 0.5);
  color: #e1e1e1;
  border-radius: 4px;
  font-size: 1rem;
  min-height: 150px;
  resize: vertical;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #88c0d0;
    box-shadow: 0 0 0 2px rgba(136, 192, 208, 0.3);
  }
`;

const SubmitButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #5e81ac, #88c0d0);
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  align-self: flex-start;
  
  &:hover {
    background: linear-gradient(135deg, #4c6f99, #77b0c0);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(94, 129, 172, 0.4);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const Message = styled(motion.div)<{ $success: boolean }>`
  padding: 1rem;
  background-color: ${props => props.$success ? 'rgba(163, 190, 140, 0.2)' : 'rgba(191, 97, 106, 0.2)'};
  border-left: 4px solid ${props => props.$success ? '#a3be8c' : '#bf616a'};
  border-radius: 4px;
  color: ${props => props.$success ? '#a3be8c' : '#bf616a'};
  margin-top: 1.5rem;
`;

const Contact: React.FC = () => {
  const form = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string; success: boolean } | null>(null);
  
  const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!form.current) return;
    
    setIsSubmitting(true);
    
    // Replace with your EmailJS service ID, template ID, and Public Key
    emailjs.sendForm(
      'service_szc0b2r', 
      'template_zxvpn0b', 
      form.current, 
      'YOUR_PUBLIC_KEY_HERE'
    )
      .then((result) => {
        setMessage({
          text: 'Thank you for your message! We will get back to you soon.',
          success: true
        });
        form.current!.reset();
      })
      .catch((error) => {
        setMessage({
          text: `Failed to send the message: ${error.text}`,
          success: false
        });
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <ContactSection id="contact">
      <Title>Get in Touch</Title>
      <ContactForm ref={form} onSubmit={sendEmail}>
        <FormGroup>
          <Label htmlFor="name">Name</Label>
          <Input type="text" id="name" name="from_name" required placeholder="Your name" />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="email">Email</Label>
          <Input type="email" id="email" name="from_email" required placeholder="Your email address" />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="message">Message</Label>
          <TextArea id="message" name="message" required placeholder="Type your message here..." />
        </FormGroup>
        
        <SubmitButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </SubmitButton>
      </ContactForm>
      
      {message && (
        <Message
          $success={message.success}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {message.text}
        </Message>
      )}
    </ContactSection>
  );
};

export default Contact;