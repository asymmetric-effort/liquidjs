// (c) 2025-2026 Asymmetric Effort, LLC. MIT LICENSE
// SPDX-License-Identifier: MIT

/**
 * Component Registry — assigns compact, deterministic IDs to component instances.
 *
 * Each component TYPE gets a numeric index (0, 1, 2, ...) on first registration.
 * Each component INSTANCE gets a sequential instance number within its type.
 *
 * DOM elements receive: id="s-{typeIndex}-{instanceId}"
 * Example: s-3-12 = type index 3, instance 12
 *
 * The lookup table at window.__SPECIFYJS_COMPONENTS__ maps indices to names
 * for debugging, testing, and programmatic interaction.
 */

interface ComponentTypeEntry {
  name: string;
  index: number;
  instanceCount: number;
}

const typeMap = new Map<string, ComponentTypeEntry>();
let nextTypeIndex = 0;
let enabled = true;

/**
 * Enable or disable component ID assignment.
 * When disabled, registerComponentInstance returns '' and no IDs are assigned.
 */
export function setComponentIdsEnabled(value: boolean): void {
  enabled = value;
}

/**
 * Register a component type and get a unique instance ID.
 * Returns the compact ID string: "s-{typeIndex}-{instanceId}"
 */
export function registerComponentInstance(componentName: string): string {
  if (!enabled) return '';
  let entry = typeMap.get(componentName);
  if (!entry) {
    entry = { name: componentName, index: nextTypeIndex++, instanceCount: 0 };
    typeMap.set(componentName, entry);
    updateGlobalLookup();
  }
  const instanceId = entry.instanceCount++;
  return `s-${entry.index}-${instanceId}`;
}

/**
 * Resolve a compact ID back to component metadata.
 * Returns null if the ID is not recognized.
 */
export function resolveComponentId(
  id: string,
): { typeName: string; typeIndex: number; instanceId: number } | null {
  const match = id.match(/^s-(\d+)-(\d+)$/);
  if (!match || !match[1] || !match[2]) return null;
  const typeIndex = parseInt(match[1], 10);
  const instanceId = parseInt(match[2], 10);
  for (const entry of typeMap.values()) {
    if (entry.index === typeIndex) {
      return { typeName: entry.name, typeIndex, instanceId };
    }
  }
  return null;
}

/**
 * Get the full component type table (for debugging/DevTools).
 */
export function getComponentTypeTable(): ReadonlyMap<string, Readonly<ComponentTypeEntry>> {
  return typeMap;
}

/**
 * Update the global lookup table on window for debugging.
 */
function updateGlobalLookup(): void {
  if (typeof globalThis !== 'undefined') {
    const lookup: Record<number, string> = {};
    for (const entry of typeMap.values()) {
      lookup[entry.index] = entry.name;
    }
    (globalThis as unknown as Record<string, unknown>).__SPECIFYJS_COMPONENTS__ = lookup;
  }
}

/**
 * Derive a short component name from a fiber's type.
 * - Function components: function.name
 * - Class components: constructor.name
 * - Host components: tag name
 * - Fragments/portals: type description
 */
export function getComponentName(type: unknown): string {
  if (typeof type === 'string') return type;
  if (typeof type === 'function') return (type as { name?: string }).name || 'Anonymous';
  if (type === null || type === undefined) return 'Unknown';
  return 'Component';
}

/**
 * Reset the registry (for testing).
 */
export function resetComponentRegistry(): void {
  typeMap.clear();
  nextTypeIndex = 0;
}
