'use client';

import { useEffect, useRef } from 'react';

export interface ShortcutConfig {
  newWill?: string;
  search?: string;
  help?: string;
}

export interface UseKeyboardShortcutsProps {
  onNewWill?: () => void;
  onSearch?: () => void;
  onHelp?: () => void;
  shortcuts?: ShortcutConfig;
}

export function useKeyboardShortcuts(props: UseKeyboardShortcutsProps) {
  const { onNewWill, onSearch, onHelp, shortcuts } = props;

  // Keep the latest props in a ref so the keydown listener can read fresh
  // closures without being re-registered. Assigning during render (rather
  // than inside an effect) closes the window between commit and effect flush
  // where a fast keystroke could otherwise invoke stale handlers.
  //
  // This is the "latest ref" pattern: identity of `shortcuts` and the
  // handler callbacks is intentionally ignored by the effect below, so
  // callers may pass inline objects/arrows without triggering churn.
  const latestRef = useRef<UseKeyboardShortcutsProps>(props);
  latestRef.current = { onNewWill, onSearch, onHelp, shortcuts };

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      // Check if modifier keys are pressed (excluding Shift, which is needed for '?')
      if (event.ctrlKey || event.altKey || event.metaKey) {
        return;
      }

      // Check if focused element is an input, textarea, or contenteditable
      const activeEl = document.activeElement;
      if (activeEl) {
        const tagName = activeEl.tagName.toLowerCase();
        const contentEditableAttr = activeEl.getAttribute('contenteditable');
        const htmlEl = activeEl as HTMLElement;
        const isContentEditable =
          contentEditableAttr === 'true' ||
          contentEditableAttr === '' ||
          htmlEl.contentEditable === 'true' ||
          (htmlEl as HTMLElement & { isContentEditable?: boolean }).isContentEditable === true;

        if (
          tagName === 'input' ||
          tagName === 'textarea' ||
          isContentEditable
        ) {
          return;
        }
      }

      const {
        onNewWill: currentOnNewWill,
        onSearch: currentOnSearch,
        onHelp: currentOnHelp,
        shortcuts: currentShortcuts,
      } = latestRef.current;

      // Define default keys and overrides
      const keyNewWill = currentShortcuts?.newWill ?? 'n';
      const keySearch = currentShortcuts?.search ?? '/';
      const keyHelp = currentShortcuts?.help ?? '?';

      if (event.key === keyNewWill && currentOnNewWill) {
        event.preventDefault();
        currentOnNewWill();
      } else if (event.key === keySearch && currentOnSearch) {
        event.preventDefault();
        currentOnSearch();
      } else if (event.key === keyHelp && currentOnHelp) {
        event.preventDefault();
        currentOnHelp();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
}
