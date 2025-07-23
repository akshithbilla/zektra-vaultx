// utils/helpers.js
export function toBufferIfNecessary(val, encoding = 'hex') {
  if (!val) throw new Error('Missing value to convert to Buffer');
  if (Buffer.isBuffer(val)) return val;
  if (typeof val === 'string') return Buffer.from(val, encoding);
  if (typeof val === 'object' && val.type === 'Buffer' && Array.isArray(val.data)) {
    return Buffer.from(val.data);
  }
  throw new Error('Invalid format for buffer conversion');
}
