// Pure display formatters shared across components.

/** Human-readable file size: bytes under 1 KiB, whole KB under 1 MiB, else MB to 1dp. */
export function formatBytes(bytes: number): string {
  return bytes < 1024
    ? `${bytes} B`
    : bytes < 1048576
      ? `${(bytes / 1024).toFixed(0)} KB`
      : `${(bytes / 1048576).toFixed(1)} MB`;
}
