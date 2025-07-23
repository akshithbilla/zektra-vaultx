export function toBufferIfNecessary(val, encoding = 'hex') {
  if (Buffer.isBuffer(val)) return val;
  if (typeof val === 'string') return Buffer.from(val, encoding);
  if (val && typeof val === 'object' && val.type === 'Buffer' && Array.isArray(val.data)) {
    return Buffer.from(val.data);
  }
  throw new Error('Value cannot be converted to Buffer');
}