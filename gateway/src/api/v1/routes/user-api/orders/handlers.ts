import dbSdk from "../../../../../services/dbServiceV2";

// libs
import {
  getPaginateQuery,
  getPagingDataV2,
} from "../../../lib/utils/pagination";

import { getWhereQuery } from "../../../lib/utils/filtering";

import * as loader from "../../../lib/loaders/order";

import { createError, ErrorType } from "../../../lib/utils/createError";

import * as deletionHelper from "../../../lib/utils/deletion";

// schemas
import * as resourceSchemas from "../../../components/schemas/Orders";

export const createOne = async (req, res, next) => {

  const creator = req.creator;

  const out = await dbSdk.postOrder(
    {
      ...req.body,
      creator,
    },
    {
      fields: loader.getFieldsList(),
    }
  );

  return res.status(201).json(out);
};

export const getList = async (req, res) => {
  const userId = req.user.id;

  let $where: any = getWhereQuery(req, resourceSchemas.Order);

  const $orderBy = {
    id: req.query.order === undefined ? "desc" : req.query.order,
  };

  const $paginate = getPaginateQuery(req);

  const dbSdkRes = await dbSdk.getOrderListPaginated(
    {
      $paginate,
      $where,
      $orderBy,
    },
    {
      fields: loader.getFieldsList(),
    }
  );

  const paging = getPagingDataV2({ req, dbSdkRes });

  return res.json({ results: dbSdkRes.results, paging });
};

export const getOne = async (req, res, next) => {
  const { orderUuid } = req.params;

  const out = await dbSdk.getOrder(
    { uuid: orderUuid },
    { fields: loader.getFieldsList() }
  );

  return res.json(out);
};

export const updateOne = async (req, res, next) => {
  const { orderUuid } = req.params;

  let data = { ...req.body };

  const out = await dbSdk.patchOrder(
    { uuid: orderUuid },
    { ...data },
    { fields: loader.getFieldsList() }
  );

  return res.json(out);
};

export const deleteOne = async (req, res) => {
  const { orderUuid } = req.params;

  await deletionHelper.deleteOrder({ orderUuid });

  return res.status(204).end();
};