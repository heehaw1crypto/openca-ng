import dbSdk from "../../../../../services/dbServiceV2";

// libs
import {
  getPaginateQuery,
  getPagingDataV2,
} from "../../../lib/utils/pagination";

import { getWhereQuery } from "../../../lib/utils/filtering";

import * as loader from "../../../lib/loaders/addresses";

import { createError, ErrorType } from "../../../lib/utils/createError";

import * as deletionHelper from "../../../lib/utils/deletion";

// schemas
import * as resourceSchemas from "../../../components/schemas/Addresses";

export const createOne = async (req, res, next) => {
  const creator = req.creator;

  const { organizationUuid } = req.params;

  // get organization
  const organizationList = await dbSdk.getOrganizationList({
    $where: { uuid: organizationUuid, valid: true },
  });

  if (!organizationList.length) {
    return next(createError(ErrorType.RESOURCE_NOT_FOUND));
  }

  const record = await dbSdk.postAddress(
    {
      ...req.body,
      creator,
    },
    {
      fields: ["id", "uuid"],
    }
  );

  await dbSdk.postOrganizationAddress({
    organizationId: organizationList[0].id!,
    addressId: record.id!,
    creator,
  });

  const out = await dbSdk.getAddress(
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

  let $where: any = getWhereQuery(req, resourceSchemas.Address);

  const $orderBy = {
    id: req.query.order === undefined ? "desc" : req.query.order,
  };

  const $paginate = getPaginateQuery(req);

  const dbSdkRes = await dbSdk.getAddressListPaginated(
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
  const { addressUuid } = req.params;

  const out = await dbSdk.getAddress(
    { uuid: addressUuid },
    { fields: loader.getFieldsList() }
  );

  return res.json(out);
};

export const updateOne = async (req, res, next) => {
  const { addressUuid } = req.params;

  let data = { ...req.body };

  const out = await dbSdk.patchAddress(
    { uuid: addressUuid },
    { ...data },
    { fields: loader.getFieldsList() }
  );

  return res.json(out);
};

export const deleteOne = async (req, res) => {
  const { addressUuid } = req.params;

  await deletionHelper.deleteAddress({ addressUuid });

  return res.status(204).end();
};
