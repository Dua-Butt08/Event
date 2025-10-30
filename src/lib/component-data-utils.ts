/* eslint-disable @typescript-eslint/no-explicit-any */

const NODE_NAME_MAP: Record<string, string> = {
  'audience-architect': 'AudienceArchitect',
  'content-compass': 'ContentCompass',
  'message-multiplier': 'MessageMultiplier',
  'event-funnel': 'HighConvertingFunnel',
  'landing-page': 'EventLandingPage',
};

export function extractComponentData(data: any, componentKey: string, fallbackKeys: string[] = []): any {
  if (!data) return null;

  // NEW STRUCTURE: Check for nodes array
  if (data.nodes && Array.isArray(data.nodes)) {
    return extractFromNodesStructure(data, componentKey, fallbackKeys);
  }

  // LEGACY STRUCTURE
  return extractFromLegacyStructure(data, componentKey, fallbackKeys);
}

function extractFromNodesStructure(data: any, componentKey: string, fallbackKeys: string[] = []): any {
  if (!data.nodes || !Array.isArray(data.nodes)) return null;

  const targetNodeName = NODE_NAME_MAP[componentKey] || componentKey;
  const keysToTry = [targetNodeName, componentKey, ...fallbackKeys];

  for (const key of keysToTry) {
    const node = data.nodes.find((n: any) => 
      n.node === key || 
      n.node?.toLowerCase() === key.toLowerCase() ||
      n.node?.replace(/[-_]/g, '').toLowerCase() === key.replace(/[-_]/g, '').toLowerCase()
    );

    if (node) {
      return { ...node, _meta: data.meta, _version: data.version };
    }
  }

  return null;
}

function extractFromLegacyStructure(data: any, componentKey: string, fallbackKeys: string[] = []): any {
  let componentData = null;
  const keysToTry = [componentKey, ...fallbackKeys];

  // Check for payload.content wrapper (new N8N format)
  if (data.payload?.content && typeof data.payload.content === 'object') {
    return data.payload.content;
  }
  
  // Check for old payload format
  if (data.payload && data.submissionId && data.timestamp) {
    return data.payload;
  }

  // Unwrap assistant/content wrapper at root
  let workingData = data;
  if (data.content && typeof data.content === 'object' && (typeof data.role === 'string' || data.role === 'assistant')) {
    workingData = data.content;
  }

  // Try direct access
  for (const key of keysToTry) {
    componentData = workingData[key];
    if (componentData) break;
  }

  // If no match, check if workingData has expected structure
  if (!componentData && workingData && typeof workingData === 'object') {
    const hasExpectedFields = workingData.header || workingData.topics || workingData.sub_topics || 
                              workingData.sections || workingData.profiles || workingData.steps || workingData.milestone;
    if (hasExpectedFields) {
      componentData = workingData;
    }
  }

  // Check components property
  if (!componentData && data.components) {
    for (const key of keysToTry) {
      componentData = data.components[key];
      if (componentData) break;
    }
    
    if (!componentData && data.components.components) {
      for (const key of keysToTry) {
        componentData = data.components.components[key];
        if (componentData) break;
      }
    }
  }
  
  // Parse JSON strings
  if (typeof componentData === 'string') {
    try {
      componentData = JSON.parse(componentData);
    } catch {
      return { error: 'Invalid JSON format', raw: componentData };
    }
  }
  
  // Unwrap nested structures
  if (componentData && typeof componentData === 'object') {
    const keys = Object.keys(componentData);
    
    // FIRST: Check for assistant/content wrapper (most common)
    if ((componentData as any).role === 'assistant' && (componentData as any).content && typeof (componentData as any).content === 'object') {
      componentData = (componentData as any).content;
      // Re-check keys after unwrapping
      if (componentData && typeof componentData === 'object') {
        const newKeys = Object.keys(componentData);
        // If after unwrapping we have a single-key wrapper, continue to next check
        if (newKeys.length === 1) {
          const innerKey = newKeys[0];
          const lowerInnerKey = innerKey.toLowerCase();
          
          if (lowerInnerKey.includes('audience') || lowerInnerKey.includes('architect') ||
              lowerInnerKey.includes('content') || lowerInnerKey.includes('compass') ||
              lowerInnerKey.includes('message') || lowerInnerKey.includes('multiplier') ||
              lowerInnerKey.includes('funnel') || lowerInnerKey.includes('event') ||
              lowerInnerKey.includes('landing') || lowerInnerKey.includes('page') ||
              innerKey === 'landing_page' || innerKey === 'landing_page_blueprint' || innerKey === 'event_funnel') {
            componentData = (componentData as any)[innerKey];
          }
        }
      }
    }
    // SECOND: Check for single-key wrappers (but only if NOT already unwrapped)
    else if (keys.length === 1) {
      const innerKey = keys[0];
      const lowerInnerKey = innerKey.toLowerCase();
      
      if (lowerInnerKey.includes('audience') || lowerInnerKey.includes('architect') ||
          lowerInnerKey.includes('content') || lowerInnerKey.includes('compass') ||
          lowerInnerKey.includes('message') || lowerInnerKey.includes('multiplier') ||
          lowerInnerKey.includes('funnel') || lowerInnerKey.includes('event') ||
          lowerInnerKey.includes('landing') || lowerInnerKey.includes('page') ||
          innerKey === 'landing_page' || innerKey === 'landing_page_blueprint' || innerKey === 'event_funnel') {
        componentData = (componentData as any)[innerKey];
      }
    }

    // THIRD: Unwrap missing header edge case
    if (componentData && typeof componentData === 'object' && 
        !(Object.prototype.hasOwnProperty.call(componentData, 'header')) && 
        (componentData as any).content?.header) {
      componentData = (componentData as any).content;
    }

    // FOURTH: Unwrap inner payload
    if (componentData && typeof componentData === 'object' && 
        (componentData as any).payload && typeof (componentData as any).payload === 'object') {
      const inner = (componentData as any).payload;
      componentData = inner.content && inner.node ? inner.content : inner;
    }
  }
  
  return componentData;
}

export function createDebugInfo(data: any, componentKey: string): any {
  if (data?.nodes && Array.isArray(data.nodes)) {
    const availableNodes = data.nodes.map((n: any) => n.node).filter(Boolean);
    return {
      message: `${componentKey} data not found in the response.`,
      debug: {
        hasNodes: true,
        availableNodes,
        searchedFor: componentKey,
        expectedNodeName: NODE_NAME_MAP[componentKey] || componentKey
      }
    };
  }

  const rootKeys = data ? Object.keys(data).filter(key => key !== 'components') : [];
  const componentKeys = data?.components ? Object.keys(data.components) : [];
  
  return {
    message: `${componentKey} data not found in the response.`,
    debug: {
      hasData: !!data,
      hasComponents: !!(data && data.components),
      rootLevelKeys: rootKeys,
      componentKeys,
      searchedFor: componentKey
    }
  };
}