// (c) 2025-2026 Asymmetric Effort, LLC. MIT LICENSE
// SPDX-License-Identifier: MIT

/**
 * UnityDesktop -- Full-screen layout resembling the Ubuntu Unity Desktop.
 *
 * Features a left sidebar launcher bar with icon buttons, a top panel bar
 * with Activities, clock, and system tray, and a main desktop area with
 * an aubergine gradient background. Includes a mock active window,
 * real-time clock, hover states, keyboard navigation, and dark-mode
 * CSS variable support.
 */

import { createElement } from '../../../../core/src/index';
import { useMemo, useState, useEffect, useCallback } from '../../../../core/src/hooks/index';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface UnityDesktopProps {
  /** Content rendered in the main desktop area */
  children?: unknown;
  /** Extra class name */
  className?: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const LAUNCHER_WIDTH = '48px';
const TOP_PANEL_HEIGHT = '28px';

const LAUNCHER_ICONS: Array<{ letter: string; color: string; label: string }> = [
  { letter: 'F', color: '#3465a4', label: 'Files' },
  { letter: 'W', color: '#e67e22', label: 'Browser' },
  { letter: 'T', color: '#2ecc71', label: 'Terminal' },
  { letter: 'M', color: '#3498db', label: 'Mail' },
  { letter: 'N', color: '#e74c3c', label: 'Music' },
  { letter: 'P', color: '#9b59b6', label: 'Photos' },
  { letter: 'S', color: '#f39c12', label: 'Software' },
  { letter: 'G', color: '#7f8c8d', label: 'Settings' },
];

const TRAY_ICONS = ['\u{1F50A}', '\u{1F4F6}', '\u{1F50B}'];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function UnityDesktop(props: UnityDesktopProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number>(-1);
  const [clockText, setClockText] = useState<string>(() => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
  });
  const [dateText, setDateText] = useState<string>(() => {
    return new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  });

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setClockText(`${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`);
      setDateText(now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }));
    };
    const id = setInterval(updateClock, 1000);
    return () => clearInterval(id);
  }, []);

  const handleIconKeyDown = useCallback((index: number, e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      // activate action (no-op in mock)
    }
  }, []);

  const containerStyle = useMemo<Record<string, string>>(() => ({
    width: '100%',
    height: '100%',
    minHeight: '500px',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'Ubuntu, "Segoe UI", sans-serif',
    fontSize: '13px',
    color: 'var(--color-text, #ffffff)',
    overflow: 'hidden',
    position: 'relative',
  }), []);

  const topPanelStyle: Record<string, string> = {
    width: '100%',
    height: TOP_PANEL_HEIGHT,
    backgroundColor: 'var(--color-bg, #1a1a1a)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 12px',
    boxSizing: 'border-box',
    fontSize: '12px',
    zIndex: '10',
    flexShrink: '0',
    borderBottom: '1px solid var(--color-border, #333)',
  };

  const bodyStyle: Record<string, string> = {
    display: 'flex',
    flex: '1',
    overflow: 'hidden',
  };

  const launcherStyle: Record<string, string> = {
    width: LAUNCHER_WIDTH,
    backgroundColor: 'var(--color-bg, #2c2c2c)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: '8px',
    paddingBottom: '8px',
    gap: '4px',
    flexShrink: '0',
    overflowY: 'auto',
    boxSizing: 'border-box',
    borderRight: '1px solid var(--color-border, #444)',
  };

  const desktopStyle: Record<string, string> = {
    flex: '1',
    background: 'linear-gradient(135deg, #2c001e 0%, #5e2750 50%, #2c001e 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'auto',
    position: 'relative',
  };

  // Mock window styles
  const windowStyle: Record<string, string> = {
    width: '420px',
    minHeight: '280px',
    backgroundColor: '#ffffff',
    borderRadius: '6px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    position: 'absolute',
  };

  const windowTitleBarStyle: Record<string, string> = {
    height: '32px',
    backgroundColor: '#3c3c3c',
    display: 'flex',
    alignItems: 'center',
    padding: '0 10px',
    gap: '6px',
    flexShrink: '0',
  };

  const windowBodyStyle: Record<string, string> = {
    flex: '1',
    padding: '16px',
    fontSize: '13px',
    color: '#333',
    lineHeight: '1.5',
  };

  function makeCircleStyle(color: string): Record<string, string> {
    return {
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      backgroundColor: color,
      cursor: 'pointer',
    };
  }

  function makeIconButtonStyle(index: number): Record<string, string> {
    const isHovered = hoveredIndex === index;
    return {
      width: '40px',
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '700',
      backgroundColor: isHovered ? 'rgba(255,255,255,0.15)' : 'transparent',
      border: 'none',
      color: '#ffffff',
      transition: 'background 0.15s',
    };
  }

  function makeIconCircleStyle(color: string): Record<string, string> {
    return {
      width: '28px',
      height: '28px',
      borderRadius: '50%',
      backgroundColor: color,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '13px',
      fontWeight: '700',
      color: '#ffffff',
      lineHeight: '1',
    };
  }

  const gridButtonStyle: Record<string, string> = {
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '20px',
    backgroundColor: hoveredIndex === LAUNCHER_ICONS.length ? 'rgba(255,255,255,0.15)' : 'transparent',
    border: 'none',
    color: '#ffffff',
    transition: 'background 0.15s',
    marginTop: 'auto',
  };

  return createElement(
    'div',
    {
      className: `unity-desktop ${props.className ?? ''}`.trim(),
      style: containerStyle,
    },
    // Top Panel
    createElement(
      'div',
      { className: 'unity-desktop__top-panel', style: topPanelStyle },
      createElement(
        'span',
        {
          style: {
            fontWeight: '600',
            cursor: 'pointer',
            padding: '2px 8px',
            borderRadius: '3px',
            transition: 'background 0.15s',
          },
        },
        'Activities',
      ),
      createElement(
        'span',
        { style: { position: 'absolute', left: '50%', transform: 'translateX(-50%)' } },
        `${dateText}  ${clockText}`,
      ),
      createElement(
        'div',
        { style: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px' } },
        ...TRAY_ICONS.map((icon, i) =>
          createElement('span', { key: String(i), style: { cursor: 'pointer' } }, icon),
        ),
        createElement('span', { style: { fontSize: '12px', marginLeft: '4px', cursor: 'pointer' } }, '\u25BC'),
      ),
    ),
    // Body: Launcher + Desktop
    createElement(
      'div',
      { style: bodyStyle },
      // Launcher Sidebar
      createElement(
        'nav',
        {
          className: 'unity-desktop__launcher',
          style: launcherStyle,
          'aria-label': 'Application launcher',
        },
        ...LAUNCHER_ICONS.map((item, i) =>
          createElement(
            'button',
            {
              key: String(i),
              style: makeIconButtonStyle(i),
              title: item.label,
              'aria-label': item.label,
              tabIndex: 0,
              onMouseEnter: () => setHoveredIndex(i),
              onMouseLeave: () => setHoveredIndex(-1),
              onKeyDown: (e: KeyboardEvent) => handleIconKeyDown(i, e),
            },
            createElement('span', { style: makeIconCircleStyle(item.color) }, item.letter),
          ),
        ),
        // Show Applications grid button
        createElement(
          'button',
          {
            style: gridButtonStyle,
            title: 'Show Applications',
            'aria-label': 'Show Applications',
            tabIndex: 0,
            onMouseEnter: () => setHoveredIndex(LAUNCHER_ICONS.length),
            onMouseLeave: () => setHoveredIndex(-1),
          },
          '\u{2630}',
        ),
      ),
      // Main Desktop Area
      createElement(
        'main',
        {
          className: 'unity-desktop__desktop',
          style: desktopStyle,
        },
        // Mock active window
        createElement(
          'div',
          { className: 'unity-desktop__window', style: windowStyle },
          createElement(
            'div',
            { style: windowTitleBarStyle },
            createElement('span', { style: makeCircleStyle('#e74c3c') }),
            createElement('span', { style: makeCircleStyle('#f39c12') }),
            createElement('span', { style: makeCircleStyle('#2ecc71') }),
            createElement(
              'span',
              {
                style: {
                  flex: '1',
                  textAlign: 'center',
                  fontSize: '12px',
                  color: '#ccc',
                  marginRight: '40px',
                },
              },
              'Terminal',
            ),
          ),
          createElement(
            'div',
            { style: windowBodyStyle },
            createElement('span', { style: { color: '#2ecc71' } }, 'user@desktop:~$ '),
            createElement('span', { style: { color: '#666' } }, 'Welcome to SpecifyJS Desktop'),
          ),
        ),
        props.children,
      ),
    ),
  );
}
