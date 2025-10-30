/**
 * Utility functions for accessing component status safely
 */

export type ComponentStatus = 'pending' | 'completed' | 'failed' | 'not_requested';

export type ComponentStatusMap = Record<string, ComponentStatus>;

interface ComponentsWithStatus {
  componentStatus?: ComponentStatusMap;
  [key: string]: unknown;
}

/**
 * Type guard to check if components object has componentStatus
 */
export function hasComponentStatus(
  components: unknown
): components is ComponentsWithStatus {
  return (
    typeof components === 'object' &&
    components !== null &&
    'componentStatus' in components
  );
}

/**
 * Safely get component status map from submission components
 */
export function getComponentStatusMap(
  components: unknown
): ComponentStatusMap {
  if (hasComponentStatus(components)) {
    return components.componentStatus || {};
  }
  return {};
}

/**
 * Get status for a specific component
 */
export function getComponentStatus(
  components: unknown,
  componentKey: string
): ComponentStatus | null {
  const statusMap = getComponentStatusMap(components);
  return statusMap[componentKey] || null;
}

/**
 * Check if a component is completed
 */
export function isComponentCompleted(
  components: unknown,
  componentKey: string
): boolean {
  return getComponentStatus(components, componentKey) === 'completed';
}

/**
 * Check if a component is pending
 */
export function isComponentPending(
  components: unknown,
  componentKey: string
): boolean {
  return getComponentStatus(components, componentKey) === 'pending';
}

/**
 * Check if a component has failed
 */
export function isComponentFailed(
  components: unknown,
  componentKey: string
): boolean {
  return getComponentStatus(components, componentKey) === 'failed';
}

/**
 * Check if a component was not requested
 */
export function isComponentNotRequested(
  components: unknown,
  componentKey: string
): boolean {
  const status = getComponentStatus(components, componentKey);
  return status === 'not_requested' || status === null;
}
