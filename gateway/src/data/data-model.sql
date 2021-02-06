
SET @@GLOBAL.sql_mode='NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION';

DROP DATABASE IF EXISTS `OpenCA_NG`;
CREATE DATABASE IF NOT EXISTS `OpenCA_NG`
  DEFAULT CHARACTER SET utf8
  COLLATE utf8_general_ci;
USE `OpenCA_NG`;

-- template tables

DROP TABLE IF EXISTS `_Base`;
CREATE TABLE `_Base` (
  `uuid`                              BINARY(36) NOT NULL UNIQUE,
  `shortDescription`                  VARCHAR(255) NULL,
  `longDescription`                   TEXT NULL,
  `created`                           TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `creator`                           CHAR(36) NOT NULL,
  `metadata`	                        TEXT NULL,
  `updated`                           TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updaterIdentityUuid`               BINARY(36) NULL,
  `valid`                             TINYINT(1) NOT NULL DEFAULT 1 COMMENT 'a DELETE action was taken on the record due to an error or correction.  For auditability, the record is kept intact.',
  `archived`                          TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'REST DELETE operation sets to true',
  `cacheKey`                          BINARY(36) NULL,
  `integrityKey`                      VARCHAR(255) NULL COMMENT 'Hash containing history of all ordered record updates',
  `deidentified`                      TINYINT(1) NOT NULL DEFAULT 0, 
  `deidentifiedTimestamp`             BIGINT NULL,
  `markedForExpungepment`             TINYINT(1) NOT NULL DEFAULT 0, 
  `expungementTimestamp`              BIGINT NULL,
  `containsSensitiveData`             TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'Flag to mark if record could contain Sensitive Information',
  `sensitivityClassificationTypeEnum` VARCHAR(20) NOT NULL DEFAULT 'PHI',
  `version`                           VARCHAR(10) NOT NULL DEFAULT 'v1',
  `correlationUuid`                   BINARY(36) NULL,
  `externalId`                        VARCHAR(255) NULL COMMENT 'Identifier for external system reference',
  `comment`                           TEXT NULL,
  `recordType`                        VARCHAR(6) DEFAULT "RECORD"
) ENGINE=InnoDB CHARSET=utf8;


-- begin concrete tables

DROP TABLE IF EXISTS `Role`;
CREATE TABLE `Role` (
    `id`   BIGINT(20) NOT NULL AUTO_INCREMENT,
    `enum` VARCHAR(20) NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    PRIMARY KEY (`id`)
) SELECT * FROM `_Base`;

INSERT INTO Role SET uuid=UUID(), enum="USER", name="User", creator="SYSTEM";
INSERT INTO Role SET uuid=UUID(), enum="ADMIN", name="Admin", creator="SYSTEM";
INSERT INTO Role SET uuid=UUID(), enum="GLOBAL_ADMIN", name="Global Admin", creator="SYSTEM";

DROP TABLE IF EXISTS `User`;
CREATE TABLE `User` (
    `id`                       BIGINT(20) NOT NULL AUTO_INCREMENT,
    `primaryRoleId`            BIGINT NOT NULL,
    `primaryRoleEnum`          VARCHAR(20) NOT NULL,
    `firstName`                VARCHAR(50) NULL,
    `lastName`                 VARCHAR(50) NULL,
    `username`                 VARCHAR(50) NOT NULL UNIQUE,
    `email`                    VARCHAR(50) NOT NULL UNIQUE,
    `password`                 VARCHAR(1024) NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `User_primaryRoleId_fk` FOREIGN KEY (`primaryRoleId`) REFERENCES `Role` (`id`)
) SELECT * FROM `_Base`;


DROP TABLE IF EXISTS `Address`;
CREATE TABLE `Address` (
    `id`          BIGINT(20) NOT NULL AUTO_INCREMENT,
    `street1`     VARCHAR(255) NULL,
    `street2`     VARCHAR(255) NULL,
    `city`        VARCHAR(255) NULL,
    `state`       VARCHAR(255) NULL,
    `postalCode`  VARCHAR(255) NULL,
    `country`     VARCHAR(255) NULL,
    PRIMARY KEY (`id`)
) SELECT * FROM `_Base`;

DROP TABLE IF EXISTS `Organization`;
CREATE TABLE `Organization` (
    `id`           BIGINT(20) NOT NULL AUTO_INCREMENT,
    `name`         VARCHAR(255) NOT NULL,
    `description`  TEXT NULL,
    `siteUrl`      TEXT NULL,
    `logoUrl`      TEXT NULL,
    `isEnabled`    TINYINT(1) NOT NULL DEFAULT 1,
    PRIMARY KEY (`id`)
) SELECT * FROM `_Base`;

DROP TABLE IF EXISTS `PKI`;
CREATE TABLE `PKI` (
    `id`           BIGINT(20) NOT NULL AUTO_INCREMENT,
    `name`         VARCHAR(255) NOT NULL,
    `description`  TEXT NULL,
    `siteUrl`      TEXT NULL,
    `logoUrl`      TEXT NULL,
    `policyName`   VARCHAR(255) NULL,
    `policyUrl`    TEXT NULL,
    `isEnabled`    TINYINT(1) NOT NULL DEFAULT 1,
    PRIMARY KEY (`id`)
) SELECT * FROM `_Base`;

DROP TABLE IF EXISTS `OrganizationAddress`;
CREATE TABLE `OrganizationAddress` (
    `id`             BIGINT(20) NOT NULL AUTO_INCREMENT,
    `addressId`      BIGINT NOT NULL,
    `organizationId` BIGINT NOT NULL,
    `isPrimary`      TINYINT(1) NOT NULL DEFAULT 0,
    PRIMARY KEY (`id`),
    CONSTRAINT `OrganizationAddress_addressId_fk` FOREIGN KEY (`addressId`) REFERENCES `Address` (`id`),
    CONSTRAINT `OrganizationAddress_organizationId_fk` FOREIGN KEY (`organizationId`) REFERENCES `Organization` (`id`)
) SELECT * FROM `_Base`;

DROP TABLE IF EXISTS `CertificateAuthority`;
CREATE TABLE IF NOT EXISTS `CertificateAuthority` (
  `id`            BIGINT NOT NULL AUTO_INCREMENT,
  `pkiId`         BIGINT NULL,
  `name`          VARCHAR(255) NOT NULL,
  `description`   VARCHAR(255) NULL,
  `status`        ENUM('ENABLED', 'DISABLED', 'SUSPENDED'),
  `isRoot`        TINYINT(1) NOT NULL DEFAULT 0,
  `hasValidToken` TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY id_pk (`id`),
  CONSTRAINT `CertificateAuthority_pkiId_fk` FOREIGN KEY (`pkiId`) REFERENCES `PKI` (`id`)
) SELECT * FROM `_Base`;

DROP TABLE IF EXISTS `CertificateToken`;
CREATE TABLE IF NOT EXISTS `CertificateToken` (
  `id`                            BIGINT NOT NULL AUTO_INCREMENT,
  `issuerCertificateAuthorityId`  BIGINT NOT NULL,
  `standard`                      ENUM('X509', 'OTHER'),
  `key`                           TEXT NULL,
  `cert`                          TEXT NULL,
  `isSelfSigned`                  TINYINT(1) NOT NULL DEFAULT 0,
  `caOwned`                       TINYINT(1) NOT NULL DEFAULT 0,
  `expires`                       BIGINT NOT NULL,
  `revoked`                       TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY id_pk (`id`),
  CONSTRAINT `CertificateToken_issuerId_fk` FOREIGN KEY (`issuerCertificateAuthorityId`) REFERENCES `CertificateAuthority` (`id`)
) SELECT * FROM `_Base`;

DROP TABLE IF EXISTS `CertificateAuthorityCertificateToken`;
CREATE TABLE `CertificateAuthorityCertificateToken` (
    `id`                      BIGINT(20) NOT NULL AUTO_INCREMENT,
    `certificateAuthorityId`  BIGINT NOT NULL,
    `certificateTokenId`      BIGINT NOT NULL,
    `isSelected`              TINYINT(1) NOT NULL DEFAULT 0,
    PRIMARY KEY (`id`),
    CONSTRAINT `CertificateAuthorityCertificateToken_certificateAuthorityId_fk` FOREIGN KEY (`certificateAuthorityId`) REFERENCES `CertificateAuthority` (`id`),
    CONSTRAINT `CertificateAuthorityCertificateToken_certificateTokenId_fk` FOREIGN KEY (`certificateTokenId`) REFERENCES `CertificateToken` (`id`)
) SELECT * FROM `_Base`;

DROP TABLE IF EXISTS `OrganizationCertificateToken`;
CREATE TABLE `OrganizationCertificateToken` (
    `id`                  BIGINT(20) NOT NULL AUTO_INCREMENT,
    `organizationId`      BIGINT NOT NULL,
    `certificateTokenId`  BIGINT NOT NULL,
    `isSelected`          TINYINT(1) NOT NULL DEFAULT 0,
    PRIMARY KEY (`id`),
    CONSTRAINT `OrganizationCertificateToken_certificateAuthorityId_fk` FOREIGN KEY (`organizationId`) REFERENCES `Organization` (`id`),
    CONSTRAINT `OrganizationCertificateToken_certificateTokenId_fk` FOREIGN KEY (`certificateTokenId`) REFERENCES `CertificateToken` (`id`)
) SELECT * FROM `_Base`;

DROP TABLE IF EXISTS `Order`;
CREATE TABLE IF NOT EXISTS `Order` (
  `id`                     BIGINT NOT NULL AUTO_INCREMENT,
  `submittedByUserId`      BIGINT NULL,
  `organizationId`         BIGINT NULL,
  `certificateAuthorityId` BIGINT NULL,
  `serialNumber`           BIGINT NOT NULL,
  `generateKeys`           TINYINT(1) NOT NULL DEFAULT 0,
  `status`                 ENUM('NEW', 'REJECTED', 'PENDING_FINAL_APPROVAL', 'APPROVED'),
  `subject`                JSON NULL,
  `publicKey`              JSON NULL,
  `extensions`             JSON NULL,
  PRIMARY KEY id_pk (`id`)
) SELECT * FROM `_Base`;

DROP TABLE IF EXISTS `Job`;
CREATE TABLE IF NOT EXISTS `Job` (
  `id`                      BIGINT NOT NULL AUTO_INCREMENT,
  `certificateAuthorityId`  BIGINT NULL,
  `prevId`                  BIGINT NULL,
  `nextId`                  BIGINT NULL,
  `fileName`                VARCHAR(255) NULL,
  `ordFileName`             VARCHAR(255) NULL,
  `submittedOn`             VARCHAR(255) NULL,
  `completedOn`             VARCHAR(255) NULL,
  `errorOn`                 VARCHAR(255) NULL,
  `processed`               JSON NULL,
  PRIMARY KEY id_pk (`id`)
) SELECT * FROM `_Base`;

DROP TABLE IF EXISTS `CSPCapabilityCryptocmdAlgorcmd`;
CREATE TABLE IF NOT EXISTS `CSPCapabilityCryptocmdAlgorcmd` (
  `id`             BIGINT NOT NULL AUTO_INCREMENT,
  `rsa`            VARCHAR(255) NULL,
  `ecdsa`          VARCHAR(255) NULL,
  `composite`      VARCHAR(255) NULL,
  PRIMARY KEY id_pk (`id`)
) SELECT * FROM `_Base`;

DROP TABLE IF EXISTS `CSPCapabilityCryptocmd`;
CREATE TABLE IF NOT EXISTS `CSPCapabilityCryptocmd` (
  `id`       BIGINT NOT NULL AUTO_INCREMENT,
  `algorcmdId`    BIGINT NULL,
  `enabled`  TINYINT(1) NOT NULL DEFAULT 1,
  CONSTRAINT `CSPCapabilityCryptocmd_cmdId_fk` FOREIGN KEY (`algorcmdId`) REFERENCES `CSPCapabilityCryptocmdAlgorcmd` (`id`),
  PRIMARY KEY id_pk (`id`)
) SELECT * FROM `_Base`;

DROP TABLE IF EXISTS `CSP`;
CREATE TABLE IF NOT EXISTS `CSP` (
  `id`             BIGINT NOT NULL AUTO_INCREMENT,
  `enabled`        TINYINT(1) NOT NULL DEFAULT 1,
  `hasKeyFile`     TINYINT(1) NOT NULL DEFAULT 1,
  `isHardware`     TINYINT(1) NOT NULL DEFAULT 1,
  `compliance`     JSON,
  `init`           JSON,
  PRIMARY KEY id_pk (`id`)
) SELECT * FROM `_Base`;

DROP TABLE IF EXISTS `CSPCapability`;
CREATE TABLE IF NOT EXISTS `CSPCapability` (
  `id`              BIGINT NOT NULL AUTO_INCREMENT,
  `cspId`           BIGINT NULL,
  `keyDeleteCmdId`  BIGINT NULL,
  `keyCreateCmdId`  BIGINT NULL,
  `keyImportCmdId`  BIGINT NULL,
  `keyExportCmdId`  BIGINT NULL,
  `enabled`         TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY id_pk (`id`),
  CONSTRAINT `CSPCapability_cspId_fk` FOREIGN KEY (`cspId`) REFERENCES `CSP` (`id`)
) SELECT * FROM `_Base`;

DROP TABLE IF EXISTS `CSPCapability`;
CREATE TABLE IF NOT EXISTS `CSPCapability` (
  `id`              BIGINT NOT NULL AUTO_INCREMENT,
  `cspId`           BIGINT NULL,
  `keyDeleteCmdId`  BIGINT NULL,
  `keyCreateCmdId`  BIGINT NULL,
  `keyImportCmdId`  BIGINT NULL,
  `keyExportCmdId`  BIGINT NULL,
  `enabled`         TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY id_pk (`id`),
  CONSTRAINT `CSPCapability_cspId_fk` FOREIGN KEY (`cspId`) REFERENCES `CSP` (`id`)
) SELECT * FROM `_Base`;

/* user links */

DROP TABLE IF EXISTS `UserRole`;
CREATE TABLE `UserRole` (
    `id`      BIGINT(20) NOT NULL AUTO_INCREMENT,
    `roleId`  BIGINT NOT NULL,
    `userId`  BIGINT NOT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `UserRole_roleId_fk` FOREIGN KEY (`roleId`) REFERENCES `Role` (`id`),
    CONSTRAINT `UserRole_userId_fk` FOREIGN KEY (`userId`) REFERENCES `User` (`id`)
) SELECT * FROM `_Base`;

DROP TABLE IF EXISTS `UserOrganization`;
CREATE TABLE `UserOrganization` (
    `id`             BIGINT(20) NOT NULL AUTO_INCREMENT,
    `organizationId` BIGINT NOT NULL,
    `userId`         BIGINT NOT NULL,
    `isSelected`     TINYINT(1) NOT NULL DEFAULT 1,
    PRIMARY KEY (`id`),
    CONSTRAINT `UserOrganization_organizationId_fk` FOREIGN KEY (`organizationId`) REFERENCES `Organization` (`id`),
    CONSTRAINT `UserOrganization_userId_fk` FOREIGN KEY (`userId`) REFERENCES `User` (`id`)
) SELECT * FROM `_Base`;

/* state tracking */

DROP TABLE IF EXISTS `StateType`;
CREATE TABLE IF NOT EXISTS `StateType` (
  `id`              BIGINT NOT NULL AUTO_INCREMENT,
  `parentId`        BIGINT NULL,
  `name`            VARCHAR(255) NULL,
  `enum`            VARCHAR(255) NULL,
  `type`            ENUM('ORDER', 'JOB', 'CERTIFICATE_TOKEN'),
  PRIMARY KEY id_pk (`id`)
) SELECT * FROM `_Base`;

DROP TABLE IF EXISTS `OrderState`;
CREATE TABLE IF NOT EXISTS `OrderState` (
  `id`               BIGINT NOT NULL AUTO_INCREMENT,
  `parentId`         BIGINT NULL,
  `orderId`          BIGINT NULL,
  `stateId`          BIGINT NULL,
  `stateEnum`        VARCHAR(255) NULL,
  `entryTimestamp`   BIGINT NULL,
  `exitTimestamp`    BIGINT NULL,
  PRIMARY KEY id_pk (`id`)
) SELECT * FROM `_Base`;

/* write all records at end of job (redis manages in-progress job state tracking) */
DROP TABLE IF EXISTS `JobState`;
CREATE TABLE IF NOT EXISTS `JobState` (
  `id`               BIGINT NOT NULL AUTO_INCREMENT,
  `parentId`         BIGINT NULL,
  `jobId`            BIGINT NULL,
  `stateId`          BIGINT NULL,
  `stateEnum`        VARCHAR(255) NULL,
  `entryTimestamp`   BIGINT NULL,
  `exitTimestamp`    BIGINT NULL,
  PRIMARY KEY id_pk (`id`)
) SELECT * FROM `_Base`;

DROP TABLE IF EXISTS `CertificateTokenState`;
CREATE TABLE IF NOT EXISTS `CertificateTokenState` (
  `id`                 BIGINT NOT NULL AUTO_INCREMENT,
  `parentId`           BIGINT NULL,
  `certificateTokenId` BIGINT NULL,
  `stateId`            BIGINT NULL,
  `stateEnum`          VARCHAR(255) NULL,
  `entryTimestamp`     BIGINT NULL,
  `exitTimestamp`      BIGINT NULL,
  PRIMARY KEY id_pk (`id`)
) SELECT * FROM `_Base`;

DROP TABLE IF EXISTS `Comment`;
CREATE TABLE IF NOT EXISTS `Comment` (
  `id`                      BIGINT NOT NULL AUTO_INCREMENT,
  `parentId`                BIGINT NULL,
  `organizationId`          BIGINT NULL,
  `userId`                  BIGINT NULL,
  `orderId`                 BIGINT NULL,
  `orderStateId`            BIGINT NULL,
  `jobStateId`              BIGINT NULL,
  `certificateTokenStateId` BIGINT NULL,
  `markdownText`            TEXT NULL,
  PRIMARY KEY id_pk (`id`)
) SELECT * FROM `_Base`;

/* seed data */

INSERT INTO `User` SET uuid=UUID(), primaryRoleId=(SELECT id FROM Role WHERE enum="GLOBAL_ADMIN"), primaryRoleEnum="GLOBAL_ADMIN", username="gadmin", email="opencagadmin@openca.org", password=SHA2("69c5ncWxZWXVVA3N", 256), creator="SYSTEM";
INSERT INTO `UserRole` SET uuid=UUID(), roleId=(SELECT id FROM Role WHERE enum="USER"),         userId=(SELECT id FROM User WHERE username="gadmin"), creator="SYSTEM";
INSERT INTO `UserRole` SET uuid=UUID(), roleId=(SELECT id FROM Role WHERE enum="GLOBAL_ADMIN"), userId=(SELECT id FROM User WHERE username="gadmin"), creator="SYSTEM";