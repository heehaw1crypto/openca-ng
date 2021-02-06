
-- SELECT @@GLOBAL.sql_mode; 
-- SET @@GLOBAL.sql_mode='STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION';
SET @@GLOBAL.sql_mode='NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION';

DROP DATABASE IF EXISTS `AMZR_RiskAssessment`;
CREATE DATABASE IF NOT EXISTS `AMZR_RiskAssessment`
  DEFAULT CHARACTER SET utf8
  COLLATE utf8_general_ci;
USE `AMZR_RiskAssessment`;

DROP TABLE IF EXISTS `Authorization`;
CREATE TABLE IF NOT EXISTS `Authorization` (
  `id`          BIGINT       NOT NULL AUTO_INCREMENT,
  `uuid`        BINARY(36)    NOT NULL,
  `serviceName` VARCHAR(255) NOT NULL,
  `key`         VARCHAR(255) NOT NULL,
  `secret`      VARCHAR(255) NOT NULL,
  `created`     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY id_pk (`id`),
  UNIQUE INDEX auth_idx (`serviceName`, `key`, `secret`)
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8;

INSERT INTO Authorization (`uuid`, `serviceName`, `key`, `secret`) VALUES (UUID(), 'testService', 'key', SHA2('secret', 256));

-- Tables to add: CategoryTemplate, OrganizationalReporting, ...

-- template tables

DROP TABLE IF EXISTS `_Base`;
CREATE TABLE `_Base` (
  `uuid`                              BINARY(36) NOT NULL UNIQUE,
  `shortDescription`                  VARCHAR(255) NULL,
  `longDescription`                   TEXT NULL,
  `created`                           TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `creator`                           CHAR(36) NOT NULL,
  `metadata`	                      TEXT NULL,
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

DROP TABLE IF EXISTS `_AttributeTypeBase`;
CREATE TABLE `_AttributeTypeBase` (
  `enum`              VARCHAR(255) NOT NULL,
  `name`              VARCHAR(255) NOT NULL,
  `labelNumber`       VARCHAR(20) NULL,
  `defaultValue`      TEXT NOT NULL,
  `isRequired`        TINYINT(1) NOT NULL DEFAULT 0,
  `jsonSchema`        TEXT NOT NULL,
  `label`             VARCHAR(255) NULL,
  `placeholderText`   VARCHAR(255) NULL,
  `helpMarkdownText`  TEXT NULL,
  `isMedia`           TINYINT(1) NULL DEFAULT 0
) SELECT * FROM `_Base`;

DROP TABLE IF EXISTS `_AttributeTypeValueBase`;
CREATE TABLE `_AttributeTypeValueBase` (
  `enum`  VARCHAR(255) NOT NULL,
  `name`  VARCHAR(255) NOT NULL,
  `value` VARCHAR(255) NULL
) SELECT * FROM `_Base`;

DROP TABLE IF EXISTS `_AttributeBase`;
CREATE TABLE `_AttributeBase` (
  `name`  VARCHAR(255) NULL,
  `value` VARCHAR(255) NULL
) SELECT * FROM `_Base`;

-- begin concrete tables

DROP TABLE IF EXISTS `Media`;
CREATE TABLE IF NOT EXISTS `Media` (
  `id`                   BIGINT        NOT NULL AUTO_INCREMENT,
  `name`                 VARCHAR(1024) NULL,
  `type`                 ENUM('DOCUMENT', 'IMAGE', 'VIDEO', 'AUDIO'),
  `mimeType`             VARCHAR(255)  NULL,
  `sourceMediaUrl`       TEXT,
  `compressedMediaUrl`   TEXT,
  `caption`              VARCHAR(1024) NULL,
  `sourceMediaKey`       VARCHAR(255)  NULL,
  `compressedMediaKey`   VARCHAR(255)  NULL,
  `storageLocation`      ENUM('S3_BUCKET', 'GCP_BUCKET', 'INTERNAL') NOT NULL,
  `originalFilename`     VARCHAR(255)  NOT NULL,
  `isPublic`             TINYINT(1)    NOT NULL DEFAULT 0,
  PRIMARY KEY id_pk (`id`)
) SELECT * FROM `_Base`;
 
 
DROP TABLE IF EXISTS `Tag`;
CREATE TABLE IF NOT EXISTS `Tag` (
  `id`       BIGINT        NOT NULL AUTO_INCREMENT,
  `name`     VARCHAR(255)  NOT NULL,
  `rgbColor` VARCHAR(10)   NULL,
  PRIMARY KEY id_pk (`id`)
) SELECT * FROM `_Base`;


DROP TABLE IF EXISTS `Role`;
CREATE TABLE `Role` (
    `id`   BIGINT(20) NOT NULL AUTO_INCREMENT,
    `enum` VARCHAR(20) NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    PRIMARY KEY (`id`)
) SELECT * FROM `_Base`;

INSERT INTO Role SET uuid=UUID(), enum="SUPER_USER", name="Super User", creator="SYSTEM";
INSERT INTO Role SET uuid=UUID(), enum="STANDARD_USER", name="Standard User", creator="SYSTEM";

DROP TABLE IF EXISTS `User`;
CREATE TABLE `User` (
    `id`                       BIGINT(20) NOT NULL AUTO_INCREMENT,
    `primaryRoleId`            BIGINT NOT NULL,
    `primaryRoleEnum`          VARCHAR(20) NOT NULL,
    `firstName`                VARCHAR(50) NOT NULL,
    `lastName`                 VARCHAR(50) NOT NULL,
    `username`                 VARCHAR(50) NOT NULL UNIQUE,
    `email`                    VARCHAR(50) NOT NULL UNIQUE,
    `password`                 VARCHAR(1024) NULL,
    `accountType`              ENUM('USER', 'SERVICE_ACCOUNT') NOT NULL DEFAULT 'USER',
    `clientId`                 VARCHAR(1024) NULL,
    `clientSecret`             VARCHAR(1024) NULL,
    `externalIdProvider`       ENUM ('AMZ', 'GOOGLE') NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `User_primaryRoleId_fk` FOREIGN KEY (`primaryRoleId`) REFERENCES `Role` (`id`)
) SELECT * FROM `_Base`;

DROP TABLE IF EXISTS `Organization`;
CREATE TABLE `Organization` (
    `id`                   BIGINT(20) NOT NULL AUTO_INCREMENT,
    `enum`                 VARCHAR(20) NOT NULL,
    `name`                 VARCHAR(50) NOT NULL,
    `parentOrganizationId` BIGINT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `Organization_parentOrganizationId_fk` FOREIGN KEY (`parentOrganizationId`) REFERENCES `Organization` (`id`)
) SELECT * FROM `_Base`;

DROP TABLE IF EXISTS `OrganizationRole`;
CREATE TABLE `OrganizationRole` (
    `id`               BIGINT(20) NOT NULL AUTO_INCREMENT,
    `organizationId`   BIGINT NOT NULL,
    `organizationEnum` VARCHAR(20) NOT NULL,
    `enum`             VARCHAR(20) NOT NULL UNIQUE,
    `name`             VARCHAR(50) NOT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `OrganizationRole_organizationId_fk` FOREIGN KEY (`organizationId`) REFERENCES `Organization` (`id`)
) SELECT * FROM `_Base`;

-- Projects

/* Project AKA HARA "Hazard Analysis and Risk Assessment" */
DROP TABLE IF EXISTS `Project`;
CREATE TABLE `Project` (
    `id`                   BIGINT(20) NOT NULL AUTO_INCREMENT,
    `organizationId`       BIGINT NOT NULL,
    `enum`                 VARCHAR(255) NOT NULL,
    `name`                 VARCHAR(50) NOT NULL,
    `startDate`            BIGINT NOT NULL,
    `targetEndDate`        BIGINT NULL,
    `targetReleaseDate`    BIGINT NULL,
    `requirementsUrl`      TEXT NULL,
    `standardsUrl`         TEXT NULL,
    `projectManagementUrl` TEXT NULL,
    /* "Metric Actions" and "Action Required" are calculated in the project hydrator */
    PRIMARY KEY (`id`),
    CONSTRAINT `Project_organizationId_fk` FOREIGN KEY (`organizationId`) REFERENCES `Organization` (`id`)
) SELECT * FROM `_Base`;


DROP TABLE IF EXISTS `ProjectAttributeType`;
CREATE TABLE `ProjectAttributeType` (
    `id`                     BIGINT(20) NOT NULL AUTO_INCREMENT,
    `projectId`              BIGINT NOT NULL,
    `parentId`               BIGINT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `ProjectAttributeType_projectId_fk` FOREIGN KEY (`projectId`) REFERENCES `Project` (`id`),
    CONSTRAINT `ProjectAttributeType_parentId_fk`  FOREIGN KEY (`parentId`) REFERENCES  `ProjectAttributeType` (`id`)
) SELECT * FROM `_AttributeTypeBase`;

DROP TABLE IF EXISTS `ProjectAttributeTypeValue`;
CREATE TABLE `ProjectAttributeTypeValue` (
    `id`                      BIGINT(20) NOT NULL AUTO_INCREMENT,
    `projectId`               BIGINT NOT NULL,
    `projectAttributeTypeId`  BIGINT NOT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `ProjectAttributeTypeValue_projectId_fk` FOREIGN KEY (`projectId`) REFERENCES `Project` (`id`),
    CONSTRAINT `ProjectAttributeTypeValue_projectAttributeTypeId_fk` FOREIGN KEY (`projectAttributeTypeId`) REFERENCES `ProjectAttributeType` (`id`)
) SELECT * FROM `_AttributeTypeValueBase`;

DROP TABLE IF EXISTS `ProjectAttribute`;
CREATE TABLE `ProjectAttribute` (
    `id`                             BIGINT(20) NOT NULL AUTO_INCREMENT,
    `projectId`                      BIGINT NOT NULL,
    `projectAttributeTypeId`         BIGINT NOT NULL,
    `projectAttributeTypeValueId`    BIGINT NULL,
    `projectAttributeTypeEnum`       VARCHAR(255) NOT NULL,
    `projectAttributeTypeValueEnum`  VARCHAR(255) NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `ProjectAttribute_projectId_fk` FOREIGN KEY (`projectId`) REFERENCES `Project` (`id`),
    CONSTRAINT `ProjectAttribute_projectAttributeTypeId_fk` FOREIGN KEY (`projectAttributeTypeId`) REFERENCES `ProjectAttributeType` (`id`),
    CONSTRAINT `ProjectAttribute_projectAttributeTypeValueId_fk` FOREIGN KEY (`projectAttributeTypeValueId`) REFERENCES `ProjectAttributeTypeValue` (`id`)
) SELECT * FROM `_AttributeBase`;

-- Risk

DROP TABLE IF EXISTS `RiskCategory`;
CREATE TABLE `RiskCategory` (
    `id`             BIGINT(20) NOT NULL AUTO_INCREMENT,
    `sectionNumber`  VARCHAR(20) NULL,
    `enum`           VARCHAR(20) NOT NULL UNIQUE,
    `name`           VARCHAR(50) NOT NULL,
    `referenceUrl`   TEXT NULL COMMENT 'cert standard URL?',
    PRIMARY KEY (`id`)
) SELECT * FROM `_Base`;
 
DROP TABLE IF EXISTS `RiskCategoryAttributeType`;
CREATE TABLE `RiskCategoryAttributeType` (
    `id`                    BIGINT(20) NOT NULL AUTO_INCREMENT,
    `riskCategoryId`        BIGINT NULL,
    `parentId`              BIGINT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `RiskCategoryAttributeType_riskCategoryId_fk` FOREIGN KEY (`riskCategoryId`) REFERENCES `RiskCategory` (`id`),
    CONSTRAINT `RiskCategoryAttributeType_parentId_fk` FOREIGN KEY (`parentId`) REFERENCES `RiskCategoryAttributeType` (`id`)
) SELECT * FROM `_AttributeTypeBase`;

DROP TABLE IF EXISTS `RiskCategoryAttribute`;
CREATE TABLE `RiskCategoryAttribute` (
    `id`                          BIGINT(20) NOT NULL AUTO_INCREMENT,
    `riskCategoryId`              BIGINT NOT NULL,
    `riskCategoryAttributeTypeId` BIGINT NOT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `RiskCategoryAttribute_riskCategoryId_fk` FOREIGN KEY (`riskCategoryId`) REFERENCES `RiskCategory` (`id`),
    CONSTRAINT `RiskCategoryAttribute_riskCategoryAttributeTypeId_fk` FOREIGN KEY (`riskCategoryAttributeTypeId`) REFERENCES `RiskCategoryAttributeType` (`id`)
) SELECT * FROM `_AttributeBase`;

DROP TABLE IF EXISTS `RiskType`;
CREATE TABLE `RiskType` (
    `id`               BIGINT(20) NOT NULL AUTO_INCREMENT,
    `enum`             VARCHAR(20) NOT NULL UNIQUE,
    `name`             VARCHAR(50) NOT NULL,
    `parentId` BIGINT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `RiskType_parentId_fk` FOREIGN KEY (`parentId`) REFERENCES `RiskType` (`id`)
) SELECT * FROM `_Base`;


DROP TABLE IF EXISTS `Risk`;
CREATE TABLE `Risk` (
    `id`                BIGINT(20) NOT NULL AUTO_INCREMENT,
    `projectId`         BIGINT NOT NULL,
    `riskTypeId`        BIGINT NULL,
    `riskTypeEnum`      VARCHAR(20) NOT NULL,
    `riskCategoryId`    BIGINT NOT NULL,
    `riskCategoryEnum`  VARCHAR(20) NOT NULL,
    `name`              VARCHAR(50) NOT NULL,
    `sectionNumber`     VARCHAR(20) NULL,
    `referenceUrl`      TEXT NULL COMMENT 'cert standard URL?',
    `location`          TEXT NULL,
    `persons`           TEXT NULL,
    `activity`          TEXT NULL,
    `photoUrl`          TEXT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `Risk_projectId_fk` FOREIGN KEY (`projectId`) REFERENCES `Risk` (`id`),
    CONSTRAINT `Risk_riskTypeId_fk` FOREIGN KEY (`riskTypeId`) REFERENCES `RiskType` (`id`),
    CONSTRAINT `Risk_riskCategoryId_fk` FOREIGN KEY (`riskCategoryId`) REFERENCES `RiskCategory` (`id`)
) SELECT * FROM `_Base`;

DROP TABLE IF EXISTS `RiskAttributeType`;
CREATE TABLE `RiskAttributeType` (
    `id`       BIGINT(20) NOT NULL AUTO_INCREMENT,
    `riskId`   BIGINT NULL,
    `parentId` BIGINT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `RiskAttributeType_riskId_fk` FOREIGN KEY (`riskId`) REFERENCES `Risk` (`id`),
    CONSTRAINT `RiskAttributeType_parentId_fk` FOREIGN KEY (`parentId`) REFERENCES `RiskAttributeType` (`id`)
) SELECT * FROM `_AttributeTypeBase`;

DROP TABLE IF EXISTS `RiskAttribute`;
CREATE TABLE `RiskAttribute` (
    `id`                  BIGINT(20) NOT NULL AUTO_INCREMENT,
    `riskId`              BIGINT NOT NULL,
    `riskAttributeTypeId` BIGINT NOT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `RiskAttribute_riskId_fk` FOREIGN KEY (`riskId`) REFERENCES `Risk` (`id`),
    CONSTRAINT `RiskAttribute_riskAttributeTypeId_fk` FOREIGN KEY (`riskAttributeTypeId`) REFERENCES `RiskAttributeType` (`id`)
) SELECT * FROM `_AttributeBase`;

-- hardcode risk scale in API
DROP TABLE IF EXISTS `RiskEvaluation`;
CREATE TABLE `RiskEvaluation` (
    `id`                             BIGINT(20) NOT NULL AUTO_INCREMENT,
    `type`                           VARCHAR(20) NOT NULL DEFAULT 'SIL',
    `riskId`                         BIGINT NOT NULL,
    `stage`                          ENUM('INITIAL', 'RESIDUAL') NOT NULL DEFAULT 'INITIAL',
    `compositeSeverityOfInjury`      DECIMAL NULL,
    `compositeFrequencyOfEvent`      DECIMAL NULL,
    `compositePossibilityOfInjury`   DECIMAL NULL,
    `severityOfInjuryMin`            INTEGER NOT NULL DEFAULT 0,
    `severityOfInjuryMax`            INTEGER NOT NULL DEFAULT 3,
    `severityOfInjuryVoteAllowed`    TINYINT(1) NULL DEFAULT 0,
    `frequencyOfEventMin`            INTEGER NOT NULL DEFAULT 0,
    `frequencyOfEventMax`            INTEGER NOT NULL DEFAULT 3,
    `frequencyOfEventVoteAllowed`    TINYINT(1) NULL DEFAULT 0,
    `possibilityOfInjuryMin`         INTEGER NOT NULL DEFAULT 0,
    `possibilityOfInjuryMax`         INTEGER NOT NULL DEFAULT 3,
    `possibilityOfInjuryVoteAllowed` TINYINT(1) NULL DEFAULT 0,
    `compositeRiskScore`             DECIMAL NULL,
    `riskReductionMeasureComment`    TEXT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `RiskEvaluation_riskId_fk` FOREIGN KEY (`riskId`) REFERENCES `Risk` (`id`)
) SELECT * FROM `_Base`;


DROP TABLE IF EXISTS `RiskEvaluationEntry`;
CREATE TABLE `RiskEvaluationEntry` (
    `id`                  BIGINT(20) NOT NULL AUTO_INCREMENT,
    `userId`              BIGINT NOT NULL,
    `riskId`              BIGINT NOT NULL,
    `severityOfInjury`    DECIMAL NULL,
    `frequencyOfEvent`    DECIMAL NULL,
    `possibilityOfInjury` DECIMAL NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `RiskEvaluationEntry_userId_fk` FOREIGN KEY (`userId`) REFERENCES `User` (`id`),
    CONSTRAINT `RiskEvaluationEntry_riskId_fk` FOREIGN KEY (`riskId`) REFERENCES `Risk` (`id`)
) SELECT * FROM `_Base`;


DROP TABLE IF EXISTS `RiskDiscussion`;
CREATE TABLE `RiskDiscussion` (
    `id`      BIGINT(20) NOT NULL AUTO_INCREMENT,
    `type`    VARCHAR(20) NOT NULL DEFAULT 'SIL',
    `riskId`  BIGINT NOT NULL,
    `locked`  TINYINT(1) NOT NULL DEFAULT 0,
    `closed`  TINYINT(1) NOT NULL DEFAULT 0,
    PRIMARY KEY (`id`),
    CONSTRAINT `RiskDiscussion_riskId_fk` FOREIGN KEY (`riskId`) REFERENCES `Risk` (`id`)
) SELECT * FROM `_Base`;
 
DROP TABLE IF EXISTS `RiskDiscussionMessage`;
CREATE TABLE `RiskDiscussionMessage` (
    `id`                            BIGINT(20) NOT NULL AUTO_INCREMENT,
    `authorUserId`                  BIGINT NOT NULL,
    `parentId`                      BIGINT NULL,
    `mediaId`                       BIGINT NULL,
    `message`                       TEXT NOT NULL COMMENT 'markdown',
    `timestamp`                     BIGINT NOT NULL,
    `hasParentMessage`              TINYINT(1) NOT NULL DEFAULT 0,
    `isEdited`                      TINYINT(1) NOT NULL DEFAULT 0,
    PRIMARY KEY (`id`),
    CONSTRAINT `RiskDiscussionMessage_authorUserId_fk` FOREIGN KEY (`authorUserId`) REFERENCES `User` (`id`),
    CONSTRAINT `RiskDiscussionMessage_mediaId_fk` FOREIGN KEY (`mediaId`) REFERENCES `Media` (`id`),
    CONSTRAINT `RiskDiscussionMessage_parentId_fk` FOREIGN KEY (`parentId`) REFERENCES `RiskDiscussionMessage` (`id`)
) SELECT * FROM `_Base`;


DROP TABLE IF EXISTS `RiskMedia`;
CREATE TABLE `RiskMedia` (
    `id`      BIGINT(20) NOT NULL AUTO_INCREMENT,
    `riskId`  BIGINT NOT NULL,
    `mediaId` BIGINT NOT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `RiskMedia_riskId_fk`  FOREIGN KEY (`riskId`) REFERENCES  `Risk` (`id`),
    CONSTRAINT `RiskMedia_mediaId_fk` FOREIGN KEY (`mediaId`) REFERENCES `Media` (`id`)
) SELECT * FROM `_Base`;

-- link tables (User)

DROP TABLE IF EXISTS `UserOrganization`;
CREATE TABLE `UserOrganization` (
    `id`                 BIGINT(20) NOT NULL AUTO_INCREMENT,
    `userId`             BIGINT NOT NULL, 
    `organizationId`     BIGINT NOT NULL,
    `isSelected`         TINYINT(1) NOT NULL DEFAULT 0,
    PRIMARY KEY (`id`),
    CONSTRAINT `UserOrganization_userId_fk`         FOREIGN KEY (`userId`) REFERENCES `User` (`id`),
    CONSTRAINT `UserOrganization_organizationId_fk` FOREIGN KEY (`organizationId`) REFERENCES `Organization` (`id`)
) SELECT * FROM `_Base`;

DROP TABLE IF EXISTS `UserOrganizationRole`;
CREATE TABLE `UserOrganizationRole` (
    `id`                 BIGINT(20) NOT NULL AUTO_INCREMENT,
    `userId`             BIGINT NOT NULL,
    `organizationRoleId` BIGINT NOT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `UserOrganizationRole_userId_fk` FOREIGN KEY (`userId`) REFERENCES `User` (`id`),
    CONSTRAINT `UserOrganizationRole_organizationRoleId_fk` FOREIGN KEY (`organizationRoleId`) REFERENCES `OrganizationRole` (`id`)
) SELECT * FROM `_Base`;

DROP TABLE IF EXISTS `UserProject`;
CREATE TABLE `UserProject` (
    `id`                  BIGINT(20) NOT NULL AUTO_INCREMENT,
    `userId`              BIGINT NULL, /* userId is nullable so that users can be assigned afterwards if needed */
    `projectId`           BIGINT NOT NULL,
    `organizationRoleId`  BIGINT NULL,
    `projectRole`         ENUM('OWNER', 'MEMBER', 'GUEST'),
    PRIMARY KEY (`id`),
    CONSTRAINT `UserProject_userId_fk` FOREIGN KEY (`userId`) REFERENCES `User` (`id`),
    CONSTRAINT `UserProject_projectId_fk` FOREIGN KEY (`projectId`) REFERENCES `Project` (`id`),
    CONSTRAINT `UserProject_organizationRoleId_fk` FOREIGN KEY (`organizationRoleId`) REFERENCES `OrganizationRole` (`id`)
) SELECT * FROM `_Base`;

DROP TABLE IF EXISTS `UserRole`;
CREATE TABLE `UserRole` (
    `id`       BIGINT(20) NOT NULL AUTO_INCREMENT,
    `userId`   BIGINT NOT NULL, 
    `roleId`   BIGINT NOT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `UserRole_userId_fk`   FOREIGN KEY (`userId`) REFERENCES `User` (`id`),
    CONSTRAINT `UserRole_roleId_fk`   FOREIGN KEY (`roleId`) REFERENCES `Role` (`id`)
) SELECT * FROM `_Base`;

-- link tables (Tag)

DROP TABLE IF EXISTS `TagOrganization`;
CREATE TABLE `TagOrganization` (
    `id`                        BIGINT(20) NOT NULL AUTO_INCREMENT,
    `tagId`                     BIGINT NOT NULL, 
    `organizationId`            BIGINT NOT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `TagOrganization_tagId_fk`    FOREIGN KEY (`tagId`) REFERENCES `Tag` (`id`),
    CONSTRAINT `TagOrganization_organizationId_fk` FOREIGN KEY (`organizationId`) REFERENCES `Organization` (`id`)
) SELECT * FROM `_Base`;

DROP TABLE IF EXISTS `TagProject`;
CREATE TABLE `TagProject` (
    `id`                        BIGINT(20) NOT NULL AUTO_INCREMENT,
    `tagId`                     BIGINT NOT NULL, 
    `projectId`                 BIGINT NOT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `TagProject_tagId_fk`    FOREIGN KEY (`tagId`) REFERENCES `Tag` (`id`),
    CONSTRAINT `TagProject_projectId_fk` FOREIGN KEY (`projectId`) REFERENCES `Project` (`id`)
) SELECT * FROM `_Base`;

-- link tables (other)


DROP TABLE IF EXISTS `RiskCategoryProject`;
CREATE TABLE `RiskCategoryProject` (
    `id`             BIGINT(20) NOT NULL AUTO_INCREMENT,
    `riskCategoryId` BIGINT NULL,
    `projectId`      BIGINT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `RiskCategoryProject_riskCategoryId_fk` FOREIGN KEY (`riskCategoryId`) REFERENCES `RiskCategory` (`id`),
    CONSTRAINT `RiskCategoryProject_projectId_fk` FOREIGN KEY (`projectId`) REFERENCES `Project` (`id`)
) SELECT * FROM `_Base`;

/* HARA Spreadsheet Data Model */

/* ex. ISO 26262, IEC 61508  */
DROP TABLE IF EXISTS `Standard`;
CREATE TABLE `Standard` (
    `id`        BIGINT(20) NOT NULL AUTO_INCREMENT,
    `hrId`      VARCHAR(255) NOT NULL,
    `standard`  VARCHAR(255) NOT NULL,
    `title`     VARCHAR(255) NULL,
    `strict`    TINYINT(1) NULL DEFAULT 1,
    `url`       TEXT NULL,
    PRIMARY KEY (`id`)
) SELECT * FROM `_Base`;

DROP TABLE IF EXISTS `RiskSeverity`;
CREATE TABLE `RiskSeverity` (
    `id`          BIGINT(20) NOT NULL AUTO_INCREMENT,
    `classId`     VARCHAR(255) NOT NULL,
    `projectId`   BIGINT NULL,
    `standardId`  BIGINT NULL,
    `title`       TEXT NULL,
    `guidance`    TEXT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `RiskSeverity_projectId_fk` FOREIGN KEY (`projectId`) REFERENCES `Project` (`id`),
    CONSTRAINT `RiskSeverity_standardId_fk` FOREIGN KEY (`standardId`) REFERENCES `Standard` (`id`)
) SELECT * FROM `_Base`;

DROP TABLE IF EXISTS `RiskExposure`;
CREATE TABLE `RiskExposure` (
    `id`                 BIGINT(20) NOT NULL AUTO_INCREMENT,
    `classId`            VARCHAR(255) NOT NULL,
    `projectId`          BIGINT NULL,
    `standardId`         BIGINT NULL,
    `exposureFrequency`  VARCHAR(255) NULL,
    `guidance`           TEXT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `RiskExposure_projectId_fk` FOREIGN KEY (`projectId`) REFERENCES `Project` (`id`),
    CONSTRAINT `RiskExposure_standardId_fk` FOREIGN KEY (`standardId`) REFERENCES `Standard` (`id`)
) SELECT * FROM `_Base`;

DROP TABLE IF EXISTS `RiskAvoidability`;
CREATE TABLE `RiskAvoidability` (
    `id`          BIGINT(20) NOT NULL AUTO_INCREMENT,
    `classId`     VARCHAR(255) NOT NULL,
    `projectId`   BIGINT NULL,
    `standardId`  BIGINT NULL,
    `likelihood`  VARCHAR(255) NULL,
    `guidance`    TEXT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `RiskAvoidability_projectId_fk` FOREIGN KEY (`projectId`) REFERENCES `Project` (`id`),
    CONSTRAINT `RiskAvoidability_standardId_fk` FOREIGN KEY (`standardId`) REFERENCES `Standard` (`id`)
) SELECT * FROM `_Base`;

DROP TABLE IF EXISTS `RiskClass`;
CREATE TABLE `RiskClass` (
    `id`                 BIGINT(20) NOT NULL AUTO_INCREMENT,
    `classId`            VARCHAR(255) NOT NULL,
    `projectId`          BIGINT NULL,
    `standardId`         BIGINT NULL,
    `interpretation`     TEXT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `RiskClass_projectId_fk` FOREIGN KEY (`projectId`) REFERENCES `Project` (`id`),
    CONSTRAINT `RiskClass_standardId_fk` FOREIGN KEY (`standardId`) REFERENCES `Standard` (`id`)
) SELECT * FROM `_Base`;

DROP TABLE IF EXISTS `SIL`;
CREATE TABLE `SIL` (
    `id`           BIGINT(20) NOT NULL AUTO_INCREMENT,
    `projectId`    BIGINT NULL,
    `standardId`   BIGINT NULL,
    `level`        VARCHAR(255) NULL,
    `remarks`      TEXT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `SIL_projectId_fk` FOREIGN KEY (`projectId`) REFERENCES `Project` (`id`),
    CONSTRAINT `SIL_standardId_fk` FOREIGN KEY (`standardId`) REFERENCES `Standard` (`id`)
) SELECT * FROM `_Base`;

DROP TABLE IF EXISTS `PL`;
CREATE TABLE `PL` (
    `id`           BIGINT(20) NOT NULL AUTO_INCREMENT,
    `projectId`    BIGINT NULL,
    `standardId`   BIGINT NULL,
    `level`        VARCHAR(255) NULL,
    `remarks`      TEXT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `PL_projectId_fk` FOREIGN KEY (`projectId`) REFERENCES `Project` (`id`),
    CONSTRAINT `PL_standardId_fk` FOREIGN KEY (`standardId`) REFERENCES `Standard` (`id`)
) SELECT * FROM `_Base`;

DROP TABLE IF EXISTS `ASIL`;
CREATE TABLE `ASIL` (
    `id`           BIGINT(20) NOT NULL AUTO_INCREMENT,
    `projectId`    BIGINT NULL,
    `standardId`   BIGINT NULL,
    `level`        VARCHAR(255) NULL,
    `remarks`      TEXT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `ASIL_projectId_fk` FOREIGN KEY (`projectId`) REFERENCES `Project` (`id`),
    CONSTRAINT `ASIL_standardId_fk` FOREIGN KEY (`standardId`) REFERENCES `Standard` (`id`)
) SELECT * FROM `_Base`;

DROP TABLE IF EXISTS `RiskReductionMeasureType`;
CREATE TABLE `RiskReductionMeasureType` (
    `id`             BIGINT(20) NOT NULL AUTO_INCREMENT,
    `projectId`      BIGINT NULL,
    `name`           VARCHAR(255) NULL,
    `description`    TEXT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `RiskReductionMeasureType_projectId_fk` FOREIGN KEY (`projectId`) REFERENCES `Project` (`id`)
) SELECT * FROM `_Base`;

DROP TABLE IF EXISTS `RiskReductionMeasure`;
CREATE TABLE `RiskReductionMeasure` (
    `id`             BIGINT(20) NOT NULL AUTO_INCREMENT,
    `hrId`           VARCHAR(255) NOT NULL,
    `projectId`      BIGINT NULL,
    `typeId`         BIGINT NULL,
    `targetSILId`    BIGINT NULL,
    `description`    TEXT NULL,
    `remarks`    TEXT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `RiskReductionMeasure_projectId_fk` FOREIGN KEY (`projectId`) REFERENCES `Project` (`id`),
    CONSTRAINT `RiskReductionMeasure_typeId_fk` FOREIGN KEY (`typeId`) REFERENCES `RiskReductionMeasureType` (`id`),
    CONSTRAINT `RiskReductionMeasure_targetSILId_fk` FOREIGN KEY (`targetSILId`) REFERENCES `SIL` (`id`)
) SELECT * FROM `_Base`;

DROP TABLE IF EXISTS `ConsideredSituationalAttribute`;
CREATE TABLE `ConsideredSituationalAttribute` (
    `id`         BIGINT(20) NOT NULL AUTO_INCREMENT,
    `hrId`       VARCHAR(255) NOT NULL,
    `projectId`  BIGINT NULL,
    `type`       ENUM('MODE', 'MOTION', 'LOAD', 'OBSTACLE_EXPOSURE') NOT NULL,
    `value`      VARCHAR(255) NOT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `ConsideredSituationalAttribute_projectId_fk` FOREIGN KEY (`projectId`) REFERENCES `Project` (`id`)
) SELECT * FROM `_Base`;

DROP TABLE IF EXISTS `Assumption`;
CREATE TABLE `Assumption` (
    `id`             BIGINT(20) NOT NULL AUTO_INCREMENT,
    `projectId`      BIGINT NULL,
    `hrId`           VARCHAR(255) NOT NULL,
    `description`    TEXT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `Assumption_projectId_fk` FOREIGN KEY (`projectId`) REFERENCES `Project` (`id`)
) SELECT * FROM `_Base`;


DROP TABLE IF EXISTS `ExistingExternalMeasure`;
CREATE TABLE `ExistingExternalMeasure` (
    `id`           BIGINT(20) NOT NULL AUTO_INCREMENT,
    `projectId`    BIGINT NULL,
    `hrId`         VARCHAR(255) NOT NULL,
    `description`  TEXT NULL,
    `remarks`      TEXT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `ExistingExternalMeasure_projectId_fk` FOREIGN KEY (`projectId`) REFERENCES `Project` (`id`)
) SELECT * FROM `_Base`;


DROP TABLE IF EXISTS `ODD`;
CREATE TABLE `ODD` (
    `id`                     BIGINT(20) NOT NULL AUTO_INCREMENT,
    `hrId`                   VARCHAR(255) NOT NULL,
    `projectId`              BIGINT NULL,
    `csaModeId`              BIGINT NULL, 
    `csaMotionId`            BIGINT NULL, 
    `csaLoadId`              BIGINT NULL, 
    `csaObstacleExposureId`  BIGINT NULL, 
    `description`            TEXT NULL,
    `remarks`                TEXT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `ODD_projectId_fk` FOREIGN KEY (`projectId`) REFERENCES `Project` (`id`),
    CONSTRAINT `ODD_csaModeId_fk` FOREIGN KEY (`csaModeId`) REFERENCES `ConsideredSituationalAttribute` (`id`),
    CONSTRAINT `ODD_csaMotionId_fk` FOREIGN KEY (`csaMotionId`) REFERENCES `ConsideredSituationalAttribute` (`id`),
    CONSTRAINT `ODD_csaLoadId_fk` FOREIGN KEY (`csaLoadId`) REFERENCES `ConsideredSituationalAttribute` (`id`),
    CONSTRAINT `ODD_csaObstacleExposureId_fk` FOREIGN KEY (`csaObstacleExposureId`) REFERENCES `ConsideredSituationalAttribute` (`id`)
) SELECT * FROM `_Base`;

DROP TABLE IF EXISTS `HazardType`;
CREATE TABLE `HazardType` (
    `id`          BIGINT(20) NOT NULL AUTO_INCREMENT,
    `projectId`   BIGINT NULL,
    `standardId`   BIGINT NULL,
    `value`       VARCHAR(255) NOT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `HazardType_projectId_fk` FOREIGN KEY (`projectId`) REFERENCES `Project` (`id`),
    CONSTRAINT `HazardType_standarId_fk` FOREIGN KEY (`standardId`) REFERENCES `Standard` (`id`)
) SELECT * FROM `_Base`;

DROP TABLE IF EXISTS `Hazard`;
CREATE TABLE `Hazard` (
    `id`                   BIGINT(20) NOT NULL AUTO_INCREMENT,
    `hrId`                 VARCHAR(255) NOT NULL,
    `projectId`            BIGINT NULL,
    `suggestedSeverityId`  BIGINT NULL,
    `hazardTypeId`         BIGINT NULL,
    `description`          VARCHAR(255) NOT NULL,
    `remarks`              TEXT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `Hazard_projectId_fk` FOREIGN KEY (`projectId`) REFERENCES `Project` (`id`),
    CONSTRAINT `Hazard_suggestedSeverityId_fk` FOREIGN KEY (`suggestedSeverityId`) REFERENCES `RiskSeverity` (`id`),
    CONSTRAINT `Hazard_hazardTypeId_fk` FOREIGN KEY (`hazardTypeId`) REFERENCES `HazardType` (`id`)
) SELECT * FROM `_Base`;

DROP TABLE IF EXISTS `FunctionTask`;
CREATE TABLE `FunctionTask` (
    `id`                 BIGINT(20) NOT NULL AUTO_INCREMENT,
    `hrId`               VARCHAR(255) NOT NULL,
    `projectId`          BIGINT NULL,
    `description`        VARCHAR(255) NOT NULL,
    `remarks`            TEXT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `FunctionTask_projectId_fk` FOREIGN KEY (`projectId`) REFERENCES `Project` (`id`)
) SELECT * FROM `_Base`;

DROP TABLE IF EXISTS `Guideword`;
CREATE TABLE `Guideword` (
    `id`          BIGINT(20) NOT NULL AUTO_INCREMENT,
    `projectId`   BIGINT NULL,
    `standardId`   BIGINT NULL,
    `value`       VARCHAR(255) NOT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `Guideword_projectId_fk` FOREIGN KEY (`projectId`) REFERENCES `Project` (`id`),
    CONSTRAINT `Guideword_standardId_fk` FOREIGN KEY (`standardId`) REFERENCES `Standard` (`id`)
) SELECT * FROM `_Base`;

DROP TABLE IF EXISTS `HAZOP`;
CREATE TABLE `HAZOP` (
    `id`                    BIGINT(20) NOT NULL AUTO_INCREMENT,
    `hrId`                  VARCHAR(255) NOT NULL,
    `projectId`             BIGINT NULL,
    `functionTaskId`        BIGINT NULL,
    `guidewordId`           BIGINT NULL,
    `resultingMalfunction`  TEXT NULL,
    `remarks`               TEXT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `HAZOP_projectId_fk` FOREIGN KEY (`projectId`) REFERENCES `Project` (`id`),
    CONSTRAINT `HAZOP_functionTaskId_fk` FOREIGN KEY (`functionTaskId`) REFERENCES `FunctionTask` (`id`),
    CONSTRAINT `HAZOP_guidewordId_fk` FOREIGN KEY (`guidewordId`) REFERENCES `Guideword` (`id`)
) SELECT * FROM `_Base`;

DROP TABLE IF EXISTS `HazardousEvent`;
CREATE TABLE `HazardousEvent` (
    `id`               BIGINT(20) NOT NULL AUTO_INCREMENT,
    `hrId`             VARCHAR(255) NOT NULL,
    `projectId`        BIGINT NULL,
    `hazopId`          BIGINT NULL,
    `oddId`            BIGINT NULL,
    `description`      VARCHAR(255) NOT NULL,
    `remarks`          TEXT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `HazardousEvent_projectId_fk` FOREIGN KEY (`projectId`) REFERENCES `Project` (`id`),
    CONSTRAINT `HazardousEvent_hazopId_fk` FOREIGN KEY (`hazopId`) REFERENCES `HAZOP` (`id`),
    CONSTRAINT `HazardousEvent_oddId_fk` FOREIGN KEY (`oddId`) REFERENCES `ODD` (`id`)
) SELECT * FROM `_Base`;


DROP TABLE IF EXISTS `HARA`;
CREATE TABLE `HARA` (
    `id`                               BIGINT(20) NOT NULL AUTO_INCREMENT,
    `hrId`                             VARCHAR(255) NOT NULL,
    `userId`                           BIGINT NULL,
    `projectId`                        BIGINT NULL,
    `hazardousEventId`                 BIGINT NULL,
    `hazardId`                         BIGINT NULL,
    `existingExternalMeasureId`        BIGINT NULL,
    `initialSeverityId`                BIGINT NULL,
    `initialSeverityJustification`     TEXT NULL,
    `initialExposureId`                BIGINT NULL,
    `initialExposureJustification`     TEXT NULL,
    `initialAvoidabilityId`            BIGINT NULL,
    `initialAvoidabilityJustification` TEXT NULL,
    `initialRiskClassId`               BIGINT NULL,
    `targetRiskReductionMeasureTypeId` BIGINT NULL,
    `safetyTargetType`                 TEXT NULL,
    `allocatedSILId`                   BIGINT NULL,
    `riskReductionMeasureId`           BIGINT NULL,
    `finalSeverityId`                  BIGINT NULL,
    `finalSeverityJustification`       TEXT NULL,
    `finalExposureId`                  BIGINT NULL,
    `finalExposureJustification`       TEXT NULL,
    `finalAvoidabilityId`              BIGINT NULL,
    `finalAvoidabilityJustification`   TEXT NULL,
    `finalRiskClassId`                 BIGINT NULL,
    `remarks`                          TEXT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `HARA_userId_fk` FOREIGN KEY (`userId`) REFERENCES `User` (`id`),
    CONSTRAINT `HARA_projectId_fk` FOREIGN KEY (`projectId`) REFERENCES `Project` (`id`),
    CONSTRAINT `HARA_hazardousEventId_fk` FOREIGN KEY (`hazardousEventId`) REFERENCES `HazardousEvent` (`id`),
    CONSTRAINT `HARA_hazardId_fk` FOREIGN KEY (`hazardId`) REFERENCES `Hazard` (`id`),
    CONSTRAINT `HARA_existingExternalMeasureId_fk` FOREIGN KEY (`existingExternalMeasureId`) REFERENCES `ExistingExternalMeasure` (`id`),
    CONSTRAINT `HARA_initialSeverityId_fk` FOREIGN KEY (`initialSeverityId`) REFERENCES `RiskSeverity` (`id`),
    CONSTRAINT `HARA_initialExposureId_fk` FOREIGN KEY (`initialExposureId`) REFERENCES `RiskExposure` (`id`),
    CONSTRAINT `HARA_initialAvoidabilityId_fk` FOREIGN KEY (`initialAvoidabilityId`) REFERENCES `RiskAvoidability` (`id`),
    CONSTRAINT `HARA_initialRiskClassId_fk` FOREIGN KEY (`initialRiskClassId`) REFERENCES `RiskClass` (`id`),
    CONSTRAINT `HARA_targetRiskReductionMeasureTypeId_fk` FOREIGN KEY (`targetRiskReductionMeasureTypeId`) REFERENCES `RiskReductionMeasureType` (`id`),
    CONSTRAINT `HARA_allocatedSILId_fk` FOREIGN KEY (`allocatedSILId`) REFERENCES `SIL` (`id`),
    CONSTRAINT `HARA_riskReductionMeasureId_fk` FOREIGN KEY (`riskReductionMeasureId`) REFERENCES `RiskReductionMeasure` (`id`),
    CONSTRAINT `HARA_finalSeverityId_fk` FOREIGN KEY (`finalSeverityId`) REFERENCES `RiskSeverity` (`id`),
    CONSTRAINT `HARA_finalExposureId_fk` FOREIGN KEY (`finalExposureId`) REFERENCES `RiskExposure` (`id`),
    CONSTRAINT `HARA_finalAvoidabilityId_fk` FOREIGN KEY (`finalAvoidabilityId`) REFERENCES `RiskAvoidability` (`id`),
    CONSTRAINT `HARA_finalRiskClassId_fk` FOREIGN KEY (`finalRiskClassId`) REFERENCES `RiskClass` (`id`)
) SELECT * FROM `_Base`;
