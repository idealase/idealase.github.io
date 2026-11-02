import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { NAV_ITEMS } from '../data/siteContent';

const NavContainer = styled.nav<{ $scrolled: boolean }>`
  background-color: ${({ $scrolled }) => ($scrolled ? 'rgba(25, 25, 25, 0.95)' : 'rgba(37, 37, 37, 0.8)')};
  backdrop-filter: blur(6px);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  transition: background-color 0.3s ease;
`;

const NavInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0.85rem 1.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const Brand = styled(RouterLink)`
  font-family: 'Fira Code', monospace;
  font-size: 1.05rem;
  color: #e1e1e1;
  text-decoration: none;
  letter-spacing: 0.02em;

  span {
    color: #88c0d0;
  }

  &:hover,
  &:focus-visible {
    color: #88c0d0;
  }
`;

const NavList = styled.ul<{ $isOpen: boolean }>`
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 1.75rem;

  @media (max-width: 768px) {
    display: ${({ $isOpen }) => ($isOpen ? 'flex' : 'none')};
    flex-basis: 100%;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 1.25rem 0 0.5rem;
  }
`;

const Link = styled(RouterLink)<{ $isActive: boolean }>`
  color: ${({ $isActive }) => ($isActive ? '#88c0d0' : '#e1e1e1')};
  text-decoration: none;
  font-weight: ${({ $isActive }) => ($isActive ? 600 : 400)};
  position: relative;
  padding: 0.4rem 0.1rem;
  font-size: 1.05rem;
  transition: color 0.2s ease;

  &:hover,
  &:focus-visible {
    color: #88c0d0;
  }

  &::after {
    content: '';
    position: absolute;
    width: ${({ $isActive }) => ($isActive ? '100%' : '0')};
    height: 2px;
    bottom: 0;
    left: 0;
    background-color: #88c0d0;
    transition: width 0.25s ease;
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
  line-height: 1;
  cursor: pointer;
  padding: 0.25rem 0.5rem;

  @media (max-width: 768px) {
    display: block;
  }
`;

const isActivePath = (current: string, path: string) =>
  path === '/' ? current === '/' : current === path || current.startsWith(`${path}/`);

const Navigation: React.FC = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isMobileMenuOpen) return undefined;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isMobileMenuOpen]);

  return (
    <NavContainer $scrolled={scrolled} aria-label="Primary">
      <NavInner>
        <Brand to="/" aria-label="sandford.systems home">
          sandford<span>.systems</span>
        </Brand>
        <MobileMenuButton
          onClick={() => setIsMobileMenuOpen((open) => !open)}
          type="button"
          aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isMobileMenuOpen}
          aria-controls="primary-navigation"
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </MobileMenuButton>
        <NavList $isOpen={isMobileMenuOpen} id="primary-navigation">
          {NAV_ITEMS.filter((item) => item.path !== '/').map((item) => {
            const active = isActivePath(location.pathname, item.path);
            return (
              <li key={item.path}>
                <Link to={item.path} $isActive={active} aria-current={active ? 'page' : undefined}>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </NavList>
      </NavInner>
    </NavContainer>
  );
};

export default Navigation;
