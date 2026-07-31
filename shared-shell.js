// Thin wrapper: all shared shell behavior now lives in src/shell.js (single source of truth).
// Every page that previously loaded this file keeps working unchanged.
import { initSharedShell } from './src/shell.js';

initSharedShell();
