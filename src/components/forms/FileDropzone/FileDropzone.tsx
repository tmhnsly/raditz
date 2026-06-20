import { useState, useRef } from 'react';
import type { ChangeEvent, DragEvent, HTMLAttributes, ReactElement, ReactNode } from 'react';
import { cx, useControllableState, formatBytes } from '../../internal';

export interface FileDropzoneProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** Controlled file list. */
  value?: File[];
  /** Initial files (uncontrolled). @default [] */
  defaultValue?: File[];
  onChange?: (files: File[]) => void;
  /** Input accept string, e.g. "image/*,.pdf". */
  accept?: string;
  /** Allow multiple files. @default true */
  multiple?: boolean;
  /** Max bytes per file (larger are ignored). */
  maxSize?: number;
  /** Helper line under the prompt (e.g. "PNG, JPG up to 5MB"). */
  hint?: ReactNode;
  disabled?: boolean;
}

/**
 * FileDropzone — a drag-and-drop file input with click-to-browse and a file
 * list. Uncontrolled by default; pass `value` / `onChange` (File[]) to control.
 * `accept` (input accept string), `multiple`, and `maxSize` (bytes) filter what's
 * accepted. This is UI only — it does not upload; read the files in `onChange`.
 */
export function FileDropzone({
  value,
  defaultValue = [],
  onChange,
  accept,
  multiple = true,
  maxSize,
  hint,
  disabled = false,
  className,
  ...rest
}: FileDropzoneProps): ReactElement {
  const [files, setFiles] = useControllableState<File[]>({ value, defaultValue, onChange });
  const [over, setOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const add = (list: FileList | null): void => {
    if (!list) return;
    let next = Array.from(list);
    if (maxSize) next = next.filter((f) => f.size <= maxSize);
    setFiles(multiple ? [...files, ...next] : next.slice(0, 1));
  };
  const remove = (i: number): void => setFiles(files.filter((_, x) => x !== i));

  return (
    <div className={cx('rdz-dropzone-wrap', className)} {...rest}>
      <button
        type="button"
        className={cx('rdz-dropzone', over && 'is-over')}
        disabled={disabled}
        onClick={() => inputRef.current && inputRef.current.click()}
        onDragOver={(e: DragEvent<HTMLButtonElement>) => { e.preventDefault(); setOver(true); }}
        onDragLeave={() => setOver(false)}
        onDrop={(e: DragEvent<HTMLButtonElement>) => { e.preventDefault(); setOver(false); if (!disabled) add(e.dataTransfer.files); }}
      >
        <svg className="rdz-dropzone__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
        <span className="rdz-dropzone__title"><b>Click to upload</b> or drag &amp; drop</span>
        {hint ? <span className="rdz-dropzone__hint">{hint}</span> : null}
      </button>
      {/* The file input lives outside the button (interactive controls must not
          nest) and is driven via inputRef.click(); the button names the action. */}
      <input
        ref={inputRef}
        type="file"
        className="rdz-dropzone__input"
        aria-label="Upload file"
        tabIndex={-1}
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={(e: ChangeEvent<HTMLInputElement>) => { add(e.target.files); e.target.value = ''; }}
      />
      {files.length ? (
        <ul className="rdz-dropzone__list">
          {files.map((f, i) => (
            <li className="rdz-dropzone__file" key={i}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><polyline points="14 2 14 8 20 8" /></svg>
              <span className="rdz-dropzone__name">{f.name}</span>
              <span className="rdz-dropzone__size">{formatBytes(f.size)}</span>
              <button type="button" className="rdz-dropzone__remove" aria-label={`Remove ${f.name}`} onClick={() => remove(i)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="6" y1="6" x2="18" y2="18" /><line x1="18" y1="6" x2="6" y2="18" /></svg>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
