// config
import * as config from "../../../../configuration";

import * as _ from "lodash";

export const getPaginateQuery = (req, order = "desc") => {
  let $paginate:
    | { first: number; after: string }
    | { last: number; before: string }
    | { last: number; after: string }
    | { first: number; before: string }
    | { first: number }
    | { last: number }
    | { limit: number }
    | { limit: number; offset: number };

  const parsedLimit: any =
    req.query.limit === undefined ? undefined : parseInt(req.query.limit);

  let limit = getLimit(parsedLimit);

  if (req.query.after) {
    $paginate = { first: limit, after: req.query.after };
  } else if (req.query.before) {
    $paginate = { last: limit, before: req.query.before };
  } else {
    $paginate = { first: limit };
  }

  return $paginate;
};

export const getPagingDataStub = () => {
  const paging = {
    totalCount: 0,
    cursors: {
      after: null,
      before: null,
    },
    previous: null,
    next: null,
  };

  return paging;
};

export const getPagingData = ({ req, serviceResponse }) => {
  const limit = getLimit(req.query.limit);

  let baseLink = `${req.baseUrl}${req.path}`;
  if (baseLink.charAt(baseLink.length - 1) === "/") {
    baseLink = baseLink.slice(0, -1);
  }
  const startCursor = _.get(serviceResponse, "paginationStartCursor") || null;
  const endCursor = _.get(serviceResponse, "paginationEndCursor") || null;

  const hasNextPage = _.get(serviceResponse, "paginationHasNextPage");
  const hasPreviousPage = _.get(serviceResponse, "paginationHasPreviousPage");

  const paging = {
    totalCount: _.get(serviceResponse, "paginationTotalCount"),
    cursors: {
      after: hasNextPage ? endCursor : null,
      before: hasPreviousPage ? startCursor : null,
    },
    previous: hasPreviousPage
      ? `${baseLink}?limit=${limit}&before=${startCursor}`
      : null,
    next: hasNextPage ? `${baseLink}?limit=${limit}&after=${endCursor}` : null,
  };

  return paging;
};

export const getPagingDataV2 = ({ req, dbSdkRes }) => {
  const limit = getLimit(req.query.limit);

  let baseLink = `${req.baseUrl}${req.path}`;
  if (baseLink.charAt(baseLink.length - 1) === "/") {
    baseLink = baseLink.slice(0, -1);
  }

  const { paginationInfo } = dbSdkRes;

  const startCursor = _.get(paginationInfo, "startCursor") || null;
  const endCursor = _.get(paginationInfo, "endCursor") || null;
  const hasNextPage = _.get(paginationInfo, "hasNextPage");
  const hasPreviousPage = _.get(paginationInfo, "hasPreviousPage");

  const paging = {
    totalCount: _.get(paginationInfo, "totalCount"),
    cursors: {
      after: hasNextPage ? endCursor : null,
      before: hasPreviousPage ? startCursor : null,
    },
    previous: hasPreviousPage
      ? `${baseLink}?limit=${limit}&before=${startCursor}`
      : null,
    next: hasNextPage ? `${baseLink}?limit=${limit}&after=${endCursor}` : null,
  };

  return paging;
};

function getLimit(limit: number | null) {
  return limit == null
    ? config.system.resourceListLimit
    : Math.max(0, Math.min(limit, config.system.resourceListLimit));
}
