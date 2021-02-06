import dbSdk from "../../../../../services/dbServiceV2";

// libs
import {
  getPaginateQuery,
  getPagingDataV2,
} from "../../../lib/utils/pagination";

import { getWhereQuery } from "../../../lib/utils/filtering";

import * as loader from "../../../lib/loaders/certificateTokens";

import { createError, ErrorType } from "../../../lib/utils/createError";

import * as deletionHelper from "../../../lib/utils/deletion";

// schemas
import * as resourceSchemas from "../../../components/schemas/CertificateTokens";

export const createOneForCertificateAuthority = async (req, res, next) => {
  const creator = req.creator;

  const { certificateAuthorityUuid } = req.params;
  const { issuerCertificateAuthorityUuid } = req.body;

  // get CA
  const certificateAuthorityList = await dbSdk.getCertificateAuthorityList(
    {
      $where: { uuid: certificateAuthorityUuid, valid: true },
    },
    { fields: ["id", "uuid"] }
  );

  if (!certificateAuthorityList.length) {
    return next(createError(ErrorType.RESOURCE_NOT_FOUND));
  }

  // get issuer CA
  const issuerCertificateAuthorityList = await dbSdk.getCertificateAuthorityList(
    {
      $where: { uuid: issuerCertificateAuthorityUuid, valid: true },
    },
    { fields: ["id", "uuid"] }
  );
  if (!issuerCertificateAuthorityList.length) {
    return next(createError(ErrorType.RESOURCE_NOT_FOUND));
  }
  delete req.body.issuerCertificateAuthorityUuid;

  const isSelfSigned =
    certificateAuthorityUuid === req.body.issuerCertificateAuthorityUuid;

  const record = await dbSdk.postCertificateToken(
    {
      ...req.body,
      isSelfSigned,
      revoked: false,
      issuerCertificateAuthorityId: issuerCertificateAuthorityList[0].id!,
      creator,
    },
    {
      fields: ["id", "uuid"],
    }
  );

  await dbSdk.postCertificateAuthorityCertificateToken({
    certificateAuthorityId: certificateAuthorityList[0].id!,
    certificateTokenId: record.id!,
    creator,
  });

  const out = await dbSdk.getCertificateToken(
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

export const createOneForOrganization = async (req, res, next) => {
  const creator = req.creator;

  const { organizationUuid } = req.params;
  const { issuerCertificateAuthorityUuid } = req.params;

  // get organization
  const organizationList = await dbSdk.getOrganizationList(
    {
      $where: { uuid: organizationUuid, valid: true },
    },
    { fields: ["id", "uuid"] }
  );

  if (!organizationList.length) {
    return next(createError(ErrorType.RESOURCE_NOT_FOUND));
  }

  // get issuer CA
  const issuerCertificateAuthorityList = await dbSdk.getCertificateAuthorityList(
    {
      $where: { uuid: issuerCertificateAuthorityUuid, valid: true },
    },
    { fields: ["id", "uuid"] }
  );
  if (!issuerCertificateAuthorityList.length) {
    return next(createError(ErrorType.RESOURCE_NOT_FOUND));
  }
  delete req.body.issuerCertificateAuthorityUuid;

  const record = await dbSdk.postCertificateToken(
    {
      ...req.body,
      isSelfSigned: false,
      revoked: false,
      issuerCertificateAuthorityId: issuerCertificateAuthorityList[0].id!,
      creator,
    },
    {
      fields: ["id", "uuid"],
    }
  );

  await dbSdk.postOrganizationCertificateToken({
    organizationId: organizationList[0].id!,
    certificateTokenId: record.id!,
    creator,
  });

  const out = await dbSdk.getCertificateToken(
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

  let $where: any = getWhereQuery(req, resourceSchemas.CertificateToken);

  const $orderBy = {
    id: req.query.order === undefined ? "desc" : req.query.order,
  };

  const $paginate = getPaginateQuery(req);

  const dbSdkRes = await dbSdk.getCertificateTokenListPaginated(
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
  const { certificateTokenUuid } = req.params;

  const out = await dbSdk.getCertificateToken(
    { uuid: certificateTokenUuid },
    { fields: loader.getFieldsList() }
  );

  return res.json(out);
};

export const updateOne = async (req, res, next) => {
  const { certificateTokenUuid } = req.params;

  let data = { ...req.body };

  const out = await dbSdk.patchCertificateToken(
    { uuid: certificateTokenUuid },
    { ...data },
    { fields: loader.getFieldsList() }
  );

  return res.json(out);
};

export const deleteOne = async (req, res) => {
  const { certificateTokenUuid } = req.params;

  await deletionHelper.deleteCertificateToken({ certificateTokenUuid });

  return res.status(204).end();
};
