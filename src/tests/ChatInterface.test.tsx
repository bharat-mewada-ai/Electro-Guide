import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChatInterface } from '../components/features/ChatInterface';
import { useAppStore } from '../store/useAppStore';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock the store
vi.mock('../store/useAppStore', () => ({
  useAppStore: vi.fn()
}));

// Mock the services
vi.mock('../services/IntentEngine', () => ({
  detectIntent: vi.fn().mockResolvedValue({
    intent: 'GENERAL',
    confidence: 0.9,
    reasoning: 'Test reasoning'
  }),
  getResponseForIntent: vi.fn().mockReturnValue('Test AI Response')
}));

describe('ChatInterface', () => {
  const mockAddMessage = vi.fn();
  const mockSetIntent = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useAppStore as any).mockReturnValue({
      messages: [],
      addMessage: mockAddMessage,
      setIntent: mockSetIntent,
      userContext: { name: 'Citizen', location: { state: 'Maharashtra' } }
    });
  });

  it('renders chat input', () => {
    render(<ChatInterface />);
    expect(screen.getByPlaceholderText(/Type your question/i)).toBeDefined();
  });

  it('sends a message and calls addMessage', async () => {
    render(<ChatInterface />);
    const input = screen.getByPlaceholderText(/Type your question/i);
    const sendButton = screen.getByLabelText(/Send message/i);

    fireEvent.change(input, { target: { value: 'How to vote?' } });
    fireEvent.click(sendButton);

    expect(mockAddMessage).toHaveBeenCalledWith(expect.objectContaining({
      role: 'user',
      content: 'How to vote?'
    }));
  });
});
