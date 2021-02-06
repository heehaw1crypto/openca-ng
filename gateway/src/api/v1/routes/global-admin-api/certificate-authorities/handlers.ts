import dbSdk from "../../../../../services/dbServiceV2";

// libs
import {
  getPaginateQuery,
  getPagingDataV2,
} from "../../../lib/utils/pagination";

import { getWhereQuery } from "../../../lib/utils/filtering";

import * as loader from "../../../lib/loaders/certificateAuthorities";

import { createError, ErrorType } from "../../../lib/utils/createError";

import * as deletionHelper from "../../../lib/utils/deletion";

// schemas
import * as resourceSchemas from "../../../components/schemas/CertificateAuthorities";

export const createOne = async (req, res, next) => {
  const creator = req.creator;

  const { pkiUuid } = req.body;

  let pkiId: number | null = null;

  // get PKI
  if (pkiUuid) {
    const pkiList = await dbSdk.getPkiList({
      $where: { uuid: pkiUuid, valid: true },
    });
    if (!pkiList.length) {
      return next(createError(ErrorType.RESOURCE_NOT_FOUND));
    }
    pkiId = pkiList[0].id!;
    delete req.body.pkiUuid;
  }

  const out = await dbSdk.postCertificateAuthority(
    {
      ...req.body,
      pkiId,
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

  let $where: any = getWhereQuery(req, resourceSchemas.CertificateAuthority);

  const $orderBy = {
    id: req.query.order === undefined ? "desc" : req.query.order,
  };

  const $paginate = getPaginateQuery(req);

  const dbSdkRes = await dbSdk.getCertificateAuthorityListPaginated(
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
  const { certificateAuthorityUuid } = req.params;

  const out = await dbSdk.getCertificateAuthority(
    { uuid: certificateAuthorityUuid },
    { fields: loader.getFieldsList() }
  );

  return res.json(out);
};

export const updateOne = async (req, res, next) => {
  const { certificateAuthorityUuid } = req.params;

  let data = { ...req.body };

  const out = await dbSdk.patchCertificateAuthority(
    { uuid: certificateAuthorityUuid },
    { ...data },
    { fields: loader.getFieldsList() }
  );

  return res.json(out);
};

export const deleteOne = async (req, res) => {
  const { certificateAuthorityUuid } = req.params;

  await deletionHelper.deleteCertificateAuthority({ certificateAuthorityUuid });

  return res.status(204).end();
};
