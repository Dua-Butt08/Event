"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useUndoRedo } from '@/hooks/useUndoRedo';
import { MarkdownRenderer } from './MarkdownRenderer';

interface InlineEditableContentProps<T> {
  data: T;
  onUpdate?: (updatedData: T) => Promise<void>;
  isUpdating?: boolean;
  children: (props: {
    localData: T;
    EditableText: React.ComponentType<EditableTextProps>;
    undo: () => void;
    redo: () => void;
    canUndo: boolean;
    canRedo: boolean;
    hasChanges: boolean;
    saveAll: () => Promise<void>;
    cancelAll: () => void;
  }) => React.ReactNode;
}

interface EditableTextProps {
  value: string;
  fieldPath: string;
  className?: string;
  multiline?: boolean;
  placeholder?: string;
  renderMarkdown?: boolean;
}

export function InlineEditableContent<T extends Record<string, unknown>>({
  data,
  onUpdate,
  isUpdating: _isUpdating = false,
  children,
}: InlineEditableContentProps<T>) {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [, setSaveError] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const editValueRef = useRef<string>('');

  // Use undo/redo hook
  const { state: localData, set: setLocalData, undo, redo, canUndo, canRedo, reset } = useUndoRedo(data);

  // Track if data has been modified
  useEffect(() => {
    setHasChanges(JSON.stringify(localData) !== JSON.stringify(data));
  }, [localData, data]);

  // Reset undo history when data prop changes
  useEffect(() => {
    reset(data);
  }, [data, reset]);

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (editingField) return;
      
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, editingField]);

  // Start editing a field
 const startEdit = useCallback((fieldPath: string, currentValue: string) => {
    setEditingField(fieldPath);
    editValueRef.current = currentValue;
  }, []);

  // Cancel editing current field
  const cancelEdit = useCallback(() => {
    setEditingField(null);
    editValueRef.current = '';
  }, []);

 // Apply current edit and save to database immediately
 const applyEdit = useCallback(async () => {
    if (!editingField || isSaving) return;

    const pathParts = editingField.split(/[\.\[\]]+/).filter(Boolean);
    const updatedData = JSON.parse(JSON.stringify(localData));

    // Navigate to the nested property and update it
    let current: Record<string, unknown> | unknown[] = updatedData;
    for (let i = 0; i < pathParts.length - 1; i++) {
      const part = pathParts[i];
      if (!isNaN(Number(part))) {
        current = (current as unknown[])[parseInt(part)] as Record<string, unknown> | unknown[];
      } else {
        current = (current as Record<string, unknown>)[part] as Record<string, unknown> | unknown[];
      }
    }

    const finalKey = pathParts[pathParts.length - 1];
    if (!isNaN(Number(finalKey))) {
      (current as unknown[])[parseInt(finalKey)] = editValueRef.current;
    } else {
      (current as Record<string, unknown>)[finalKey] = editValueRef.current;
    }

    setLocalData(updatedData);
    cancelEdit();

    // Save to database immediately if onUpdate is available
    if (onUpdate) {
      setIsSaving(true);
      setSaveError(null);
      try {
        await onUpdate(updatedData);
      } catch (error) {
        console.error('Failed to save changes:', error);
        setSaveError(error instanceof Error ? error.message : 'Failed to save changes');
        // Revert the change on error
        setLocalData(localData);
      } finally {
        setIsSaving(false);
      }
    }
  }, [editingField, localData, setLocalData, cancelEdit, onUpdate, isSaving]);

  // Save ALL changes at once
  const saveAll = useCallback(async () => {
    if (!onUpdate || !hasChanges) return;

    try {
      await onUpdate(localData);
      setHasChanges(false);
    } catch (error) {
      console.error('Failed to save changes:', error);
      throw error;
    }
  }, [onUpdate, hasChanges, localData]);

  // Cancel ALL changes
 const cancelAll = useCallback(() => {
    reset(data);
    setHasChanges(false);
    cancelEdit();
  }, [data, reset, cancelEdit]);

  // Editable text component - memoized to prevent recreation on each render
  const EditableText = useCallback<React.FC<EditableTextProps>>(({
    value,
    fieldPath,
    className = '',
    multiline = false,
    placeholder = 'Click to edit',
    renderMarkdown = false
 }) => {
    const isEditing = editingField === fieldPath;
    
    if (isEditing) {
      return (
        <div className="space-y-2 my-2" key={fieldPath}>
          {multiline ? (
            <textarea
              key={`${fieldPath}-textarea`}
              defaultValue={editValueRef.current}
              onChange={(e) => {
                editValueRef.current = e.target.value;
              }}
              className="w-full p-3 rounded-lg bg-slate-800/90 border-2 border-blue-400 text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y min-h-[100px]"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Escape') cancelEdit();
              }}
            />
          ) : (
            <input
              key={`${fieldPath}-input`}
              type="text"
              defaultValue={editValueRef.current}
              onChange={(e) => {
                editValueRef.current = e.target.value;
              }}
              className="w-full p-2 rounded-lg bg-slate-800/90 border-2 border-blue-400 text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') applyEdit();
                if (e.key === 'Escape') cancelEdit();
              }}
            />
          )}
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={applyEdit}
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? '💾 Saving...' : '✓ Apply'}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={cancelEdit}
              disabled={isSaving}
            >
              ✕ Cancel
            </Button>
          </div>
          <p className="text-xs text-[var(--muted)] italic">
            {isSaving ? 'Saving changes to database...' : 'Press Enter to apply and save, Esc to cancel.'}
          </p>
        </div>
      );
    }

    if (renderMarkdown && value) {
      return (
        <div
          className={`${className} cursor-pointer hover:bg-blue-500/20 hover:outline-2 hover:outline-blue-400/60 rounded-md px-2 py-1 -mx-2 -my-1 transition-all duration-200 group`}
          onClick={() => startEdit(fieldPath, value)}
          title="Click to edit"
        >
          <MarkdownRenderer content={value} inline />
          <span className="opacity-0 group-hover:opacity-100 ml-2 text-blue-400 text-sm transition-opacity inline-block">✏️</span>
        </div>
      );
    }

    return (
      <span
        className={`${className} cursor-pointer hover:bg-blue-500/20 hover:outline-2 hover:outline-blue-400/60 rounded-md px-2 py-1 -mx-2 -my-1 transition-all duration-200 group inline-block`}
        onClick={() => startEdit(fieldPath, value)}
        title="Click to edit"
      >
        {value || placeholder}
        <span className="opacity-0 group-hover:opacity-100 ml-2 text-blue-400 text-sm transition-opacity">✏️</span>
      </span>
    );
  }, [editingField, startEdit, applyEdit, cancelEdit, isSaving]);

  return <>{children({ localData, EditableText, undo, redo, canUndo, canRedo, hasChanges, saveAll, cancelAll })}</>;
}

