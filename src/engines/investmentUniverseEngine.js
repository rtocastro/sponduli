import opportunityUniverse from "../data/opportunityUniverse";

export function getInvestmentUniverse() {
  return opportunityUniverse;
}

export function getBySector(sector) {
  return opportunityUniverse.filter(
    (investment) => investment.sector === sector
  );
}

export function getByCategory(category) {
  return opportunityUniverse.filter(
    (investment) => investment.category === category
  );
}

export function getByAssetType(assetType) {
  return opportunityUniverse.filter(
    (investment) => investment.assetType === assetType
  );
}

export function getSectors() {
  return [...new Set(opportunityUniverse.map((i) => i.sector))].sort();
}

export function getCategories() {
  return [...new Set(opportunityUniverse.map((i) => i.category))].sort();
}

export function getAssetTypes() {
  return [...new Set(opportunityUniverse.map((i) => i.assetType))].sort();
}