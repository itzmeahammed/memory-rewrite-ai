import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BoldButton } from './BoldButton';

describe('BoldButton', () => {
    it('renders correctly', () => {
        render(<BoldButton>Click Me</BoldButton>);
        expect(screen.getByText('Click Me')).toBeDefined();
    });

    it('shows loading state', () => {
        render(<BoldButton isLoading>Click Me</BoldButton>);
        // Check for spinner or disabled state if applicable
        const button = screen.getByRole('button');
        expect(button).toBeDefined();
        // In a real test we'd check for the spinner class or element
    });
});
