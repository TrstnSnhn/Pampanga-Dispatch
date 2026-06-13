import type { ServiceType } from "../domain/service-type.ts";

type PricingRule = {
  baseFare: number;
  perKm: number;
  minimumFare: number;
};

const pricingRules: Record<ServiceType, PricingRule> = {
  ride: {
    baseFare: 80,
    perKm: 18,
    minimumFare: 140,
  },
  delivery: {
    baseFare: 120,
    perKm: 24,
    minimumFare: 180,
  },
  "food-delivery": {
    baseFare: 70,
    perKm: 16,
    minimumFare: 120,
  },
};

function roundToNearestTen(amount: number) {
  return Math.round(amount / 10) * 10;
}

export function estimatePrice(serviceType: ServiceType, distanceKm: number) {
  const rule = pricingRules[serviceType];
  const rawEstimate = rule.baseFare + distanceKm * rule.perKm;

  return Math.max(rule.minimumFare, roundToNearestTen(rawEstimate));
}

export function getPricingRule(serviceType: ServiceType) {
  return pricingRules[serviceType];
}
