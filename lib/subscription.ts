export type Tier = 'free' | 'explorer' | 'adventurer' | 'master';

export const tierLimits: Record<Tier, number> = {
    free: 3,
    explorer: 10,
    adventurer: 100,
    master: Infinity,
};

export const tierNames: Record<Tier, string> = {
    free: 'Free',
    explorer: 'Explorer',
    adventurer: 'Adventurer',
    master: 'Master Escape',
};

export const tierPrices: Record<Tier, string> = {
    free: '0',
    explorer: '6.99',
    adventurer: '12.99',
    master: '29.99',
};

export function getTierLimit(tier: Tier): number {
    return tierLimits[tier] || 0;
}

export function isMostPopular(tier: Tier): boolean {
    return tier === 'adventurer';
}
