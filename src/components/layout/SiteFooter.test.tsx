import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SiteFooter } from './SiteFooter';

describe('SiteFooter Component', () => {
  it('renders methodology title and source registries details', () => {
    render(<SiteFooter />);
    
    // Check if the methodology section exists
    const methodologyHeading = screen.getByText('Carbon Track Methodology');
    expect(methodologyHeading).toBeInTheDocument();
    
    // Check for standard registries text
    expect(screen.getByText(/DEFRA/)).toBeInTheDocument();
    expect(screen.getByText(/EPA/)).toBeInTheDocument();
    expect(screen.getByText(/IEA/)).toBeInTheDocument();
  });

  it('renders Google Gemini API attribution', () => {
    render(<SiteFooter />);
    
    // Check for Google Gemini API mention
    const apiAttribution = screen.getByText('Google Gemini API');
    expect(apiAttribution).toBeInTheDocument();
    expect(screen.getByText(/\(gemini-2.5-flash\)/)).toBeInTheDocument();
  });

  it('renders copyright and current year', () => {
    render(<SiteFooter />);
    
    const currentYear = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(currentYear))).toBeInTheDocument();
    expect(screen.getByText(/VoidCarbon/)).toBeInTheDocument();
  });
});
