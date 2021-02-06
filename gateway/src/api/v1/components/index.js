const {
  Address,
  AddressNullable,
  AddressCreate,
  AddressUpdate,
} = require("./schemas/Addresses");

const {
  CertificateAuthority,
  CertificateAuthorityNullable,
  CertificateAuthorityCreate,
  CertificateAuthorityUpdate,
} = require("./schemas/CertificateAuthorities");

const {
  CertificateToken,
  CertificateTokenNullable,
  CertificateTokenCreate,
  CertificateTokenUpdate,
} = require("./schemas/CertificateTokens");

const {
  Organization,
  OrganizationNullable,
  OrganizationCreate,
  OrganizationUpdate,
} = require("./schemas/Organizations");

const { PaginationObject } = require("./schemas/Pagination");

const { PKI, PKINullable, PKICreate, PKIUpdate } = require("./schemas/PKIs");

const { Role, RoleEnum } = require("./schemas/Roles");

const {
  User,
  UserLogin,
  UserLoginResponse,
  UserRegister,
  UserUpdate,
} = require("./schemas/Users");

module.exports = {
  schemas: {
    User,
    UserLogin,
    UserLoginResponse,
    UserRegister,
    UserUpdate,
    Organization,
    OrganizationNullable,
    OrganizationCreate,
    OrganizationUpdate,
    Role,
    RoleEnum,
    Pagination: PaginationObject,
    Address,
    AddressNullable,
    AddressCreate,
    AddressUpdate,
    PKI,
    PKINullable,
    PKICreate,
    PKIUpdate,
    CertificateAuthority,
    CertificateAuthorityNullable,
    CertificateAuthorityCreate,
    CertificateAuthorityUpdate,
    CertificateToken,
    CertificateTokenNullable,
    CertificateTokenCreate,
    CertificateTokenUpdate,
  },
};
