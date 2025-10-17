function requireEnv(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (!value) {
    console.error('Available NEXT_PUBLIC env variables:', Object.keys(process.env).filter(k => k.startsWith('NEXT_PUBLIC')));
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}


export const ADDRESSES = {
  PRESALE: requireEnv('NEXT_PUBLIC_USDTRAIN_CONTRACT_ADDRESS', '0x000...'),
  USDT: requireEnv('NEXT_PUBLIC_USDT_CONTRACT_ADDRESS', '0x000...'),
  CHAIN_ID: Number(requireEnv('NEXT_PUBLIC_CHAIN_ID', '97')),
} as const;
