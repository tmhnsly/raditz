// Overlay internals, split by concern into one file each. Import the specific hook
// you need; this module re-exports them all, and <Overlay> / the internal barrel
// import from here.
//
// Combination contract, as <Overlay> wires them (order matters — position first so
// the panel is measured before focus moves into it):
//   const pos = useOverlayPosition(panelRef, position, open); // anchored/point measured; centered/side via CSS
//   useScrollLock(open && modal);                             // modal topologies only
//   useFocusTrap(panelRef, open && focus === 'trap');
//   useDismiss(panelRef, open && (escape || outside), onDismiss, { ignoreRef, escape, outside });
//
// Caveats a caller must know: useDismiss attaches its outside-pointer listener on a
// deferred tick, so the opening click never self-dismisses. useRovingMenu is NOT part
// of an Overlay — Menu-surface layers it *inside* an Overlay (focus: 'none') for menus.
export * from './useDismiss';
export * from './useFocusTrap';
export * from './useScrollLock';
export * from './overlayPosition';
export * from './useRovingMenu';
