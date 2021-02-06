import * as config from "../../../../configuration";

import dbSdk from "../../../../services/dbServiceV2";

async function _deleteOrganization({ organizationUuid }) {
  await dbSdk.patchOrganization({ uuid: organizationUuid }, { valid: false });
}
export const deleteOrganization = _deleteOrganization;

async function _deleteAddress({ addressUuid }) {
  await dbSdk.patchAddress({ uuid: addressUuid }, { valid: false });
}
export const deleteAddress = _deleteAddress;

async function _deletePKI({ pkiUuid }) {
  await dbSdk.patchPki({ uuid: pkiUuid }, { valid: false });
}
export const deletePKI = _deletePKI;

async function _deleteCertificateAuthority({ certificateAuthorityUuid }) {
  await dbSdk.patchCertificateAuthority(
    { uuid: certificateAuthorityUuid },
    { valid: false }
  );
}
export const deleteCertificateAuthority = _deleteCertificateAuthority;

async function _deleteCertificateToken({ certificateTokenUuid }) {
  await dbSdk.patchCertificateToken(
    { uuid: certificateTokenUuid },
    { valid: false }
  );
}
export const deleteCertificateToken = _deleteCertificateToken;
