import dbSdk from "../../../../../services/dbServiceV2";

// libs
import {
  getPaginateQuery,
  getPagingDataV2,
} from "../../../lib/utils/pagination";

import { getWhereQuery } from "../../../lib/utils/filtering";

import * as loader from "../../../lib/loaders/organizations";

import { createError, ErrorType } from "../../../lib/utils/createError";

import * as deletionHelper from "../../../lib/utils/deletion";

// schemas
import * as resourceSchemas from "../../../components/schemas/Organizations";

export const createOne = async (req, res, next) => {
  const userId = req.user.id;
  const creator = req.creator;

  const record = await dbSdk.postOrganization(
    {
      ...req.body,
      creator,
    },
    {
      fields: ["id", "uuid"],
    }
  );

  const out = await dbSdk.getOrganization(
    {
      uuid: record.uuid!,
    },
    {
      fields: loader.getFieldsList(),
    }
  );

  return res.status(201).json(out);
};

export const getList = async (req, res) => {
  const userId = req.user.id;

  let $where: any = getWhereQuery(req, resourceSchemas.Organization);

  const $orderBy = {
    id: req.query.order === undefined ? "desc" : req.query.order,
  };

  const $paginate = getPaginateQuery(req);

  const dbSdkRes = await dbSdk.getOrganizationListPaginated(
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
  const { organizationUuid } = req.params;

  const out = await dbSdk.getOrganization(
    { uuid: organizationUuid },
    { fields: loader.getFieldsList() }
  );

  return res.json(out);
};

export const updateOne = async (req, res, next) => {
  const { organizationUuid } = req.params;

  const out = await dbSdk.patchOrganization(
    { uuid: organizationUuid },
    { ...req.body },
    { fields: loader.getFieldsList() }
  );

  return res.json(out);
};

export const deleteOne = async (req, res) => {
  const { organizationUuid } = req.params;

  await deletionHelper.deleteOrganization({ organizationUuid });

  return res.status(204).end();
};
