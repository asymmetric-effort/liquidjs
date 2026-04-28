// (c) 2025-2026 Asymmetric Effort, LLC. MIT LICENSE
// SPDX-License-Identifier: MIT

/**
 * UnityDesktop -- Full-screen layout resembling the Ubuntu Unity Desktop.
 *
 * Features a left sidebar launcher bar with icon buttons, a top panel bar
 * with Activities, clock, and system tray, and a main desktop area with
 * an aubergine gradient background.
 */

import { createElement } from '../../../../core/src/index';
import { useMemo } from '../../../../core/src/hooks/index';

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

const LAUNCHER_ICONS: Array<{ emoji: string; label: string }> = [
  { emoji: '\u{1F4C1}', label: 'Files' },
  { emoji: '\u{1F310}', label: 'Browser' },
  { emoji: '\u{1F4BB}', label: 'Terminal' },
  { emoji: '\u{2709}\uFE0F', label: 'Mail' },
  { emoji: '\u{1F3B5}', label: 'Music' },
  { emoji: '\u{1F4F7}', label: 'Photos' },
  { emoji: '\u{1F4E6}', label: 'Software' },
  { emoji: '\u{2699}\uFE0F', label: 'Settings' },
];

const TRAY_ICONS = ['\u{1F50A}', '\u{1F4F6}', '\u{1F50B}'];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function UnityDesktop(props: UnityDesktopProps) {
  const containerStyle = useMemo<Record<string, string>>(() => ({
    width: '100%',
    height: '100%',
    minHeight: '500px',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'Ubuntu, "Segoe UI", sans-serif',
    fontSize: '13px',
    color: '#ffffff',
    overflow: 'hidden',
    position: 'relative',
  }), []);

  const topPanelStyle: Record<string, string> = {
    width: '100%',
    height: TOP_PANEL_HEIGHT,
    backgroundColor: '#1a1a1a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 12px',
    boxSizing: 'border-box',
    fontSize: '12px',
    zIndex: '10',
    flexShrink: '0',
  };

  const bodyStyle: Record<string, string> = {
    display: 'flex',
    flex: '1',
    overflow: 'hidden',
  };

  const launcherStyle: Record<string, string> = {
    width: LAUNCHER_WIDTH,
    backgroundColor: '#2c2c2c',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: '8px',
    paddingBottom: '8px',
    gap: '4px',
    flexShrink: '0',
    overflowY: 'auto',
    boxSizing: 'border-box',
  };

  const iconButtonStyle: Record<string, string> = {
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '18px',
    backgroundColor: 'transparent',
    border: 'none',
    transition: 'background-color 0.15s',
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

  const gridButtonStyle: Record<string, string> = {
    ...iconButtonStyle,
    marginTop: 'auto',
    fontSize: '20px',
  };

  const now = new Date();
  const clockText = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const dateText = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

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
        { style: { fontWeight: '600', cursor: 'pointer' } },
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
              style: iconButtonStyle,
              title: item.label,
              'aria-label': item.label,
            },
            item.emoji,
          ),
        ),
        // Show Applications grid button
        createElement(
          'button',
          {
            style: gridButtonStyle,
            title: 'Show Applications',
            'aria-label': 'Show Applications',
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
        props.children,
      ),
    ),
  );
}
