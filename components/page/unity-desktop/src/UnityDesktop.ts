// (c) 2025-2026 Asymmetric Effort, LLC. MIT LICENSE
// SPDX-License-Identifier: MIT

/**
 * UnityDesktop -- Full-screen layout resembling the Ubuntu Unity Desktop.
 *
 * Features a left sidebar launcher bar with icon buttons, a top panel bar
 * with Activities, clock, and system tray, and a main desktop area with
 * an aubergine gradient background. Clicking launcher icons opens
 * interactive app windows with title bars, close/minimize/maximize
 * buttons, and placeholder content. Supports multiple windows, z-index
 * management, and a Show Applications grid overlay.
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

interface OpenWindow {
  id: number;
  appLabel: string;
  appLetter: string;
  appColor: string;
  minimized: boolean;
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
// Placeholder content generators
// ---------------------------------------------------------------------------

function getPlaceholderContent(appLabel: string): unknown[] {
  switch (appLabel) {
    case 'Files':
      return [
        createElement('div', { style: { fontWeight: '600', marginBottom: '8px', color: '#333' } }, 'Home'),
        createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '4px' } },
          createElement('span', { style: { color: '#555', cursor: 'pointer' } }, '\u{1F4C1} Documents'),
          createElement('span', { style: { color: '#555', cursor: 'pointer' } }, '\u{1F4C1} Downloads'),
          createElement('span', { style: { color: '#555', cursor: 'pointer' } }, '\u{1F4C1} Music'),
          createElement('span', { style: { color: '#555', cursor: 'pointer' } }, '\u{1F4C1} Pictures'),
          createElement('span', { style: { color: '#555', cursor: 'pointer' } }, '\u{1F4C1} Videos'),
          createElement('span', { style: { color: '#555', cursor: 'pointer' } }, '\u{1F4C4} readme.txt'),
        ),
      ];
    case 'Browser':
      return [
        createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' } },
          createElement('span', { style: { padding: '4px 8px', backgroundColor: '#eee', borderRadius: '4px', fontSize: '12px', flex: '1', color: '#666' } }, 'https://example.com'),
        ),
        createElement('div', { style: { padding: '16px', backgroundColor: '#fafafa', borderRadius: '4px', textAlign: 'center', color: '#999' } }, 'Web page content area'),
      ];
    case 'Terminal':
      return [
        createElement('div', { style: { backgroundColor: '#1a1a1a', padding: '12px', borderRadius: '4px', fontFamily: 'monospace', fontSize: '12px', color: '#2ecc71', lineHeight: '1.6' } },
          createElement('div', null,
            createElement('span', { style: { color: '#2ecc71' } }, 'user@desktop:~$ '),
            createElement('span', { style: { color: '#ccc' } }, 'Welcome to SpecifyJS Desktop'),
          ),
          createElement('div', null,
            createElement('span', { style: { color: '#2ecc71' } }, 'user@desktop:~$ '),
            createElement('span', { style: { color: '#ccc' } }, 'ls -la'),
          ),
          createElement('div', { style: { color: '#aaa' } }, 'total 42'),
          createElement('div', null,
            createElement('span', { style: { color: '#2ecc71' } }, 'user@desktop:~$ '),
            createElement('span', { style: { color: '#ccc', borderRight: '2px solid #2ecc71' } }, ' '),
          ),
        ),
      ];
    case 'Mail':
      return [
        createElement('div', { style: { fontWeight: '600', marginBottom: '8px', color: '#333' } }, 'Inbox (3)'),
        createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '6px' } },
          createElement('div', { style: { padding: '6px', backgroundColor: '#e8f0fe', borderRadius: '4px', color: '#333', fontSize: '12px' } }, 'Welcome to SpecifyJS Mail'),
          createElement('div', { style: { padding: '6px', backgroundColor: '#f5f5f5', borderRadius: '4px', color: '#333', fontSize: '12px' } }, 'Your weekly digest'),
          createElement('div', { style: { padding: '6px', backgroundColor: '#f5f5f5', borderRadius: '4px', color: '#333', fontSize: '12px' } }, 'Team standup notes'),
        ),
      ];
    case 'Music':
      return [
        createElement('div', { style: { textAlign: 'center', padding: '20px', color: '#333' } },
          createElement('div', { style: { fontSize: '48px', marginBottom: '12px' } }, '\u{1F3B5}'),
          createElement('div', { style: { fontWeight: '600', marginBottom: '4px' } }, 'Now Playing'),
          createElement('div', { style: { color: '#666', fontSize: '12px' } }, 'No track selected'),
          createElement('div', { style: { marginTop: '16px', display: 'flex', justifyContent: 'center', gap: '16px', fontSize: '18px' } },
            createElement('span', { style: { cursor: 'pointer' } }, '\u{23EE}'),
            createElement('span', { style: { cursor: 'pointer' } }, '\u{25B6}'),
            createElement('span', { style: { cursor: 'pointer' } }, '\u{23ED}'),
          ),
        ),
      ];
    case 'Photos':
      return [
        createElement('div', { style: { fontWeight: '600', marginBottom: '8px', color: '#333' } }, 'Photo Library'),
        createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' } },
          createElement('div', { style: { width: '60px', height: '60px', backgroundColor: '#ddd', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' } }, '\u{1F5BC}'),
          createElement('div', { style: { width: '60px', height: '60px', backgroundColor: '#ddd', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' } }, '\u{1F5BC}'),
          createElement('div', { style: { width: '60px', height: '60px', backgroundColor: '#ddd', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' } }, '\u{1F5BC}'),
        ),
      ];
    case 'Software':
      return [
        createElement('div', { style: { fontWeight: '600', marginBottom: '8px', color: '#333' } }, 'Software Center'),
        createElement('div', { style: { color: '#666', fontSize: '12px' } }, 'Browse and install applications'),
        createElement('div', { style: { marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px' } },
          createElement('div', { style: { padding: '6px', backgroundColor: '#f5f5f5', borderRadius: '4px', color: '#333', fontSize: '12px' } }, '\u{1F4E6} Package Manager'),
          createElement('div', { style: { padding: '6px', backgroundColor: '#f5f5f5', borderRadius: '4px', color: '#333', fontSize: '12px' } }, '\u{1F4E6} Text Editor'),
          createElement('div', { style: { padding: '6px', backgroundColor: '#f5f5f5', borderRadius: '4px', color: '#333', fontSize: '12px' } }, '\u{1F4E6} Image Viewer'),
        ),
      ];
    case 'Settings':
      return [
        createElement('div', { style: { fontWeight: '600', marginBottom: '8px', color: '#333' } }, 'System Settings'),
        createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '6px' } },
          createElement('div', { style: { padding: '6px', backgroundColor: '#f5f5f5', borderRadius: '4px', color: '#333', fontSize: '12px', cursor: 'pointer' } }, '\u{2699} General'),
          createElement('div', { style: { padding: '6px', backgroundColor: '#f5f5f5', borderRadius: '4px', color: '#333', fontSize: '12px', cursor: 'pointer' } }, '\u{1F4F6} Network'),
          createElement('div', { style: { padding: '6px', backgroundColor: '#f5f5f5', borderRadius: '4px', color: '#333', fontSize: '12px', cursor: 'pointer' } }, '\u{1F508} Sound'),
          createElement('div', { style: { padding: '6px', backgroundColor: '#f5f5f5', borderRadius: '4px', color: '#333', fontSize: '12px', cursor: 'pointer' } }, '\u{1F5A5} Display'),
        ),
      ];
    default:
      return [
        createElement('div', { style: { textAlign: 'center', color: '#999', padding: '20px' } }, `${appLabel} placeholder`),
      ];
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

let nextWindowId = 1;

export function UnityDesktop(props: UnityDesktopProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number>(-1);
  const [clockText, setClockText] = useState<string>(() => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
  });
  const [dateText, setDateText] = useState<string>(() => {
    return new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  });
  const [openWindows, setOpenWindows] = useState<OpenWindow[]>([]);
  const [focusedWindowId, setFocusedWindowId] = useState<number>(-1);
  const [showAppsGrid, setShowAppsGrid] = useState<boolean>(false);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setClockText(`${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`);
      setDateText(now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }));
    };
    const id = setInterval(updateClock, 1000);
    return () => clearInterval(id);
  }, []);

  const handleOpenApp = useCallback((icon: { letter: string; color: string; label: string }) => {
    const id = nextWindowId++;
    const win: OpenWindow = {
      id,
      appLabel: icon.label,
      appLetter: icon.letter,
      appColor: icon.color,
      minimized: false,
    };
    setOpenWindows((prev: OpenWindow[]) => [...prev, win]);
    setFocusedWindowId(id);
    setShowAppsGrid(false);
  }, []);

  const handleCloseWindow = useCallback((windowId: number) => {
    setOpenWindows((prev: OpenWindow[]) => prev.filter((w: OpenWindow) => w.id !== windowId));
    setFocusedWindowId((prev: number) => (prev === windowId ? -1 : prev));
  }, []);

  const handleMinimizeWindow = useCallback((windowId: number) => {
    setOpenWindows((prev: OpenWindow[]) =>
      prev.map((w: OpenWindow) => (w.id === windowId ? { ...w, minimized: !w.minimized } : w)),
    );
  }, []);

  const handleFocusWindow = useCallback((windowId: number) => {
    setFocusedWindowId(windowId);
    // Un-minimize if minimized
    setOpenWindows((prev: OpenWindow[]) =>
      prev.map((w: OpenWindow) => (w.id === windowId ? { ...w, minimized: false } : w)),
    );
  }, []);

  const handleToggleAppsGrid = useCallback(() => {
    setShowAppsGrid((prev: boolean) => !prev);
  }, []);

  const handleIconKeyDown = useCallback((index: number, e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleOpenApp(LAUNCHER_ICONS[index]);
    }
  }, [handleOpenApp]);

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

  function makeCircleStyle(color: string): Record<string, string> {
    return {
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      backgroundColor: color,
      cursor: 'pointer',
      display: 'inline-block',
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

  // Build window elements
  const windowElements = openWindows.map((win: OpenWindow, idx: number) => {
    if (win.minimized) return null;

    const isFocused = win.id === focusedWindowId;
    const offsetX = 80 + (idx % 5) * 30;
    const offsetY = 40 + (idx % 5) * 30;
    const zIndex = isFocused ? 100 : 10 + idx;

    const windowStyle: Record<string, string> = {
      width: '420px',
      minHeight: '280px',
      backgroundColor: '#ffffff',
      borderRadius: '6px',
      boxShadow: isFocused ? '0 12px 48px rgba(0,0,0,0.5)' : '0 8px 32px rgba(0,0,0,0.4)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      position: 'absolute',
      left: `${offsetX}px`,
      top: `${offsetY}px`,
      zIndex: String(zIndex),
      transition: 'box-shadow 0.15s',
    };

    const windowTitleBarStyle: Record<string, string> = {
      height: '32px',
      backgroundColor: isFocused ? '#3c3c3c' : '#555',
      display: 'flex',
      alignItems: 'center',
      padding: '0 10px',
      gap: '6px',
      flexShrink: '0',
      cursor: 'default',
    };

    const windowBodyStyle: Record<string, string> = {
      flex: '1',
      padding: '16px',
      fontSize: '13px',
      color: '#333',
      lineHeight: '1.5',
    };

    return createElement(
      'div',
      {
        key: String(win.id),
        className: 'unity-desktop__window',
        style: windowStyle,
        onMouseDown: () => handleFocusWindow(win.id),
      },
      createElement(
        'div',
        { style: windowTitleBarStyle },
        createElement('span', {
          style: makeCircleStyle('#e74c3c'),
          onClick: () => handleCloseWindow(win.id),
          title: 'Close',
          role: 'button',
          'aria-label': `Close ${win.appLabel}`,
          tabIndex: 0,
        }),
        createElement('span', {
          style: makeCircleStyle('#f39c12'),
          onClick: () => handleMinimizeWindow(win.id),
          title: 'Minimize',
          role: 'button',
          'aria-label': `Minimize ${win.appLabel}`,
          tabIndex: 0,
        }),
        createElement('span', {
          style: makeCircleStyle('#2ecc71'),
          title: 'Maximize',
          role: 'button',
          'aria-label': `Maximize ${win.appLabel}`,
          tabIndex: 0,
        }),
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
          win.appLabel,
        ),
      ),
      createElement(
        'div',
        { style: windowBodyStyle },
        ...getPlaceholderContent(win.appLabel),
      ),
    );
  });

  // Show Applications grid overlay
  const appsGridOverlay = showAppsGrid
    ? createElement(
        'div',
        {
          className: 'unity-desktop__apps-grid',
          style: {
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            backgroundColor: 'rgba(0,0,0,0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: '200',
          },
          onClick: () => setShowAppsGrid(false),
        },
        createElement(
          'div',
          {
            style: {
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 80px)',
              gap: '24px',
              padding: '40px',
            },
            onClick: (e: Event) => e.stopPropagation(),
          },
          ...LAUNCHER_ICONS.map((icon) =>
            createElement(
              'div',
              {
                key: icon.label,
                style: {
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  padding: '12px',
                  borderRadius: '8px',
                  transition: 'background 0.15s',
                },
                onClick: () => handleOpenApp(icon),
                role: 'button',
                tabIndex: 0,
                'aria-label': icon.label,
              },
              createElement(
                'span',
                {
                  style: {
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    backgroundColor: icon.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#ffffff',
                  },
                },
                icon.letter,
              ),
              createElement(
                'span',
                {
                  style: {
                    color: '#ffffff',
                    fontSize: '11px',
                  },
                },
                icon.label,
              ),
            ),
          ),
        ),
      )
    : null;

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
              onClick: () => handleOpenApp(item),
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
            onClick: handleToggleAppsGrid,
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
        ...windowElements.filter(Boolean),
        appsGridOverlay,
        props.children,
      ),
    ),
  );
}
