// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';
import { TEAM_MAP } from './data/players';
import { FORMATIONS } from './data/formations';
import { buildDefaultLineup, teamRating } from './utils/lineupUtils';

describe('System Test Suite - BallonRey', () => {

  describe('Unit Testing: Data & Logic Models', () => {
    it('TC-01 / US-01: Validates that TEAM_MAP initializes valid team data', () => {
      expect(TEAM_MAP).toBeDefined();
      expect(TEAM_MAP['rma']).toBeDefined();
      expect(TEAM_MAP['rma'].name).toContain('Real Madrid');
    });

    it('TC-02 / US-02: Validates that FORMATIONS includes tactical presets like 4-3-3 with 11 slots', () => {
      expect(FORMATIONS['4-3-3']).toBeDefined();
      expect(FORMATIONS['4-3-3'].slots.length).toBe(11);
    });

    it('TC-03 / US-10: buildDefaultLineup instantiates 11 starters and bench players', () => {
      const team = TEAM_MAP['rma'];
      const defaultLineup = buildDefaultLineup(team, '4-3-3');
      
      expect(defaultLineup).toHaveProperty('lineup');
      expect(defaultLineup).toHaveProperty('bench');
      expect(Object.keys(defaultLineup.lineup).length).toBe(11);
      expect(defaultLineup.bench.length).toBeGreaterThan(0);
    });

    it('TC-04 / US-06: teamRating calculates numerical team average correctly', () => {
      const team = TEAM_MAP['rma'];
      const defaultLineup = buildDefaultLineup(team, '4-3-3');
      const rating = teamRating(team, defaultLineup.lineup);
      
      expect(typeof rating).toBe('number');
      expect(rating).toBeGreaterThan(0);
    });
  });

  describe('Integration Testing: User Interface & Component Mounting', () => {
    it('TC-05 / US-03: Mounts main application container without runtime exceptions', () => {
      const { container } = render(<App />);
      expect(container).toBeDefined();
      
      const appShell = container.querySelector('.app-shell');
      expect(appShell).not.toBeNull();
    });

    it('TC-06 / US-03: Renders header title and bench toggle button', () => {
      render(<App />);
      
      const title = screen.getByRole('heading', { name: /BallonRey/i });
      expect(title).toBeDefined();

      const benchBtn = screen.getByRole('button', { name: /bench/i });
      expect(benchBtn).toBeDefined();
    });

    it('TC-07 / US-01: Renders controls with Team overall rating display', () => {
      render(<App />);
      
      const ratingLabel = screen.getByText(/Team's overall/i);
      expect(ratingLabel).toBeDefined();
    });
  });

});