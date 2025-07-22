import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const NavContainer = styled.nav`
  background-color: rgba(25, 25, 25, 0.95);
  padding: 1rem;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
`;

const NavList = styled.ul<{ $isOpen: boolean }>`
  display: flex;
  justify-content: center;
  list-style: none;
  margin: 0;
  padding: 0;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    display: ${props => props.$isOpen ? 'flex' : 'none'};
    padding: 1rem 0;
    margin-top: 1rem;
    transition: all 0.3s ease;
  }
`;

const NavItem = styled.li`
  margin: 0 1rem;

  @media (max-width: 768px) {
    margin: 0.5rem 0;
  }
`;

const Link = styled(RouterLink)<{ $isActive: boolean }>`
  color: ${props => props.$isActive ? '#88c0d0' : '#e1e1e1'};
  text-decoration: none;
  font-weight: ${props => props.$isActive ? 'bold' : 'normal'};
  position: relative;
  padding: 0.5rem 0.25rem;
  font-size: 1.1rem;
  transition: all 0.3s ease;

  &:hover {
    color: #88c0d0;
  }

  &::after {
    content: '';
    position: absolute;
    width: ${props => props.$isActive ? '100%' : '0'};
    height: 2px;
    bottom: 0;
    left: 0;
    background-color: #88c0d0;
    transition: width 0.3s ease;
  }

  &:hover::after {
    width: 100%;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: #e1e1e1;
  font-size: 1.5rem;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
    position: absolute;
    right: 1rem;
    top: 1rem;
  }
`;

const Navigation: React.FC = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [prevPathname, setPrevPathname] = useState(location.pathname);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Effect to close mobile menu when location changes
  useEffect(() => {
    // Check if the pathname has changed
    if (location.pathname !== prevPathname) {
      // Close the mobile menu
      setIsMobileMenuOpen(false);
      // Update the previous pathname
      setPrevPathname(location.pathname);
    }
  }, [location.pathname, prevPathname]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <NavContainer style={{ backgroundColor: scrolled ? 'rgba(25, 25, 25, 0.95)' : 'rgba(37, 37, 37, 0.8)' }}>
      <MobileMenuButton onClick={toggleMobileMenu}>
        {isMobileMenuOpen ? '✕' : '☰'}
      </MobileMenuButton>
      <NavList $isOpen={isMobileMenuOpen}>
        <NavItem>
          <Link to="/" $isActive={location.pathname === '/'}>
            Home
          </Link>
        </NavItem>
        <NavItem>
          <Link to="/about" $isActive={location.pathname === '/about'}>
            About
          </Link>
        </NavItem>
        <NavItem>
          <Link to="/documents" $isActive={location.pathname === '/documents'}>
            Documents
          </Link>
        </NavItem>
        <NavItem>
          <Link to="/development" $isActive={location.pathname === '/development'}>
            Development
          </Link>
        </NavItem>
        <NavItem>
          <Link to="/perth-beer-curator" $isActive={location.pathname === '/perth-beer-curator'}>
            Perth Beer Curator
          </Link>
        </NavItem>
        <NavItem>
          <Link to="/login" $isActive={location.pathname === '/login'}>
            Private Area
          </Link>
        </NavItem>
        <NavItem>
          <Link to="/contact" $isActive={location.pathname === '/contact'}>
            Contact
          </Link>
        </NavItem>
      </NavList>
    </NavContainer>
  );
};

export default Navigation;