// Global Save Toolbar Component
export function SaveToolbar({
  hasChanges,
  saveAll,
  cancelAll,
  isUpdating,
  error,
  position = 'top'
}: {
  hasChanges: boolean;
  saveAll: () => Promise<void>;
  cancelAll: () => void;
  isUpdating?: boolean;
  error?: string | null;
  position?: 'top' | 'bottom';
}) {
  if (!hasChanges) return null;

  return (
    <div className={`sticky ${position === 'top' ? 'top-16' : 'bottom-4'} z-40 mb-6`}>
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-2xl border-2 border-blue-400/50 p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="animate-pulse">
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            </div>
            <p className="text-white font-semibold">
              You have unsaved changes
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={saveAll}
              disabled={isUpdating}
              className="bg-green-600 hover:bg-green-700 text-white font-bold shadow-lg"
            >
              {isUpdating ? '💾 Saving...' : '💾 Save All Changes'}
            </Button>
            <Button
              onClick={cancelAll}
              disabled={isUpdating}
              variant="outline"
              className="bg-white/10 hover:bg-white/20 text-white border-white/30"
            >
              ✕ Discard Changes
            </Button>
          </div>
        </div>
        {error && (
          <div className="mt-3 text-sm text-red-200 bg-red-500/20 border border-red-400/30 rounded px-3 py-2">
            ⚠️ {error}
          </div>
        )}
      </div>
    </div>
  );
}

// Undo/Redo Toolbar Component
export function UndoRedoToolbar({
  undo,
  redo,
  canUndo,
  canRedo
}: {
  undo: () => void; 
  redo: () => void; 
  canUndo: boolean; 
  canRedo: boolean;
}) {
  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        variant="outline"
        onClick={undo}
        disabled={!canUndo}
        title="Undo (Ctrl+Z)"
      >
        ↶ Undo
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={redo}
        disabled={!canRedo}
        title="Redo (Ctrl+Y)"
      >
        ↷ Redo
      </Button>
    </div>
  );
}
