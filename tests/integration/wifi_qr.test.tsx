import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { WifiInfoQrComponent } from '../../src/components/wifi/qr.component';

describe('WifiInfoQrComponent Integration', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Mock clipboard
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn(),
      },
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it('R1, R2: renders with provided props', () => {
    render(<WifiInfoQrComponent ssid="Test-Net" password="test-password" security="WPA3" />);
    expect(screen.getByText('Test-Net')).toBeDefined();
    expect(screen.getByText('WPA3')).toBeDefined();
  });

  it('R3, R4: generates a crisp SVG QR code matrix', () => {
    render(<WifiInfoQrComponent ssid="Test-Net" password="test-password" security="WPA3" />);
    const svg = screen.getByRole('img', { name: /Wi-Fi Automatic Connection QR Code/i });
    expect(svg).toBeDefined();
    expect(svg.getAttribute('shape-rendering')).toBe('crispEdges');
    
    // R9: Check SVG Title
    const title = svg.querySelector('title');
    expect(title).toBeDefined();
    expect(title?.textContent).toBe('Wi-Fi Automatic Connection QR Code');
    
    // Check path exists
    const path = svg.querySelector('path');
    expect(path).toBeDefined();
    expect(path?.getAttribute('d')).toContain('M'); // Contains path commands
  });

  it('R5, R6, R9: handles copy interactions and state transitions', async () => {
    const onCopyMock = vi.fn();
    render(<WifiInfoQrComponent ssid="Test-Net" password="test-password" onCopy={onCopyMock} />);
    
    const button = screen.getByRole('button', { name: /Copy Wi-Fi password to clipboard/i });
    expect(button).toBeDefined();
    
    // Initial state check
    expect(screen.queryByText(/Copied Password!/i)).toBeNull();
    
    // Click
    fireEvent.click(button);
    
    // Verify clipboard write
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('test-password');
    expect(onCopyMock).toHaveBeenCalled();
    
    // Verify state transition
    expect(screen.getByText(/Copied Password!/i)).toBeDefined();
    expect(button.getAttribute('aria-label')).toBe('Wi-Fi password copied successfully');
    
    // Advance timers by 2000ms
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    
    // Verify reset
    expect(screen.queryByText(/Copied Password!/i)).toBeNull();
    expect(button.getAttribute('aria-label')).toBe('Copy Wi-Fi password to clipboard');
  });
});
