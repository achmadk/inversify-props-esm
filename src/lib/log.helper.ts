/**
 * Log a message if debug mode is enabled
 */

export function log(debug = false, ...messages: any[]): void {
  if (!debug) {
    return;
  }

  // @ts-ignore
  console.log(...messages);
}
