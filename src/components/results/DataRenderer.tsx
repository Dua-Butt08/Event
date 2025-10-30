/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Shared data rendering component for display components
 * Eliminates duplicate rendering logic across EventFunnel, LandingPage, etc.
 */

interface DataRendererProps {
  data: any;
  keyName: string;
  colorScheme?: 'blue' | 'cyan' | 'purple' | 'green' | 'orange' | 'red' | 'yellow' | 'pink';
}

export function DataRenderer({ data, keyName, colorScheme = 'cyan' }: DataRendererProps) {
  const displayKey = keyName.replace(/_/g, ' ');
  
  // Array rendering
  if (Array.isArray(data)) {
    return (
      <div>
        <h4 className={`text-sm font-semibold text-${colorScheme}-400 uppercase tracking-wide mb-2`}>
          {displayKey}
        </h4>
        <ul className="space-y-2">
          {data.map((item: any, idx: number) => (
            <li key={idx} className="flex items-start gap-2">
              <span className={`text-${colorScheme}-400`}>•</span>
              <span className="text-[var(--text)]">
                {typeof item === 'object' && item !== null ? (
                  <div className="space-y-1">
                    {Object.entries(item).map(([k, v]) => (
                      <div key={k}>
                        <span className={`font-semibold text-${colorScheme}-300`}>
                          {k.replace(/_/g, ' ')}:
                        </span>{' '}
                        <span>{String(v)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  String(item)
                )}
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // Object rendering
  if (typeof data === 'object' && data !== null) {
    return (
      <div className={`p-4 rounded-lg bg-gradient-to-br from-${colorScheme}-500/5 to-${colorScheme === 'cyan' ? 'blue' : colorScheme}-500/5 border border-${colorScheme}-500/20`}>
        <h4 className={`text-sm font-semibold text-${colorScheme}-400 uppercase tracking-wide mb-2`}>
          {displayKey}
        </h4>
        <div className="space-y-2">
          {Object.entries(data).map(([k, v]) => (
            <div key={k} className="text-[var(--text)] text-sm">
              <span className={`font-semibold text-${colorScheme}-300`}>
                {k.replace(/_/g, ' ')}:
              </span>{' '}
              <span>{Array.isArray(v) ? v.join(', ') : String(v)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Primitive rendering
  return (
    <div>
      <h4 className={`text-sm font-semibold text-${colorScheme}-400 uppercase tracking-wide mb-2`}>
        {displayKey}
      </h4>
      <p className="text-[var(--text)]">{String(data)}</p>
    </div>
  );
}
