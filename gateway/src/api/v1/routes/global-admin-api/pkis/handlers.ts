import dbSdk from "../../../../../services/dbServiceV2";

// libs
import {
  getPaginateQuery,
  getPagingDataV2,
} from "../../../lib/utils/pagination";

import { getWhereQuery } from "../../../lib/utils/filtering";

import * as loader from "../../../lib/loaders/pkis";

import { createError, ErrorType } from "../../../lib/utils/createError";

import * as deletionHelper from "../../../lib/utils/deletion";

// schemas
import * as resourceSchemas from "../../../components/schemas/PKIs";

export const createOne = async (req, res, next) => {
  const creator = req.creator;

  const out = await dbSdk.postPki(
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

  let $where: any = getWhereQuery(req, resourceSchemas.PKI);

  const $orderBy = {
    id: req.query.order === undefined ? "desc" : req.query.order,
  };

  const $paginate = getPaginateQuery(req);

  const dbSdkRes = await dbSdk.getPkiListPaginated(
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
  const { pkiUuid } = req.params;

  const out = await dbSdk.getPki(
    { uuid: pkiUuid },
    { fields: loader.getFieldsList() }
  );

  return res.json(out);
};

export const updateOne = async (req, res, next) => {
  const { pkiUuid } = req.params;

  let data = { ...req.body };

  const out = await dbSdk.patchPki(
    { uuid: pkiUuid },
    { ...data },
    { fields: loader.getFieldsList() }
  );

  return res.json(out);
};

export const deleteOne = async (req, res) => {
  const { pkiUuid } = req.params;

  await deletionHelper.deletePKI({ pkiUuid });

  return res.status(204).end();
};
