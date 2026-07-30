function getScore(item) {
  return Number(item?.decision?.score) || 0;
}

function rankOpportunities(opportunities = []) {
  return [...opportunities].sort(
    (a, b) => getScore(b) - getScore(a)
  );
}

export function getTopOverall(opportunities = [], limit = 3) {
  return rankOpportunities(opportunities).slice(0, limit);
}

export function getTopBySector(
  opportunities = [],
  sector,
  limit = 3
) {
  return rankOpportunities(
    opportunities.filter((item) => item.sector === sector)
  ).slice(0, limit);
}

export function getTopByCategory(
  opportunities = [],
  category,
  limit = 3
) {
  return rankOpportunities(
    opportunities.filter((item) => item.category === category)
  ).slice(0, limit);
}

export function getTopByAssetType(
  opportunities = [],
  assetType,
  limit = 3
) {
  return rankOpportunities(
    opportunities.filter((item) => item.assetType === assetType)
  ).slice(0, limit);
}