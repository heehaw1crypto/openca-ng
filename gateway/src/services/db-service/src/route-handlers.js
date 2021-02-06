const _ = require("lodash/fp");
const { db } = require("../core-js");
const getSQLString = require("./getSQLString");
const prepareWhere = require("./prepareWhere");
const encodeCursor = require("./encodeCursor");
const prepareDateTimeStrings = require("./prepareDateTimeStrings");

const archiveTablesMap = {
  Authorization: null,
  Media: null,
  Organization: null,
  OrganizationRole: null,
  Project: null,
  ProjectAttribute: null,
  ProjectAttributeType: null,
  ProjectAttributeTypeValue: null,
  Risk: null,
  RiskAttribute: null,
  RiskAttributeType: null,
  RiskCategory: null,
  RiskCategoryAttribute: null,
  RiskCategoryAttributeType: null,
  RiskCategoryProject: null,
  RiskDiscussion: null,
  RiskDiscussionMessage: null,
  RiskEvaluation: null,
  RiskEvaluationEntry: null,
  RiskMedia: null,
  RiskType: null,
  Role: null,
  Tag: null,
  TagOrganization: null,
  TagProject: null,
  User: null,
  UserOrganization: null,
  UserOrganizationRole: null,
  UserProject: null,
  UserRole: null,
  _AttributeBase: null,
  _AttributeTypeBase: null,
  _AttributeTypeValueBase: null,
  _Base: null,
};

const relationsMap = {
  Authorization: [],
  Media: [],
  Organization: [
    {
      localTable: "Organization",
      localField: "parentOrganizationId",
      localForeignIdent: "parentOrganizationUuid",
      foreignTable: "Organization",
      foreignField: "id",
      foreignIdent: "uuid",
    },
  ],
  OrganizationRole: [
    {
      localTable: "OrganizationRole",
      localField: "organizationId",
      localForeignIdent: "organizationUuid",
      foreignTable: "Organization",
      foreignField: "id",
      foreignIdent: "uuid",
    },
  ],
  Project: [
    {
      localTable: "Project",
      localField: "organizationId",
      localForeignIdent: "organizationUuid",
      foreignTable: "Organization",
      foreignField: "id",
      foreignIdent: "uuid",
    },
  ],
  ProjectAttribute: [
    {
      localTable: "ProjectAttribute",
      localField: "projectAttributeTypeId",
      localForeignIdent: "projectAttributeTypeUuid",
      foreignTable: "ProjectAttributeType",
      foreignField: "id",
      foreignIdent: "uuid",
    },
    {
      localTable: "ProjectAttribute",
      localField: "projectAttributeTypeValueId",
      localForeignIdent: "projectAttributeTypeValueUuid",
      foreignTable: "ProjectAttributeTypeValue",
      foreignField: "id",
      foreignIdent: "uuid",
    },
    {
      localTable: "ProjectAttribute",
      localField: "projectId",
      localForeignIdent: "projectUuid",
      foreignTable: "Project",
      foreignField: "id",
      foreignIdent: "uuid",
    },
  ],
  ProjectAttributeType: [
    {
      localTable: "ProjectAttributeType",
      localField: "parentId",
      localForeignIdent: "parentUuid",
      foreignTable: "ProjectAttributeType",
      foreignField: "id",
      foreignIdent: "uuid",
    },
    {
      localTable: "ProjectAttributeType",
      localField: "projectId",
      localForeignIdent: "projectUuid",
      foreignTable: "Project",
      foreignField: "id",
      foreignIdent: "uuid",
    },
  ],
  ProjectAttributeTypeValue: [
    {
      localTable: "ProjectAttributeTypeValue",
      localField: "projectAttributeTypeId",
      localForeignIdent: "projectAttributeTypeUuid",
      foreignTable: "ProjectAttributeType",
      foreignField: "id",
      foreignIdent: "uuid",
    },
    {
      localTable: "ProjectAttributeTypeValue",
      localField: "projectId",
      localForeignIdent: "projectUuid",
      foreignTable: "Project",
      foreignField: "id",
      foreignIdent: "uuid",
    },
  ],
  Risk: [
    {
      localTable: "Risk",
      localField: "projectId",
      localForeignIdent: "projectUuid",
      foreignTable: "Risk",
      foreignField: "id",
      foreignIdent: "uuid",
    },
    {
      localTable: "Risk",
      localField: "riskCategoryId",
      localForeignIdent: "riskCategoryUuid",
      foreignTable: "RiskCategory",
      foreignField: "id",
      foreignIdent: "uuid",
    },
    {
      localTable: "Risk",
      localField: "riskTypeId",
      localForeignIdent: "riskTypeUuid",
      foreignTable: "RiskType",
      foreignField: "id",
      foreignIdent: "uuid",
    },
  ],
  RiskAttribute: [
    {
      localTable: "RiskAttribute",
      localField: "riskAttributeTypeId",
      localForeignIdent: "riskAttributeTypeUuid",
      foreignTable: "RiskAttributeType",
      foreignField: "id",
      foreignIdent: "uuid",
    },
    {
      localTable: "RiskAttribute",
      localField: "riskId",
      localForeignIdent: "riskUuid",
      foreignTable: "Risk",
      foreignField: "id",
      foreignIdent: "uuid",
    },
  ],
  RiskAttributeType: [
    {
      localTable: "RiskAttributeType",
      localField: "parentId",
      localForeignIdent: "parentUuid",
      foreignTable: "RiskAttributeType",
      foreignField: "id",
      foreignIdent: "uuid",
    },
    {
      localTable: "RiskAttributeType",
      localField: "riskId",
      localForeignIdent: "riskUuid",
      foreignTable: "Risk",
      foreignField: "id",
      foreignIdent: "uuid",
    },
  ],
  RiskCategory: [],
  RiskCategoryAttribute: [
    {
      localTable: "RiskCategoryAttribute",
      localField: "riskCategoryAttributeTypeId",
      localForeignIdent: "riskCategoryAttributeTypeUuid",
      foreignTable: "RiskCategoryAttributeType",
      foreignField: "id",
      foreignIdent: "uuid",
    },
    {
      localTable: "RiskCategoryAttribute",
      localField: "riskCategoryId",
      localForeignIdent: "riskCategoryUuid",
      foreignTable: "RiskCategory",
      foreignField: "id",
      foreignIdent: "uuid",
    },
  ],
  RiskCategoryAttributeType: [
    {
      localTable: "RiskCategoryAttributeType",
      localField: "parentId",
      localForeignIdent: "parentUuid",
      foreignTable: "RiskCategoryAttributeType",
      foreignField: "id",
      foreignIdent: "uuid",
    },
    {
      localTable: "RiskCategoryAttributeType",
      localField: "riskCategoryId",
      localForeignIdent: "riskCategoryUuid",
      foreignTable: "RiskCategory",
      foreignField: "id",
      foreignIdent: "uuid",
    },
  ],
  RiskCategoryProject: [
    {
      localTable: "RiskCategoryProject",
      localField: "projectId",
      localForeignIdent: "projectUuid",
      foreignTable: "Project",
      foreignField: "id",
      foreignIdent: "uuid",
    },
    {
      localTable: "RiskCategoryProject",
      localField: "riskCategoryId",
      localForeignIdent: "riskCategoryUuid",
      foreignTable: "RiskCategory",
      foreignField: "id",
      foreignIdent: "uuid",
    },
  ],
  RiskDiscussion: [
    {
      localTable: "RiskDiscussion",
      localField: "riskId",
      localForeignIdent: "riskUuid",
      foreignTable: "Risk",
      foreignField: "id",
      foreignIdent: "uuid",
    },
  ],
  RiskDiscussionMessage: [
    {
      localTable: "RiskDiscussionMessage",
      localField: "authorUserId",
      localForeignIdent: "authorUserUuid",
      foreignTable: "User",
      foreignField: "id",
      foreignIdent: "uuid",
    },
    {
      localTable: "RiskDiscussionMessage",
      localField: "mediaId",
      localForeignIdent: "mediaUuid",
      foreignTable: "Media",
      foreignField: "id",
      foreignIdent: "uuid",
    },
    {
      localTable: "RiskDiscussionMessage",
      localField: "parentId",
      localForeignIdent: "parentUuid",
      foreignTable: "RiskDiscussionMessage",
      foreignField: "id",
      foreignIdent: "uuid",
    },
  ],
  RiskEvaluation: [
    {
      localTable: "RiskEvaluation",
      localField: "riskId",
      localForeignIdent: "riskUuid",
      foreignTable: "Risk",
      foreignField: "id",
      foreignIdent: "uuid",
    },
  ],
  RiskEvaluationEntry: [
    {
      localTable: "RiskEvaluationEntry",
      localField: "riskId",
      localForeignIdent: "riskUuid",
      foreignTable: "Risk",
      foreignField: "id",
      foreignIdent: "uuid",
    },
    {
      localTable: "RiskEvaluationEntry",
      localField: "userId",
      localForeignIdent: "userUuid",
      foreignTable: "User",
      foreignField: "id",
      foreignIdent: "uuid",
    },
  ],
  RiskMedia: [
    {
      localTable: "RiskMedia",
      localField: "mediaId",
      localForeignIdent: "mediaUuid",
      foreignTable: "Media",
      foreignField: "id",
      foreignIdent: "uuid",
    },
    {
      localTable: "RiskMedia",
      localField: "riskId",
      localForeignIdent: "riskUuid",
      foreignTable: "Risk",
      foreignField: "id",
      foreignIdent: "uuid",
    },
  ],
  RiskType: [
    {
      localTable: "RiskType",
      localField: "parentId",
      localForeignIdent: "parentUuid",
      foreignTable: "RiskType",
      foreignField: "id",
      foreignIdent: "uuid",
    },
  ],
  Role: [],
  Tag: [],
  TagOrganization: [
    {
      localTable: "TagOrganization",
      localField: "organizationId",
      localForeignIdent: "organizationUuid",
      foreignTable: "Organization",
      foreignField: "id",
      foreignIdent: "uuid",
    },
    {
      localTable: "TagOrganization",
      localField: "tagId",
      localForeignIdent: "tagUuid",
      foreignTable: "Tag",
      foreignField: "id",
      foreignIdent: "uuid",
    },
  ],
  TagProject: [
    {
      localTable: "TagProject",
      localField: "projectId",
      localForeignIdent: "projectUuid",
      foreignTable: "Project",
      foreignField: "id",
      foreignIdent: "uuid",
    },
    {
      localTable: "TagProject",
      localField: "tagId",
      localForeignIdent: "tagUuid",
      foreignTable: "Tag",
      foreignField: "id",
      foreignIdent: "uuid",
    },
  ],
  User: [
    {
      localTable: "User",
      localField: "primaryRoleId",
      localForeignIdent: "primaryRoleUuid",
      foreignTable: "Role",
      foreignField: "id",
      foreignIdent: "uuid",
    },
  ],
  UserOrganization: [
    {
      localTable: "UserOrganization",
      localField: "organizationId",
      localForeignIdent: "organizationUuid",
      foreignTable: "Organization",
      foreignField: "id",
      foreignIdent: "uuid",
    },
    {
      localTable: "UserOrganization",
      localField: "userId",
      localForeignIdent: "userUuid",
      foreignTable: "User",
      foreignField: "id",
      foreignIdent: "uuid",
    },
  ],
  UserOrganizationRole: [
    {
      localTable: "UserOrganizationRole",
      localField: "organizationRoleId",
      localForeignIdent: "organizationRoleUuid",
      foreignTable: "OrganizationRole",
      foreignField: "id",
      foreignIdent: "uuid",
    },
    {
      localTable: "UserOrganizationRole",
      localField: "userId",
      localForeignIdent: "userUuid",
      foreignTable: "User",
      foreignField: "id",
      foreignIdent: "uuid",
    },
  ],
  UserProject: [
    {
      localTable: "UserProject",
      localField: "organizationRoleId",
      localForeignIdent: "organizationRoleUuid",
      foreignTable: "OrganizationRole",
      foreignField: "id",
      foreignIdent: "uuid",
    },
    {
      localTable: "UserProject",
      localField: "projectId",
      localForeignIdent: "projectUuid",
      foreignTable: "Project",
      foreignField: "id",
      foreignIdent: "uuid",
    },
    {
      localTable: "UserProject",
      localField: "userId",
      localForeignIdent: "userUuid",
      foreignTable: "User",
      foreignField: "id",
      foreignIdent: "uuid",
    },
  ],
  UserRole: [
    {
      localTable: "UserRole",
      localField: "roleId",
      localForeignIdent: "roleUuid",
      foreignTable: "Role",
      foreignField: "id",
      foreignIdent: "uuid",
    },
    {
      localTable: "UserRole",
      localField: "userId",
      localForeignIdent: "userUuid",
      foreignTable: "User",
      foreignField: "id",
      foreignIdent: "uuid",
    },
  ],
  _AttributeBase: [],
  _AttributeTypeBase: [],
  _AttributeTypeValueBase: [],
  _Base: [],
};

async function mapInternalIdentsToExposed(relations, data) {
  let out = {};
  for (let [k, v] of Object.entries(data)) {
    const related = relations.find((r) => r.localField === k);
    if (related) {
      if (Array.isArray(v)) {
        out[related.localForeignIdent] = await Promise.all(
          v.map((w) =>
            db
              .queryHead("SELECT ?? FROM ?? WHERE ?? = ?", [
                related.foreignIdent,
                related.foreignTable,
                related.foreignField,
                w,
              ])
              // Fall back to null to ensure key is present in response.
              .then((x) => (x && x[related.foreignIdent]) || null)
          )
        );
      } else {
        out[related.localForeignIdent] = await db
          .queryHead("SELECT ?? FROM ?? WHERE ?? = ?", [
            related.foreignIdent,
            related.foreignTable,
            related.foreignField,
            v,
          ])
          // Fall back to null to ensure key is present in response.
          .then((x) => (x && x[related.foreignIdent]) || null);
      }
    } else {
      out[k] = v;
    }
  }
  return out;
}

async function mapExposedIdentsToInternal(relations, data) {
  let out = {};
  for (let [k, v] of Object.entries(data)) {
    const related = relations.find((r) => r.localForeignIdent === k);
    if (related) {
      if (Array.isArray(v)) {
        out[related.localField] = await Promise.all(
          v.map((w) =>
            db
              .queryHead("SELECT ?? FROM ?? WHERE ?? = ?", [
                related.foreignField,
                related.foreignTable,
                related.foreignIdent,
                w,
              ])
              .then(_.property(related.foreignField))
          )
        );
      } else {
        out[
          related.localField
        ] = await db
          .queryHead("SELECT ?? FROM ?? WHERE ?? = ?", [
            related.foreignField,
            related.foreignTable,
            related.foreignIdent,
            v,
          ])
          .then(_.property(related.foreignField));
      }
    } else {
      out[k] = v;
    }
  }
  return out;
}

function mapExposedKeysToInternal(relations, data) {
  let out = {};
  for (let [k, v] of Object.entries(data)) {
    const related = relations.find((r) => r.localForeignIdent === k);
    if (related) {
      out[related.localField] = v;
    } else {
      out[k] = v;
    }
  }
  return out;
}

module.exports.__sql = async (req, res, next) => {
  try {
    const { sql, values, resSchema } = req.body;
    const result = await db.query(sql, values);
    if (resSchema != null) {
      const Ajv = require("ajv");
      const ajv = new Ajv();
      const validate = ajv.compile(resSchema);
      const valid = validate(result);
      if (valid === false) {
        return res.status(400).json({ errors: validate.errors });
      }
    }
    return res.json(result);
  } catch (e) {
    return next(e);
  }
};

module.exports.authorizationGet = async (req, res, next) => {
  try {
    const table = "Authorization";
    const ident = "uuid";
    const joins = [];
    const fields = ["uuid", "serviceName", "key", "secret", "created"];
    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const record = await db.queryHead(sqlStringAndValues);
    if (!record) {
      return res.status(404).json({ errors: ["Record not found"] });
    }
    return res.status(200).json(record);
  } catch (e) {
    return next(e);
  }
};

module.exports.authorizationGetList = async (req, res, next) => {
  try {
    const table = "Authorization";
    const relations = [];

    const $where = await prepareWhere(relations, req.query.$where);
    const $orderBy = req.query.$orderBy
      ? Array.isArray(req.query.$orderBy)
        ? req.query.$orderBy.map((x) => mapExposedKeysToInternal(relations, x))
        : mapExposedKeysToInternal(relations, req.query.$orderBy)
      : undefined;

    // https://github.com/epoberezkin/ajv/issues/276
    if (req.query.$paginate && req.query.$paginate.page) {
      req.query.$paginate.pageSize = req.query.$paginate.pageSize || 20;
    }

    let rows, totalCount;

    const joins = [];
    const fields = ["id", "uuid", "serviceName", "key", "secret", "created"];
    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where,
      $orderBy,
      $paginate: req.query.$paginate || undefined,
    });

    if (req.query.$paginate) {
      [rows, totalCount] = await Promise.all([
        db.query(sqlStringAndValues),
        db
          .queryHead(
            await getSQLString({
              table,
              fields: ["COUNT(*)"],
              $where,
              $orderBy,
            })
          )
          .then((d) => d["COUNT(*)"]),
      ]);
    } else {
      rows = await db.query(sqlStringAndValues);
    }

    if (req.query.$paginate) {
      if (typeof req.query.$paginate.limit === "number") {
        const hasMoreResults = rows.length === req.query.$paginate.limit + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }

        res.set("x-pagination-limit", req.query.$paginate.limit);
        res.set("x-pagination-offset", req.query.$paginate.offset);
        res.set(
          "x-pagination-has-previous-page",
          req.query.$paginate.offset > 0
        );
        res.set("x-pagination-has-next-page", !!hasMoreResults);
      } else if (typeof req.query.$paginate.page === "number") {
        const hasMoreResults = rows.length === req.query.$paginate.pageSize + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }

        res.set("x-pagination-page", req.query.$paginate.page);
        res.set("x-pagination-page-size", req.query.$paginate.pageSize);
        res.set("x-pagination-has-previous-page", req.query.$paginate.page > 1);
        res.set("x-pagination-has-next-page", !!hasMoreResults);
      } else {
        const flip =
          typeof req.query.$paginate.first === "number" ? false : true;
        const limit = flip
          ? req.query.$paginate.last
          : req.query.$paginate.first;

        const hasMoreResults = rows.length === limit + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }
        if (flip) {
          rows = rows.reverse();
        }

        const hasPreviousPage = flip ? hasMoreResults : false;
        const hasNextPage = flip ? false : hasMoreResults;
        const startCursor =
          rows[0] && rows[0].id ? encodeCursor(rows[0].id) : null;
        const endCursor =
          rows[rows.length - 1] && rows[rows.length - 1].id
            ? encodeCursor(rows[rows.length - 1].id)
            : null;

        res.set("x-pagination-has-previous-page", hasPreviousPage);
        res.set("x-pagination-has-next-page", hasNextPage);
        if (startCursor != null) {
          res.set("x-pagination-start-cursor", startCursor);
        }
        if (endCursor != null) {
          res.set("x-pagination-end-cursor", endCursor);
        }
      }
    }

    if (typeof totalCount === "number") {
      res.set("x-pagination-total-count", totalCount);
    }

    if (
      typeof totalCount === "number" &&
      req.query.$paginate &&
      req.query.$paginate.pageSize
    ) {
      res.set(
        "x-pagination-last-page",
        Math.ceil(totalCount / req.query.$paginate.pageSize)
      );
    }

    // https://jsperf.com/delete-vs-spread-vs-lodash-omit-vs-lodash-inverse-pick
    for (let row of rows) {
      row.id = undefined;
    }

    return res.status(200).json(rows);
  } catch (e) {
    return next(e);
  }
};

module.exports.authorizationPost = async (req, res, next) => {
  try {
    const table = "Authorization";
    const relations = [];
    const reqBodySchema = require("./schemas/authorization.POST.req.body.json");
    const ident = "uuid";
    const joins = [];
    const fields = ["uuid", "serviceName", "key", "secret", "created"];

    const body = prepareDateTimeStrings(
      reqBodySchema,
      await mapExposedIdentsToInternal(relations, req.body)
    );

    const inserted = await db.query("INSERT INTO ?? SET ?? = UUID(), ?", [
      table,
      ident,
      body,
    ]);
    const id = inserted.insertId;

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { id },
    });
    const record = await db.queryHead(sqlStringAndValues);

    return res.status(200).json(record);
  } catch (e) {
    return next(e);
  }
};

module.exports.authorizationPatch = async (req, res, next) => {
  try {
    const table = "Authorization";
    const archiveTable = archiveTablesMap[table];
    const relations = [];
    const reqBodySchema = require("./schemas/authorization.PATCH.req.body.json");
    const resBodyKeys = ["uuid", "serviceName", "key", "secret", "created"];
    const ident = "uuid";
    const joins = [];
    const fields = ["*"];

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const current = await db.queryHead(sqlStringAndValues);

    if (!current) {
      return res.status(404).json({ errors: ["Record not found"] });
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? SET ?", [
        archiveTable,
        {
          ..._.omit([], current),
          modifier: req.headers["x-user-uuid"] || "stub",
        },
      ]);
    }

    if (Object.keys(req.body).length) {
      const body = prepareDateTimeStrings(
        reqBodySchema,
        await mapExposedIdentsToInternal(relations, req.body)
      );
      await db.query("UPDATE ?? SET ? WHERE ?? = ?", [
        table,
        body,
        ident,
        req.params[ident],
      ]);
    } else {
      // Nothing to update.
      const resBody = _.pick(resBodyKeys, current);
      return res.status(200).json(resBody);
    }
    const record = await db.queryHead(
      await getSQLString({
        table,
        fields,
        joins,
        $where: { [ident]: req.params["uuid"] },
      })
    );

    const resBody = _.pick(resBodyKeys, record);
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.authorizationPatchList = async (req, res, next) => {
  try {
    const table = "Authorization";
    const relations = relationsMap[table];
    const archiveTable = archiveTablesMap[table];
    const reqBodySchema = require("./schemas/authorization.PATCH.list.req.body.json");
    const resBodyKeys = ["uuid", "serviceName", "key", "secret", "created"];

    const $where = await prepareWhere(relations, req.query.$where);
    const selectParams = await getSQLString({
      table,
      $where,
    });

    const currents = await db.query(selectParams);
    if (!currents.length) {
      return res.status(200).json([]);
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? (??) VALUES ?", [
        archiveTable,
        [].concat(Object.keys(currents[0])).concat("modifier"),
        currents.map((c) =>
          Object.values(c).concat(req.headers["x-user-uuid"] || "stub")
        ),
      ]);
    }

    if (Object.keys(req.body).length) {
      const body = prepareDateTimeStrings(
        reqBodySchema,
        await mapExposedIdentsToInternal(relations, req.body)
      );

      let sql = "UPDATE ?? SET ?";
      let values = [table, body];

      if (selectParams.sql.includes(" where ")) {
        sql += " where " + selectParams.sql.split(" where ")[1];
        values = values.concat(selectParams.values);
      }

      await db.query(sql, values);
    } else {
      // Nothing to update.
      let resBody = (
        await Promise.all(
          currents.map((current) =>
            mapInternalIdentsToExposed(relations, current)
          )
        )
      ).map((x) => _.pick(resBodyKeys, x));
      return res.status(200).json(resBody);
    }
    const records = await db.query(selectParams);
    const resBody = (
      await Promise.all(
        records.map((record) => mapInternalIdentsToExposed(relations, record))
      )
    ).map((x) => _.pick(resBodyKeys, x));
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.authorizationDelete = async (req, res, next) => {
  try {
    const table = "Authorization";
    const archiveTable = archiveTablesMap[table];
    const resBodyKeys = ["uuid", "serviceName", "key", "secret", "created"];
    const ident = "uuid";
    const joins = [];
    const fields = ["*"];

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const current = await db.queryHead(sqlStringAndValues);

    if (!current) {
      return res.status(404).json({ errors: ["Record not found"] });
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? SET ?", [
        archiveTable,
        {
          ..._.omit([], current),
          modifier: req.headers["x-user-uuid"] || "stub",
          userDeleted: 1,
        },
      ]);
    }

    await db.query("DELETE FROM ?? WHERE ?? = ?", [
      table,
      ident,
      req.params[ident],
    ]);

    const resBody = _.pick(resBodyKeys, current);
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.authorizationDeleteList = async (req, res, next) => {
  try {
    const table = "Authorization";
    const archiveTable = archiveTablesMap[table];
    const relations = relationsMap[table];
    const resBodyKeys = ["uuid", "serviceName", "key", "secret", "created"];

    const $where = await prepareWhere(relations, req.query.$where);
    const selectParams = await getSQLString({
      table,
      $where,
    });

    const currents = await db.query(selectParams);
    if (!currents.length) {
      return res.status(200).json([]);
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? (??) VALUES ?", [
        archiveTable,
        []
          .concat(Object.keys(currents[0]))
          .concat("modifier")
          .concat("userDeleted"),
        currents.map((c) =>
          Object.values(c)
            .concat(req.headers["x-user-uuid"] || "stub")
            .concat(1)
        ),
      ]);
    }

    let sql = "DELETE FROM ??";
    let values = [table];

    if (selectParams.sql.includes(" where ")) {
      sql += " where " + selectParams.sql.split(" where ")[1];
      values = values.concat(selectParams.values);
    }

    await db.query(sql, values);

    const resBody = (
      await Promise.all(
        currents.map((record) => mapInternalIdentsToExposed(relations, record))
      )
    ).map((x) => _.pick(resBodyKeys, x));
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.mediaGet = async (req, res, next) => {
  try {
    const table = "Media";
    const ident = "uuid";
    const joins = [];
    const fields = [
      "name",
      "type",
      "mimeType",
      "sourceMediaUrl",
      "compressedMediaUrl",
      "caption",
      "sourceMediaKey",
      "compressedMediaKey",
      "storageLocation",
      "originalFilename",
      "isPublic",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];
    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const record = await db.queryHead(sqlStringAndValues);
    if (!record) {
      return res.status(404).json({ errors: ["Record not found"] });
    }
    return res.status(200).json(record);
  } catch (e) {
    return next(e);
  }
};

module.exports.mediaGetList = async (req, res, next) => {
  try {
    const table = "Media";
    const relations = [];

    const $where = await prepareWhere(relations, req.query.$where);
    const $orderBy = req.query.$orderBy
      ? Array.isArray(req.query.$orderBy)
        ? req.query.$orderBy.map((x) => mapExposedKeysToInternal(relations, x))
        : mapExposedKeysToInternal(relations, req.query.$orderBy)
      : undefined;

    // https://github.com/epoberezkin/ajv/issues/276
    if (req.query.$paginate && req.query.$paginate.page) {
      req.query.$paginate.pageSize = req.query.$paginate.pageSize || 20;
    }

    let rows, totalCount;

    const joins = [];
    const fields = [
      "id",
      "name",
      "type",
      "mimeType",
      "sourceMediaUrl",
      "compressedMediaUrl",
      "caption",
      "sourceMediaKey",
      "compressedMediaKey",
      "storageLocation",
      "originalFilename",
      "isPublic",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];
    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where,
      $orderBy,
      $paginate: req.query.$paginate || undefined,
    });

    if (req.query.$paginate) {
      [rows, totalCount] = await Promise.all([
        db.query(sqlStringAndValues),
        db
          .queryHead(
            await getSQLString({
              table,
              fields: ["COUNT(*)"],
              $where,
              $orderBy,
            })
          )
          .then((d) => d["COUNT(*)"]),
      ]);
    } else {
      rows = await db.query(sqlStringAndValues);
    }

    if (req.query.$paginate) {
      if (typeof req.query.$paginate.limit === "number") {
        const hasMoreResults = rows.length === req.query.$paginate.limit + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }

        res.set("x-pagination-limit", req.query.$paginate.limit);
        res.set("x-pagination-offset", req.query.$paginate.offset);
        res.set(
          "x-pagination-has-previous-page",
          req.query.$paginate.offset > 0
        );
        res.set("x-pagination-has-next-page", !!hasMoreResults);
      } else if (typeof req.query.$paginate.page === "number") {
        const hasMoreResults = rows.length === req.query.$paginate.pageSize + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }

        res.set("x-pagination-page", req.query.$paginate.page);
        res.set("x-pagination-page-size", req.query.$paginate.pageSize);
        res.set("x-pagination-has-previous-page", req.query.$paginate.page > 1);
        res.set("x-pagination-has-next-page", !!hasMoreResults);
      } else {
        const flip =
          typeof req.query.$paginate.first === "number" ? false : true;
        const limit = flip
          ? req.query.$paginate.last
          : req.query.$paginate.first;

        const hasMoreResults = rows.length === limit + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }
        if (flip) {
          rows = rows.reverse();
        }

        const hasPreviousPage = flip ? hasMoreResults : false;
        const hasNextPage = flip ? false : hasMoreResults;
        const startCursor =
          rows[0] && rows[0].id ? encodeCursor(rows[0].id) : null;
        const endCursor =
          rows[rows.length - 1] && rows[rows.length - 1].id
            ? encodeCursor(rows[rows.length - 1].id)
            : null;

        res.set("x-pagination-has-previous-page", hasPreviousPage);
        res.set("x-pagination-has-next-page", hasNextPage);
        if (startCursor != null) {
          res.set("x-pagination-start-cursor", startCursor);
        }
        if (endCursor != null) {
          res.set("x-pagination-end-cursor", endCursor);
        }
      }
    }

    if (typeof totalCount === "number") {
      res.set("x-pagination-total-count", totalCount);
    }

    if (
      typeof totalCount === "number" &&
      req.query.$paginate &&
      req.query.$paginate.pageSize
    ) {
      res.set(
        "x-pagination-last-page",
        Math.ceil(totalCount / req.query.$paginate.pageSize)
      );
    }

    // https://jsperf.com/delete-vs-spread-vs-lodash-omit-vs-lodash-inverse-pick
    for (let row of rows) {
      row.id = undefined;
    }

    return res.status(200).json(rows);
  } catch (e) {
    return next(e);
  }
};

module.exports.mediaPost = async (req, res, next) => {
  try {
    const table = "Media";
    const relations = [];
    const reqBodySchema = require("./schemas/media.POST.req.body.json");
    const ident = "uuid";
    const joins = [];
    const fields = [
      "name",
      "type",
      "mimeType",
      "sourceMediaUrl",
      "compressedMediaUrl",
      "caption",
      "sourceMediaKey",
      "compressedMediaKey",
      "storageLocation",
      "originalFilename",
      "isPublic",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];

    const body = prepareDateTimeStrings(
      reqBodySchema,
      await mapExposedIdentsToInternal(relations, req.body)
    );

    const inserted = await db.query("INSERT INTO ?? SET ?? = UUID(), ?", [
      table,
      ident,
      body,
    ]);
    const id = inserted.insertId;

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { id },
    });
    const record = await db.queryHead(sqlStringAndValues);

    return res.status(200).json(record);
  } catch (e) {
    return next(e);
  }
};

module.exports.mediaPatch = async (req, res, next) => {
  try {
    const table = "Media";
    const archiveTable = archiveTablesMap[table];
    const relations = [];
    const reqBodySchema = require("./schemas/media.PATCH.req.body.json");
    const resBodyKeys = [
      "name",
      "type",
      "mimeType",
      "sourceMediaUrl",
      "compressedMediaUrl",
      "caption",
      "sourceMediaKey",
      "compressedMediaKey",
      "storageLocation",
      "originalFilename",
      "isPublic",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];
    const ident = "uuid";
    const joins = [];
    const fields = ["*"];

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const current = await db.queryHead(sqlStringAndValues);

    if (!current) {
      return res.status(404).json({ errors: ["Record not found"] });
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? SET ?", [
        archiveTable,
        {
          ..._.omit([], current),
          modifier: req.headers["x-user-uuid"] || "stub",
        },
      ]);
    }

    if (Object.keys(req.body).length) {
      const body = prepareDateTimeStrings(
        reqBodySchema,
        await mapExposedIdentsToInternal(relations, req.body)
      );
      await db.query("UPDATE ?? SET ? WHERE ?? = ?", [
        table,
        body,
        ident,
        req.params[ident],
      ]);
    } else {
      // Nothing to update.
      const resBody = _.pick(resBodyKeys, current);
      return res.status(200).json(resBody);
    }
    const record = await db.queryHead(
      await getSQLString({
        table,
        fields,
        joins,
        $where: { [ident]: req.params["uuid"] },
      })
    );

    const resBody = _.pick(resBodyKeys, record);
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.mediaPatchList = async (req, res, next) => {
  try {
    const table = "Media";
    const relations = relationsMap[table];
    const archiveTable = archiveTablesMap[table];
    const reqBodySchema = require("./schemas/media.PATCH.list.req.body.json");
    const resBodyKeys = [
      "name",
      "type",
      "mimeType",
      "sourceMediaUrl",
      "compressedMediaUrl",
      "caption",
      "sourceMediaKey",
      "compressedMediaKey",
      "storageLocation",
      "originalFilename",
      "isPublic",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];

    const $where = await prepareWhere(relations, req.query.$where);
    const selectParams = await getSQLString({
      table,
      $where,
    });

    const currents = await db.query(selectParams);
    if (!currents.length) {
      return res.status(200).json([]);
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? (??) VALUES ?", [
        archiveTable,
        [].concat(Object.keys(currents[0])).concat("modifier"),
        currents.map((c) =>
          Object.values(c).concat(req.headers["x-user-uuid"] || "stub")
        ),
      ]);
    }

    if (Object.keys(req.body).length) {
      const body = prepareDateTimeStrings(
        reqBodySchema,
        await mapExposedIdentsToInternal(relations, req.body)
      );

      let sql = "UPDATE ?? SET ?";
      let values = [table, body];

      if (selectParams.sql.includes(" where ")) {
        sql += " where " + selectParams.sql.split(" where ")[1];
        values = values.concat(selectParams.values);
      }

      await db.query(sql, values);
    } else {
      // Nothing to update.
      let resBody = (
        await Promise.all(
          currents.map((current) =>
            mapInternalIdentsToExposed(relations, current)
          )
        )
      ).map((x) => _.pick(resBodyKeys, x));
      return res.status(200).json(resBody);
    }
    const records = await db.query(selectParams);
    const resBody = (
      await Promise.all(
        records.map((record) => mapInternalIdentsToExposed(relations, record))
      )
    ).map((x) => _.pick(resBodyKeys, x));
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.mediaDelete = async (req, res, next) => {
  try {
    const table = "Media";
    const archiveTable = archiveTablesMap[table];
    const resBodyKeys = [
      "name",
      "type",
      "mimeType",
      "sourceMediaUrl",
      "compressedMediaUrl",
      "caption",
      "sourceMediaKey",
      "compressedMediaKey",
      "storageLocation",
      "originalFilename",
      "isPublic",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];
    const ident = "uuid";
    const joins = [];
    const fields = ["*"];

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const current = await db.queryHead(sqlStringAndValues);

    if (!current) {
      return res.status(404).json({ errors: ["Record not found"] });
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? SET ?", [
        archiveTable,
        {
          ..._.omit([], current),
          modifier: req.headers["x-user-uuid"] || "stub",
          userDeleted: 1,
        },
      ]);
    }

    await db.query("DELETE FROM ?? WHERE ?? = ?", [
      table,
      ident,
      req.params[ident],
    ]);

    const resBody = _.pick(resBodyKeys, current);
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.mediaDeleteList = async (req, res, next) => {
  try {
    const table = "Media";
    const archiveTable = archiveTablesMap[table];
    const relations = relationsMap[table];
    const resBodyKeys = [
      "name",
      "type",
      "mimeType",
      "sourceMediaUrl",
      "compressedMediaUrl",
      "caption",
      "sourceMediaKey",
      "compressedMediaKey",
      "storageLocation",
      "originalFilename",
      "isPublic",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];

    const $where = await prepareWhere(relations, req.query.$where);
    const selectParams = await getSQLString({
      table,
      $where,
    });

    const currents = await db.query(selectParams);
    if (!currents.length) {
      return res.status(200).json([]);
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? (??) VALUES ?", [
        archiveTable,
        []
          .concat(Object.keys(currents[0]))
          .concat("modifier")
          .concat("userDeleted"),
        currents.map((c) =>
          Object.values(c)
            .concat(req.headers["x-user-uuid"] || "stub")
            .concat(1)
        ),
      ]);
    }

    let sql = "DELETE FROM ??";
    let values = [table];

    if (selectParams.sql.includes(" where ")) {
      sql += " where " + selectParams.sql.split(" where ")[1];
      values = values.concat(selectParams.values);
    }

    await db.query(sql, values);

    const resBody = (
      await Promise.all(
        currents.map((record) => mapInternalIdentsToExposed(relations, record))
      )
    ).map((x) => _.pick(resBodyKeys, x));
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.organizationGet = async (req, res, next) => {
  try {
    const table = "Organization";
    const ident = "uuid";
    const joins = [
      {
        type: "left",
        target: "Organization",
        alias: "Organization_0",
        on: { id: "$Organization.parentOrganizationId$" },
      },
    ];
    const fields = [
      "enum",
      "name",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
      { as: "parentOrganizationUuid", expression: "Organization_0.uuid" },
    ];
    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const record = await db.queryHead(sqlStringAndValues);
    if (!record) {
      return res.status(404).json({ errors: ["Record not found"] });
    }
    return res.status(200).json(record);
  } catch (e) {
    return next(e);
  }
};

module.exports.organizationGetList = async (req, res, next) => {
  try {
    const table = "Organization";
    const relations = [
      {
        localTable: "Organization",
        localField: "parentOrganizationId",
        localForeignIdent: "parentOrganizationUuid",
        foreignTable: "Organization",
        foreignField: "id",
        foreignIdent: "uuid",
      },
    ];

    const $where = await prepareWhere(relations, req.query.$where);
    const $orderBy = req.query.$orderBy
      ? Array.isArray(req.query.$orderBy)
        ? req.query.$orderBy.map((x) => mapExposedKeysToInternal(relations, x))
        : mapExposedKeysToInternal(relations, req.query.$orderBy)
      : undefined;

    // https://github.com/epoberezkin/ajv/issues/276
    if (req.query.$paginate && req.query.$paginate.page) {
      req.query.$paginate.pageSize = req.query.$paginate.pageSize || 20;
    }

    let rows, totalCount;

    const joins = [
      {
        type: "left",
        target: "Organization",
        alias: "Organization_0",
        on: { id: "$Organization.parentOrganizationId$" },
      },
    ];
    const fields = [
      "id",
      "enum",
      "name",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
      { as: "parentOrganizationUuid", expression: "Organization_0.uuid" },
    ];
    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where,
      $orderBy,
      $paginate: req.query.$paginate || undefined,
    });

    if (req.query.$paginate) {
      [rows, totalCount] = await Promise.all([
        db.query(sqlStringAndValues),
        db
          .queryHead(
            await getSQLString({
              table,
              fields: ["COUNT(*)"],
              $where,
              $orderBy,
            })
          )
          .then((d) => d["COUNT(*)"]),
      ]);
    } else {
      rows = await db.query(sqlStringAndValues);
    }

    if (req.query.$paginate) {
      if (typeof req.query.$paginate.limit === "number") {
        const hasMoreResults = rows.length === req.query.$paginate.limit + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }

        res.set("x-pagination-limit", req.query.$paginate.limit);
        res.set("x-pagination-offset", req.query.$paginate.offset);
        res.set(
          "x-pagination-has-previous-page",
          req.query.$paginate.offset > 0
        );
        res.set("x-pagination-has-next-page", !!hasMoreResults);
      } else if (typeof req.query.$paginate.page === "number") {
        const hasMoreResults = rows.length === req.query.$paginate.pageSize + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }

        res.set("x-pagination-page", req.query.$paginate.page);
        res.set("x-pagination-page-size", req.query.$paginate.pageSize);
        res.set("x-pagination-has-previous-page", req.query.$paginate.page > 1);
        res.set("x-pagination-has-next-page", !!hasMoreResults);
      } else {
        const flip =
          typeof req.query.$paginate.first === "number" ? false : true;
        const limit = flip
          ? req.query.$paginate.last
          : req.query.$paginate.first;

        const hasMoreResults = rows.length === limit + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }
        if (flip) {
          rows = rows.reverse();
        }

        const hasPreviousPage = flip ? hasMoreResults : false;
        const hasNextPage = flip ? false : hasMoreResults;
        const startCursor =
          rows[0] && rows[0].id ? encodeCursor(rows[0].id) : null;
        const endCursor =
          rows[rows.length - 1] && rows[rows.length - 1].id
            ? encodeCursor(rows[rows.length - 1].id)
            : null;

        res.set("x-pagination-has-previous-page", hasPreviousPage);
        res.set("x-pagination-has-next-page", hasNextPage);
        if (startCursor != null) {
          res.set("x-pagination-start-cursor", startCursor);
        }
        if (endCursor != null) {
          res.set("x-pagination-end-cursor", endCursor);
        }
      }
    }

    if (typeof totalCount === "number") {
      res.set("x-pagination-total-count", totalCount);
    }

    if (
      typeof totalCount === "number" &&
      req.query.$paginate &&
      req.query.$paginate.pageSize
    ) {
      res.set(
        "x-pagination-last-page",
        Math.ceil(totalCount / req.query.$paginate.pageSize)
      );
    }

    // https://jsperf.com/delete-vs-spread-vs-lodash-omit-vs-lodash-inverse-pick
    for (let row of rows) {
      row.id = undefined;
    }

    return res.status(200).json(rows);
  } catch (e) {
    return next(e);
  }
};

module.exports.organizationPost = async (req, res, next) => {
  try {
    const table = "Organization";
    const relations = [
      {
        localTable: "Organization",
        localField: "parentOrganizationId",
        localForeignIdent: "parentOrganizationUuid",
        foreignTable: "Organization",
        foreignField: "id",
        foreignIdent: "uuid",
      },
    ];
    const reqBodySchema = require("./schemas/organization.POST.req.body.json");
    const ident = "uuid";
    const joins = [
      {
        type: "left",
        target: "Organization",
        alias: "Organization_0",
        on: { id: "$Organization.parentOrganizationId$" },
      },
    ];
    const fields = [
      "enum",
      "name",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
      { as: "parentOrganizationUuid", expression: "Organization_0.uuid" },
    ];

    const body = prepareDateTimeStrings(
      reqBodySchema,
      await mapExposedIdentsToInternal(relations, req.body)
    );

    const inserted = await db.query("INSERT INTO ?? SET ?? = UUID(), ?", [
      table,
      ident,
      body,
    ]);
    const id = inserted.insertId;

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { id },
    });
    const record = await db.queryHead(sqlStringAndValues);

    return res.status(200).json(record);
  } catch (e) {
    return next(e);
  }
};

module.exports.organizationPatch = async (req, res, next) => {
  try {
    const table = "Organization";
    const archiveTable = archiveTablesMap[table];
    const relations = [
      {
        localTable: "Organization",
        localField: "parentOrganizationId",
        localForeignIdent: "parentOrganizationUuid",
        foreignTable: "Organization",
        foreignField: "id",
        foreignIdent: "uuid",
      },
    ];
    const reqBodySchema = require("./schemas/organization.PATCH.req.body.json");
    const resBodyKeys = [
      "enum",
      "name",
      "parentOrganizationUuid",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];
    const ident = "uuid";
    const joins = [
      {
        type: "left",
        target: "Organization",
        alias: "Organization_0",
        on: { id: "$Organization.parentOrganizationId$" },
      },
    ];
    const fields = [
      "*",
      { as: "parentOrganizationUuid", expression: "Organization_0.uuid" },
    ];

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const current = await db.queryHead(sqlStringAndValues);

    if (!current) {
      return res.status(404).json({ errors: ["Record not found"] });
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? SET ?", [
        archiveTable,
        {
          ..._.omit(["parentOrganizationUuid"], current),
          modifier: req.headers["x-user-uuid"] || "stub",
        },
      ]);
    }

    if (Object.keys(req.body).length) {
      const body = prepareDateTimeStrings(
        reqBodySchema,
        await mapExposedIdentsToInternal(relations, req.body)
      );
      await db.query("UPDATE ?? SET ? WHERE ?? = ?", [
        table,
        body,
        ident,
        req.params[ident],
      ]);
    } else {
      // Nothing to update.
      const resBody = _.pick(resBodyKeys, current);
      return res.status(200).json(resBody);
    }
    const record = await db.queryHead(
      await getSQLString({
        table,
        fields,
        joins,
        $where: { [ident]: req.params["uuid"] },
      })
    );

    const resBody = _.pick(resBodyKeys, record);
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.organizationPatchList = async (req, res, next) => {
  try {
    const table = "Organization";
    const relations = relationsMap[table];
    const archiveTable = archiveTablesMap[table];
    const reqBodySchema = require("./schemas/organization.PATCH.list.req.body.json");
    const resBodyKeys = [
      "enum",
      "name",
      "parentOrganizationUuid",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];

    const $where = await prepareWhere(relations, req.query.$where);
    const selectParams = await getSQLString({
      table,
      $where,
    });

    const currents = await db.query(selectParams);
    if (!currents.length) {
      return res.status(200).json([]);
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? (??) VALUES ?", [
        archiveTable,
        [].concat(Object.keys(currents[0])).concat("modifier"),
        currents.map((c) =>
          Object.values(c).concat(req.headers["x-user-uuid"] || "stub")
        ),
      ]);
    }

    if (Object.keys(req.body).length) {
      const body = prepareDateTimeStrings(
        reqBodySchema,
        await mapExposedIdentsToInternal(relations, req.body)
      );

      let sql = "UPDATE ?? SET ?";
      let values = [table, body];

      if (selectParams.sql.includes(" where ")) {
        sql += " where " + selectParams.sql.split(" where ")[1];
        values = values.concat(selectParams.values);
      }

      await db.query(sql, values);
    } else {
      // Nothing to update.
      let resBody = (
        await Promise.all(
          currents.map((current) =>
            mapInternalIdentsToExposed(relations, current)
          )
        )
      ).map((x) => _.pick(resBodyKeys, x));
      return res.status(200).json(resBody);
    }
    const records = await db.query(selectParams);
    const resBody = (
      await Promise.all(
        records.map((record) => mapInternalIdentsToExposed(relations, record))
      )
    ).map((x) => _.pick(resBodyKeys, x));
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.organizationDelete = async (req, res, next) => {
  try {
    const table = "Organization";
    const archiveTable = archiveTablesMap[table];
    const resBodyKeys = [
      "enum",
      "name",
      "parentOrganizationUuid",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];
    const ident = "uuid";
    const joins = [
      {
        type: "left",
        target: "Organization",
        alias: "Organization_0",
        on: { id: "$Organization.parentOrganizationId$" },
      },
    ];
    const fields = [
      "*",
      { as: "parentOrganizationUuid", expression: "Organization_0.uuid" },
    ];

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const current = await db.queryHead(sqlStringAndValues);

    if (!current) {
      return res.status(404).json({ errors: ["Record not found"] });
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? SET ?", [
        archiveTable,
        {
          ..._.omit(["parentOrganizationUuid"], current),
          modifier: req.headers["x-user-uuid"] || "stub",
          userDeleted: 1,
        },
      ]);
    }

    await db.query("DELETE FROM ?? WHERE ?? = ?", [
      table,
      ident,
      req.params[ident],
    ]);

    const resBody = _.pick(resBodyKeys, current);
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.organizationDeleteList = async (req, res, next) => {
  try {
    const table = "Organization";
    const archiveTable = archiveTablesMap[table];
    const relations = relationsMap[table];
    const resBodyKeys = [
      "enum",
      "name",
      "parentOrganizationUuid",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];

    const $where = await prepareWhere(relations, req.query.$where);
    const selectParams = await getSQLString({
      table,
      $where,
    });

    const currents = await db.query(selectParams);
    if (!currents.length) {
      return res.status(200).json([]);
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? (??) VALUES ?", [
        archiveTable,
        []
          .concat(Object.keys(currents[0]))
          .concat("modifier")
          .concat("userDeleted"),
        currents.map((c) =>
          Object.values(c)
            .concat(req.headers["x-user-uuid"] || "stub")
            .concat(1)
        ),
      ]);
    }

    let sql = "DELETE FROM ??";
    let values = [table];

    if (selectParams.sql.includes(" where ")) {
      sql += " where " + selectParams.sql.split(" where ")[1];
      values = values.concat(selectParams.values);
    }

    await db.query(sql, values);

    const resBody = (
      await Promise.all(
        currents.map((record) => mapInternalIdentsToExposed(relations, record))
      )
    ).map((x) => _.pick(resBodyKeys, x));
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.organizationRoleGet = async (req, res, next) => {
  try {
    const table = "OrganizationRole";
    const ident = "uuid";
    const joins = [
      {
        type: "left",
        target: "Organization",
        alias: "Organization_0",
        on: { id: "$OrganizationRole.organizationId$" },
      },
    ];
    const fields = [
      "organizationEnum",
      "enum",
      "name",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
      { as: "organizationUuid", expression: "Organization_0.uuid" },
    ];
    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const record = await db.queryHead(sqlStringAndValues);
    if (!record) {
      return res.status(404).json({ errors: ["Record not found"] });
    }
    return res.status(200).json(record);
  } catch (e) {
    return next(e);
  }
};

module.exports.organizationRoleGetList = async (req, res, next) => {
  try {
    const table = "OrganizationRole";
    const relations = [
      {
        localTable: "OrganizationRole",
        localField: "organizationId",
        localForeignIdent: "organizationUuid",
        foreignTable: "Organization",
        foreignField: "id",
        foreignIdent: "uuid",
      },
    ];

    const $where = await prepareWhere(relations, req.query.$where);
    const $orderBy = req.query.$orderBy
      ? Array.isArray(req.query.$orderBy)
        ? req.query.$orderBy.map((x) => mapExposedKeysToInternal(relations, x))
        : mapExposedKeysToInternal(relations, req.query.$orderBy)
      : undefined;

    // https://github.com/epoberezkin/ajv/issues/276
    if (req.query.$paginate && req.query.$paginate.page) {
      req.query.$paginate.pageSize = req.query.$paginate.pageSize || 20;
    }

    let rows, totalCount;

    const joins = [
      {
        type: "left",
        target: "Organization",
        alias: "Organization_0",
        on: { id: "$OrganizationRole.organizationId$" },
      },
    ];
    const fields = [
      "id",
      "organizationEnum",
      "enum",
      "name",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
      { as: "organizationUuid", expression: "Organization_0.uuid" },
    ];
    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where,
      $orderBy,
      $paginate: req.query.$paginate || undefined,
    });

    if (req.query.$paginate) {
      [rows, totalCount] = await Promise.all([
        db.query(sqlStringAndValues),
        db
          .queryHead(
            await getSQLString({
              table,
              fields: ["COUNT(*)"],
              $where,
              $orderBy,
            })
          )
          .then((d) => d["COUNT(*)"]),
      ]);
    } else {
      rows = await db.query(sqlStringAndValues);
    }

    if (req.query.$paginate) {
      if (typeof req.query.$paginate.limit === "number") {
        const hasMoreResults = rows.length === req.query.$paginate.limit + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }

        res.set("x-pagination-limit", req.query.$paginate.limit);
        res.set("x-pagination-offset", req.query.$paginate.offset);
        res.set(
          "x-pagination-has-previous-page",
          req.query.$paginate.offset > 0
        );
        res.set("x-pagination-has-next-page", !!hasMoreResults);
      } else if (typeof req.query.$paginate.page === "number") {
        const hasMoreResults = rows.length === req.query.$paginate.pageSize + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }

        res.set("x-pagination-page", req.query.$paginate.page);
        res.set("x-pagination-page-size", req.query.$paginate.pageSize);
        res.set("x-pagination-has-previous-page", req.query.$paginate.page > 1);
        res.set("x-pagination-has-next-page", !!hasMoreResults);
      } else {
        const flip =
          typeof req.query.$paginate.first === "number" ? false : true;
        const limit = flip
          ? req.query.$paginate.last
          : req.query.$paginate.first;

        const hasMoreResults = rows.length === limit + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }
        if (flip) {
          rows = rows.reverse();
        }

        const hasPreviousPage = flip ? hasMoreResults : false;
        const hasNextPage = flip ? false : hasMoreResults;
        const startCursor =
          rows[0] && rows[0].id ? encodeCursor(rows[0].id) : null;
        const endCursor =
          rows[rows.length - 1] && rows[rows.length - 1].id
            ? encodeCursor(rows[rows.length - 1].id)
            : null;

        res.set("x-pagination-has-previous-page", hasPreviousPage);
        res.set("x-pagination-has-next-page", hasNextPage);
        if (startCursor != null) {
          res.set("x-pagination-start-cursor", startCursor);
        }
        if (endCursor != null) {
          res.set("x-pagination-end-cursor", endCursor);
        }
      }
    }

    if (typeof totalCount === "number") {
      res.set("x-pagination-total-count", totalCount);
    }

    if (
      typeof totalCount === "number" &&
      req.query.$paginate &&
      req.query.$paginate.pageSize
    ) {
      res.set(
        "x-pagination-last-page",
        Math.ceil(totalCount / req.query.$paginate.pageSize)
      );
    }

    // https://jsperf.com/delete-vs-spread-vs-lodash-omit-vs-lodash-inverse-pick
    for (let row of rows) {
      row.id = undefined;
    }

    return res.status(200).json(rows);
  } catch (e) {
    return next(e);
  }
};

module.exports.organizationRolePost = async (req, res, next) => {
  try {
    const table = "OrganizationRole";
    const relations = [
      {
        localTable: "OrganizationRole",
        localField: "organizationId",
        localForeignIdent: "organizationUuid",
        foreignTable: "Organization",
        foreignField: "id",
        foreignIdent: "uuid",
      },
    ];
    const reqBodySchema = require("./schemas/organization-role.POST.req.body.json");
    const ident = "uuid";
    const joins = [
      {
        type: "left",
        target: "Organization",
        alias: "Organization_0",
        on: { id: "$OrganizationRole.organizationId$" },
      },
    ];
    const fields = [
      "organizationEnum",
      "enum",
      "name",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
      { as: "organizationUuid", expression: "Organization_0.uuid" },
    ];

    const body = prepareDateTimeStrings(
      reqBodySchema,
      await mapExposedIdentsToInternal(relations, req.body)
    );

    const inserted = await db.query("INSERT INTO ?? SET ?? = UUID(), ?", [
      table,
      ident,
      body,
    ]);
    const id = inserted.insertId;

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { id },
    });
    const record = await db.queryHead(sqlStringAndValues);

    return res.status(200).json(record);
  } catch (e) {
    return next(e);
  }
};

module.exports.organizationRolePatch = async (req, res, next) => {
  try {
    const table = "OrganizationRole";
    const archiveTable = archiveTablesMap[table];
    const relations = [
      {
        localTable: "OrganizationRole",
        localField: "organizationId",
        localForeignIdent: "organizationUuid",
        foreignTable: "Organization",
        foreignField: "id",
        foreignIdent: "uuid",
      },
    ];
    const reqBodySchema = require("./schemas/organization-role.PATCH.req.body.json");
    const resBodyKeys = [
      "organizationUuid",
      "organizationEnum",
      "enum",
      "name",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];
    const ident = "uuid";
    const joins = [
      {
        type: "left",
        target: "Organization",
        alias: "Organization_0",
        on: { id: "$OrganizationRole.organizationId$" },
      },
    ];
    const fields = [
      "*",
      { as: "organizationUuid", expression: "Organization_0.uuid" },
    ];

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const current = await db.queryHead(sqlStringAndValues);

    if (!current) {
      return res.status(404).json({ errors: ["Record not found"] });
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? SET ?", [
        archiveTable,
        {
          ..._.omit(["organizationUuid"], current),
          modifier: req.headers["x-user-uuid"] || "stub",
        },
      ]);
    }

    if (Object.keys(req.body).length) {
      const body = prepareDateTimeStrings(
        reqBodySchema,
        await mapExposedIdentsToInternal(relations, req.body)
      );
      await db.query("UPDATE ?? SET ? WHERE ?? = ?", [
        table,
        body,
        ident,
        req.params[ident],
      ]);
    } else {
      // Nothing to update.
      const resBody = _.pick(resBodyKeys, current);
      return res.status(200).json(resBody);
    }
    const record = await db.queryHead(
      await getSQLString({
        table,
        fields,
        joins,
        $where: { [ident]: req.params["uuid"] },
      })
    );

    const resBody = _.pick(resBodyKeys, record);
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.organizationRolePatchList = async (req, res, next) => {
  try {
    const table = "OrganizationRole";
    const relations = relationsMap[table];
    const archiveTable = archiveTablesMap[table];
    const reqBodySchema = require("./schemas/organization-role.PATCH.list.req.body.json");
    const resBodyKeys = [
      "organizationUuid",
      "organizationEnum",
      "enum",
      "name",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];

    const $where = await prepareWhere(relations, req.query.$where);
    const selectParams = await getSQLString({
      table,
      $where,
    });

    const currents = await db.query(selectParams);
    if (!currents.length) {
      return res.status(200).json([]);
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? (??) VALUES ?", [
        archiveTable,
        [].concat(Object.keys(currents[0])).concat("modifier"),
        currents.map((c) =>
          Object.values(c).concat(req.headers["x-user-uuid"] || "stub")
        ),
      ]);
    }

    if (Object.keys(req.body).length) {
      const body = prepareDateTimeStrings(
        reqBodySchema,
        await mapExposedIdentsToInternal(relations, req.body)
      );

      let sql = "UPDATE ?? SET ?";
      let values = [table, body];

      if (selectParams.sql.includes(" where ")) {
        sql += " where " + selectParams.sql.split(" where ")[1];
        values = values.concat(selectParams.values);
      }

      await db.query(sql, values);
    } else {
      // Nothing to update.
      let resBody = (
        await Promise.all(
          currents.map((current) =>
            mapInternalIdentsToExposed(relations, current)
          )
        )
      ).map((x) => _.pick(resBodyKeys, x));
      return res.status(200).json(resBody);
    }
    const records = await db.query(selectParams);
    const resBody = (
      await Promise.all(
        records.map((record) => mapInternalIdentsToExposed(relations, record))
      )
    ).map((x) => _.pick(resBodyKeys, x));
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.organizationRoleDelete = async (req, res, next) => {
  try {
    const table = "OrganizationRole";
    const archiveTable = archiveTablesMap[table];
    const resBodyKeys = [
      "organizationUuid",
      "organizationEnum",
      "enum",
      "name",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];
    const ident = "uuid";
    const joins = [
      {
        type: "left",
        target: "Organization",
        alias: "Organization_0",
        on: { id: "$OrganizationRole.organizationId$" },
      },
    ];
    const fields = [
      "*",
      { as: "organizationUuid", expression: "Organization_0.uuid" },
    ];

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const current = await db.queryHead(sqlStringAndValues);

    if (!current) {
      return res.status(404).json({ errors: ["Record not found"] });
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? SET ?", [
        archiveTable,
        {
          ..._.omit(["organizationUuid"], current),
          modifier: req.headers["x-user-uuid"] || "stub",
          userDeleted: 1,
        },
      ]);
    }

    await db.query("DELETE FROM ?? WHERE ?? = ?", [
      table,
      ident,
      req.params[ident],
    ]);

    const resBody = _.pick(resBodyKeys, current);
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.organizationRoleDeleteList = async (req, res, next) => {
  try {
    const table = "OrganizationRole";
    const archiveTable = archiveTablesMap[table];
    const relations = relationsMap[table];
    const resBodyKeys = [
      "organizationUuid",
      "organizationEnum",
      "enum",
      "name",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];

    const $where = await prepareWhere(relations, req.query.$where);
    const selectParams = await getSQLString({
      table,
      $where,
    });

    const currents = await db.query(selectParams);
    if (!currents.length) {
      return res.status(200).json([]);
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? (??) VALUES ?", [
        archiveTable,
        []
          .concat(Object.keys(currents[0]))
          .concat("modifier")
          .concat("userDeleted"),
        currents.map((c) =>
          Object.values(c)
            .concat(req.headers["x-user-uuid"] || "stub")
            .concat(1)
        ),
      ]);
    }

    let sql = "DELETE FROM ??";
    let values = [table];

    if (selectParams.sql.includes(" where ")) {
      sql += " where " + selectParams.sql.split(" where ")[1];
      values = values.concat(selectParams.values);
    }

    await db.query(sql, values);

    const resBody = (
      await Promise.all(
        currents.map((record) => mapInternalIdentsToExposed(relations, record))
      )
    ).map((x) => _.pick(resBodyKeys, x));
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.projectGet = async (req, res, next) => {
  try {
    const table = "Project";
    const ident = "uuid";
    const joins = [
      {
        type: "left",
        target: "Organization",
        alias: "Organization_0",
        on: { id: "$Project.organizationId$" },
      },
    ];
    const fields = [
      "enum",
      "name",
      "startDate",
      "targetEndDate",
      "targetReleaseDate",
      "requirementsUrl",
      "standardsUrl",
      "projectManagementUrl",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
      { as: "organizationUuid", expression: "Organization_0.uuid" },
    ];
    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const record = await db.queryHead(sqlStringAndValues);
    if (!record) {
      return res.status(404).json({ errors: ["Record not found"] });
    }
    return res.status(200).json(record);
  } catch (e) {
    return next(e);
  }
};

module.exports.projectGetList = async (req, res, next) => {
  try {
    const table = "Project";
    const relations = [
      {
        localTable: "Project",
        localField: "organizationId",
        localForeignIdent: "organizationUuid",
        foreignTable: "Organization",
        foreignField: "id",
        foreignIdent: "uuid",
      },
    ];

    const $where = await prepareWhere(relations, req.query.$where);
    const $orderBy = req.query.$orderBy
      ? Array.isArray(req.query.$orderBy)
        ? req.query.$orderBy.map((x) => mapExposedKeysToInternal(relations, x))
        : mapExposedKeysToInternal(relations, req.query.$orderBy)
      : undefined;

    // https://github.com/epoberezkin/ajv/issues/276
    if (req.query.$paginate && req.query.$paginate.page) {
      req.query.$paginate.pageSize = req.query.$paginate.pageSize || 20;
    }

    let rows, totalCount;

    const joins = [
      {
        type: "left",
        target: "Organization",
        alias: "Organization_0",
        on: { id: "$Project.organizationId$" },
      },
    ];
    const fields = [
      "id",
      "enum",
      "name",
      "startDate",
      "targetEndDate",
      "targetReleaseDate",
      "requirementsUrl",
      "standardsUrl",
      "projectManagementUrl",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
      { as: "organizationUuid", expression: "Organization_0.uuid" },
    ];
    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where,
      $orderBy,
      $paginate: req.query.$paginate || undefined,
    });

    if (req.query.$paginate) {
      [rows, totalCount] = await Promise.all([
        db.query(sqlStringAndValues),
        db
          .queryHead(
            await getSQLString({
              table,
              fields: ["COUNT(*)"],
              $where,
              $orderBy,
            })
          )
          .then((d) => d["COUNT(*)"]),
      ]);
    } else {
      rows = await db.query(sqlStringAndValues);
    }

    if (req.query.$paginate) {
      if (typeof req.query.$paginate.limit === "number") {
        const hasMoreResults = rows.length === req.query.$paginate.limit + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }

        res.set("x-pagination-limit", req.query.$paginate.limit);
        res.set("x-pagination-offset", req.query.$paginate.offset);
        res.set(
          "x-pagination-has-previous-page",
          req.query.$paginate.offset > 0
        );
        res.set("x-pagination-has-next-page", !!hasMoreResults);
      } else if (typeof req.query.$paginate.page === "number") {
        const hasMoreResults = rows.length === req.query.$paginate.pageSize + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }

        res.set("x-pagination-page", req.query.$paginate.page);
        res.set("x-pagination-page-size", req.query.$paginate.pageSize);
        res.set("x-pagination-has-previous-page", req.query.$paginate.page > 1);
        res.set("x-pagination-has-next-page", !!hasMoreResults);
      } else {
        const flip =
          typeof req.query.$paginate.first === "number" ? false : true;
        const limit = flip
          ? req.query.$paginate.last
          : req.query.$paginate.first;

        const hasMoreResults = rows.length === limit + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }
        if (flip) {
          rows = rows.reverse();
        }

        const hasPreviousPage = flip ? hasMoreResults : false;
        const hasNextPage = flip ? false : hasMoreResults;
        const startCursor =
          rows[0] && rows[0].id ? encodeCursor(rows[0].id) : null;
        const endCursor =
          rows[rows.length - 1] && rows[rows.length - 1].id
            ? encodeCursor(rows[rows.length - 1].id)
            : null;

        res.set("x-pagination-has-previous-page", hasPreviousPage);
        res.set("x-pagination-has-next-page", hasNextPage);
        if (startCursor != null) {
          res.set("x-pagination-start-cursor", startCursor);
        }
        if (endCursor != null) {
          res.set("x-pagination-end-cursor", endCursor);
        }
      }
    }

    if (typeof totalCount === "number") {
      res.set("x-pagination-total-count", totalCount);
    }

    if (
      typeof totalCount === "number" &&
      req.query.$paginate &&
      req.query.$paginate.pageSize
    ) {
      res.set(
        "x-pagination-last-page",
        Math.ceil(totalCount / req.query.$paginate.pageSize)
      );
    }

    // https://jsperf.com/delete-vs-spread-vs-lodash-omit-vs-lodash-inverse-pick
    for (let row of rows) {
      row.id = undefined;
    }

    return res.status(200).json(rows);
  } catch (e) {
    return next(e);
  }
};

module.exports.projectPost = async (req, res, next) => {
  try {
    const table = "Project";
    const relations = [
      {
        localTable: "Project",
        localField: "organizationId",
        localForeignIdent: "organizationUuid",
        foreignTable: "Organization",
        foreignField: "id",
        foreignIdent: "uuid",
      },
    ];
    const reqBodySchema = require("./schemas/project.POST.req.body.json");
    const ident = "uuid";
    const joins = [
      {
        type: "left",
        target: "Organization",
        alias: "Organization_0",
        on: { id: "$Project.organizationId$" },
      },
    ];
    const fields = [
      "enum",
      "name",
      "startDate",
      "targetEndDate",
      "targetReleaseDate",
      "requirementsUrl",
      "standardsUrl",
      "projectManagementUrl",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
      { as: "organizationUuid", expression: "Organization_0.uuid" },
    ];

    const body = prepareDateTimeStrings(
      reqBodySchema,
      await mapExposedIdentsToInternal(relations, req.body)
    );

    const inserted = await db.query("INSERT INTO ?? SET ?? = UUID(), ?", [
      table,
      ident,
      body,
    ]);
    const id = inserted.insertId;

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { id },
    });
    const record = await db.queryHead(sqlStringAndValues);

    return res.status(200).json(record);
  } catch (e) {
    return next(e);
  }
};

module.exports.projectPatch = async (req, res, next) => {
  try {
    const table = "Project";
    const archiveTable = archiveTablesMap[table];
    const relations = [
      {
        localTable: "Project",
        localField: "organizationId",
        localForeignIdent: "organizationUuid",
        foreignTable: "Organization",
        foreignField: "id",
        foreignIdent: "uuid",
      },
    ];
    const reqBodySchema = require("./schemas/project.PATCH.req.body.json");
    const resBodyKeys = [
      "organizationUuid",
      "enum",
      "name",
      "startDate",
      "targetEndDate",
      "targetReleaseDate",
      "requirementsUrl",
      "standardsUrl",
      "projectManagementUrl",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];
    const ident = "uuid";
    const joins = [
      {
        type: "left",
        target: "Organization",
        alias: "Organization_0",
        on: { id: "$Project.organizationId$" },
      },
    ];
    const fields = [
      "*",
      { as: "organizationUuid", expression: "Organization_0.uuid" },
    ];

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const current = await db.queryHead(sqlStringAndValues);

    if (!current) {
      return res.status(404).json({ errors: ["Record not found"] });
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? SET ?", [
        archiveTable,
        {
          ..._.omit(["organizationUuid"], current),
          modifier: req.headers["x-user-uuid"] || "stub",
        },
      ]);
    }

    if (Object.keys(req.body).length) {
      const body = prepareDateTimeStrings(
        reqBodySchema,
        await mapExposedIdentsToInternal(relations, req.body)
      );
      await db.query("UPDATE ?? SET ? WHERE ?? = ?", [
        table,
        body,
        ident,
        req.params[ident],
      ]);
    } else {
      // Nothing to update.
      const resBody = _.pick(resBodyKeys, current);
      return res.status(200).json(resBody);
    }
    const record = await db.queryHead(
      await getSQLString({
        table,
        fields,
        joins,
        $where: { [ident]: req.params["uuid"] },
      })
    );

    const resBody = _.pick(resBodyKeys, record);
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.projectPatchList = async (req, res, next) => {
  try {
    const table = "Project";
    const relations = relationsMap[table];
    const archiveTable = archiveTablesMap[table];
    const reqBodySchema = require("./schemas/project.PATCH.list.req.body.json");
    const resBodyKeys = [
      "organizationUuid",
      "enum",
      "name",
      "startDate",
      "targetEndDate",
      "targetReleaseDate",
      "requirementsUrl",
      "standardsUrl",
      "projectManagementUrl",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];

    const $where = await prepareWhere(relations, req.query.$where);
    const selectParams = await getSQLString({
      table,
      $where,
    });

    const currents = await db.query(selectParams);
    if (!currents.length) {
      return res.status(200).json([]);
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? (??) VALUES ?", [
        archiveTable,
        [].concat(Object.keys(currents[0])).concat("modifier"),
        currents.map((c) =>
          Object.values(c).concat(req.headers["x-user-uuid"] || "stub")
        ),
      ]);
    }

    if (Object.keys(req.body).length) {
      const body = prepareDateTimeStrings(
        reqBodySchema,
        await mapExposedIdentsToInternal(relations, req.body)
      );

      let sql = "UPDATE ?? SET ?";
      let values = [table, body];

      if (selectParams.sql.includes(" where ")) {
        sql += " where " + selectParams.sql.split(" where ")[1];
        values = values.concat(selectParams.values);
      }

      await db.query(sql, values);
    } else {
      // Nothing to update.
      let resBody = (
        await Promise.all(
          currents.map((current) =>
            mapInternalIdentsToExposed(relations, current)
          )
        )
      ).map((x) => _.pick(resBodyKeys, x));
      return res.status(200).json(resBody);
    }
    const records = await db.query(selectParams);
    const resBody = (
      await Promise.all(
        records.map((record) => mapInternalIdentsToExposed(relations, record))
      )
    ).map((x) => _.pick(resBodyKeys, x));
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.projectDelete = async (req, res, next) => {
  try {
    const table = "Project";
    const archiveTable = archiveTablesMap[table];
    const resBodyKeys = [
      "organizationUuid",
      "enum",
      "name",
      "startDate",
      "targetEndDate",
      "targetReleaseDate",
      "requirementsUrl",
      "standardsUrl",
      "projectManagementUrl",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];
    const ident = "uuid";
    const joins = [
      {
        type: "left",
        target: "Organization",
        alias: "Organization_0",
        on: { id: "$Project.organizationId$" },
      },
    ];
    const fields = [
      "*",
      { as: "organizationUuid", expression: "Organization_0.uuid" },
    ];

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const current = await db.queryHead(sqlStringAndValues);

    if (!current) {
      return res.status(404).json({ errors: ["Record not found"] });
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? SET ?", [
        archiveTable,
        {
          ..._.omit(["organizationUuid"], current),
          modifier: req.headers["x-user-uuid"] || "stub",
          userDeleted: 1,
        },
      ]);
    }

    await db.query("DELETE FROM ?? WHERE ?? = ?", [
      table,
      ident,
      req.params[ident],
    ]);

    const resBody = _.pick(resBodyKeys, current);
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.projectDeleteList = async (req, res, next) => {
  try {
    const table = "Project";
    const archiveTable = archiveTablesMap[table];
    const relations = relationsMap[table];
    const resBodyKeys = [
      "organizationUuid",
      "enum",
      "name",
      "startDate",
      "targetEndDate",
      "targetReleaseDate",
      "requirementsUrl",
      "standardsUrl",
      "projectManagementUrl",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];

    const $where = await prepareWhere(relations, req.query.$where);
    const selectParams = await getSQLString({
      table,
      $where,
    });

    const currents = await db.query(selectParams);
    if (!currents.length) {
      return res.status(200).json([]);
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? (??) VALUES ?", [
        archiveTable,
        []
          .concat(Object.keys(currents[0]))
          .concat("modifier")
          .concat("userDeleted"),
        currents.map((c) =>
          Object.values(c)
            .concat(req.headers["x-user-uuid"] || "stub")
            .concat(1)
        ),
      ]);
    }

    let sql = "DELETE FROM ??";
    let values = [table];

    if (selectParams.sql.includes(" where ")) {
      sql += " where " + selectParams.sql.split(" where ")[1];
      values = values.concat(selectParams.values);
    }

    await db.query(sql, values);

    const resBody = (
      await Promise.all(
        currents.map((record) => mapInternalIdentsToExposed(relations, record))
      )
    ).map((x) => _.pick(resBodyKeys, x));
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.projectAttributeGet = async (req, res, next) => {
  try {
    const table = "ProjectAttribute";
    const ident = "uuid";
    const joins = [
      {
        type: "left",
        target: "ProjectAttributeType",
        alias: "ProjectAttributeType_0",
        on: { id: "$ProjectAttribute.projectAttributeTypeId$" },
      },
      {
        type: "left",
        target: "ProjectAttributeTypeValue",
        alias: "ProjectAttributeTypeValue_1",
        on: { id: "$ProjectAttribute.projectAttributeTypeValueId$" },
      },
      {
        type: "left",
        target: "Project",
        alias: "Project_2",
        on: { id: "$ProjectAttribute.projectId$" },
      },
    ];
    const fields = [
      "projectAttributeTypeEnum",
      "projectAttributeTypeValueEnum",
      "name",
      "value",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
      {
        as: "projectAttributeTypeUuid",
        expression: "ProjectAttributeType_0.uuid",
      },
      {
        as: "projectAttributeTypeValueUuid",
        expression: "ProjectAttributeTypeValue_1.uuid",
      },
      { as: "projectUuid", expression: "Project_2.uuid" },
    ];
    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const record = await db.queryHead(sqlStringAndValues);
    if (!record) {
      return res.status(404).json({ errors: ["Record not found"] });
    }
    return res.status(200).json(record);
  } catch (e) {
    return next(e);
  }
};

module.exports.projectAttributeGetList = async (req, res, next) => {
  try {
    const table = "ProjectAttribute";
    const relations = [
      {
        localTable: "ProjectAttribute",
        localField: "projectAttributeTypeId",
        localForeignIdent: "projectAttributeTypeUuid",
        foreignTable: "ProjectAttributeType",
        foreignField: "id",
        foreignIdent: "uuid",
      },
      {
        localTable: "ProjectAttribute",
        localField: "projectAttributeTypeValueId",
        localForeignIdent: "projectAttributeTypeValueUuid",
        foreignTable: "ProjectAttributeTypeValue",
        foreignField: "id",
        foreignIdent: "uuid",
      },
      {
        localTable: "ProjectAttribute",
        localField: "projectId",
        localForeignIdent: "projectUuid",
        foreignTable: "Project",
        foreignField: "id",
        foreignIdent: "uuid",
      },
    ];

    const $where = await prepareWhere(relations, req.query.$where);
    const $orderBy = req.query.$orderBy
      ? Array.isArray(req.query.$orderBy)
        ? req.query.$orderBy.map((x) => mapExposedKeysToInternal(relations, x))
        : mapExposedKeysToInternal(relations, req.query.$orderBy)
      : undefined;

    // https://github.com/epoberezkin/ajv/issues/276
    if (req.query.$paginate && req.query.$paginate.page) {
      req.query.$paginate.pageSize = req.query.$paginate.pageSize || 20;
    }

    let rows, totalCount;

    const joins = [
      {
        type: "left",
        target: "ProjectAttributeType",
        alias: "ProjectAttributeType_0",
        on: { id: "$ProjectAttribute.projectAttributeTypeId$" },
      },
      {
        type: "left",
        target: "ProjectAttributeTypeValue",
        alias: "ProjectAttributeTypeValue_1",
        on: { id: "$ProjectAttribute.projectAttributeTypeValueId$" },
      },
      {
        type: "left",
        target: "Project",
        alias: "Project_2",
        on: { id: "$ProjectAttribute.projectId$" },
      },
    ];
    const fields = [
      "id",
      "projectAttributeTypeEnum",
      "projectAttributeTypeValueEnum",
      "name",
      "value",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
      {
        as: "projectAttributeTypeUuid",
        expression: "ProjectAttributeType_0.uuid",
      },
      {
        as: "projectAttributeTypeValueUuid",
        expression: "ProjectAttributeTypeValue_1.uuid",
      },
      { as: "projectUuid", expression: "Project_2.uuid" },
    ];
    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where,
      $orderBy,
      $paginate: req.query.$paginate || undefined,
    });

    if (req.query.$paginate) {
      [rows, totalCount] = await Promise.all([
        db.query(sqlStringAndValues),
        db
          .queryHead(
            await getSQLString({
              table,
              fields: ["COUNT(*)"],
              $where,
              $orderBy,
            })
          )
          .then((d) => d["COUNT(*)"]),
      ]);
    } else {
      rows = await db.query(sqlStringAndValues);
    }

    if (req.query.$paginate) {
      if (typeof req.query.$paginate.limit === "number") {
        const hasMoreResults = rows.length === req.query.$paginate.limit + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }

        res.set("x-pagination-limit", req.query.$paginate.limit);
        res.set("x-pagination-offset", req.query.$paginate.offset);
        res.set(
          "x-pagination-has-previous-page",
          req.query.$paginate.offset > 0
        );
        res.set("x-pagination-has-next-page", !!hasMoreResults);
      } else if (typeof req.query.$paginate.page === "number") {
        const hasMoreResults = rows.length === req.query.$paginate.pageSize + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }

        res.set("x-pagination-page", req.query.$paginate.page);
        res.set("x-pagination-page-size", req.query.$paginate.pageSize);
        res.set("x-pagination-has-previous-page", req.query.$paginate.page > 1);
        res.set("x-pagination-has-next-page", !!hasMoreResults);
      } else {
        const flip =
          typeof req.query.$paginate.first === "number" ? false : true;
        const limit = flip
          ? req.query.$paginate.last
          : req.query.$paginate.first;

        const hasMoreResults = rows.length === limit + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }
        if (flip) {
          rows = rows.reverse();
        }

        const hasPreviousPage = flip ? hasMoreResults : false;
        const hasNextPage = flip ? false : hasMoreResults;
        const startCursor =
          rows[0] && rows[0].id ? encodeCursor(rows[0].id) : null;
        const endCursor =
          rows[rows.length - 1] && rows[rows.length - 1].id
            ? encodeCursor(rows[rows.length - 1].id)
            : null;

        res.set("x-pagination-has-previous-page", hasPreviousPage);
        res.set("x-pagination-has-next-page", hasNextPage);
        if (startCursor != null) {
          res.set("x-pagination-start-cursor", startCursor);
        }
        if (endCursor != null) {
          res.set("x-pagination-end-cursor", endCursor);
        }
      }
    }

    if (typeof totalCount === "number") {
      res.set("x-pagination-total-count", totalCount);
    }

    if (
      typeof totalCount === "number" &&
      req.query.$paginate &&
      req.query.$paginate.pageSize
    ) {
      res.set(
        "x-pagination-last-page",
        Math.ceil(totalCount / req.query.$paginate.pageSize)
      );
    }

    // https://jsperf.com/delete-vs-spread-vs-lodash-omit-vs-lodash-inverse-pick
    for (let row of rows) {
      row.id = undefined;
    }

    return res.status(200).json(rows);
  } catch (e) {
    return next(e);
  }
};

module.exports.projectAttributePost = async (req, res, next) => {
  try {
    const table = "ProjectAttribute";
    const relations = [
      {
        localTable: "ProjectAttribute",
        localField: "projectAttributeTypeId",
        localForeignIdent: "projectAttributeTypeUuid",
        foreignTable: "ProjectAttributeType",
        foreignField: "id",
        foreignIdent: "uuid",
      },
      {
        localTable: "ProjectAttribute",
        localField: "projectAttributeTypeValueId",
        localForeignIdent: "projectAttributeTypeValueUuid",
        foreignTable: "ProjectAttributeTypeValue",
        foreignField: "id",
        foreignIdent: "uuid",
      },
      {
        localTable: "ProjectAttribute",
        localField: "projectId",
        localForeignIdent: "projectUuid",
        foreignTable: "Project",
        foreignField: "id",
        foreignIdent: "uuid",
      },
    ];
    const reqBodySchema = require("./schemas/project-attribute.POST.req.body.json");
    const ident = "uuid";
    const joins = [
      {
        type: "left",
        target: "ProjectAttributeType",
        alias: "ProjectAttributeType_0",
        on: { id: "$ProjectAttribute.projectAttributeTypeId$" },
      },
      {
        type: "left",
        target: "ProjectAttributeTypeValue",
        alias: "ProjectAttributeTypeValue_1",
        on: { id: "$ProjectAttribute.projectAttributeTypeValueId$" },
      },
      {
        type: "left",
        target: "Project",
        alias: "Project_2",
        on: { id: "$ProjectAttribute.projectId$" },
      },
    ];
    const fields = [
      "projectAttributeTypeEnum",
      "projectAttributeTypeValueEnum",
      "name",
      "value",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
      {
        as: "projectAttributeTypeUuid",
        expression: "ProjectAttributeType_0.uuid",
      },
      {
        as: "projectAttributeTypeValueUuid",
        expression: "ProjectAttributeTypeValue_1.uuid",
      },
      { as: "projectUuid", expression: "Project_2.uuid" },
    ];

    const body = prepareDateTimeStrings(
      reqBodySchema,
      await mapExposedIdentsToInternal(relations, req.body)
    );

    const inserted = await db.query("INSERT INTO ?? SET ?? = UUID(), ?", [
      table,
      ident,
      body,
    ]);
    const id = inserted.insertId;

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { id },
    });
    const record = await db.queryHead(sqlStringAndValues);

    return res.status(200).json(record);
  } catch (e) {
    return next(e);
  }
};

module.exports.projectAttributePatch = async (req, res, next) => {
  try {
    const table = "ProjectAttribute";
    const archiveTable = archiveTablesMap[table];
    const relations = [
      {
        localTable: "ProjectAttribute",
        localField: "projectAttributeTypeId",
        localForeignIdent: "projectAttributeTypeUuid",
        foreignTable: "ProjectAttributeType",
        foreignField: "id",
        foreignIdent: "uuid",
      },
      {
        localTable: "ProjectAttribute",
        localField: "projectAttributeTypeValueId",
        localForeignIdent: "projectAttributeTypeValueUuid",
        foreignTable: "ProjectAttributeTypeValue",
        foreignField: "id",
        foreignIdent: "uuid",
      },
      {
        localTable: "ProjectAttribute",
        localField: "projectId",
        localForeignIdent: "projectUuid",
        foreignTable: "Project",
        foreignField: "id",
        foreignIdent: "uuid",
      },
    ];
    const reqBodySchema = require("./schemas/project-attribute.PATCH.req.body.json");
    const resBodyKeys = [
      "projectUuid",
      "projectAttributeTypeUuid",
      "projectAttributeTypeValueUuid",
      "projectAttributeTypeEnum",
      "projectAttributeTypeValueEnum",
      "name",
      "value",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];
    const ident = "uuid";
    const joins = [
      {
        type: "left",
        target: "ProjectAttributeType",
        alias: "ProjectAttributeType_0",
        on: { id: "$ProjectAttribute.projectAttributeTypeId$" },
      },
      {
        type: "left",
        target: "ProjectAttributeTypeValue",
        alias: "ProjectAttributeTypeValue_1",
        on: { id: "$ProjectAttribute.projectAttributeTypeValueId$" },
      },
      {
        type: "left",
        target: "Project",
        alias: "Project_2",
        on: { id: "$ProjectAttribute.projectId$" },
      },
    ];
    const fields = [
      "*",
      {
        as: "projectAttributeTypeUuid",
        expression: "ProjectAttributeType_0.uuid",
      },
      {
        as: "projectAttributeTypeValueUuid",
        expression: "ProjectAttributeTypeValue_1.uuid",
      },
      { as: "projectUuid", expression: "Project_2.uuid" },
    ];

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const current = await db.queryHead(sqlStringAndValues);

    if (!current) {
      return res.status(404).json({ errors: ["Record not found"] });
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? SET ?", [
        archiveTable,
        {
          ..._.omit(
            [
              "projectAttributeTypeUuid",
              "projectAttributeTypeValueUuid",
              "projectUuid",
            ],
            current
          ),
          modifier: req.headers["x-user-uuid"] || "stub",
        },
      ]);
    }

    if (Object.keys(req.body).length) {
      const body = prepareDateTimeStrings(
        reqBodySchema,
        await mapExposedIdentsToInternal(relations, req.body)
      );
      await db.query("UPDATE ?? SET ? WHERE ?? = ?", [
        table,
        body,
        ident,
        req.params[ident],
      ]);
    } else {
      // Nothing to update.
      const resBody = _.pick(resBodyKeys, current);
      return res.status(200).json(resBody);
    }
    const record = await db.queryHead(
      await getSQLString({
        table,
        fields,
        joins,
        $where: { [ident]: req.params["uuid"] },
      })
    );

    const resBody = _.pick(resBodyKeys, record);
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.projectAttributePatchList = async (req, res, next) => {
  try {
    const table = "ProjectAttribute";
    const relations = relationsMap[table];
    const archiveTable = archiveTablesMap[table];
    const reqBodySchema = require("./schemas/project-attribute.PATCH.list.req.body.json");
    const resBodyKeys = [
      "projectUuid",
      "projectAttributeTypeUuid",
      "projectAttributeTypeValueUuid",
      "projectAttributeTypeEnum",
      "projectAttributeTypeValueEnum",
      "name",
      "value",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];

    const $where = await prepareWhere(relations, req.query.$where);
    const selectParams = await getSQLString({
      table,
      $where,
    });

    const currents = await db.query(selectParams);
    if (!currents.length) {
      return res.status(200).json([]);
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? (??) VALUES ?", [
        archiveTable,
        [].concat(Object.keys(currents[0])).concat("modifier"),
        currents.map((c) =>
          Object.values(c).concat(req.headers["x-user-uuid"] || "stub")
        ),
      ]);
    }

    if (Object.keys(req.body).length) {
      const body = prepareDateTimeStrings(
        reqBodySchema,
        await mapExposedIdentsToInternal(relations, req.body)
      );

      let sql = "UPDATE ?? SET ?";
      let values = [table, body];

      if (selectParams.sql.includes(" where ")) {
        sql += " where " + selectParams.sql.split(" where ")[1];
        values = values.concat(selectParams.values);
      }

      await db.query(sql, values);
    } else {
      // Nothing to update.
      let resBody = (
        await Promise.all(
          currents.map((current) =>
            mapInternalIdentsToExposed(relations, current)
          )
        )
      ).map((x) => _.pick(resBodyKeys, x));
      return res.status(200).json(resBody);
    }
    const records = await db.query(selectParams);
    const resBody = (
      await Promise.all(
        records.map((record) => mapInternalIdentsToExposed(relations, record))
      )
    ).map((x) => _.pick(resBodyKeys, x));
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.projectAttributeDelete = async (req, res, next) => {
  try {
    const table = "ProjectAttribute";
    const archiveTable = archiveTablesMap[table];
    const resBodyKeys = [
      "projectUuid",
      "projectAttributeTypeUuid",
      "projectAttributeTypeValueUuid",
      "projectAttributeTypeEnum",
      "projectAttributeTypeValueEnum",
      "name",
      "value",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];
    const ident = "uuid";
    const joins = [
      {
        type: "left",
        target: "ProjectAttributeType",
        alias: "ProjectAttributeType_0",
        on: { id: "$ProjectAttribute.projectAttributeTypeId$" },
      },
      {
        type: "left",
        target: "ProjectAttributeTypeValue",
        alias: "ProjectAttributeTypeValue_1",
        on: { id: "$ProjectAttribute.projectAttributeTypeValueId$" },
      },
      {
        type: "left",
        target: "Project",
        alias: "Project_2",
        on: { id: "$ProjectAttribute.projectId$" },
      },
    ];
    const fields = [
      "*",
      {
        as: "projectAttributeTypeUuid",
        expression: "ProjectAttributeType_0.uuid",
      },
      {
        as: "projectAttributeTypeValueUuid",
        expression: "ProjectAttributeTypeValue_1.uuid",
      },
      { as: "projectUuid", expression: "Project_2.uuid" },
    ];

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const current = await db.queryHead(sqlStringAndValues);

    if (!current) {
      return res.status(404).json({ errors: ["Record not found"] });
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? SET ?", [
        archiveTable,
        {
          ..._.omit(
            [
              "projectAttributeTypeUuid",
              "projectAttributeTypeValueUuid",
              "projectUuid",
            ],
            current
          ),
          modifier: req.headers["x-user-uuid"] || "stub",
          userDeleted: 1,
        },
      ]);
    }

    await db.query("DELETE FROM ?? WHERE ?? = ?", [
      table,
      ident,
      req.params[ident],
    ]);

    const resBody = _.pick(resBodyKeys, current);
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.projectAttributeDeleteList = async (req, res, next) => {
  try {
    const table = "ProjectAttribute";
    const archiveTable = archiveTablesMap[table];
    const relations = relationsMap[table];
    const resBodyKeys = [
      "projectUuid",
      "projectAttributeTypeUuid",
      "projectAttributeTypeValueUuid",
      "projectAttributeTypeEnum",
      "projectAttributeTypeValueEnum",
      "name",
      "value",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];

    const $where = await prepareWhere(relations, req.query.$where);
    const selectParams = await getSQLString({
      table,
      $where,
    });

    const currents = await db.query(selectParams);
    if (!currents.length) {
      return res.status(200).json([]);
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? (??) VALUES ?", [
        archiveTable,
        []
          .concat(Object.keys(currents[0]))
          .concat("modifier")
          .concat("userDeleted"),
        currents.map((c) =>
          Object.values(c)
            .concat(req.headers["x-user-uuid"] || "stub")
            .concat(1)
        ),
      ]);
    }

    let sql = "DELETE FROM ??";
    let values = [table];

    if (selectParams.sql.includes(" where ")) {
      sql += " where " + selectParams.sql.split(" where ")[1];
      values = values.concat(selectParams.values);
    }

    await db.query(sql, values);

    const resBody = (
      await Promise.all(
        currents.map((record) => mapInternalIdentsToExposed(relations, record))
      )
    ).map((x) => _.pick(resBodyKeys, x));
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.projectAttributeTypeGet = async (req, res, next) => {
  try {
    const table = "ProjectAttributeType";
    const ident = "uuid";
    const joins = [
      {
        type: "left",
        target: "ProjectAttributeType",
        alias: "ProjectAttributeType_0",
        on: { id: "$ProjectAttributeType.parentId$" },
      },
      {
        type: "left",
        target: "Project",
        alias: "Project_1",
        on: { id: "$ProjectAttributeType.projectId$" },
      },
    ];
    const fields = [
      "enum",
      "name",
      "labelNumber",
      "defaultValue",
      "isRequired",
      "jsonSchema",
      "label",
      "placeholderText",
      "helpMarkdownText",
      "isMedia",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
      { as: "parentUuid", expression: "ProjectAttributeType_0.uuid" },
      { as: "projectUuid", expression: "Project_1.uuid" },
    ];
    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const record = await db.queryHead(sqlStringAndValues);
    if (!record) {
      return res.status(404).json({ errors: ["Record not found"] });
    }
    return res.status(200).json(record);
  } catch (e) {
    return next(e);
  }
};

module.exports.projectAttributeTypeGetList = async (req, res, next) => {
  try {
    const table = "ProjectAttributeType";
    const relations = [
      {
        localTable: "ProjectAttributeType",
        localField: "parentId",
        localForeignIdent: "parentUuid",
        foreignTable: "ProjectAttributeType",
        foreignField: "id",
        foreignIdent: "uuid",
      },
      {
        localTable: "ProjectAttributeType",
        localField: "projectId",
        localForeignIdent: "projectUuid",
        foreignTable: "Project",
        foreignField: "id",
        foreignIdent: "uuid",
      },
    ];

    const $where = await prepareWhere(relations, req.query.$where);
    const $orderBy = req.query.$orderBy
      ? Array.isArray(req.query.$orderBy)
        ? req.query.$orderBy.map((x) => mapExposedKeysToInternal(relations, x))
        : mapExposedKeysToInternal(relations, req.query.$orderBy)
      : undefined;

    // https://github.com/epoberezkin/ajv/issues/276
    if (req.query.$paginate && req.query.$paginate.page) {
      req.query.$paginate.pageSize = req.query.$paginate.pageSize || 20;
    }

    let rows, totalCount;

    const joins = [
      {
        type: "left",
        target: "ProjectAttributeType",
        alias: "ProjectAttributeType_0",
        on: { id: "$ProjectAttributeType.parentId$" },
      },
      {
        type: "left",
        target: "Project",
        alias: "Project_1",
        on: { id: "$ProjectAttributeType.projectId$" },
      },
    ];
    const fields = [
      "id",
      "enum",
      "name",
      "labelNumber",
      "defaultValue",
      "isRequired",
      "jsonSchema",
      "label",
      "placeholderText",
      "helpMarkdownText",
      "isMedia",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
      { as: "parentUuid", expression: "ProjectAttributeType_0.uuid" },
      { as: "projectUuid", expression: "Project_1.uuid" },
    ];
    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where,
      $orderBy,
      $paginate: req.query.$paginate || undefined,
    });

    if (req.query.$paginate) {
      [rows, totalCount] = await Promise.all([
        db.query(sqlStringAndValues),
        db
          .queryHead(
            await getSQLString({
              table,
              fields: ["COUNT(*)"],
              $where,
              $orderBy,
            })
          )
          .then((d) => d["COUNT(*)"]),
      ]);
    } else {
      rows = await db.query(sqlStringAndValues);
    }

    if (req.query.$paginate) {
      if (typeof req.query.$paginate.limit === "number") {
        const hasMoreResults = rows.length === req.query.$paginate.limit + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }

        res.set("x-pagination-limit", req.query.$paginate.limit);
        res.set("x-pagination-offset", req.query.$paginate.offset);
        res.set(
          "x-pagination-has-previous-page",
          req.query.$paginate.offset > 0
        );
        res.set("x-pagination-has-next-page", !!hasMoreResults);
      } else if (typeof req.query.$paginate.page === "number") {
        const hasMoreResults = rows.length === req.query.$paginate.pageSize + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }

        res.set("x-pagination-page", req.query.$paginate.page);
        res.set("x-pagination-page-size", req.query.$paginate.pageSize);
        res.set("x-pagination-has-previous-page", req.query.$paginate.page > 1);
        res.set("x-pagination-has-next-page", !!hasMoreResults);
      } else {
        const flip =
          typeof req.query.$paginate.first === "number" ? false : true;
        const limit = flip
          ? req.query.$paginate.last
          : req.query.$paginate.first;

        const hasMoreResults = rows.length === limit + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }
        if (flip) {
          rows = rows.reverse();
        }

        const hasPreviousPage = flip ? hasMoreResults : false;
        const hasNextPage = flip ? false : hasMoreResults;
        const startCursor =
          rows[0] && rows[0].id ? encodeCursor(rows[0].id) : null;
        const endCursor =
          rows[rows.length - 1] && rows[rows.length - 1].id
            ? encodeCursor(rows[rows.length - 1].id)
            : null;

        res.set("x-pagination-has-previous-page", hasPreviousPage);
        res.set("x-pagination-has-next-page", hasNextPage);
        if (startCursor != null) {
          res.set("x-pagination-start-cursor", startCursor);
        }
        if (endCursor != null) {
          res.set("x-pagination-end-cursor", endCursor);
        }
      }
    }

    if (typeof totalCount === "number") {
      res.set("x-pagination-total-count", totalCount);
    }

    if (
      typeof totalCount === "number" &&
      req.query.$paginate &&
      req.query.$paginate.pageSize
    ) {
      res.set(
        "x-pagination-last-page",
        Math.ceil(totalCount / req.query.$paginate.pageSize)
      );
    }

    // https://jsperf.com/delete-vs-spread-vs-lodash-omit-vs-lodash-inverse-pick
    for (let row of rows) {
      row.id = undefined;
    }

    return res.status(200).json(rows);
  } catch (e) {
    return next(e);
  }
};

module.exports.projectAttributeTypePost = async (req, res, next) => {
  try {
    const table = "ProjectAttributeType";
    const relations = [
      {
        localTable: "ProjectAttributeType",
        localField: "parentId",
        localForeignIdent: "parentUuid",
        foreignTable: "ProjectAttributeType",
        foreignField: "id",
        foreignIdent: "uuid",
      },
      {
        localTable: "ProjectAttributeType",
        localField: "projectId",
        localForeignIdent: "projectUuid",
        foreignTable: "Project",
        foreignField: "id",
        foreignIdent: "uuid",
      },
    ];
    const reqBodySchema = require("./schemas/project-attribute-type.POST.req.body.json");
    const ident = "uuid";
    const joins = [
      {
        type: "left",
        target: "ProjectAttributeType",
        alias: "ProjectAttributeType_0",
        on: { id: "$ProjectAttributeType.parentId$" },
      },
      {
        type: "left",
        target: "Project",
        alias: "Project_1",
        on: { id: "$ProjectAttributeType.projectId$" },
      },
    ];
    const fields = [
      "enum",
      "name",
      "labelNumber",
      "defaultValue",
      "isRequired",
      "jsonSchema",
      "label",
      "placeholderText",
      "helpMarkdownText",
      "isMedia",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
      { as: "parentUuid", expression: "ProjectAttributeType_0.uuid" },
      { as: "projectUuid", expression: "Project_1.uuid" },
    ];

    const body = prepareDateTimeStrings(
      reqBodySchema,
      await mapExposedIdentsToInternal(relations, req.body)
    );

    const inserted = await db.query("INSERT INTO ?? SET ?? = UUID(), ?", [
      table,
      ident,
      body,
    ]);
    const id = inserted.insertId;

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { id },
    });
    const record = await db.queryHead(sqlStringAndValues);

    return res.status(200).json(record);
  } catch (e) {
    return next(e);
  }
};

module.exports.projectAttributeTypePatch = async (req, res, next) => {
  try {
    const table = "ProjectAttributeType";
    const archiveTable = archiveTablesMap[table];
    const relations = [
      {
        localTable: "ProjectAttributeType",
        localField: "parentId",
        localForeignIdent: "parentUuid",
        foreignTable: "ProjectAttributeType",
        foreignField: "id",
        foreignIdent: "uuid",
      },
      {
        localTable: "ProjectAttributeType",
        localField: "projectId",
        localForeignIdent: "projectUuid",
        foreignTable: "Project",
        foreignField: "id",
        foreignIdent: "uuid",
      },
    ];
    const reqBodySchema = require("./schemas/project-attribute-type.PATCH.req.body.json");
    const resBodyKeys = [
      "projectUuid",
      "parentUuid",
      "enum",
      "name",
      "labelNumber",
      "defaultValue",
      "isRequired",
      "jsonSchema",
      "label",
      "placeholderText",
      "helpMarkdownText",
      "isMedia",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];
    const ident = "uuid";
    const joins = [
      {
        type: "left",
        target: "ProjectAttributeType",
        alias: "ProjectAttributeType_0",
        on: { id: "$ProjectAttributeType.parentId$" },
      },
      {
        type: "left",
        target: "Project",
        alias: "Project_1",
        on: { id: "$ProjectAttributeType.projectId$" },
      },
    ];
    const fields = [
      "*",
      { as: "parentUuid", expression: "ProjectAttributeType_0.uuid" },
      { as: "projectUuid", expression: "Project_1.uuid" },
    ];

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const current = await db.queryHead(sqlStringAndValues);

    if (!current) {
      return res.status(404).json({ errors: ["Record not found"] });
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? SET ?", [
        archiveTable,
        {
          ..._.omit(["parentUuid", "projectUuid"], current),
          modifier: req.headers["x-user-uuid"] || "stub",
        },
      ]);
    }

    if (Object.keys(req.body).length) {
      const body = prepareDateTimeStrings(
        reqBodySchema,
        await mapExposedIdentsToInternal(relations, req.body)
      );
      await db.query("UPDATE ?? SET ? WHERE ?? = ?", [
        table,
        body,
        ident,
        req.params[ident],
      ]);
    } else {
      // Nothing to update.
      const resBody = _.pick(resBodyKeys, current);
      return res.status(200).json(resBody);
    }
    const record = await db.queryHead(
      await getSQLString({
        table,
        fields,
        joins,
        $where: { [ident]: req.params["uuid"] },
      })
    );

    const resBody = _.pick(resBodyKeys, record);
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.projectAttributeTypePatchList = async (req, res, next) => {
  try {
    const table = "ProjectAttributeType";
    const relations = relationsMap[table];
    const archiveTable = archiveTablesMap[table];
    const reqBodySchema = require("./schemas/project-attribute-type.PATCH.list.req.body.json");
    const resBodyKeys = [
      "projectUuid",
      "parentUuid",
      "enum",
      "name",
      "labelNumber",
      "defaultValue",
      "isRequired",
      "jsonSchema",
      "label",
      "placeholderText",
      "helpMarkdownText",
      "isMedia",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];

    const $where = await prepareWhere(relations, req.query.$where);
    const selectParams = await getSQLString({
      table,
      $where,
    });

    const currents = await db.query(selectParams);
    if (!currents.length) {
      return res.status(200).json([]);
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? (??) VALUES ?", [
        archiveTable,
        [].concat(Object.keys(currents[0])).concat("modifier"),
        currents.map((c) =>
          Object.values(c).concat(req.headers["x-user-uuid"] || "stub")
        ),
      ]);
    }

    if (Object.keys(req.body).length) {
      const body = prepareDateTimeStrings(
        reqBodySchema,
        await mapExposedIdentsToInternal(relations, req.body)
      );

      let sql = "UPDATE ?? SET ?";
      let values = [table, body];

      if (selectParams.sql.includes(" where ")) {
        sql += " where " + selectParams.sql.split(" where ")[1];
        values = values.concat(selectParams.values);
      }

      await db.query(sql, values);
    } else {
      // Nothing to update.
      let resBody = (
        await Promise.all(
          currents.map((current) =>
            mapInternalIdentsToExposed(relations, current)
          )
        )
      ).map((x) => _.pick(resBodyKeys, x));
      return res.status(200).json(resBody);
    }
    const records = await db.query(selectParams);
    const resBody = (
      await Promise.all(
        records.map((record) => mapInternalIdentsToExposed(relations, record))
      )
    ).map((x) => _.pick(resBodyKeys, x));
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.projectAttributeTypeDelete = async (req, res, next) => {
  try {
    const table = "ProjectAttributeType";
    const archiveTable = archiveTablesMap[table];
    const resBodyKeys = [
      "projectUuid",
      "parentUuid",
      "enum",
      "name",
      "labelNumber",
      "defaultValue",
      "isRequired",
      "jsonSchema",
      "label",
      "placeholderText",
      "helpMarkdownText",
      "isMedia",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];
    const ident = "uuid";
    const joins = [
      {
        type: "left",
        target: "ProjectAttributeType",
        alias: "ProjectAttributeType_0",
        on: { id: "$ProjectAttributeType.parentId$" },
      },
      {
        type: "left",
        target: "Project",
        alias: "Project_1",
        on: { id: "$ProjectAttributeType.projectId$" },
      },
    ];
    const fields = [
      "*",
      { as: "parentUuid", expression: "ProjectAttributeType_0.uuid" },
      { as: "projectUuid", expression: "Project_1.uuid" },
    ];

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const current = await db.queryHead(sqlStringAndValues);

    if (!current) {
      return res.status(404).json({ errors: ["Record not found"] });
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? SET ?", [
        archiveTable,
        {
          ..._.omit(["parentUuid", "projectUuid"], current),
          modifier: req.headers["x-user-uuid"] || "stub",
          userDeleted: 1,
        },
      ]);
    }

    await db.query("DELETE FROM ?? WHERE ?? = ?", [
      table,
      ident,
      req.params[ident],
    ]);

    const resBody = _.pick(resBodyKeys, current);
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.projectAttributeTypeDeleteList = async (req, res, next) => {
  try {
    const table = "ProjectAttributeType";
    const archiveTable = archiveTablesMap[table];
    const relations = relationsMap[table];
    const resBodyKeys = [
      "projectUuid",
      "parentUuid",
      "enum",
      "name",
      "labelNumber",
      "defaultValue",
      "isRequired",
      "jsonSchema",
      "label",
      "placeholderText",
      "helpMarkdownText",
      "isMedia",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];

    const $where = await prepareWhere(relations, req.query.$where);
    const selectParams = await getSQLString({
      table,
      $where,
    });

    const currents = await db.query(selectParams);
    if (!currents.length) {
      return res.status(200).json([]);
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? (??) VALUES ?", [
        archiveTable,
        []
          .concat(Object.keys(currents[0]))
          .concat("modifier")
          .concat("userDeleted"),
        currents.map((c) =>
          Object.values(c)
            .concat(req.headers["x-user-uuid"] || "stub")
            .concat(1)
        ),
      ]);
    }

    let sql = "DELETE FROM ??";
    let values = [table];

    if (selectParams.sql.includes(" where ")) {
      sql += " where " + selectParams.sql.split(" where ")[1];
      values = values.concat(selectParams.values);
    }

    await db.query(sql, values);

    const resBody = (
      await Promise.all(
        currents.map((record) => mapInternalIdentsToExposed(relations, record))
      )
    ).map((x) => _.pick(resBodyKeys, x));
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.projectAttributeTypeValueGet = async (req, res, next) => {
  try {
    const table = "ProjectAttributeTypeValue";
    const ident = "uuid";
    const joins = [
      {
        type: "left",
        target: "ProjectAttributeType",
        alias: "ProjectAttributeType_0",
        on: { id: "$ProjectAttributeTypeValue.projectAttributeTypeId$" },
      },
      {
        type: "left",
        target: "Project",
        alias: "Project_1",
        on: { id: "$ProjectAttributeTypeValue.projectId$" },
      },
    ];
    const fields = [
      "enum",
      "name",
      "value",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
      {
        as: "projectAttributeTypeUuid",
        expression: "ProjectAttributeType_0.uuid",
      },
      { as: "projectUuid", expression: "Project_1.uuid" },
    ];
    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const record = await db.queryHead(sqlStringAndValues);
    if (!record) {
      return res.status(404).json({ errors: ["Record not found"] });
    }
    return res.status(200).json(record);
  } catch (e) {
    return next(e);
  }
};

module.exports.projectAttributeTypeValueGetList = async (req, res, next) => {
  try {
    const table = "ProjectAttributeTypeValue";
    const relations = [
      {
        localTable: "ProjectAttributeTypeValue",
        localField: "projectAttributeTypeId",
        localForeignIdent: "projectAttributeTypeUuid",
        foreignTable: "ProjectAttributeType",
        foreignField: "id",
        foreignIdent: "uuid",
      },
      {
        localTable: "ProjectAttributeTypeValue",
        localField: "projectId",
        localForeignIdent: "projectUuid",
        foreignTable: "Project",
        foreignField: "id",
        foreignIdent: "uuid",
      },
    ];

    const $where = await prepareWhere(relations, req.query.$where);
    const $orderBy = req.query.$orderBy
      ? Array.isArray(req.query.$orderBy)
        ? req.query.$orderBy.map((x) => mapExposedKeysToInternal(relations, x))
        : mapExposedKeysToInternal(relations, req.query.$orderBy)
      : undefined;

    // https://github.com/epoberezkin/ajv/issues/276
    if (req.query.$paginate && req.query.$paginate.page) {
      req.query.$paginate.pageSize = req.query.$paginate.pageSize || 20;
    }

    let rows, totalCount;

    const joins = [
      {
        type: "left",
        target: "ProjectAttributeType",
        alias: "ProjectAttributeType_0",
        on: { id: "$ProjectAttributeTypeValue.projectAttributeTypeId$" },
      },
      {
        type: "left",
        target: "Project",
        alias: "Project_1",
        on: { id: "$ProjectAttributeTypeValue.projectId$" },
      },
    ];
    const fields = [
      "id",
      "enum",
      "name",
      "value",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
      {
        as: "projectAttributeTypeUuid",
        expression: "ProjectAttributeType_0.uuid",
      },
      { as: "projectUuid", expression: "Project_1.uuid" },
    ];
    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where,
      $orderBy,
      $paginate: req.query.$paginate || undefined,
    });

    if (req.query.$paginate) {
      [rows, totalCount] = await Promise.all([
        db.query(sqlStringAndValues),
        db
          .queryHead(
            await getSQLString({
              table,
              fields: ["COUNT(*)"],
              $where,
              $orderBy,
            })
          )
          .then((d) => d["COUNT(*)"]),
      ]);
    } else {
      rows = await db.query(sqlStringAndValues);
    }

    if (req.query.$paginate) {
      if (typeof req.query.$paginate.limit === "number") {
        const hasMoreResults = rows.length === req.query.$paginate.limit + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }

        res.set("x-pagination-limit", req.query.$paginate.limit);
        res.set("x-pagination-offset", req.query.$paginate.offset);
        res.set(
          "x-pagination-has-previous-page",
          req.query.$paginate.offset > 0
        );
        res.set("x-pagination-has-next-page", !!hasMoreResults);
      } else if (typeof req.query.$paginate.page === "number") {
        const hasMoreResults = rows.length === req.query.$paginate.pageSize + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }

        res.set("x-pagination-page", req.query.$paginate.page);
        res.set("x-pagination-page-size", req.query.$paginate.pageSize);
        res.set("x-pagination-has-previous-page", req.query.$paginate.page > 1);
        res.set("x-pagination-has-next-page", !!hasMoreResults);
      } else {
        const flip =
          typeof req.query.$paginate.first === "number" ? false : true;
        const limit = flip
          ? req.query.$paginate.last
          : req.query.$paginate.first;

        const hasMoreResults = rows.length === limit + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }
        if (flip) {
          rows = rows.reverse();
        }

        const hasPreviousPage = flip ? hasMoreResults : false;
        const hasNextPage = flip ? false : hasMoreResults;
        const startCursor =
          rows[0] && rows[0].id ? encodeCursor(rows[0].id) : null;
        const endCursor =
          rows[rows.length - 1] && rows[rows.length - 1].id
            ? encodeCursor(rows[rows.length - 1].id)
            : null;

        res.set("x-pagination-has-previous-page", hasPreviousPage);
        res.set("x-pagination-has-next-page", hasNextPage);
        if (startCursor != null) {
          res.set("x-pagination-start-cursor", startCursor);
        }
        if (endCursor != null) {
          res.set("x-pagination-end-cursor", endCursor);
        }
      }
    }

    if (typeof totalCount === "number") {
      res.set("x-pagination-total-count", totalCount);
    }

    if (
      typeof totalCount === "number" &&
      req.query.$paginate &&
      req.query.$paginate.pageSize
    ) {
      res.set(
        "x-pagination-last-page",
        Math.ceil(totalCount / req.query.$paginate.pageSize)
      );
    }

    // https://jsperf.com/delete-vs-spread-vs-lodash-omit-vs-lodash-inverse-pick
    for (let row of rows) {
      row.id = undefined;
    }

    return res.status(200).json(rows);
  } catch (e) {
    return next(e);
  }
};

module.exports.projectAttributeTypeValuePost = async (req, res, next) => {
  try {
    const table = "ProjectAttributeTypeValue";
    const relations = [
      {
        localTable: "ProjectAttributeTypeValue",
        localField: "projectAttributeTypeId",
        localForeignIdent: "projectAttributeTypeUuid",
        foreignTable: "ProjectAttributeType",
        foreignField: "id",
        foreignIdent: "uuid",
      },
      {
        localTable: "ProjectAttributeTypeValue",
        localField: "projectId",
        localForeignIdent: "projectUuid",
        foreignTable: "Project",
        foreignField: "id",
        foreignIdent: "uuid",
      },
    ];
    const reqBodySchema = require("./schemas/project-attribute-type-value.POST.req.body.json");
    const ident = "uuid";
    const joins = [
      {
        type: "left",
        target: "ProjectAttributeType",
        alias: "ProjectAttributeType_0",
        on: { id: "$ProjectAttributeTypeValue.projectAttributeTypeId$" },
      },
      {
        type: "left",
        target: "Project",
        alias: "Project_1",
        on: { id: "$ProjectAttributeTypeValue.projectId$" },
      },
    ];
    const fields = [
      "enum",
      "name",
      "value",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
      {
        as: "projectAttributeTypeUuid",
        expression: "ProjectAttributeType_0.uuid",
      },
      { as: "projectUuid", expression: "Project_1.uuid" },
    ];

    const body = prepareDateTimeStrings(
      reqBodySchema,
      await mapExposedIdentsToInternal(relations, req.body)
    );

    const inserted = await db.query("INSERT INTO ?? SET ?? = UUID(), ?", [
      table,
      ident,
      body,
    ]);
    const id = inserted.insertId;

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { id },
    });
    const record = await db.queryHead(sqlStringAndValues);

    return res.status(200).json(record);
  } catch (e) {
    return next(e);
  }
};

module.exports.projectAttributeTypeValuePatch = async (req, res, next) => {
  try {
    const table = "ProjectAttributeTypeValue";
    const archiveTable = archiveTablesMap[table];
    const relations = [
      {
        localTable: "ProjectAttributeTypeValue",
        localField: "projectAttributeTypeId",
        localForeignIdent: "projectAttributeTypeUuid",
        foreignTable: "ProjectAttributeType",
        foreignField: "id",
        foreignIdent: "uuid",
      },
      {
        localTable: "ProjectAttributeTypeValue",
        localField: "projectId",
        localForeignIdent: "projectUuid",
        foreignTable: "Project",
        foreignField: "id",
        foreignIdent: "uuid",
      },
    ];
    const reqBodySchema = require("./schemas/project-attribute-type-value.PATCH.req.body.json");
    const resBodyKeys = [
      "projectUuid",
      "projectAttributeTypeUuid",
      "enum",
      "name",
      "value",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];
    const ident = "uuid";
    const joins = [
      {
        type: "left",
        target: "ProjectAttributeType",
        alias: "ProjectAttributeType_0",
        on: { id: "$ProjectAttributeTypeValue.projectAttributeTypeId$" },
      },
      {
        type: "left",
        target: "Project",
        alias: "Project_1",
        on: { id: "$ProjectAttributeTypeValue.projectId$" },
      },
    ];
    const fields = [
      "*",
      {
        as: "projectAttributeTypeUuid",
        expression: "ProjectAttributeType_0.uuid",
      },
      { as: "projectUuid", expression: "Project_1.uuid" },
    ];

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const current = await db.queryHead(sqlStringAndValues);

    if (!current) {
      return res.status(404).json({ errors: ["Record not found"] });
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? SET ?", [
        archiveTable,
        {
          ..._.omit(["projectAttributeTypeUuid", "projectUuid"], current),
          modifier: req.headers["x-user-uuid"] || "stub",
        },
      ]);
    }

    if (Object.keys(req.body).length) {
      const body = prepareDateTimeStrings(
        reqBodySchema,
        await mapExposedIdentsToInternal(relations, req.body)
      );
      await db.query("UPDATE ?? SET ? WHERE ?? = ?", [
        table,
        body,
        ident,
        req.params[ident],
      ]);
    } else {
      // Nothing to update.
      const resBody = _.pick(resBodyKeys, current);
      return res.status(200).json(resBody);
    }
    const record = await db.queryHead(
      await getSQLString({
        table,
        fields,
        joins,
        $where: { [ident]: req.params["uuid"] },
      })
    );

    const resBody = _.pick(resBodyKeys, record);
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.projectAttributeTypeValuePatchList = async (req, res, next) => {
  try {
    const table = "ProjectAttributeTypeValue";
    const relations = relationsMap[table];
    const archiveTable = archiveTablesMap[table];
    const reqBodySchema = require("./schemas/project-attribute-type-value.PATCH.list.req.body.json");
    const resBodyKeys = [
      "projectUuid",
      "projectAttributeTypeUuid",
      "enum",
      "name",
      "value",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];

    const $where = await prepareWhere(relations, req.query.$where);
    const selectParams = await getSQLString({
      table,
      $where,
    });

    const currents = await db.query(selectParams);
    if (!currents.length) {
      return res.status(200).json([]);
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? (??) VALUES ?", [
        archiveTable,
        [].concat(Object.keys(currents[0])).concat("modifier"),
        currents.map((c) =>
          Object.values(c).concat(req.headers["x-user-uuid"] || "stub")
        ),
      ]);
    }

    if (Object.keys(req.body).length) {
      const body = prepareDateTimeStrings(
        reqBodySchema,
        await mapExposedIdentsToInternal(relations, req.body)
      );

      let sql = "UPDATE ?? SET ?";
      let values = [table, body];

      if (selectParams.sql.includes(" where ")) {
        sql += " where " + selectParams.sql.split(" where ")[1];
        values = values.concat(selectParams.values);
      }

      await db.query(sql, values);
    } else {
      // Nothing to update.
      let resBody = (
        await Promise.all(
          currents.map((current) =>
            mapInternalIdentsToExposed(relations, current)
          )
        )
      ).map((x) => _.pick(resBodyKeys, x));
      return res.status(200).json(resBody);
    }
    const records = await db.query(selectParams);
    const resBody = (
      await Promise.all(
        records.map((record) => mapInternalIdentsToExposed(relations, record))
      )
    ).map((x) => _.pick(resBodyKeys, x));
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.projectAttributeTypeValueDelete = async (req, res, next) => {
  try {
    const table = "ProjectAttributeTypeValue";
    const archiveTable = archiveTablesMap[table];
    const resBodyKeys = [
      "projectUuid",
      "projectAttributeTypeUuid",
      "enum",
      "name",
      "value",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];
    const ident = "uuid";
    const joins = [
      {
        type: "left",
        target: "ProjectAttributeType",
        alias: "ProjectAttributeType_0",
        on: { id: "$ProjectAttributeTypeValue.projectAttributeTypeId$" },
      },
      {
        type: "left",
        target: "Project",
        alias: "Project_1",
        on: { id: "$ProjectAttributeTypeValue.projectId$" },
      },
    ];
    const fields = [
      "*",
      {
        as: "projectAttributeTypeUuid",
        expression: "ProjectAttributeType_0.uuid",
      },
      { as: "projectUuid", expression: "Project_1.uuid" },
    ];

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const current = await db.queryHead(sqlStringAndValues);

    if (!current) {
      return res.status(404).json({ errors: ["Record not found"] });
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? SET ?", [
        archiveTable,
        {
          ..._.omit(["projectAttributeTypeUuid", "projectUuid"], current),
          modifier: req.headers["x-user-uuid"] || "stub",
          userDeleted: 1,
        },
      ]);
    }

    await db.query("DELETE FROM ?? WHERE ?? = ?", [
      table,
      ident,
      req.params[ident],
    ]);

    const resBody = _.pick(resBodyKeys, current);
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.projectAttributeTypeValueDeleteList = async (req, res, next) => {
  try {
    const table = "ProjectAttributeTypeValue";
    const archiveTable = archiveTablesMap[table];
    const relations = relationsMap[table];
    const resBodyKeys = [
      "projectUuid",
      "projectAttributeTypeUuid",
      "enum",
      "name",
      "value",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];

    const $where = await prepareWhere(relations, req.query.$where);
    const selectParams = await getSQLString({
      table,
      $where,
    });

    const currents = await db.query(selectParams);
    if (!currents.length) {
      return res.status(200).json([]);
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? (??) VALUES ?", [
        archiveTable,
        []
          .concat(Object.keys(currents[0]))
          .concat("modifier")
          .concat("userDeleted"),
        currents.map((c) =>
          Object.values(c)
            .concat(req.headers["x-user-uuid"] || "stub")
            .concat(1)
        ),
      ]);
    }

    let sql = "DELETE FROM ??";
    let values = [table];

    if (selectParams.sql.includes(" where ")) {
      sql += " where " + selectParams.sql.split(" where ")[1];
      values = values.concat(selectParams.values);
    }

    await db.query(sql, values);

    const resBody = (
      await Promise.all(
        currents.map((record) => mapInternalIdentsToExposed(relations, record))
      )
    ).map((x) => _.pick(resBodyKeys, x));
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.riskGet = async (req, res, next) => {
  try {
    const table = "Risk";
    const ident = "uuid";
    const joins = [
      {
        type: "left",
        target: "Risk",
        alias: "Risk_0",
        on: { id: "$Risk.projectId$" },
      },
      {
        type: "left",
        target: "RiskCategory",
        alias: "RiskCategory_1",
        on: { id: "$Risk.riskCategoryId$" },
      },
      {
        type: "left",
        target: "RiskType",
        alias: "RiskType_2",
        on: { id: "$Risk.riskTypeId$" },
      },
    ];
    const fields = [
      "riskTypeEnum",
      "riskCategoryEnum",
      "name",
      "sectionNumber",
      "referenceUrl",
      "location",
      "persons",
      "activity",
      "photoUrl",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
      { as: "projectUuid", expression: "Risk_0.uuid" },
      { as: "riskCategoryUuid", expression: "RiskCategory_1.uuid" },
      { as: "riskTypeUuid", expression: "RiskType_2.uuid" },
    ];
    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const record = await db.queryHead(sqlStringAndValues);
    if (!record) {
      return res.status(404).json({ errors: ["Record not found"] });
    }
    return res.status(200).json(record);
  } catch (e) {
    return next(e);
  }
};

module.exports.riskGetList = async (req, res, next) => {
  try {
    const table = "Risk";
    const relations = [
      {
        localTable: "Risk",
        localField: "projectId",
        localForeignIdent: "projectUuid",
        foreignTable: "Risk",
        foreignField: "id",
        foreignIdent: "uuid",
      },
      {
        localTable: "Risk",
        localField: "riskCategoryId",
        localForeignIdent: "riskCategoryUuid",
        foreignTable: "RiskCategory",
        foreignField: "id",
        foreignIdent: "uuid",
      },
      {
        localTable: "Risk",
        localField: "riskTypeId",
        localForeignIdent: "riskTypeUuid",
        foreignTable: "RiskType",
        foreignField: "id",
        foreignIdent: "uuid",
      },
    ];

    const $where = await prepareWhere(relations, req.query.$where);
    const $orderBy = req.query.$orderBy
      ? Array.isArray(req.query.$orderBy)
        ? req.query.$orderBy.map((x) => mapExposedKeysToInternal(relations, x))
        : mapExposedKeysToInternal(relations, req.query.$orderBy)
      : undefined;

    // https://github.com/epoberezkin/ajv/issues/276
    if (req.query.$paginate && req.query.$paginate.page) {
      req.query.$paginate.pageSize = req.query.$paginate.pageSize || 20;
    }

    let rows, totalCount;

    const joins = [
      {
        type: "left",
        target: "Risk",
        alias: "Risk_0",
        on: { id: "$Risk.projectId$" },
      },
      {
        type: "left",
        target: "RiskCategory",
        alias: "RiskCategory_1",
        on: { id: "$Risk.riskCategoryId$" },
      },
      {
        type: "left",
        target: "RiskType",
        alias: "RiskType_2",
        on: { id: "$Risk.riskTypeId$" },
      },
    ];
    const fields = [
      "id",
      "riskTypeEnum",
      "riskCategoryEnum",
      "name",
      "sectionNumber",
      "referenceUrl",
      "location",
      "persons",
      "activity",
      "photoUrl",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
      { as: "projectUuid", expression: "Risk_0.uuid" },
      { as: "riskCategoryUuid", expression: "RiskCategory_1.uuid" },
      { as: "riskTypeUuid", expression: "RiskType_2.uuid" },
    ];
    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where,
      $orderBy,
      $paginate: req.query.$paginate || undefined,
    });

    if (req.query.$paginate) {
      [rows, totalCount] = await Promise.all([
        db.query(sqlStringAndValues),
        db
          .queryHead(
            await getSQLString({
              table,
              fields: ["COUNT(*)"],
              $where,
              $orderBy,
            })
          )
          .then((d) => d["COUNT(*)"]),
      ]);
    } else {
      rows = await db.query(sqlStringAndValues);
    }

    if (req.query.$paginate) {
      if (typeof req.query.$paginate.limit === "number") {
        const hasMoreResults = rows.length === req.query.$paginate.limit + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }

        res.set("x-pagination-limit", req.query.$paginate.limit);
        res.set("x-pagination-offset", req.query.$paginate.offset);
        res.set(
          "x-pagination-has-previous-page",
          req.query.$paginate.offset > 0
        );
        res.set("x-pagination-has-next-page", !!hasMoreResults);
      } else if (typeof req.query.$paginate.page === "number") {
        const hasMoreResults = rows.length === req.query.$paginate.pageSize + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }

        res.set("x-pagination-page", req.query.$paginate.page);
        res.set("x-pagination-page-size", req.query.$paginate.pageSize);
        res.set("x-pagination-has-previous-page", req.query.$paginate.page > 1);
        res.set("x-pagination-has-next-page", !!hasMoreResults);
      } else {
        const flip =
          typeof req.query.$paginate.first === "number" ? false : true;
        const limit = flip
          ? req.query.$paginate.last
          : req.query.$paginate.first;

        const hasMoreResults = rows.length === limit + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }
        if (flip) {
          rows = rows.reverse();
        }

        const hasPreviousPage = flip ? hasMoreResults : false;
        const hasNextPage = flip ? false : hasMoreResults;
        const startCursor =
          rows[0] && rows[0].id ? encodeCursor(rows[0].id) : null;
        const endCursor =
          rows[rows.length - 1] && rows[rows.length - 1].id
            ? encodeCursor(rows[rows.length - 1].id)
            : null;

        res.set("x-pagination-has-previous-page", hasPreviousPage);
        res.set("x-pagination-has-next-page", hasNextPage);
        if (startCursor != null) {
          res.set("x-pagination-start-cursor", startCursor);
        }
        if (endCursor != null) {
          res.set("x-pagination-end-cursor", endCursor);
        }
      }
    }

    if (typeof totalCount === "number") {
      res.set("x-pagination-total-count", totalCount);
    }

    if (
      typeof totalCount === "number" &&
      req.query.$paginate &&
      req.query.$paginate.pageSize
    ) {
      res.set(
        "x-pagination-last-page",
        Math.ceil(totalCount / req.query.$paginate.pageSize)
      );
    }

    // https://jsperf.com/delete-vs-spread-vs-lodash-omit-vs-lodash-inverse-pick
    for (let row of rows) {
      row.id = undefined;
    }

    return res.status(200).json(rows);
  } catch (e) {
    return next(e);
  }
};

module.exports.riskPost = async (req, res, next) => {
  try {
    const table = "Risk";
    const relations = [
      {
        localTable: "Risk",
        localField: "projectId",
        localForeignIdent: "projectUuid",
        foreignTable: "Risk",
        foreignField: "id",
        foreignIdent: "uuid",
      },
      {
        localTable: "Risk",
        localField: "riskCategoryId",
        localForeignIdent: "riskCategoryUuid",
        foreignTable: "RiskCategory",
        foreignField: "id",
        foreignIdent: "uuid",
      },
      {
        localTable: "Risk",
        localField: "riskTypeId",
        localForeignIdent: "riskTypeUuid",
        foreignTable: "RiskType",
        foreignField: "id",
        foreignIdent: "uuid",
      },
    ];
    const reqBodySchema = require("./schemas/risk.POST.req.body.json");
    const ident = "uuid";
    const joins = [
      {
        type: "left",
        target: "Risk",
        alias: "Risk_0",
        on: { id: "$Risk.projectId$" },
      },
      {
        type: "left",
        target: "RiskCategory",
        alias: "RiskCategory_1",
        on: { id: "$Risk.riskCategoryId$" },
      },
      {
        type: "left",
        target: "RiskType",
        alias: "RiskType_2",
        on: { id: "$Risk.riskTypeId$" },
      },
    ];
    const fields = [
      "riskTypeEnum",
      "riskCategoryEnum",
      "name",
      "sectionNumber",
      "referenceUrl",
      "location",
      "persons",
      "activity",
      "photoUrl",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
      { as: "projectUuid", expression: "Risk_0.uuid" },
      { as: "riskCategoryUuid", expression: "RiskCategory_1.uuid" },
      { as: "riskTypeUuid", expression: "RiskType_2.uuid" },
    ];

    const body = prepareDateTimeStrings(
      reqBodySchema,
      await mapExposedIdentsToInternal(relations, req.body)
    );

    const inserted = await db.query("INSERT INTO ?? SET ?? = UUID(), ?", [
      table,
      ident,
      body,
    ]);
    const id = inserted.insertId;

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { id },
    });
    const record = await db.queryHead(sqlStringAndValues);

    return res.status(200).json(record);
  } catch (e) {
    return next(e);
  }
};

module.exports.riskPatch = async (req, res, next) => {
  try {
    const table = "Risk";
    const archiveTable = archiveTablesMap[table];
    const relations = [
      {
        localTable: "Risk",
        localField: "projectId",
        localForeignIdent: "projectUuid",
        foreignTable: "Risk",
        foreignField: "id",
        foreignIdent: "uuid",
      },
      {
        localTable: "Risk",
        localField: "riskCategoryId",
        localForeignIdent: "riskCategoryUuid",
        foreignTable: "RiskCategory",
        foreignField: "id",
        foreignIdent: "uuid",
      },
      {
        localTable: "Risk",
        localField: "riskTypeId",
        localForeignIdent: "riskTypeUuid",
        foreignTable: "RiskType",
        foreignField: "id",
        foreignIdent: "uuid",
      },
    ];
    const reqBodySchema = require("./schemas/risk.PATCH.req.body.json");
    const resBodyKeys = [
      "projectUuid",
      "riskTypeUuid",
      "riskTypeEnum",
      "riskCategoryUuid",
      "riskCategoryEnum",
      "name",
      "sectionNumber",
      "referenceUrl",
      "location",
      "persons",
      "activity",
      "photoUrl",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];
    const ident = "uuid";
    const joins = [
      {
        type: "left",
        target: "Risk",
        alias: "Risk_0",
        on: { id: "$Risk.projectId$" },
      },
      {
        type: "left",
        target: "RiskCategory",
        alias: "RiskCategory_1",
        on: { id: "$Risk.riskCategoryId$" },
      },
      {
        type: "left",
        target: "RiskType",
        alias: "RiskType_2",
        on: { id: "$Risk.riskTypeId$" },
      },
    ];
    const fields = [
      "*",
      { as: "projectUuid", expression: "Risk_0.uuid" },
      { as: "riskCategoryUuid", expression: "RiskCategory_1.uuid" },
      { as: "riskTypeUuid", expression: "RiskType_2.uuid" },
    ];

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const current = await db.queryHead(sqlStringAndValues);

    if (!current) {
      return res.status(404).json({ errors: ["Record not found"] });
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? SET ?", [
        archiveTable,
        {
          ..._.omit(
            ["projectUuid", "riskCategoryUuid", "riskTypeUuid"],
            current
          ),
          modifier: req.headers["x-user-uuid"] || "stub",
        },
      ]);
    }

    if (Object.keys(req.body).length) {
      const body = prepareDateTimeStrings(
        reqBodySchema,
        await mapExposedIdentsToInternal(relations, req.body)
      );
      await db.query("UPDATE ?? SET ? WHERE ?? = ?", [
        table,
        body,
        ident,
        req.params[ident],
      ]);
    } else {
      // Nothing to update.
      const resBody = _.pick(resBodyKeys, current);
      return res.status(200).json(resBody);
    }
    const record = await db.queryHead(
      await getSQLString({
        table,
        fields,
        joins,
        $where: { [ident]: req.params["uuid"] },
      })
    );

    const resBody = _.pick(resBodyKeys, record);
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.riskPatchList = async (req, res, next) => {
  try {
    const table = "Risk";
    const relations = relationsMap[table];
    const archiveTable = archiveTablesMap[table];
    const reqBodySchema = require("./schemas/risk.PATCH.list.req.body.json");
    const resBodyKeys = [
      "projectUuid",
      "riskTypeUuid",
      "riskTypeEnum",
      "riskCategoryUuid",
      "riskCategoryEnum",
      "name",
      "sectionNumber",
      "referenceUrl",
      "location",
      "persons",
      "activity",
      "photoUrl",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];

    const $where = await prepareWhere(relations, req.query.$where);
    const selectParams = await getSQLString({
      table,
      $where,
    });

    const currents = await db.query(selectParams);
    if (!currents.length) {
      return res.status(200).json([]);
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? (??) VALUES ?", [
        archiveTable,
        [].concat(Object.keys(currents[0])).concat("modifier"),
        currents.map((c) =>
          Object.values(c).concat(req.headers["x-user-uuid"] || "stub")
        ),
      ]);
    }

    if (Object.keys(req.body).length) {
      const body = prepareDateTimeStrings(
        reqBodySchema,
        await mapExposedIdentsToInternal(relations, req.body)
      );

      let sql = "UPDATE ?? SET ?";
      let values = [table, body];

      if (selectParams.sql.includes(" where ")) {
        sql += " where " + selectParams.sql.split(" where ")[1];
        values = values.concat(selectParams.values);
      }

      await db.query(sql, values);
    } else {
      // Nothing to update.
      let resBody = (
        await Promise.all(
          currents.map((current) =>
            mapInternalIdentsToExposed(relations, current)
          )
        )
      ).map((x) => _.pick(resBodyKeys, x));
      return res.status(200).json(resBody);
    }
    const records = await db.query(selectParams);
    const resBody = (
      await Promise.all(
        records.map((record) => mapInternalIdentsToExposed(relations, record))
      )
    ).map((x) => _.pick(resBodyKeys, x));
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.riskDelete = async (req, res, next) => {
  try {
    const table = "Risk";
    const archiveTable = archiveTablesMap[table];
    const resBodyKeys = [
      "projectUuid",
      "riskTypeUuid",
      "riskTypeEnum",
      "riskCategoryUuid",
      "riskCategoryEnum",
      "name",
      "sectionNumber",
      "referenceUrl",
      "location",
      "persons",
      "activity",
      "photoUrl",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];
    const ident = "uuid";
    const joins = [
      {
        type: "left",
        target: "Risk",
        alias: "Risk_0",
        on: { id: "$Risk.projectId$" },
      },
      {
        type: "left",
        target: "RiskCategory",
        alias: "RiskCategory_1",
        on: { id: "$Risk.riskCategoryId$" },
      },
      {
        type: "left",
        target: "RiskType",
        alias: "RiskType_2",
        on: { id: "$Risk.riskTypeId$" },
      },
    ];
    const fields = [
      "*",
      { as: "projectUuid", expression: "Risk_0.uuid" },
      { as: "riskCategoryUuid", expression: "RiskCategory_1.uuid" },
      { as: "riskTypeUuid", expression: "RiskType_2.uuid" },
    ];

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const current = await db.queryHead(sqlStringAndValues);

    if (!current) {
      return res.status(404).json({ errors: ["Record not found"] });
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? SET ?", [
        archiveTable,
        {
          ..._.omit(
            ["projectUuid", "riskCategoryUuid", "riskTypeUuid"],
            current
          ),
          modifier: req.headers["x-user-uuid"] || "stub",
          userDeleted: 1,
        },
      ]);
    }

    await db.query("DELETE FROM ?? WHERE ?? = ?", [
      table,
      ident,
      req.params[ident],
    ]);

    const resBody = _.pick(resBodyKeys, current);
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.riskDeleteList = async (req, res, next) => {
  try {
    const table = "Risk";
    const archiveTable = archiveTablesMap[table];
    const relations = relationsMap[table];
    const resBodyKeys = [
      "projectUuid",
      "riskTypeUuid",
      "riskTypeEnum",
      "riskCategoryUuid",
      "riskCategoryEnum",
      "name",
      "sectionNumber",
      "referenceUrl",
      "location",
      "persons",
      "activity",
      "photoUrl",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];

    const $where = await prepareWhere(relations, req.query.$where);
    const selectParams = await getSQLString({
      table,
      $where,
    });

    const currents = await db.query(selectParams);
    if (!currents.length) {
      return res.status(200).json([]);
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? (??) VALUES ?", [
        archiveTable,
        []
          .concat(Object.keys(currents[0]))
          .concat("modifier")
          .concat("userDeleted"),
        currents.map((c) =>
          Object.values(c)
            .concat(req.headers["x-user-uuid"] || "stub")
            .concat(1)
        ),
      ]);
    }

    let sql = "DELETE FROM ??";
    let values = [table];

    if (selectParams.sql.includes(" where ")) {
      sql += " where " + selectParams.sql.split(" where ")[1];
      values = values.concat(selectParams.values);
    }

    await db.query(sql, values);

    const resBody = (
      await Promise.all(
        currents.map((record) => mapInternalIdentsToExposed(relations, record))
      )
    ).map((x) => _.pick(resBodyKeys, x));
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.riskAttributeGet = async (req, res, next) => {
  try {
    const table = "RiskAttribute";
    const ident = "uuid";
    const joins = [
      {
        type: "left",
        target: "RiskAttributeType",
        alias: "RiskAttributeType_0",
        on: { id: "$RiskAttribute.riskAttributeTypeId$" },
      },
      {
        type: "left",
        target: "Risk",
        alias: "Risk_1",
        on: { id: "$RiskAttribute.riskId$" },
      },
    ];
    const fields = [
      "name",
      "value",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
      { as: "riskAttributeTypeUuid", expression: "RiskAttributeType_0.uuid" },
      { as: "riskUuid", expression: "Risk_1.uuid" },
    ];
    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const record = await db.queryHead(sqlStringAndValues);
    if (!record) {
      return res.status(404).json({ errors: ["Record not found"] });
    }
    return res.status(200).json(record);
  } catch (e) {
    return next(e);
  }
};

module.exports.riskAttributeGetList = async (req, res, next) => {
  try {
    const table = "RiskAttribute";
    const relations = [
      {
        localTable: "RiskAttribute",
        localField: "riskAttributeTypeId",
        localForeignIdent: "riskAttributeTypeUuid",
        foreignTable: "RiskAttributeType",
        foreignField: "id",
        foreignIdent: "uuid",
      },
      {
        localTable: "RiskAttribute",
        localField: "riskId",
        localForeignIdent: "riskUuid",
        foreignTable: "Risk",
        foreignField: "id",
        foreignIdent: "uuid",
      },
    ];

    const $where = await prepareWhere(relations, req.query.$where);
    const $orderBy = req.query.$orderBy
      ? Array.isArray(req.query.$orderBy)
        ? req.query.$orderBy.map((x) => mapExposedKeysToInternal(relations, x))
        : mapExposedKeysToInternal(relations, req.query.$orderBy)
      : undefined;

    // https://github.com/epoberezkin/ajv/issues/276
    if (req.query.$paginate && req.query.$paginate.page) {
      req.query.$paginate.pageSize = req.query.$paginate.pageSize || 20;
    }

    let rows, totalCount;

    const joins = [
      {
        type: "left",
        target: "RiskAttributeType",
        alias: "RiskAttributeType_0",
        on: { id: "$RiskAttribute.riskAttributeTypeId$" },
      },
      {
        type: "left",
        target: "Risk",
        alias: "Risk_1",
        on: { id: "$RiskAttribute.riskId$" },
      },
    ];
    const fields = [
      "id",
      "name",
      "value",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
      { as: "riskAttributeTypeUuid", expression: "RiskAttributeType_0.uuid" },
      { as: "riskUuid", expression: "Risk_1.uuid" },
    ];
    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where,
      $orderBy,
      $paginate: req.query.$paginate || undefined,
    });

    if (req.query.$paginate) {
      [rows, totalCount] = await Promise.all([
        db.query(sqlStringAndValues),
        db
          .queryHead(
            await getSQLString({
              table,
              fields: ["COUNT(*)"],
              $where,
              $orderBy,
            })
          )
          .then((d) => d["COUNT(*)"]),
      ]);
    } else {
      rows = await db.query(sqlStringAndValues);
    }

    if (req.query.$paginate) {
      if (typeof req.query.$paginate.limit === "number") {
        const hasMoreResults = rows.length === req.query.$paginate.limit + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }

        res.set("x-pagination-limit", req.query.$paginate.limit);
        res.set("x-pagination-offset", req.query.$paginate.offset);
        res.set(
          "x-pagination-has-previous-page",
          req.query.$paginate.offset > 0
        );
        res.set("x-pagination-has-next-page", !!hasMoreResults);
      } else if (typeof req.query.$paginate.page === "number") {
        const hasMoreResults = rows.length === req.query.$paginate.pageSize + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }

        res.set("x-pagination-page", req.query.$paginate.page);
        res.set("x-pagination-page-size", req.query.$paginate.pageSize);
        res.set("x-pagination-has-previous-page", req.query.$paginate.page > 1);
        res.set("x-pagination-has-next-page", !!hasMoreResults);
      } else {
        const flip =
          typeof req.query.$paginate.first === "number" ? false : true;
        const limit = flip
          ? req.query.$paginate.last
          : req.query.$paginate.first;

        const hasMoreResults = rows.length === limit + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }
        if (flip) {
          rows = rows.reverse();
        }

        const hasPreviousPage = flip ? hasMoreResults : false;
        const hasNextPage = flip ? false : hasMoreResults;
        const startCursor =
          rows[0] && rows[0].id ? encodeCursor(rows[0].id) : null;
        const endCursor =
          rows[rows.length - 1] && rows[rows.length - 1].id
            ? encodeCursor(rows[rows.length - 1].id)
            : null;

        res.set("x-pagination-has-previous-page", hasPreviousPage);
        res.set("x-pagination-has-next-page", hasNextPage);
        if (startCursor != null) {
          res.set("x-pagination-start-cursor", startCursor);
        }
        if (endCursor != null) {
          res.set("x-pagination-end-cursor", endCursor);
        }
      }
    }

    if (typeof totalCount === "number") {
      res.set("x-pagination-total-count", totalCount);
    }

    if (
      typeof totalCount === "number" &&
      req.query.$paginate &&
      req.query.$paginate.pageSize
    ) {
      res.set(
        "x-pagination-last-page",
        Math.ceil(totalCount / req.query.$paginate.pageSize)
      );
    }

    // https://jsperf.com/delete-vs-spread-vs-lodash-omit-vs-lodash-inverse-pick
    for (let row of rows) {
      row.id = undefined;
    }

    return res.status(200).json(rows);
  } catch (e) {
    return next(e);
  }
};

module.exports.riskAttributePost = async (req, res, next) => {
  try {
    const table = "RiskAttribute";
    const relations = [
      {
        localTable: "RiskAttribute",
        localField: "riskAttributeTypeId",
        localForeignIdent: "riskAttributeTypeUuid",
        foreignTable: "RiskAttributeType",
        foreignField: "id",
        foreignIdent: "uuid",
      },
      {
        localTable: "RiskAttribute",
        localField: "riskId",
        localForeignIdent: "riskUuid",
        foreignTable: "Risk",
        foreignField: "id",
        foreignIdent: "uuid",
      },
    ];
    const reqBodySchema = require("./schemas/risk-attribute.POST.req.body.json");
    const ident = "uuid";
    const joins = [
      {
        type: "left",
        target: "RiskAttributeType",
        alias: "RiskAttributeType_0",
        on: { id: "$RiskAttribute.riskAttributeTypeId$" },
      },
      {
        type: "left",
        target: "Risk",
        alias: "Risk_1",
        on: { id: "$RiskAttribute.riskId$" },
      },
    ];
    const fields = [
      "name",
      "value",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
      { as: "riskAttributeTypeUuid", expression: "RiskAttributeType_0.uuid" },
      { as: "riskUuid", expression: "Risk_1.uuid" },
    ];

    const body = prepareDateTimeStrings(
      reqBodySchema,
      await mapExposedIdentsToInternal(relations, req.body)
    );

    const inserted = await db.query("INSERT INTO ?? SET ?? = UUID(), ?", [
      table,
      ident,
      body,
    ]);
    const id = inserted.insertId;

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { id },
    });
    const record = await db.queryHead(sqlStringAndValues);

    return res.status(200).json(record);
  } catch (e) {
    return next(e);
  }
};

module.exports.riskAttributePatch = async (req, res, next) => {
  try {
    const table = "RiskAttribute";
    const archiveTable = archiveTablesMap[table];
    const relations = [
      {
        localTable: "RiskAttribute",
        localField: "riskAttributeTypeId",
        localForeignIdent: "riskAttributeTypeUuid",
        foreignTable: "RiskAttributeType",
        foreignField: "id",
        foreignIdent: "uuid",
      },
      {
        localTable: "RiskAttribute",
        localField: "riskId",
        localForeignIdent: "riskUuid",
        foreignTable: "Risk",
        foreignField: "id",
        foreignIdent: "uuid",
      },
    ];
    const reqBodySchema = require("./schemas/risk-attribute.PATCH.req.body.json");
    const resBodyKeys = [
      "riskUuid",
      "riskAttributeTypeUuid",
      "name",
      "value",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];
    const ident = "uuid";
    const joins = [
      {
        type: "left",
        target: "RiskAttributeType",
        alias: "RiskAttributeType_0",
        on: { id: "$RiskAttribute.riskAttributeTypeId$" },
      },
      {
        type: "left",
        target: "Risk",
        alias: "Risk_1",
        on: { id: "$RiskAttribute.riskId$" },
      },
    ];
    const fields = [
      "*",
      { as: "riskAttributeTypeUuid", expression: "RiskAttributeType_0.uuid" },
      { as: "riskUuid", expression: "Risk_1.uuid" },
    ];

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const current = await db.queryHead(sqlStringAndValues);

    if (!current) {
      return res.status(404).json({ errors: ["Record not found"] });
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? SET ?", [
        archiveTable,
        {
          ..._.omit(["riskAttributeTypeUuid", "riskUuid"], current),
          modifier: req.headers["x-user-uuid"] || "stub",
        },
      ]);
    }

    if (Object.keys(req.body).length) {
      const body = prepareDateTimeStrings(
        reqBodySchema,
        await mapExposedIdentsToInternal(relations, req.body)
      );
      await db.query("UPDATE ?? SET ? WHERE ?? = ?", [
        table,
        body,
        ident,
        req.params[ident],
      ]);
    } else {
      // Nothing to update.
      const resBody = _.pick(resBodyKeys, current);
      return res.status(200).json(resBody);
    }
    const record = await db.queryHead(
      await getSQLString({
        table,
        fields,
        joins,
        $where: { [ident]: req.params["uuid"] },
      })
    );

    const resBody = _.pick(resBodyKeys, record);
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.riskAttributePatchList = async (req, res, next) => {
  try {
    const table = "RiskAttribute";
    const relations = relationsMap[table];
    const archiveTable = archiveTablesMap[table];
    const reqBodySchema = require("./schemas/risk-attribute.PATCH.list.req.body.json");
    const resBodyKeys = [
      "riskUuid",
      "riskAttributeTypeUuid",
      "name",
      "value",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];

    const $where = await prepareWhere(relations, req.query.$where);
    const selectParams = await getSQLString({
      table,
      $where,
    });

    const currents = await db.query(selectParams);
    if (!currents.length) {
      return res.status(200).json([]);
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? (??) VALUES ?", [
        archiveTable,
        [].concat(Object.keys(currents[0])).concat("modifier"),
        currents.map((c) =>
          Object.values(c).concat(req.headers["x-user-uuid"] || "stub")
        ),
      ]);
    }

    if (Object.keys(req.body).length) {
      const body = prepareDateTimeStrings(
        reqBodySchema,
        await mapExposedIdentsToInternal(relations, req.body)
      );

      let sql = "UPDATE ?? SET ?";
      let values = [table, body];

      if (selectParams.sql.includes(" where ")) {
        sql += " where " + selectParams.sql.split(" where ")[1];
        values = values.concat(selectParams.values);
      }

      await db.query(sql, values);
    } else {
      // Nothing to update.
      let resBody = (
        await Promise.all(
          currents.map((current) =>
            mapInternalIdentsToExposed(relations, current)
          )
        )
      ).map((x) => _.pick(resBodyKeys, x));
      return res.status(200).json(resBody);
    }
    const records = await db.query(selectParams);
    const resBody = (
      await Promise.all(
        records.map((record) => mapInternalIdentsToExposed(relations, record))
      )
    ).map((x) => _.pick(resBodyKeys, x));
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.riskAttributeDelete = async (req, res, next) => {
  try {
    const table = "RiskAttribute";
    const archiveTable = archiveTablesMap[table];
    const resBodyKeys = [
      "riskUuid",
      "riskAttributeTypeUuid",
      "name",
      "value",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];
    const ident = "uuid";
    const joins = [
      {
        type: "left",
        target: "RiskAttributeType",
        alias: "RiskAttributeType_0",
        on: { id: "$RiskAttribute.riskAttributeTypeId$" },
      },
      {
        type: "left",
        target: "Risk",
        alias: "Risk_1",
        on: { id: "$RiskAttribute.riskId$" },
      },
    ];
    const fields = [
      "*",
      { as: "riskAttributeTypeUuid", expression: "RiskAttributeType_0.uuid" },
      { as: "riskUuid", expression: "Risk_1.uuid" },
    ];

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const current = await db.queryHead(sqlStringAndValues);

    if (!current) {
      return res.status(404).json({ errors: ["Record not found"] });
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? SET ?", [
        archiveTable,
        {
          ..._.omit(["riskAttributeTypeUuid", "riskUuid"], current),
          modifier: req.headers["x-user-uuid"] || "stub",
          userDeleted: 1,
        },
      ]);
    }

    await db.query("DELETE FROM ?? WHERE ?? = ?", [
      table,
      ident,
      req.params[ident],
    ]);

    const resBody = _.pick(resBodyKeys, current);
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.riskAttributeDeleteList = async (req, res, next) => {
  try {
    const table = "RiskAttribute";
    const archiveTable = archiveTablesMap[table];
    const relations = relationsMap[table];
    const resBodyKeys = [
      "riskUuid",
      "riskAttributeTypeUuid",
      "name",
      "value",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];

    const $where = await prepareWhere(relations, req.query.$where);
    const selectParams = await getSQLString({
      table,
      $where,
    });

    const currents = await db.query(selectParams);
    if (!currents.length) {
      return res.status(200).json([]);
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? (??) VALUES ?", [
        archiveTable,
        []
          .concat(Object.keys(currents[0]))
          .concat("modifier")
          .concat("userDeleted"),
        currents.map((c) =>
          Object.values(c)
            .concat(req.headers["x-user-uuid"] || "stub")
            .concat(1)
        ),
      ]);
    }

    let sql = "DELETE FROM ??";
    let values = [table];

    if (selectParams.sql.includes(" where ")) {
      sql += " where " + selectParams.sql.split(" where ")[1];
      values = values.concat(selectParams.values);
    }

    await db.query(sql, values);

    const resBody = (
      await Promise.all(
        currents.map((record) => mapInternalIdentsToExposed(relations, record))
      )
    ).map((x) => _.pick(resBodyKeys, x));
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.riskAttributeTypeGet = async (req, res, next) => {
  try {
    const table = "RiskAttributeType";
    const ident = "uuid";
    const joins = [
      {
        type: "left",
        target: "RiskAttributeType",
        alias: "RiskAttributeType_0",
        on: { id: "$RiskAttributeType.parentId$" },
      },
      {
        type: "left",
        target: "Risk",
        alias: "Risk_1",
        on: { id: "$RiskAttributeType.riskId$" },
      },
    ];
    const fields = [
      "enum",
      "name",
      "labelNumber",
      "defaultValue",
      "isRequired",
      "jsonSchema",
      "label",
      "placeholderText",
      "helpMarkdownText",
      "isMedia",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
      { as: "parentUuid", expression: "RiskAttributeType_0.uuid" },
      { as: "riskUuid", expression: "Risk_1.uuid" },
    ];
    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const record = await db.queryHead(sqlStringAndValues);
    if (!record) {
      return res.status(404).json({ errors: ["Record not found"] });
    }
    return res.status(200).json(record);
  } catch (e) {
    return next(e);
  }
};

module.exports.riskAttributeTypeGetList = async (req, res, next) => {
  try {
    const table = "RiskAttributeType";
    const relations = [
      {
        localTable: "RiskAttributeType",
        localField: "parentId",
        localForeignIdent: "parentUuid",
        foreignTable: "RiskAttributeType",
        foreignField: "id",
        foreignIdent: "uuid",
      },
      {
        localTable: "RiskAttributeType",
        localField: "riskId",
        localForeignIdent: "riskUuid",
        foreignTable: "Risk",
        foreignField: "id",
        foreignIdent: "uuid",
      },
    ];

    const $where = await prepareWhere(relations, req.query.$where);
    const $orderBy = req.query.$orderBy
      ? Array.isArray(req.query.$orderBy)
        ? req.query.$orderBy.map((x) => mapExposedKeysToInternal(relations, x))
        : mapExposedKeysToInternal(relations, req.query.$orderBy)
      : undefined;

    // https://github.com/epoberezkin/ajv/issues/276
    if (req.query.$paginate && req.query.$paginate.page) {
      req.query.$paginate.pageSize = req.query.$paginate.pageSize || 20;
    }

    let rows, totalCount;

    const joins = [
      {
        type: "left",
        target: "RiskAttributeType",
        alias: "RiskAttributeType_0",
        on: { id: "$RiskAttributeType.parentId$" },
      },
      {
        type: "left",
        target: "Risk",
        alias: "Risk_1",
        on: { id: "$RiskAttributeType.riskId$" },
      },
    ];
    const fields = [
      "id",
      "enum",
      "name",
      "labelNumber",
      "defaultValue",
      "isRequired",
      "jsonSchema",
      "label",
      "placeholderText",
      "helpMarkdownText",
      "isMedia",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
      { as: "parentUuid", expression: "RiskAttributeType_0.uuid" },
      { as: "riskUuid", expression: "Risk_1.uuid" },
    ];
    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where,
      $orderBy,
      $paginate: req.query.$paginate || undefined,
    });

    if (req.query.$paginate) {
      [rows, totalCount] = await Promise.all([
        db.query(sqlStringAndValues),
        db
          .queryHead(
            await getSQLString({
              table,
              fields: ["COUNT(*)"],
              $where,
              $orderBy,
            })
          )
          .then((d) => d["COUNT(*)"]),
      ]);
    } else {
      rows = await db.query(sqlStringAndValues);
    }

    if (req.query.$paginate) {
      if (typeof req.query.$paginate.limit === "number") {
        const hasMoreResults = rows.length === req.query.$paginate.limit + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }

        res.set("x-pagination-limit", req.query.$paginate.limit);
        res.set("x-pagination-offset", req.query.$paginate.offset);
        res.set(
          "x-pagination-has-previous-page",
          req.query.$paginate.offset > 0
        );
        res.set("x-pagination-has-next-page", !!hasMoreResults);
      } else if (typeof req.query.$paginate.page === "number") {
        const hasMoreResults = rows.length === req.query.$paginate.pageSize + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }

        res.set("x-pagination-page", req.query.$paginate.page);
        res.set("x-pagination-page-size", req.query.$paginate.pageSize);
        res.set("x-pagination-has-previous-page", req.query.$paginate.page > 1);
        res.set("x-pagination-has-next-page", !!hasMoreResults);
      } else {
        const flip =
          typeof req.query.$paginate.first === "number" ? false : true;
        const limit = flip
          ? req.query.$paginate.last
          : req.query.$paginate.first;

        const hasMoreResults = rows.length === limit + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }
        if (flip) {
          rows = rows.reverse();
        }

        const hasPreviousPage = flip ? hasMoreResults : false;
        const hasNextPage = flip ? false : hasMoreResults;
        const startCursor =
          rows[0] && rows[0].id ? encodeCursor(rows[0].id) : null;
        const endCursor =
          rows[rows.length - 1] && rows[rows.length - 1].id
            ? encodeCursor(rows[rows.length - 1].id)
            : null;

        res.set("x-pagination-has-previous-page", hasPreviousPage);
        res.set("x-pagination-has-next-page", hasNextPage);
        if (startCursor != null) {
          res.set("x-pagination-start-cursor", startCursor);
        }
        if (endCursor != null) {
          res.set("x-pagination-end-cursor", endCursor);
        }
      }
    }

    if (typeof totalCount === "number") {
      res.set("x-pagination-total-count", totalCount);
    }

    if (
      typeof totalCount === "number" &&
      req.query.$paginate &&
      req.query.$paginate.pageSize
    ) {
      res.set(
        "x-pagination-last-page",
        Math.ceil(totalCount / req.query.$paginate.pageSize)
      );
    }

    // https://jsperf.com/delete-vs-spread-vs-lodash-omit-vs-lodash-inverse-pick
    for (let row of rows) {
      row.id = undefined;
    }

    return res.status(200).json(rows);
  } catch (e) {
    return next(e);
  }
};

module.exports.riskAttributeTypePost = async (req, res, next) => {
  try {
    const table = "RiskAttributeType";
    const relations = [
      {
        localTable: "RiskAttributeType",
        localField: "parentId",
        localForeignIdent: "parentUuid",
        foreignTable: "RiskAttributeType",
        foreignField: "id",
        foreignIdent: "uuid",
      },
      {
        localTable: "RiskAttributeType",
        localField: "riskId",
        localForeignIdent: "riskUuid",
        foreignTable: "Risk",
        foreignField: "id",
        foreignIdent: "uuid",
      },
    ];
    const reqBodySchema = require("./schemas/risk-attribute-type.POST.req.body.json");
    const ident = "uuid";
    const joins = [
      {
        type: "left",
        target: "RiskAttributeType",
        alias: "RiskAttributeType_0",
        on: { id: "$RiskAttributeType.parentId$" },
      },
      {
        type: "left",
        target: "Risk",
        alias: "Risk_1",
        on: { id: "$RiskAttributeType.riskId$" },
      },
    ];
    const fields = [
      "enum",
      "name",
      "labelNumber",
      "defaultValue",
      "isRequired",
      "jsonSchema",
      "label",
      "placeholderText",
      "helpMarkdownText",
      "isMedia",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
      { as: "parentUuid", expression: "RiskAttributeType_0.uuid" },
      { as: "riskUuid", expression: "Risk_1.uuid" },
    ];

    const body = prepareDateTimeStrings(
      reqBodySchema,
      await mapExposedIdentsToInternal(relations, req.body)
    );

    const inserted = await db.query("INSERT INTO ?? SET ?? = UUID(), ?", [
      table,
      ident,
      body,
    ]);
    const id = inserted.insertId;

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { id },
    });
    const record = await db.queryHead(sqlStringAndValues);

    return res.status(200).json(record);
  } catch (e) {
    return next(e);
  }
};

module.exports.riskAttributeTypePatch = async (req, res, next) => {
  try {
    const table = "RiskAttributeType";
    const archiveTable = archiveTablesMap[table];
    const relations = [
      {
        localTable: "RiskAttributeType",
        localField: "parentId",
        localForeignIdent: "parentUuid",
        foreignTable: "RiskAttributeType",
        foreignField: "id",
        foreignIdent: "uuid",
      },
      {
        localTable: "RiskAttributeType",
        localField: "riskId",
        localForeignIdent: "riskUuid",
        foreignTable: "Risk",
        foreignField: "id",
        foreignIdent: "uuid",
      },
    ];
    const reqBodySchema = require("./schemas/risk-attribute-type.PATCH.req.body.json");
    const resBodyKeys = [
      "riskUuid",
      "parentUuid",
      "enum",
      "name",
      "labelNumber",
      "defaultValue",
      "isRequired",
      "jsonSchema",
      "label",
      "placeholderText",
      "helpMarkdownText",
      "isMedia",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];
    const ident = "uuid";
    const joins = [
      {
        type: "left",
        target: "RiskAttributeType",
        alias: "RiskAttributeType_0",
        on: { id: "$RiskAttributeType.parentId$" },
      },
      {
        type: "left",
        target: "Risk",
        alias: "Risk_1",
        on: { id: "$RiskAttributeType.riskId$" },
      },
    ];
    const fields = [
      "*",
      { as: "parentUuid", expression: "RiskAttributeType_0.uuid" },
      { as: "riskUuid", expression: "Risk_1.uuid" },
    ];

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const current = await db.queryHead(sqlStringAndValues);

    if (!current) {
      return res.status(404).json({ errors: ["Record not found"] });
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? SET ?", [
        archiveTable,
        {
          ..._.omit(["parentUuid", "riskUuid"], current),
          modifier: req.headers["x-user-uuid"] || "stub",
        },
      ]);
    }

    if (Object.keys(req.body).length) {
      const body = prepareDateTimeStrings(
        reqBodySchema,
        await mapExposedIdentsToInternal(relations, req.body)
      );
      await db.query("UPDATE ?? SET ? WHERE ?? = ?", [
        table,
        body,
        ident,
        req.params[ident],
      ]);
    } else {
      // Nothing to update.
      const resBody = _.pick(resBodyKeys, current);
      return res.status(200).json(resBody);
    }
    const record = await db.queryHead(
      await getSQLString({
        table,
        fields,
        joins,
        $where: { [ident]: req.params["uuid"] },
      })
    );

    const resBody = _.pick(resBodyKeys, record);
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.riskAttributeTypePatchList = async (req, res, next) => {
  try {
    const table = "RiskAttributeType";
    const relations = relationsMap[table];
    const archiveTable = archiveTablesMap[table];
    const reqBodySchema = require("./schemas/risk-attribute-type.PATCH.list.req.body.json");
    const resBodyKeys = [
      "riskUuid",
      "parentUuid",
      "enum",
      "name",
      "labelNumber",
      "defaultValue",
      "isRequired",
      "jsonSchema",
      "label",
      "placeholderText",
      "helpMarkdownText",
      "isMedia",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];

    const $where = await prepareWhere(relations, req.query.$where);
    const selectParams = await getSQLString({
      table,
      $where,
    });

    const currents = await db.query(selectParams);
    if (!currents.length) {
      return res.status(200).json([]);
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? (??) VALUES ?", [
        archiveTable,
        [].concat(Object.keys(currents[0])).concat("modifier"),
        currents.map((c) =>
          Object.values(c).concat(req.headers["x-user-uuid"] || "stub")
        ),
      ]);
    }

    if (Object.keys(req.body).length) {
      const body = prepareDateTimeStrings(
        reqBodySchema,
        await mapExposedIdentsToInternal(relations, req.body)
      );

      let sql = "UPDATE ?? SET ?";
      let values = [table, body];

      if (selectParams.sql.includes(" where ")) {
        sql += " where " + selectParams.sql.split(" where ")[1];
        values = values.concat(selectParams.values);
      }

      await db.query(sql, values);
    } else {
      // Nothing to update.
      let resBody = (
        await Promise.all(
          currents.map((current) =>
            mapInternalIdentsToExposed(relations, current)
          )
        )
      ).map((x) => _.pick(resBodyKeys, x));
      return res.status(200).json(resBody);
    }
    const records = await db.query(selectParams);
    const resBody = (
      await Promise.all(
        records.map((record) => mapInternalIdentsToExposed(relations, record))
      )
    ).map((x) => _.pick(resBodyKeys, x));
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.riskAttributeTypeDelete = async (req, res, next) => {
  try {
    const table = "RiskAttributeType";
    const archiveTable = archiveTablesMap[table];
    const resBodyKeys = [
      "riskUuid",
      "parentUuid",
      "enum",
      "name",
      "labelNumber",
      "defaultValue",
      "isRequired",
      "jsonSchema",
      "label",
      "placeholderText",
      "helpMarkdownText",
      "isMedia",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];
    const ident = "uuid";
    const joins = [
      {
        type: "left",
        target: "RiskAttributeType",
        alias: "RiskAttributeType_0",
        on: { id: "$RiskAttributeType.parentId$" },
      },
      {
        type: "left",
        target: "Risk",
        alias: "Risk_1",
        on: { id: "$RiskAttributeType.riskId$" },
      },
    ];
    const fields = [
      "*",
      { as: "parentUuid", expression: "RiskAttributeType_0.uuid" },
      { as: "riskUuid", expression: "Risk_1.uuid" },
    ];

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const current = await db.queryHead(sqlStringAndValues);

    if (!current) {
      return res.status(404).json({ errors: ["Record not found"] });
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? SET ?", [
        archiveTable,
        {
          ..._.omit(["parentUuid", "riskUuid"], current),
          modifier: req.headers["x-user-uuid"] || "stub",
          userDeleted: 1,
        },
      ]);
    }

    await db.query("DELETE FROM ?? WHERE ?? = ?", [
      table,
      ident,
      req.params[ident],
    ]);

    const resBody = _.pick(resBodyKeys, current);
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.riskAttributeTypeDeleteList = async (req, res, next) => {
  try {
    const table = "RiskAttributeType";
    const archiveTable = archiveTablesMap[table];
    const relations = relationsMap[table];
    const resBodyKeys = [
      "riskUuid",
      "parentUuid",
      "enum",
      "name",
      "labelNumber",
      "defaultValue",
      "isRequired",
      "jsonSchema",
      "label",
      "placeholderText",
      "helpMarkdownText",
      "isMedia",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];

    const $where = await prepareWhere(relations, req.query.$where);
    const selectParams = await getSQLString({
      table,
      $where,
    });

    const currents = await db.query(selectParams);
    if (!currents.length) {
      return res.status(200).json([]);
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? (??) VALUES ?", [
        archiveTable,
        []
          .concat(Object.keys(currents[0]))
          .concat("modifier")
          .concat("userDeleted"),
        currents.map((c) =>
          Object.values(c)
            .concat(req.headers["x-user-uuid"] || "stub")
            .concat(1)
        ),
      ]);
    }

    let sql = "DELETE FROM ??";
    let values = [table];

    if (selectParams.sql.includes(" where ")) {
      sql += " where " + selectParams.sql.split(" where ")[1];
      values = values.concat(selectParams.values);
    }

    await db.query(sql, values);

    const resBody = (
      await Promise.all(
        currents.map((record) => mapInternalIdentsToExposed(relations, record))
      )
    ).map((x) => _.pick(resBodyKeys, x));
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.riskCategoryGet = async (req, res, next) => {
  try {
    const table = "RiskCategory";
    const ident = "uuid";
    const joins = [];
    const fields = [
      "sectionNumber",
      "enum",
      "name",
      "referenceUrl",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];
    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const record = await db.queryHead(sqlStringAndValues);
    if (!record) {
      return res.status(404).json({ errors: ["Record not found"] });
    }
    return res.status(200).json(record);
  } catch (e) {
    return next(e);
  }
};

module.exports.riskCategoryGetList = async (req, res, next) => {
  try {
    const table = "RiskCategory";
    const relations = [];

    const $where = await prepareWhere(relations, req.query.$where);
    const $orderBy = req.query.$orderBy
      ? Array.isArray(req.query.$orderBy)
        ? req.query.$orderBy.map((x) => mapExposedKeysToInternal(relations, x))
        : mapExposedKeysToInternal(relations, req.query.$orderBy)
      : undefined;

    // https://github.com/epoberezkin/ajv/issues/276
    if (req.query.$paginate && req.query.$paginate.page) {
      req.query.$paginate.pageSize = req.query.$paginate.pageSize || 20;
    }

    let rows, totalCount;

    const joins = [];
    const fields = [
      "id",
      "sectionNumber",
      "enum",
      "name",
      "referenceUrl",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];
    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where,
      $orderBy,
      $paginate: req.query.$paginate || undefined,
    });

    if (req.query.$paginate) {
      [rows, totalCount] = await Promise.all([
        db.query(sqlStringAndValues),
        db
          .queryHead(
            await getSQLString({
              table,
              fields: ["COUNT(*)"],
              $where,
              $orderBy,
            })
          )
          .then((d) => d["COUNT(*)"]),
      ]);
    } else {
      rows = await db.query(sqlStringAndValues);
    }

    if (req.query.$paginate) {
      if (typeof req.query.$paginate.limit === "number") {
        const hasMoreResults = rows.length === req.query.$paginate.limit + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }

        res.set("x-pagination-limit", req.query.$paginate.limit);
        res.set("x-pagination-offset", req.query.$paginate.offset);
        res.set(
          "x-pagination-has-previous-page",
          req.query.$paginate.offset > 0
        );
        res.set("x-pagination-has-next-page", !!hasMoreResults);
      } else if (typeof req.query.$paginate.page === "number") {
        const hasMoreResults = rows.length === req.query.$paginate.pageSize + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }

        res.set("x-pagination-page", req.query.$paginate.page);
        res.set("x-pagination-page-size", req.query.$paginate.pageSize);
        res.set("x-pagination-has-previous-page", req.query.$paginate.page > 1);
        res.set("x-pagination-has-next-page", !!hasMoreResults);
      } else {
        const flip =
          typeof req.query.$paginate.first === "number" ? false : true;
        const limit = flip
          ? req.query.$paginate.last
          : req.query.$paginate.first;

        const hasMoreResults = rows.length === limit + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }
        if (flip) {
          rows = rows.reverse();
        }

        const hasPreviousPage = flip ? hasMoreResults : false;
        const hasNextPage = flip ? false : hasMoreResults;
        const startCursor =
          rows[0] && rows[0].id ? encodeCursor(rows[0].id) : null;
        const endCursor =
          rows[rows.length - 1] && rows[rows.length - 1].id
            ? encodeCursor(rows[rows.length - 1].id)
            : null;

        res.set("x-pagination-has-previous-page", hasPreviousPage);
        res.set("x-pagination-has-next-page", hasNextPage);
        if (startCursor != null) {
          res.set("x-pagination-start-cursor", startCursor);
        }
        if (endCursor != null) {
          res.set("x-pagination-end-cursor", endCursor);
        }
      }
    }

    if (typeof totalCount === "number") {
      res.set("x-pagination-total-count", totalCount);
    }

    if (
      typeof totalCount === "number" &&
      req.query.$paginate &&
      req.query.$paginate.pageSize
    ) {
      res.set(
        "x-pagination-last-page",
        Math.ceil(totalCount / req.query.$paginate.pageSize)
      );
    }

    // https://jsperf.com/delete-vs-spread-vs-lodash-omit-vs-lodash-inverse-pick
    for (let row of rows) {
      row.id = undefined;
    }

    return res.status(200).json(rows);
  } catch (e) {
    return next(e);
  }
};

module.exports.riskCategoryPost = async (req, res, next) => {
  try {
    const table = "RiskCategory";
    const relations = [];
    const reqBodySchema = require("./schemas/risk-category.POST.req.body.json");
    const ident = "uuid";
    const joins = [];
    const fields = [
      "sectionNumber",
      "enum",
      "name",
      "referenceUrl",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];

    const body = prepareDateTimeStrings(
      reqBodySchema,
      await mapExposedIdentsToInternal(relations, req.body)
    );

    const inserted = await db.query("INSERT INTO ?? SET ?? = UUID(), ?", [
      table,
      ident,
      body,
    ]);
    const id = inserted.insertId;

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { id },
    });
    const record = await db.queryHead(sqlStringAndValues);

    return res.status(200).json(record);
  } catch (e) {
    return next(e);
  }
};

module.exports.riskCategoryPatch = async (req, res, next) => {
  try {
    const table = "RiskCategory";
    const archiveTable = archiveTablesMap[table];
    const relations = [];
    const reqBodySchema = require("./schemas/risk-category.PATCH.req.body.json");
    const resBodyKeys = [
      "sectionNumber",
      "enum",
      "name",
      "referenceUrl",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];
    const ident = "uuid";
    const joins = [];
    const fields = ["*"];

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const current = await db.queryHead(sqlStringAndValues);

    if (!current) {
      return res.status(404).json({ errors: ["Record not found"] });
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? SET ?", [
        archiveTable,
        {
          ..._.omit([], current),
          modifier: req.headers["x-user-uuid"] || "stub",
        },
      ]);
    }

    if (Object.keys(req.body).length) {
      const body = prepareDateTimeStrings(
        reqBodySchema,
        await mapExposedIdentsToInternal(relations, req.body)
      );
      await db.query("UPDATE ?? SET ? WHERE ?? = ?", [
        table,
        body,
        ident,
        req.params[ident],
      ]);
    } else {
      // Nothing to update.
      const resBody = _.pick(resBodyKeys, current);
      return res.status(200).json(resBody);
    }
    const record = await db.queryHead(
      await getSQLString({
        table,
        fields,
        joins,
        $where: { [ident]: req.params["uuid"] },
      })
    );

    const resBody = _.pick(resBodyKeys, record);
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.riskCategoryPatchList = async (req, res, next) => {
  try {
    const table = "RiskCategory";
    const relations = relationsMap[table];
    const archiveTable = archiveTablesMap[table];
    const reqBodySchema = require("./schemas/risk-category.PATCH.list.req.body.json");
    const resBodyKeys = [
      "sectionNumber",
      "enum",
      "name",
      "referenceUrl",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];

    const $where = await prepareWhere(relations, req.query.$where);
    const selectParams = await getSQLString({
      table,
      $where,
    });

    const currents = await db.query(selectParams);
    if (!currents.length) {
      return res.status(200).json([]);
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? (??) VALUES ?", [
        archiveTable,
        [].concat(Object.keys(currents[0])).concat("modifier"),
        currents.map((c) =>
          Object.values(c).concat(req.headers["x-user-uuid"] || "stub")
        ),
      ]);
    }

    if (Object.keys(req.body).length) {
      const body = prepareDateTimeStrings(
        reqBodySchema,
        await mapExposedIdentsToInternal(relations, req.body)
      );

      let sql = "UPDATE ?? SET ?";
      let values = [table, body];

      if (selectParams.sql.includes(" where ")) {
        sql += " where " + selectParams.sql.split(" where ")[1];
        values = values.concat(selectParams.values);
      }

      await db.query(sql, values);
    } else {
      // Nothing to update.
      let resBody = (
        await Promise.all(
          currents.map((current) =>
            mapInternalIdentsToExposed(relations, current)
          )
        )
      ).map((x) => _.pick(resBodyKeys, x));
      return res.status(200).json(resBody);
    }
    const records = await db.query(selectParams);
    const resBody = (
      await Promise.all(
        records.map((record) => mapInternalIdentsToExposed(relations, record))
      )
    ).map((x) => _.pick(resBodyKeys, x));
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.riskCategoryDelete = async (req, res, next) => {
  try {
    const table = "RiskCategory";
    const archiveTable = archiveTablesMap[table];
    const resBodyKeys = [
      "sectionNumber",
      "enum",
      "name",
      "referenceUrl",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];
    const ident = "uuid";
    const joins = [];
    const fields = ["*"];

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const current = await db.queryHead(sqlStringAndValues);

    if (!current) {
      return res.status(404).json({ errors: ["Record not found"] });
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? SET ?", [
        archiveTable,
        {
          ..._.omit([], current),
          modifier: req.headers["x-user-uuid"] || "stub",
          userDeleted: 1,
        },
      ]);
    }

    await db.query("DELETE FROM ?? WHERE ?? = ?", [
      table,
      ident,
      req.params[ident],
    ]);

    const resBody = _.pick(resBodyKeys, current);
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.riskCategoryDeleteList = async (req, res, next) => {
  try {
    const table = "RiskCategory";
    const archiveTable = archiveTablesMap[table];
    const relations = relationsMap[table];
    const resBodyKeys = [
      "sectionNumber",
      "enum",
      "name",
      "referenceUrl",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];

    const $where = await prepareWhere(relations, req.query.$where);
    const selectParams = await getSQLString({
      table,
      $where,
    });

    const currents = await db.query(selectParams);
    if (!currents.length) {
      return res.status(200).json([]);
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? (??) VALUES ?", [
        archiveTable,
        []
          .concat(Object.keys(currents[0]))
          .concat("modifier")
          .concat("userDeleted"),
        currents.map((c) =>
          Object.values(c)
            .concat(req.headers["x-user-uuid"] || "stub")
            .concat(1)
        ),
      ]);
    }

    let sql = "DELETE FROM ??";
    let values = [table];

    if (selectParams.sql.includes(" where ")) {
      sql += " where " + selectParams.sql.split(" where ")[1];
      values = values.concat(selectParams.values);
    }

    await db.query(sql, values);

    const resBody = (
      await Promise.all(
        currents.map((record) => mapInternalIdentsToExposed(relations, record))
      )
    ).map((x) => _.pick(resBodyKeys, x));
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.riskCategoryAttributeGet = async (req, res, next) => {
  try {
    const table = "RiskCategoryAttribute";
    const ident = "uuid";
    const joins = [
      {
        type: "left",
        target: "RiskCategoryAttributeType",
        alias: "RiskCategoryAttributeType_0",
        on: { id: "$RiskCategoryAttribute.riskCategoryAttributeTypeId$" },
      },
      {
        type: "left",
        target: "RiskCategory",
        alias: "RiskCategory_1",
        on: { id: "$RiskCategoryAttribute.riskCategoryId$" },
      },
    ];
    const fields = [
      "name",
      "value",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
      {
        as: "riskCategoryAttributeTypeUuid",
        expression: "RiskCategoryAttributeType_0.uuid",
      },
      { as: "riskCategoryUuid", expression: "RiskCategory_1.uuid" },
    ];
    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const record = await db.queryHead(sqlStringAndValues);
    if (!record) {
      return res.status(404).json({ errors: ["Record not found"] });
    }
    return res.status(200).json(record);
  } catch (e) {
    return next(e);
  }
};

module.exports.riskCategoryAttributeGetList = async (req, res, next) => {
  try {
    const table = "RiskCategoryAttribute";
    const relations = [
      {
        localTable: "RiskCategoryAttribute",
        localField: "riskCategoryAttributeTypeId",
        localForeignIdent: "riskCategoryAttributeTypeUuid",
        foreignTable: "RiskCategoryAttributeType",
        foreignField: "id",
        foreignIdent: "uuid",
      },
      {
        localTable: "RiskCategoryAttribute",
        localField: "riskCategoryId",
        localForeignIdent: "riskCategoryUuid",
        foreignTable: "RiskCategory",
        foreignField: "id",
        foreignIdent: "uuid",
      },
    ];

    const $where = await prepareWhere(relations, req.query.$where);
    const $orderBy = req.query.$orderBy
      ? Array.isArray(req.query.$orderBy)
        ? req.query.$orderBy.map((x) => mapExposedKeysToInternal(relations, x))
        : mapExposedKeysToInternal(relations, req.query.$orderBy)
      : undefined;

    // https://github.com/epoberezkin/ajv/issues/276
    if (req.query.$paginate && req.query.$paginate.page) {
      req.query.$paginate.pageSize = req.query.$paginate.pageSize || 20;
    }

    let rows, totalCount;

    const joins = [
      {
        type: "left",
        target: "RiskCategoryAttributeType",
        alias: "RiskCategoryAttributeType_0",
        on: { id: "$RiskCategoryAttribute.riskCategoryAttributeTypeId$" },
      },
      {
        type: "left",
        target: "RiskCategory",
        alias: "RiskCategory_1",
        on: { id: "$RiskCategoryAttribute.riskCategoryId$" },
      },
    ];
    const fields = [
      "id",
      "name",
      "value",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
      {
        as: "riskCategoryAttributeTypeUuid",
        expression: "RiskCategoryAttributeType_0.uuid",
      },
      { as: "riskCategoryUuid", expression: "RiskCategory_1.uuid" },
    ];
    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where,
      $orderBy,
      $paginate: req.query.$paginate || undefined,
    });

    if (req.query.$paginate) {
      [rows, totalCount] = await Promise.all([
        db.query(sqlStringAndValues),
        db
          .queryHead(
            await getSQLString({
              table,
              fields: ["COUNT(*)"],
              $where,
              $orderBy,
            })
          )
          .then((d) => d["COUNT(*)"]),
      ]);
    } else {
      rows = await db.query(sqlStringAndValues);
    }

    if (req.query.$paginate) {
      if (typeof req.query.$paginate.limit === "number") {
        const hasMoreResults = rows.length === req.query.$paginate.limit + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }

        res.set("x-pagination-limit", req.query.$paginate.limit);
        res.set("x-pagination-offset", req.query.$paginate.offset);
        res.set(
          "x-pagination-has-previous-page",
          req.query.$paginate.offset > 0
        );
        res.set("x-pagination-has-next-page", !!hasMoreResults);
      } else if (typeof req.query.$paginate.page === "number") {
        const hasMoreResults = rows.length === req.query.$paginate.pageSize + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }

        res.set("x-pagination-page", req.query.$paginate.page);
        res.set("x-pagination-page-size", req.query.$paginate.pageSize);
        res.set("x-pagination-has-previous-page", req.query.$paginate.page > 1);
        res.set("x-pagination-has-next-page", !!hasMoreResults);
      } else {
        const flip =
          typeof req.query.$paginate.first === "number" ? false : true;
        const limit = flip
          ? req.query.$paginate.last
          : req.query.$paginate.first;

        const hasMoreResults = rows.length === limit + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }
        if (flip) {
          rows = rows.reverse();
        }

        const hasPreviousPage = flip ? hasMoreResults : false;
        const hasNextPage = flip ? false : hasMoreResults;
        const startCursor =
          rows[0] && rows[0].id ? encodeCursor(rows[0].id) : null;
        const endCursor =
          rows[rows.length - 1] && rows[rows.length - 1].id
            ? encodeCursor(rows[rows.length - 1].id)
            : null;

        res.set("x-pagination-has-previous-page", hasPreviousPage);
        res.set("x-pagination-has-next-page", hasNextPage);
        if (startCursor != null) {
          res.set("x-pagination-start-cursor", startCursor);
        }
        if (endCursor != null) {
          res.set("x-pagination-end-cursor", endCursor);
        }
      }
    }

    if (typeof totalCount === "number") {
      res.set("x-pagination-total-count", totalCount);
    }

    if (
      typeof totalCount === "number" &&
      req.query.$paginate &&
      req.query.$paginate.pageSize
    ) {
      res.set(
        "x-pagination-last-page",
        Math.ceil(totalCount / req.query.$paginate.pageSize)
      );
    }

    // https://jsperf.com/delete-vs-spread-vs-lodash-omit-vs-lodash-inverse-pick
    for (let row of rows) {
      row.id = undefined;
    }

    return res.status(200).json(rows);
  } catch (e) {
    return next(e);
  }
};

module.exports.riskCategoryAttributePost = async (req, res, next) => {
  try {
    const table = "RiskCategoryAttribute";
    const relations = [
      {
        localTable: "RiskCategoryAttribute",
        localField: "riskCategoryAttributeTypeId",
        localForeignIdent: "riskCategoryAttributeTypeUuid",
        foreignTable: "RiskCategoryAttributeType",
        foreignField: "id",
        foreignIdent: "uuid",
      },
      {
        localTable: "RiskCategoryAttribute",
        localField: "riskCategoryId",
        localForeignIdent: "riskCategoryUuid",
        foreignTable: "RiskCategory",
        foreignField: "id",
        foreignIdent: "uuid",
      },
    ];
    const reqBodySchema = require("./schemas/risk-category-attribute.POST.req.body.json");
    const ident = "uuid";
    const joins = [
      {
        type: "left",
        target: "RiskCategoryAttributeType",
        alias: "RiskCategoryAttributeType_0",
        on: { id: "$RiskCategoryAttribute.riskCategoryAttributeTypeId$" },
      },
      {
        type: "left",
        target: "RiskCategory",
        alias: "RiskCategory_1",
        on: { id: "$RiskCategoryAttribute.riskCategoryId$" },
      },
    ];
    const fields = [
      "name",
      "value",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
      {
        as: "riskCategoryAttributeTypeUuid",
        expression: "RiskCategoryAttributeType_0.uuid",
      },
      { as: "riskCategoryUuid", expression: "RiskCategory_1.uuid" },
    ];

    const body = prepareDateTimeStrings(
      reqBodySchema,
      await mapExposedIdentsToInternal(relations, req.body)
    );

    const inserted = await db.query("INSERT INTO ?? SET ?? = UUID(), ?", [
      table,
      ident,
      body,
    ]);
    const id = inserted.insertId;

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { id },
    });
    const record = await db.queryHead(sqlStringAndValues);

    return res.status(200).json(record);
  } catch (e) {
    return next(e);
  }
};

module.exports.riskCategoryAttributePatch = async (req, res, next) => {
  try {
    const table = "RiskCategoryAttribute";
    const archiveTable = archiveTablesMap[table];
    const relations = [
      {
        localTable: "RiskCategoryAttribute",
        localField: "riskCategoryAttributeTypeId",
        localForeignIdent: "riskCategoryAttributeTypeUuid",
        foreignTable: "RiskCategoryAttributeType",
        foreignField: "id",
        foreignIdent: "uuid",
      },
      {
        localTable: "RiskCategoryAttribute",
        localField: "riskCategoryId",
        localForeignIdent: "riskCategoryUuid",
        foreignTable: "RiskCategory",
        foreignField: "id",
        foreignIdent: "uuid",
      },
    ];
    const reqBodySchema = require("./schemas/risk-category-attribute.PATCH.req.body.json");
    const resBodyKeys = [
      "riskCategoryUuid",
      "riskCategoryAttributeTypeUuid",
      "name",
      "value",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];
    const ident = "uuid";
    const joins = [
      {
        type: "left",
        target: "RiskCategoryAttributeType",
        alias: "RiskCategoryAttributeType_0",
        on: { id: "$RiskCategoryAttribute.riskCategoryAttributeTypeId$" },
      },
      {
        type: "left",
        target: "RiskCategory",
        alias: "RiskCategory_1",
        on: { id: "$RiskCategoryAttribute.riskCategoryId$" },
      },
    ];
    const fields = [
      "*",
      {
        as: "riskCategoryAttributeTypeUuid",
        expression: "RiskCategoryAttributeType_0.uuid",
      },
      { as: "riskCategoryUuid", expression: "RiskCategory_1.uuid" },
    ];

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const current = await db.queryHead(sqlStringAndValues);

    if (!current) {
      return res.status(404).json({ errors: ["Record not found"] });
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? SET ?", [
        archiveTable,
        {
          ..._.omit(
            ["riskCategoryAttributeTypeUuid", "riskCategoryUuid"],
            current
          ),
          modifier: req.headers["x-user-uuid"] || "stub",
        },
      ]);
    }

    if (Object.keys(req.body).length) {
      const body = prepareDateTimeStrings(
        reqBodySchema,
        await mapExposedIdentsToInternal(relations, req.body)
      );
      await db.query("UPDATE ?? SET ? WHERE ?? = ?", [
        table,
        body,
        ident,
        req.params[ident],
      ]);
    } else {
      // Nothing to update.
      const resBody = _.pick(resBodyKeys, current);
      return res.status(200).json(resBody);
    }
    const record = await db.queryHead(
      await getSQLString({
        table,
        fields,
        joins,
        $where: { [ident]: req.params["uuid"] },
      })
    );

    const resBody = _.pick(resBodyKeys, record);
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.riskCategoryAttributePatchList = async (req, res, next) => {
  try {
    const table = "RiskCategoryAttribute";
    const relations = relationsMap[table];
    const archiveTable = archiveTablesMap[table];
    const reqBodySchema = require("./schemas/risk-category-attribute.PATCH.list.req.body.json");
    const resBodyKeys = [
      "riskCategoryUuid",
      "riskCategoryAttributeTypeUuid",
      "name",
      "value",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];

    const $where = await prepareWhere(relations, req.query.$where);
    const selectParams = await getSQLString({
      table,
      $where,
    });

    const currents = await db.query(selectParams);
    if (!currents.length) {
      return res.status(200).json([]);
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? (??) VALUES ?", [
        archiveTable,
        [].concat(Object.keys(currents[0])).concat("modifier"),
        currents.map((c) =>
          Object.values(c).concat(req.headers["x-user-uuid"] || "stub")
        ),
      ]);
    }

    if (Object.keys(req.body).length) {
      const body = prepareDateTimeStrings(
        reqBodySchema,
        await mapExposedIdentsToInternal(relations, req.body)
      );

      let sql = "UPDATE ?? SET ?";
      let values = [table, body];

      if (selectParams.sql.includes(" where ")) {
        sql += " where " + selectParams.sql.split(" where ")[1];
        values = values.concat(selectParams.values);
      }

      await db.query(sql, values);
    } else {
      // Nothing to update.
      let resBody = (
        await Promise.all(
          currents.map((current) =>
            mapInternalIdentsToExposed(relations, current)
          )
        )
      ).map((x) => _.pick(resBodyKeys, x));
      return res.status(200).json(resBody);
    }
    const records = await db.query(selectParams);
    const resBody = (
      await Promise.all(
        records.map((record) => mapInternalIdentsToExposed(relations, record))
      )
    ).map((x) => _.pick(resBodyKeys, x));
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.riskCategoryAttributeDelete = async (req, res, next) => {
  try {
    const table = "RiskCategoryAttribute";
    const archiveTable = archiveTablesMap[table];
    const resBodyKeys = [
      "riskCategoryUuid",
      "riskCategoryAttributeTypeUuid",
      "name",
      "value",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];
    const ident = "uuid";
    const joins = [
      {
        type: "left",
        target: "RiskCategoryAttributeType",
        alias: "RiskCategoryAttributeType_0",
        on: { id: "$RiskCategoryAttribute.riskCategoryAttributeTypeId$" },
      },
      {
        type: "left",
        target: "RiskCategory",
        alias: "RiskCategory_1",
        on: { id: "$RiskCategoryAttribute.riskCategoryId$" },
      },
    ];
    const fields = [
      "*",
      {
        as: "riskCategoryAttributeTypeUuid",
        expression: "RiskCategoryAttributeType_0.uuid",
      },
      { as: "riskCategoryUuid", expression: "RiskCategory_1.uuid" },
    ];

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const current = await db.queryHead(sqlStringAndValues);

    if (!current) {
      return res.status(404).json({ errors: ["Record not found"] });
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? SET ?", [
        archiveTable,
        {
          ..._.omit(
            ["riskCategoryAttributeTypeUuid", "riskCategoryUuid"],
            current
          ),
          modifier: req.headers["x-user-uuid"] || "stub",
          userDeleted: 1,
        },
      ]);
    }

    await db.query("DELETE FROM ?? WHERE ?? = ?", [
      table,
      ident,
      req.params[ident],
    ]);

    const resBody = _.pick(resBodyKeys, current);
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.riskCategoryAttributeDeleteList = async (req, res, next) => {
  try {
    const table = "RiskCategoryAttribute";
    const archiveTable = archiveTablesMap[table];
    const relations = relationsMap[table];
    const resBodyKeys = [
      "riskCategoryUuid",
      "riskCategoryAttributeTypeUuid",
      "name",
      "value",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];

    const $where = await prepareWhere(relations, req.query.$where);
    const selectParams = await getSQLString({
      table,
      $where,
    });

    const currents = await db.query(selectParams);
    if (!currents.length) {
      return res.status(200).json([]);
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? (??) VALUES ?", [
        archiveTable,
        []
          .concat(Object.keys(currents[0]))
          .concat("modifier")
          .concat("userDeleted"),
        currents.map((c) =>
          Object.values(c)
            .concat(req.headers["x-user-uuid"] || "stub")
            .concat(1)
        ),
      ]);
    }

    let sql = "DELETE FROM ??";
    let values = [table];

    if (selectParams.sql.includes(" where ")) {
      sql += " where " + selectParams.sql.split(" where ")[1];
      values = values.concat(selectParams.values);
    }

    await db.query(sql, values);

    const resBody = (
      await Promise.all(
        currents.map((record) => mapInternalIdentsToExposed(relations, record))
      )
    ).map((x) => _.pick(resBodyKeys, x));
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.riskCategoryAttributeTypeGet = async (req, res, next) => {
  try {
    const table = "RiskCategoryAttributeType";
    const ident = "uuid";
    const joins = [
      {
        type: "left",
        target: "RiskCategoryAttributeType",
        alias: "RiskCategoryAttributeType_0",
        on: { id: "$RiskCategoryAttributeType.parentId$" },
      },
      {
        type: "left",
        target: "RiskCategory",
        alias: "RiskCategory_1",
        on: { id: "$RiskCategoryAttributeType.riskCategoryId$" },
      },
    ];
    const fields = [
      "enum",
      "name",
      "labelNumber",
      "defaultValue",
      "isRequired",
      "jsonSchema",
      "label",
      "placeholderText",
      "helpMarkdownText",
      "isMedia",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
      { as: "parentUuid", expression: "RiskCategoryAttributeType_0.uuid" },
      { as: "riskCategoryUuid", expression: "RiskCategory_1.uuid" },
    ];
    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const record = await db.queryHead(sqlStringAndValues);
    if (!record) {
      return res.status(404).json({ errors: ["Record not found"] });
    }
    return res.status(200).json(record);
  } catch (e) {
    return next(e);
  }
};

module.exports.riskCategoryAttributeTypeGetList = async (req, res, next) => {
  try {
    const table = "RiskCategoryAttributeType";
    const relations = [
      {
        localTable: "RiskCategoryAttributeType",
        localField: "parentId",
        localForeignIdent: "parentUuid",
        foreignTable: "RiskCategoryAttributeType",
        foreignField: "id",
        foreignIdent: "uuid",
      },
      {
        localTable: "RiskCategoryAttributeType",
        localField: "riskCategoryId",
        localForeignIdent: "riskCategoryUuid",
        foreignTable: "RiskCategory",
        foreignField: "id",
        foreignIdent: "uuid",
      },
    ];

    const $where = await prepareWhere(relations, req.query.$where);
    const $orderBy = req.query.$orderBy
      ? Array.isArray(req.query.$orderBy)
        ? req.query.$orderBy.map((x) => mapExposedKeysToInternal(relations, x))
        : mapExposedKeysToInternal(relations, req.query.$orderBy)
      : undefined;

    // https://github.com/epoberezkin/ajv/issues/276
    if (req.query.$paginate && req.query.$paginate.page) {
      req.query.$paginate.pageSize = req.query.$paginate.pageSize || 20;
    }

    let rows, totalCount;

    const joins = [
      {
        type: "left",
        target: "RiskCategoryAttributeType",
        alias: "RiskCategoryAttributeType_0",
        on: { id: "$RiskCategoryAttributeType.parentId$" },
      },
      {
        type: "left",
        target: "RiskCategory",
        alias: "RiskCategory_1",
        on: { id: "$RiskCategoryAttributeType.riskCategoryId$" },
      },
    ];
    const fields = [
      "id",
      "enum",
      "name",
      "labelNumber",
      "defaultValue",
      "isRequired",
      "jsonSchema",
      "label",
      "placeholderText",
      "helpMarkdownText",
      "isMedia",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
      { as: "parentUuid", expression: "RiskCategoryAttributeType_0.uuid" },
      { as: "riskCategoryUuid", expression: "RiskCategory_1.uuid" },
    ];
    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where,
      $orderBy,
      $paginate: req.query.$paginate || undefined,
    });

    if (req.query.$paginate) {
      [rows, totalCount] = await Promise.all([
        db.query(sqlStringAndValues),
        db
          .queryHead(
            await getSQLString({
              table,
              fields: ["COUNT(*)"],
              $where,
              $orderBy,
            })
          )
          .then((d) => d["COUNT(*)"]),
      ]);
    } else {
      rows = await db.query(sqlStringAndValues);
    }

    if (req.query.$paginate) {
      if (typeof req.query.$paginate.limit === "number") {
        const hasMoreResults = rows.length === req.query.$paginate.limit + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }

        res.set("x-pagination-limit", req.query.$paginate.limit);
        res.set("x-pagination-offset", req.query.$paginate.offset);
        res.set(
          "x-pagination-has-previous-page",
          req.query.$paginate.offset > 0
        );
        res.set("x-pagination-has-next-page", !!hasMoreResults);
      } else if (typeof req.query.$paginate.page === "number") {
        const hasMoreResults = rows.length === req.query.$paginate.pageSize + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }

        res.set("x-pagination-page", req.query.$paginate.page);
        res.set("x-pagination-page-size", req.query.$paginate.pageSize);
        res.set("x-pagination-has-previous-page", req.query.$paginate.page > 1);
        res.set("x-pagination-has-next-page", !!hasMoreResults);
      } else {
        const flip =
          typeof req.query.$paginate.first === "number" ? false : true;
        const limit = flip
          ? req.query.$paginate.last
          : req.query.$paginate.first;

        const hasMoreResults = rows.length === limit + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }
        if (flip) {
          rows = rows.reverse();
        }

        const hasPreviousPage = flip ? hasMoreResults : false;
        const hasNextPage = flip ? false : hasMoreResults;
        const startCursor =
          rows[0] && rows[0].id ? encodeCursor(rows[0].id) : null;
        const endCursor =
          rows[rows.length - 1] && rows[rows.length - 1].id
            ? encodeCursor(rows[rows.length - 1].id)
            : null;

        res.set("x-pagination-has-previous-page", hasPreviousPage);
        res.set("x-pagination-has-next-page", hasNextPage);
        if (startCursor != null) {
          res.set("x-pagination-start-cursor", startCursor);
        }
        if (endCursor != null) {
          res.set("x-pagination-end-cursor", endCursor);
        }
      }
    }

    if (typeof totalCount === "number") {
      res.set("x-pagination-total-count", totalCount);
    }

    if (
      typeof totalCount === "number" &&
      req.query.$paginate &&
      req.query.$paginate.pageSize
    ) {
      res.set(
        "x-pagination-last-page",
        Math.ceil(totalCount / req.query.$paginate.pageSize)
      );
    }

    // https://jsperf.com/delete-vs-spread-vs-lodash-omit-vs-lodash-inverse-pick
    for (let row of rows) {
      row.id = undefined;
    }

    return res.status(200).json(rows);
  } catch (e) {
    return next(e);
  }
};

module.exports.riskCategoryAttributeTypePost = async (req, res, next) => {
  try {
    const table = "RiskCategoryAttributeType";
    const relations = [
      {
        localTable: "RiskCategoryAttributeType",
        localField: "parentId",
        localForeignIdent: "parentUuid",
        foreignTable: "RiskCategoryAttributeType",
        foreignField: "id",
        foreignIdent: "uuid",
      },
      {
        localTable: "RiskCategoryAttributeType",
        localField: "riskCategoryId",
        localForeignIdent: "riskCategoryUuid",
        foreignTable: "RiskCategory",
        foreignField: "id",
        foreignIdent: "uuid",
      },
    ];
    const reqBodySchema = require("./schemas/risk-category-attribute-type.POST.req.body.json");
    const ident = "uuid";
    const joins = [
      {
        type: "left",
        target: "RiskCategoryAttributeType",
        alias: "RiskCategoryAttributeType_0",
        on: { id: "$RiskCategoryAttributeType.parentId$" },
      },
      {
        type: "left",
        target: "RiskCategory",
        alias: "RiskCategory_1",
        on: { id: "$RiskCategoryAttributeType.riskCategoryId$" },
      },
    ];
    const fields = [
      "enum",
      "name",
      "labelNumber",
      "defaultValue",
      "isRequired",
      "jsonSchema",
      "label",
      "placeholderText",
      "helpMarkdownText",
      "isMedia",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
      { as: "parentUuid", expression: "RiskCategoryAttributeType_0.uuid" },
      { as: "riskCategoryUuid", expression: "RiskCategory_1.uuid" },
    ];

    const body = prepareDateTimeStrings(
      reqBodySchema,
      await mapExposedIdentsToInternal(relations, req.body)
    );

    const inserted = await db.query("INSERT INTO ?? SET ?? = UUID(), ?", [
      table,
      ident,
      body,
    ]);
    const id = inserted.insertId;

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { id },
    });
    const record = await db.queryHead(sqlStringAndValues);

    return res.status(200).json(record);
  } catch (e) {
    return next(e);
  }
};

module.exports.riskCategoryAttributeTypePatch = async (req, res, next) => {
  try {
    const table = "RiskCategoryAttributeType";
    const archiveTable = archiveTablesMap[table];
    const relations = [
      {
        localTable: "RiskCategoryAttributeType",
        localField: "parentId",
        localForeignIdent: "parentUuid",
        foreignTable: "RiskCategoryAttributeType",
        foreignField: "id",
        foreignIdent: "uuid",
      },
      {
        localTable: "RiskCategoryAttributeType",
        localField: "riskCategoryId",
        localForeignIdent: "riskCategoryUuid",
        foreignTable: "RiskCategory",
        foreignField: "id",
        foreignIdent: "uuid",
      },
    ];
    const reqBodySchema = require("./schemas/risk-category-attribute-type.PATCH.req.body.json");
    const resBodyKeys = [
      "riskCategoryUuid",
      "parentUuid",
      "enum",
      "name",
      "labelNumber",
      "defaultValue",
      "isRequired",
      "jsonSchema",
      "label",
      "placeholderText",
      "helpMarkdownText",
      "isMedia",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];
    const ident = "uuid";
    const joins = [
      {
        type: "left",
        target: "RiskCategoryAttributeType",
        alias: "RiskCategoryAttributeType_0",
        on: { id: "$RiskCategoryAttributeType.parentId$" },
      },
      {
        type: "left",
        target: "RiskCategory",
        alias: "RiskCategory_1",
        on: { id: "$RiskCategoryAttributeType.riskCategoryId$" },
      },
    ];
    const fields = [
      "*",
      { as: "parentUuid", expression: "RiskCategoryAttributeType_0.uuid" },
      { as: "riskCategoryUuid", expression: "RiskCategory_1.uuid" },
    ];

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const current = await db.queryHead(sqlStringAndValues);

    if (!current) {
      return res.status(404).json({ errors: ["Record not found"] });
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? SET ?", [
        archiveTable,
        {
          ..._.omit(["parentUuid", "riskCategoryUuid"], current),
          modifier: req.headers["x-user-uuid"] || "stub",
        },
      ]);
    }

    if (Object.keys(req.body).length) {
      const body = prepareDateTimeStrings(
        reqBodySchema,
        await mapExposedIdentsToInternal(relations, req.body)
      );
      await db.query("UPDATE ?? SET ? WHERE ?? = ?", [
        table,
        body,
        ident,
        req.params[ident],
      ]);
    } else {
      // Nothing to update.
      const resBody = _.pick(resBodyKeys, current);
      return res.status(200).json(resBody);
    }
    const record = await db.queryHead(
      await getSQLString({
        table,
        fields,
        joins,
        $where: { [ident]: req.params["uuid"] },
      })
    );

    const resBody = _.pick(resBodyKeys, record);
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.riskCategoryAttributeTypePatchList = async (req, res, next) => {
  try {
    const table = "RiskCategoryAttributeType";
    const relations = relationsMap[table];
    const archiveTable = archiveTablesMap[table];
    const reqBodySchema = require("./schemas/risk-category-attribute-type.PATCH.list.req.body.json");
    const resBodyKeys = [
      "riskCategoryUuid",
      "parentUuid",
      "enum",
      "name",
      "labelNumber",
      "defaultValue",
      "isRequired",
      "jsonSchema",
      "label",
      "placeholderText",
      "helpMarkdownText",
      "isMedia",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];

    const $where = await prepareWhere(relations, req.query.$where);
    const selectParams = await getSQLString({
      table,
      $where,
    });

    const currents = await db.query(selectParams);
    if (!currents.length) {
      return res.status(200).json([]);
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? (??) VALUES ?", [
        archiveTable,
        [].concat(Object.keys(currents[0])).concat("modifier"),
        currents.map((c) =>
          Object.values(c).concat(req.headers["x-user-uuid"] || "stub")
        ),
      ]);
    }

    if (Object.keys(req.body).length) {
      const body = prepareDateTimeStrings(
        reqBodySchema,
        await mapExposedIdentsToInternal(relations, req.body)
      );

      let sql = "UPDATE ?? SET ?";
      let values = [table, body];

      if (selectParams.sql.includes(" where ")) {
        sql += " where " + selectParams.sql.split(" where ")[1];
        values = values.concat(selectParams.values);
      }

      await db.query(sql, values);
    } else {
      // Nothing to update.
      let resBody = (
        await Promise.all(
          currents.map((current) =>
            mapInternalIdentsToExposed(relations, current)
          )
        )
      ).map((x) => _.pick(resBodyKeys, x));
      return res.status(200).json(resBody);
    }
    const records = await db.query(selectParams);
    const resBody = (
      await Promise.all(
        records.map((record) => mapInternalIdentsToExposed(relations, record))
      )
    ).map((x) => _.pick(resBodyKeys, x));
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.riskCategoryAttributeTypeDelete = async (req, res, next) => {
  try {
    const table = "RiskCategoryAttributeType";
    const archiveTable = archiveTablesMap[table];
    const resBodyKeys = [
      "riskCategoryUuid",
      "parentUuid",
      "enum",
      "name",
      "labelNumber",
      "defaultValue",
      "isRequired",
      "jsonSchema",
      "label",
      "placeholderText",
      "helpMarkdownText",
      "isMedia",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];
    const ident = "uuid";
    const joins = [
      {
        type: "left",
        target: "RiskCategoryAttributeType",
        alias: "RiskCategoryAttributeType_0",
        on: { id: "$RiskCategoryAttributeType.parentId$" },
      },
      {
        type: "left",
        target: "RiskCategory",
        alias: "RiskCategory_1",
        on: { id: "$RiskCategoryAttributeType.riskCategoryId$" },
      },
    ];
    const fields = [
      "*",
      { as: "parentUuid", expression: "RiskCategoryAttributeType_0.uuid" },
      { as: "riskCategoryUuid", expression: "RiskCategory_1.uuid" },
    ];

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const current = await db.queryHead(sqlStringAndValues);

    if (!current) {
      return res.status(404).json({ errors: ["Record not found"] });
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? SET ?", [
        archiveTable,
        {
          ..._.omit(["parentUuid", "riskCategoryUuid"], current),
          modifier: req.headers["x-user-uuid"] || "stub",
          userDeleted: 1,
        },
      ]);
    }

    await db.query("DELETE FROM ?? WHERE ?? = ?", [
      table,
      ident,
      req.params[ident],
    ]);

    const resBody = _.pick(resBodyKeys, current);
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.riskCategoryAttributeTypeDeleteList = async (req, res, next) => {
  try {
    const table = "RiskCategoryAttributeType";
    const archiveTable = archiveTablesMap[table];
    const relations = relationsMap[table];
    const resBodyKeys = [
      "riskCategoryUuid",
      "parentUuid",
      "enum",
      "name",
      "labelNumber",
      "defaultValue",
      "isRequired",
      "jsonSchema",
      "label",
      "placeholderText",
      "helpMarkdownText",
      "isMedia",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];

    const $where = await prepareWhere(relations, req.query.$where);
    const selectParams = await getSQLString({
      table,
      $where,
    });

    const currents = await db.query(selectParams);
    if (!currents.length) {
      return res.status(200).json([]);
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? (??) VALUES ?", [
        archiveTable,
        []
          .concat(Object.keys(currents[0]))
          .concat("modifier")
          .concat("userDeleted"),
        currents.map((c) =>
          Object.values(c)
            .concat(req.headers["x-user-uuid"] || "stub")
            .concat(1)
        ),
      ]);
    }

    let sql = "DELETE FROM ??";
    let values = [table];

    if (selectParams.sql.includes(" where ")) {
      sql += " where " + selectParams.sql.split(" where ")[1];
      values = values.concat(selectParams.values);
    }

    await db.query(sql, values);

    const resBody = (
      await Promise.all(
        currents.map((record) => mapInternalIdentsToExposed(relations, record))
      )
    ).map((x) => _.pick(resBodyKeys, x));
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.riskCategoryProjectGet = async (req, res, next) => {
  try {
    const table = "RiskCategoryProject";
    const ident = "uuid";
    const joins = [
      {
        type: "left",
        target: "Project",
        alias: "Project_0",
        on: { id: "$RiskCategoryProject.projectId$" },
      },
      {
        type: "left",
        target: "RiskCategory",
        alias: "RiskCategory_1",
        on: { id: "$RiskCategoryProject.riskCategoryId$" },
      },
    ];
    const fields = [
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
      { as: "projectUuid", expression: "Project_0.uuid" },
      { as: "riskCategoryUuid", expression: "RiskCategory_1.uuid" },
    ];
    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const record = await db.queryHead(sqlStringAndValues);
    if (!record) {
      return res.status(404).json({ errors: ["Record not found"] });
    }
    return res.status(200).json(record);
  } catch (e) {
    return next(e);
  }
};

module.exports.riskCategoryProjectGetList = async (req, res, next) => {
  try {
    const table = "RiskCategoryProject";
    const relations = [
      {
        localTable: "RiskCategoryProject",
        localField: "projectId",
        localForeignIdent: "projectUuid",
        foreignTable: "Project",
        foreignField: "id",
        foreignIdent: "uuid",
      },
      {
        localTable: "RiskCategoryProject",
        localField: "riskCategoryId",
        localForeignIdent: "riskCategoryUuid",
        foreignTable: "RiskCategory",
        foreignField: "id",
        foreignIdent: "uuid",
      },
    ];

    const $where = await prepareWhere(relations, req.query.$where);
    const $orderBy = req.query.$orderBy
      ? Array.isArray(req.query.$orderBy)
        ? req.query.$orderBy.map((x) => mapExposedKeysToInternal(relations, x))
        : mapExposedKeysToInternal(relations, req.query.$orderBy)
      : undefined;

    // https://github.com/epoberezkin/ajv/issues/276
    if (req.query.$paginate && req.query.$paginate.page) {
      req.query.$paginate.pageSize = req.query.$paginate.pageSize || 20;
    }

    let rows, totalCount;

    const joins = [
      {
        type: "left",
        target: "Project",
        alias: "Project_0",
        on: { id: "$RiskCategoryProject.projectId$" },
      },
      {
        type: "left",
        target: "RiskCategory",
        alias: "RiskCategory_1",
        on: { id: "$RiskCategoryProject.riskCategoryId$" },
      },
    ];
    const fields = [
      "id",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
      { as: "projectUuid", expression: "Project_0.uuid" },
      { as: "riskCategoryUuid", expression: "RiskCategory_1.uuid" },
    ];
    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where,
      $orderBy,
      $paginate: req.query.$paginate || undefined,
    });

    if (req.query.$paginate) {
      [rows, totalCount] = await Promise.all([
        db.query(sqlStringAndValues),
        db
          .queryHead(
            await getSQLString({
              table,
              fields: ["COUNT(*)"],
              $where,
              $orderBy,
            })
          )
          .then((d) => d["COUNT(*)"]),
      ]);
    } else {
      rows = await db.query(sqlStringAndValues);
    }

    if (req.query.$paginate) {
      if (typeof req.query.$paginate.limit === "number") {
        const hasMoreResults = rows.length === req.query.$paginate.limit + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }

        res.set("x-pagination-limit", req.query.$paginate.limit);
        res.set("x-pagination-offset", req.query.$paginate.offset);
        res.set(
          "x-pagination-has-previous-page",
          req.query.$paginate.offset > 0
        );
        res.set("x-pagination-has-next-page", !!hasMoreResults);
      } else if (typeof req.query.$paginate.page === "number") {
        const hasMoreResults = rows.length === req.query.$paginate.pageSize + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }

        res.set("x-pagination-page", req.query.$paginate.page);
        res.set("x-pagination-page-size", req.query.$paginate.pageSize);
        res.set("x-pagination-has-previous-page", req.query.$paginate.page > 1);
        res.set("x-pagination-has-next-page", !!hasMoreResults);
      } else {
        const flip =
          typeof req.query.$paginate.first === "number" ? false : true;
        const limit = flip
          ? req.query.$paginate.last
          : req.query.$paginate.first;

        const hasMoreResults = rows.length === limit + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }
        if (flip) {
          rows = rows.reverse();
        }

        const hasPreviousPage = flip ? hasMoreResults : false;
        const hasNextPage = flip ? false : hasMoreResults;
        const startCursor =
          rows[0] && rows[0].id ? encodeCursor(rows[0].id) : null;
        const endCursor =
          rows[rows.length - 1] && rows[rows.length - 1].id
            ? encodeCursor(rows[rows.length - 1].id)
            : null;

        res.set("x-pagination-has-previous-page", hasPreviousPage);
        res.set("x-pagination-has-next-page", hasNextPage);
        if (startCursor != null) {
          res.set("x-pagination-start-cursor", startCursor);
        }
        if (endCursor != null) {
          res.set("x-pagination-end-cursor", endCursor);
        }
      }
    }

    if (typeof totalCount === "number") {
      res.set("x-pagination-total-count", totalCount);
    }

    if (
      typeof totalCount === "number" &&
      req.query.$paginate &&
      req.query.$paginate.pageSize
    ) {
      res.set(
        "x-pagination-last-page",
        Math.ceil(totalCount / req.query.$paginate.pageSize)
      );
    }

    // https://jsperf.com/delete-vs-spread-vs-lodash-omit-vs-lodash-inverse-pick
    for (let row of rows) {
      row.id = undefined;
    }

    return res.status(200).json(rows);
  } catch (e) {
    return next(e);
  }
};

module.exports.riskCategoryProjectPost = async (req, res, next) => {
  try {
    const table = "RiskCategoryProject";
    const relations = [
      {
        localTable: "RiskCategoryProject",
        localField: "projectId",
        localForeignIdent: "projectUuid",
        foreignTable: "Project",
        foreignField: "id",
        foreignIdent: "uuid",
      },
      {
        localTable: "RiskCategoryProject",
        localField: "riskCategoryId",
        localForeignIdent: "riskCategoryUuid",
        foreignTable: "RiskCategory",
        foreignField: "id",
        foreignIdent: "uuid",
      },
    ];
    const reqBodySchema = require("./schemas/risk-category-project.POST.req.body.json");
    const ident = "uuid";
    const joins = [
      {
        type: "left",
        target: "Project",
        alias: "Project_0",
        on: { id: "$RiskCategoryProject.projectId$" },
      },
      {
        type: "left",
        target: "RiskCategory",
        alias: "RiskCategory_1",
        on: { id: "$RiskCategoryProject.riskCategoryId$" },
      },
    ];
    const fields = [
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
      { as: "projectUuid", expression: "Project_0.uuid" },
      { as: "riskCategoryUuid", expression: "RiskCategory_1.uuid" },
    ];

    const body = prepareDateTimeStrings(
      reqBodySchema,
      await mapExposedIdentsToInternal(relations, req.body)
    );

    const inserted = await db.query("INSERT INTO ?? SET ?? = UUID(), ?", [
      table,
      ident,
      body,
    ]);
    const id = inserted.insertId;

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { id },
    });
    const record = await db.queryHead(sqlStringAndValues);

    return res.status(200).json(record);
  } catch (e) {
    return next(e);
  }
};

module.exports.riskCategoryProjectPatch = async (req, res, next) => {
  try {
    const table = "RiskCategoryProject";
    const archiveTable = archiveTablesMap[table];
    const relations = [
      {
        localTable: "RiskCategoryProject",
        localField: "projectId",
        localForeignIdent: "projectUuid",
        foreignTable: "Project",
        foreignField: "id",
        foreignIdent: "uuid",
      },
      {
        localTable: "RiskCategoryProject",
        localField: "riskCategoryId",
        localForeignIdent: "riskCategoryUuid",
        foreignTable: "RiskCategory",
        foreignField: "id",
        foreignIdent: "uuid",
      },
    ];
    const reqBodySchema = require("./schemas/risk-category-project.PATCH.req.body.json");
    const resBodyKeys = [
      "riskCategoryUuid",
      "projectUuid",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];
    const ident = "uuid";
    const joins = [
      {
        type: "left",
        target: "Project",
        alias: "Project_0",
        on: { id: "$RiskCategoryProject.projectId$" },
      },
      {
        type: "left",
        target: "RiskCategory",
        alias: "RiskCategory_1",
        on: { id: "$RiskCategoryProject.riskCategoryId$" },
      },
    ];
    const fields = [
      "*",
      { as: "projectUuid", expression: "Project_0.uuid" },
      { as: "riskCategoryUuid", expression: "RiskCategory_1.uuid" },
    ];

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const current = await db.queryHead(sqlStringAndValues);

    if (!current) {
      return res.status(404).json({ errors: ["Record not found"] });
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? SET ?", [
        archiveTable,
        {
          ..._.omit(["projectUuid", "riskCategoryUuid"], current),
          modifier: req.headers["x-user-uuid"] || "stub",
        },
      ]);
    }

    if (Object.keys(req.body).length) {
      const body = prepareDateTimeStrings(
        reqBodySchema,
        await mapExposedIdentsToInternal(relations, req.body)
      );
      await db.query("UPDATE ?? SET ? WHERE ?? = ?", [
        table,
        body,
        ident,
        req.params[ident],
      ]);
    } else {
      // Nothing to update.
      const resBody = _.pick(resBodyKeys, current);
      return res.status(200).json(resBody);
    }
    const record = await db.queryHead(
      await getSQLString({
        table,
        fields,
        joins,
        $where: { [ident]: req.params["uuid"] },
      })
    );

    const resBody = _.pick(resBodyKeys, record);
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.riskCategoryProjectPatchList = async (req, res, next) => {
  try {
    const table = "RiskCategoryProject";
    const relations = relationsMap[table];
    const archiveTable = archiveTablesMap[table];
    const reqBodySchema = require("./schemas/risk-category-project.PATCH.list.req.body.json");
    const resBodyKeys = [
      "riskCategoryUuid",
      "projectUuid",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];

    const $where = await prepareWhere(relations, req.query.$where);
    const selectParams = await getSQLString({
      table,
      $where,
    });

    const currents = await db.query(selectParams);
    if (!currents.length) {
      return res.status(200).json([]);
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? (??) VALUES ?", [
        archiveTable,
        [].concat(Object.keys(currents[0])).concat("modifier"),
        currents.map((c) =>
          Object.values(c).concat(req.headers["x-user-uuid"] || "stub")
        ),
      ]);
    }

    if (Object.keys(req.body).length) {
      const body = prepareDateTimeStrings(
        reqBodySchema,
        await mapExposedIdentsToInternal(relations, req.body)
      );

      let sql = "UPDATE ?? SET ?";
      let values = [table, body];

      if (selectParams.sql.includes(" where ")) {
        sql += " where " + selectParams.sql.split(" where ")[1];
        values = values.concat(selectParams.values);
      }

      await db.query(sql, values);
    } else {
      // Nothing to update.
      let resBody = (
        await Promise.all(
          currents.map((current) =>
            mapInternalIdentsToExposed(relations, current)
          )
        )
      ).map((x) => _.pick(resBodyKeys, x));
      return res.status(200).json(resBody);
    }
    const records = await db.query(selectParams);
    const resBody = (
      await Promise.all(
        records.map((record) => mapInternalIdentsToExposed(relations, record))
      )
    ).map((x) => _.pick(resBodyKeys, x));
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.riskCategoryProjectDelete = async (req, res, next) => {
  try {
    const table = "RiskCategoryProject";
    const archiveTable = archiveTablesMap[table];
    const resBodyKeys = [
      "riskCategoryUuid",
      "projectUuid",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];
    const ident = "uuid";
    const joins = [
      {
        type: "left",
        target: "Project",
        alias: "Project_0",
        on: { id: "$RiskCategoryProject.projectId$" },
      },
      {
        type: "left",
        target: "RiskCategory",
        alias: "RiskCategory_1",
        on: { id: "$RiskCategoryProject.riskCategoryId$" },
      },
    ];
    const fields = [
      "*",
      { as: "projectUuid", expression: "Project_0.uuid" },
      { as: "riskCategoryUuid", expression: "RiskCategory_1.uuid" },
    ];

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const current = await db.queryHead(sqlStringAndValues);

    if (!current) {
      return res.status(404).json({ errors: ["Record not found"] });
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? SET ?", [
        archiveTable,
        {
          ..._.omit(["projectUuid", "riskCategoryUuid"], current),
          modifier: req.headers["x-user-uuid"] || "stub",
          userDeleted: 1,
        },
      ]);
    }

    await db.query("DELETE FROM ?? WHERE ?? = ?", [
      table,
      ident,
      req.params[ident],
    ]);

    const resBody = _.pick(resBodyKeys, current);
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.riskCategoryProjectDeleteList = async (req, res, next) => {
  try {
    const table = "RiskCategoryProject";
    const archiveTable = archiveTablesMap[table];
    const relations = relationsMap[table];
    const resBodyKeys = [
      "riskCategoryUuid",
      "projectUuid",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];

    const $where = await prepareWhere(relations, req.query.$where);
    const selectParams = await getSQLString({
      table,
      $where,
    });

    const currents = await db.query(selectParams);
    if (!currents.length) {
      return res.status(200).json([]);
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? (??) VALUES ?", [
        archiveTable,
        []
          .concat(Object.keys(currents[0]))
          .concat("modifier")
          .concat("userDeleted"),
        currents.map((c) =>
          Object.values(c)
            .concat(req.headers["x-user-uuid"] || "stub")
            .concat(1)
        ),
      ]);
    }

    let sql = "DELETE FROM ??";
    let values = [table];

    if (selectParams.sql.includes(" where ")) {
      sql += " where " + selectParams.sql.split(" where ")[1];
      values = values.concat(selectParams.values);
    }

    await db.query(sql, values);

    const resBody = (
      await Promise.all(
        currents.map((record) => mapInternalIdentsToExposed(relations, record))
      )
    ).map((x) => _.pick(resBodyKeys, x));
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.riskDiscussionGet = async (req, res, next) => {
  try {
    const table = "RiskDiscussion";
    const ident = "uuid";
    const joins = [
      {
        type: "left",
        target: "Risk",
        alias: "Risk_0",
        on: { id: "$RiskDiscussion.riskId$" },
      },
    ];
    const fields = [
      "type",
      "locked",
      "closed",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
      { as: "riskUuid", expression: "Risk_0.uuid" },
    ];
    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const record = await db.queryHead(sqlStringAndValues);
    if (!record) {
      return res.status(404).json({ errors: ["Record not found"] });
    }
    return res.status(200).json(record);
  } catch (e) {
    return next(e);
  }
};

module.exports.riskDiscussionGetList = async (req, res, next) => {
  try {
    const table = "RiskDiscussion";
    const relations = [
      {
        localTable: "RiskDiscussion",
        localField: "riskId",
        localForeignIdent: "riskUuid",
        foreignTable: "Risk",
        foreignField: "id",
        foreignIdent: "uuid",
      },
    ];

    const $where = await prepareWhere(relations, req.query.$where);
    const $orderBy = req.query.$orderBy
      ? Array.isArray(req.query.$orderBy)
        ? req.query.$orderBy.map((x) => mapExposedKeysToInternal(relations, x))
        : mapExposedKeysToInternal(relations, req.query.$orderBy)
      : undefined;

    // https://github.com/epoberezkin/ajv/issues/276
    if (req.query.$paginate && req.query.$paginate.page) {
      req.query.$paginate.pageSize = req.query.$paginate.pageSize || 20;
    }

    let rows, totalCount;

    const joins = [
      {
        type: "left",
        target: "Risk",
        alias: "Risk_0",
        on: { id: "$RiskDiscussion.riskId$" },
      },
    ];
    const fields = [
      "id",
      "type",
      "locked",
      "closed",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
      { as: "riskUuid", expression: "Risk_0.uuid" },
    ];
    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where,
      $orderBy,
      $paginate: req.query.$paginate || undefined,
    });

    if (req.query.$paginate) {
      [rows, totalCount] = await Promise.all([
        db.query(sqlStringAndValues),
        db
          .queryHead(
            await getSQLString({
              table,
              fields: ["COUNT(*)"],
              $where,
              $orderBy,
            })
          )
          .then((d) => d["COUNT(*)"]),
      ]);
    } else {
      rows = await db.query(sqlStringAndValues);
    }

    if (req.query.$paginate) {
      if (typeof req.query.$paginate.limit === "number") {
        const hasMoreResults = rows.length === req.query.$paginate.limit + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }

        res.set("x-pagination-limit", req.query.$paginate.limit);
        res.set("x-pagination-offset", req.query.$paginate.offset);
        res.set(
          "x-pagination-has-previous-page",
          req.query.$paginate.offset > 0
        );
        res.set("x-pagination-has-next-page", !!hasMoreResults);
      } else if (typeof req.query.$paginate.page === "number") {
        const hasMoreResults = rows.length === req.query.$paginate.pageSize + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }

        res.set("x-pagination-page", req.query.$paginate.page);
        res.set("x-pagination-page-size", req.query.$paginate.pageSize);
        res.set("x-pagination-has-previous-page", req.query.$paginate.page > 1);
        res.set("x-pagination-has-next-page", !!hasMoreResults);
      } else {
        const flip =
          typeof req.query.$paginate.first === "number" ? false : true;
        const limit = flip
          ? req.query.$paginate.last
          : req.query.$paginate.first;

        const hasMoreResults = rows.length === limit + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }
        if (flip) {
          rows = rows.reverse();
        }

        const hasPreviousPage = flip ? hasMoreResults : false;
        const hasNextPage = flip ? false : hasMoreResults;
        const startCursor =
          rows[0] && rows[0].id ? encodeCursor(rows[0].id) : null;
        const endCursor =
          rows[rows.length - 1] && rows[rows.length - 1].id
            ? encodeCursor(rows[rows.length - 1].id)
            : null;

        res.set("x-pagination-has-previous-page", hasPreviousPage);
        res.set("x-pagination-has-next-page", hasNextPage);
        if (startCursor != null) {
          res.set("x-pagination-start-cursor", startCursor);
        }
        if (endCursor != null) {
          res.set("x-pagination-end-cursor", endCursor);
        }
      }
    }

    if (typeof totalCount === "number") {
      res.set("x-pagination-total-count", totalCount);
    }

    if (
      typeof totalCount === "number" &&
      req.query.$paginate &&
      req.query.$paginate.pageSize
    ) {
      res.set(
        "x-pagination-last-page",
        Math.ceil(totalCount / req.query.$paginate.pageSize)
      );
    }

    // https://jsperf.com/delete-vs-spread-vs-lodash-omit-vs-lodash-inverse-pick
    for (let row of rows) {
      row.id = undefined;
    }

    return res.status(200).json(rows);
  } catch (e) {
    return next(e);
  }
};

module.exports.riskDiscussionPost = async (req, res, next) => {
  try {
    const table = "RiskDiscussion";
    const relations = [
      {
        localTable: "RiskDiscussion",
        localField: "riskId",
        localForeignIdent: "riskUuid",
        foreignTable: "Risk",
        foreignField: "id",
        foreignIdent: "uuid",
      },
    ];
    const reqBodySchema = require("./schemas/risk-discussion.POST.req.body.json");
    const ident = "uuid";
    const joins = [
      {
        type: "left",
        target: "Risk",
        alias: "Risk_0",
        on: { id: "$RiskDiscussion.riskId$" },
      },
    ];
    const fields = [
      "type",
      "locked",
      "closed",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
      { as: "riskUuid", expression: "Risk_0.uuid" },
    ];

    const body = prepareDateTimeStrings(
      reqBodySchema,
      await mapExposedIdentsToInternal(relations, req.body)
    );

    const inserted = await db.query("INSERT INTO ?? SET ?? = UUID(), ?", [
      table,
      ident,
      body,
    ]);
    const id = inserted.insertId;

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { id },
    });
    const record = await db.queryHead(sqlStringAndValues);

    return res.status(200).json(record);
  } catch (e) {
    return next(e);
  }
};

module.exports.riskDiscussionPatch = async (req, res, next) => {
  try {
    const table = "RiskDiscussion";
    const archiveTable = archiveTablesMap[table];
    const relations = [
      {
        localTable: "RiskDiscussion",
        localField: "riskId",
        localForeignIdent: "riskUuid",
        foreignTable: "Risk",
        foreignField: "id",
        foreignIdent: "uuid",
      },
    ];
    const reqBodySchema = require("./schemas/risk-discussion.PATCH.req.body.json");
    const resBodyKeys = [
      "type",
      "riskUuid",
      "locked",
      "closed",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];
    const ident = "uuid";
    const joins = [
      {
        type: "left",
        target: "Risk",
        alias: "Risk_0",
        on: { id: "$RiskDiscussion.riskId$" },
      },
    ];
    const fields = ["*", { as: "riskUuid", expression: "Risk_0.uuid" }];

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const current = await db.queryHead(sqlStringAndValues);

    if (!current) {
      return res.status(404).json({ errors: ["Record not found"] });
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? SET ?", [
        archiveTable,
        {
          ..._.omit(["riskUuid"], current),
          modifier: req.headers["x-user-uuid"] || "stub",
        },
      ]);
    }

    if (Object.keys(req.body).length) {
      const body = prepareDateTimeStrings(
        reqBodySchema,
        await mapExposedIdentsToInternal(relations, req.body)
      );
      await db.query("UPDATE ?? SET ? WHERE ?? = ?", [
        table,
        body,
        ident,
        req.params[ident],
      ]);
    } else {
      // Nothing to update.
      const resBody = _.pick(resBodyKeys, current);
      return res.status(200).json(resBody);
    }
    const record = await db.queryHead(
      await getSQLString({
        table,
        fields,
        joins,
        $where: { [ident]: req.params["uuid"] },
      })
    );

    const resBody = _.pick(resBodyKeys, record);
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.riskDiscussionPatchList = async (req, res, next) => {
  try {
    const table = "RiskDiscussion";
    const relations = relationsMap[table];
    const archiveTable = archiveTablesMap[table];
    const reqBodySchema = require("./schemas/risk-discussion.PATCH.list.req.body.json");
    const resBodyKeys = [
      "type",
      "riskUuid",
      "locked",
      "closed",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];

    const $where = await prepareWhere(relations, req.query.$where);
    const selectParams = await getSQLString({
      table,
      $where,
    });

    const currents = await db.query(selectParams);
    if (!currents.length) {
      return res.status(200).json([]);
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? (??) VALUES ?", [
        archiveTable,
        [].concat(Object.keys(currents[0])).concat("modifier"),
        currents.map((c) =>
          Object.values(c).concat(req.headers["x-user-uuid"] || "stub")
        ),
      ]);
    }

    if (Object.keys(req.body).length) {
      const body = prepareDateTimeStrings(
        reqBodySchema,
        await mapExposedIdentsToInternal(relations, req.body)
      );

      let sql = "UPDATE ?? SET ?";
      let values = [table, body];

      if (selectParams.sql.includes(" where ")) {
        sql += " where " + selectParams.sql.split(" where ")[1];
        values = values.concat(selectParams.values);
      }

      await db.query(sql, values);
    } else {
      // Nothing to update.
      let resBody = (
        await Promise.all(
          currents.map((current) =>
            mapInternalIdentsToExposed(relations, current)
          )
        )
      ).map((x) => _.pick(resBodyKeys, x));
      return res.status(200).json(resBody);
    }
    const records = await db.query(selectParams);
    const resBody = (
      await Promise.all(
        records.map((record) => mapInternalIdentsToExposed(relations, record))
      )
    ).map((x) => _.pick(resBodyKeys, x));
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.riskDiscussionDelete = async (req, res, next) => {
  try {
    const table = "RiskDiscussion";
    const archiveTable = archiveTablesMap[table];
    const resBodyKeys = [
      "type",
      "riskUuid",
      "locked",
      "closed",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];
    const ident = "uuid";
    const joins = [
      {
        type: "left",
        target: "Risk",
        alias: "Risk_0",
        on: { id: "$RiskDiscussion.riskId$" },
      },
    ];
    const fields = ["*", { as: "riskUuid", expression: "Risk_0.uuid" }];

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const current = await db.queryHead(sqlStringAndValues);

    if (!current) {
      return res.status(404).json({ errors: ["Record not found"] });
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? SET ?", [
        archiveTable,
        {
          ..._.omit(["riskUuid"], current),
          modifier: req.headers["x-user-uuid"] || "stub",
          userDeleted: 1,
        },
      ]);
    }

    await db.query("DELETE FROM ?? WHERE ?? = ?", [
      table,
      ident,
      req.params[ident],
    ]);

    const resBody = _.pick(resBodyKeys, current);
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.riskDiscussionDeleteList = async (req, res, next) => {
  try {
    const table = "RiskDiscussion";
    const archiveTable = archiveTablesMap[table];
    const relations = relationsMap[table];
    const resBodyKeys = [
      "type",
      "riskUuid",
      "locked",
      "closed",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];

    const $where = await prepareWhere(relations, req.query.$where);
    const selectParams = await getSQLString({
      table,
      $where,
    });

    const currents = await db.query(selectParams);
    if (!currents.length) {
      return res.status(200).json([]);
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? (??) VALUES ?", [
        archiveTable,
        []
          .concat(Object.keys(currents[0]))
          .concat("modifier")
          .concat("userDeleted"),
        currents.map((c) =>
          Object.values(c)
            .concat(req.headers["x-user-uuid"] || "stub")
            .concat(1)
        ),
      ]);
    }

    let sql = "DELETE FROM ??";
    let values = [table];

    if (selectParams.sql.includes(" where ")) {
      sql += " where " + selectParams.sql.split(" where ")[1];
      values = values.concat(selectParams.values);
    }

    await db.query(sql, values);

    const resBody = (
      await Promise.all(
        currents.map((record) => mapInternalIdentsToExposed(relations, record))
      )
    ).map((x) => _.pick(resBodyKeys, x));
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.riskDiscussionMessageGet = async (req, res, next) => {
  try {
    const table = "RiskDiscussionMessage";
    const ident = "uuid";
    const joins = [
      {
        type: "left",
        target: "User",
        alias: "User_0",
        on: { id: "$RiskDiscussionMessage.authorUserId$" },
      },
      {
        type: "left",
        target: "Media",
        alias: "Media_1",
        on: { id: "$RiskDiscussionMessage.mediaId$" },
      },
      {
        type: "left",
        target: "RiskDiscussionMessage",
        alias: "RiskDiscussionMessage_2",
        on: { id: "$RiskDiscussionMessage.parentId$" },
      },
    ];
    const fields = [
      "message",
      "timestamp",
      "hasParentMessage",
      "isEdited",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
      { as: "authorUserUuid", expression: "User_0.uuid" },
      { as: "mediaUuid", expression: "Media_1.uuid" },
      { as: "parentUuid", expression: "RiskDiscussionMessage_2.uuid" },
    ];
    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const record = await db.queryHead(sqlStringAndValues);
    if (!record) {
      return res.status(404).json({ errors: ["Record not found"] });
    }
    return res.status(200).json(record);
  } catch (e) {
    return next(e);
  }
};

module.exports.riskDiscussionMessageGetList = async (req, res, next) => {
  try {
    const table = "RiskDiscussionMessage";
    const relations = [
      {
        localTable: "RiskDiscussionMessage",
        localField: "authorUserId",
        localForeignIdent: "authorUserUuid",
        foreignTable: "User",
        foreignField: "id",
        foreignIdent: "uuid",
      },
      {
        localTable: "RiskDiscussionMessage",
        localField: "mediaId",
        localForeignIdent: "mediaUuid",
        foreignTable: "Media",
        foreignField: "id",
        foreignIdent: "uuid",
      },
      {
        localTable: "RiskDiscussionMessage",
        localField: "parentId",
        localForeignIdent: "parentUuid",
        foreignTable: "RiskDiscussionMessage",
        foreignField: "id",
        foreignIdent: "uuid",
      },
    ];

    const $where = await prepareWhere(relations, req.query.$where);
    const $orderBy = req.query.$orderBy
      ? Array.isArray(req.query.$orderBy)
        ? req.query.$orderBy.map((x) => mapExposedKeysToInternal(relations, x))
        : mapExposedKeysToInternal(relations, req.query.$orderBy)
      : undefined;

    // https://github.com/epoberezkin/ajv/issues/276
    if (req.query.$paginate && req.query.$paginate.page) {
      req.query.$paginate.pageSize = req.query.$paginate.pageSize || 20;
    }

    let rows, totalCount;

    const joins = [
      {
        type: "left",
        target: "User",
        alias: "User_0",
        on: { id: "$RiskDiscussionMessage.authorUserId$" },
      },
      {
        type: "left",
        target: "Media",
        alias: "Media_1",
        on: { id: "$RiskDiscussionMessage.mediaId$" },
      },
      {
        type: "left",
        target: "RiskDiscussionMessage",
        alias: "RiskDiscussionMessage_2",
        on: { id: "$RiskDiscussionMessage.parentId$" },
      },
    ];
    const fields = [
      "id",
      "message",
      "timestamp",
      "hasParentMessage",
      "isEdited",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
      { as: "authorUserUuid", expression: "User_0.uuid" },
      { as: "mediaUuid", expression: "Media_1.uuid" },
      { as: "parentUuid", expression: "RiskDiscussionMessage_2.uuid" },
    ];
    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where,
      $orderBy,
      $paginate: req.query.$paginate || undefined,
    });

    if (req.query.$paginate) {
      [rows, totalCount] = await Promise.all([
        db.query(sqlStringAndValues),
        db
          .queryHead(
            await getSQLString({
              table,
              fields: ["COUNT(*)"],
              $where,
              $orderBy,
            })
          )
          .then((d) => d["COUNT(*)"]),
      ]);
    } else {
      rows = await db.query(sqlStringAndValues);
    }

    if (req.query.$paginate) {
      if (typeof req.query.$paginate.limit === "number") {
        const hasMoreResults = rows.length === req.query.$paginate.limit + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }

        res.set("x-pagination-limit", req.query.$paginate.limit);
        res.set("x-pagination-offset", req.query.$paginate.offset);
        res.set(
          "x-pagination-has-previous-page",
          req.query.$paginate.offset > 0
        );
        res.set("x-pagination-has-next-page", !!hasMoreResults);
      } else if (typeof req.query.$paginate.page === "number") {
        const hasMoreResults = rows.length === req.query.$paginate.pageSize + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }

        res.set("x-pagination-page", req.query.$paginate.page);
        res.set("x-pagination-page-size", req.query.$paginate.pageSize);
        res.set("x-pagination-has-previous-page", req.query.$paginate.page > 1);
        res.set("x-pagination-has-next-page", !!hasMoreResults);
      } else {
        const flip =
          typeof req.query.$paginate.first === "number" ? false : true;
        const limit = flip
          ? req.query.$paginate.last
          : req.query.$paginate.first;

        const hasMoreResults = rows.length === limit + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }
        if (flip) {
          rows = rows.reverse();
        }

        const hasPreviousPage = flip ? hasMoreResults : false;
        const hasNextPage = flip ? false : hasMoreResults;
        const startCursor =
          rows[0] && rows[0].id ? encodeCursor(rows[0].id) : null;
        const endCursor =
          rows[rows.length - 1] && rows[rows.length - 1].id
            ? encodeCursor(rows[rows.length - 1].id)
            : null;

        res.set("x-pagination-has-previous-page", hasPreviousPage);
        res.set("x-pagination-has-next-page", hasNextPage);
        if (startCursor != null) {
          res.set("x-pagination-start-cursor", startCursor);
        }
        if (endCursor != null) {
          res.set("x-pagination-end-cursor", endCursor);
        }
      }
    }

    if (typeof totalCount === "number") {
      res.set("x-pagination-total-count", totalCount);
    }

    if (
      typeof totalCount === "number" &&
      req.query.$paginate &&
      req.query.$paginate.pageSize
    ) {
      res.set(
        "x-pagination-last-page",
        Math.ceil(totalCount / req.query.$paginate.pageSize)
      );
    }

    // https://jsperf.com/delete-vs-spread-vs-lodash-omit-vs-lodash-inverse-pick
    for (let row of rows) {
      row.id = undefined;
    }

    return res.status(200).json(rows);
  } catch (e) {
    return next(e);
  }
};

module.exports.riskDiscussionMessagePost = async (req, res, next) => {
  try {
    const table = "RiskDiscussionMessage";
    const relations = [
      {
        localTable: "RiskDiscussionMessage",
        localField: "authorUserId",
        localForeignIdent: "authorUserUuid",
        foreignTable: "User",
        foreignField: "id",
        foreignIdent: "uuid",
      },
      {
        localTable: "RiskDiscussionMessage",
        localField: "mediaId",
        localForeignIdent: "mediaUuid",
        foreignTable: "Media",
        foreignField: "id",
        foreignIdent: "uuid",
      },
      {
        localTable: "RiskDiscussionMessage",
        localField: "parentId",
        localForeignIdent: "parentUuid",
        foreignTable: "RiskDiscussionMessage",
        foreignField: "id",
        foreignIdent: "uuid",
      },
    ];
    const reqBodySchema = require("./schemas/risk-discussion-message.POST.req.body.json");
    const ident = "uuid";
    const joins = [
      {
        type: "left",
        target: "User",
        alias: "User_0",
        on: { id: "$RiskDiscussionMessage.authorUserId$" },
      },
      {
        type: "left",
        target: "Media",
        alias: "Media_1",
        on: { id: "$RiskDiscussionMessage.mediaId$" },
      },
      {
        type: "left",
        target: "RiskDiscussionMessage",
        alias: "RiskDiscussionMessage_2",
        on: { id: "$RiskDiscussionMessage.parentId$" },
      },
    ];
    const fields = [
      "message",
      "timestamp",
      "hasParentMessage",
      "isEdited",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
      { as: "authorUserUuid", expression: "User_0.uuid" },
      { as: "mediaUuid", expression: "Media_1.uuid" },
      { as: "parentUuid", expression: "RiskDiscussionMessage_2.uuid" },
    ];

    const body = prepareDateTimeStrings(
      reqBodySchema,
      await mapExposedIdentsToInternal(relations, req.body)
    );

    const inserted = await db.query("INSERT INTO ?? SET ?? = UUID(), ?", [
      table,
      ident,
      body,
    ]);
    const id = inserted.insertId;

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { id },
    });
    const record = await db.queryHead(sqlStringAndValues);

    return res.status(200).json(record);
  } catch (e) {
    return next(e);
  }
};

module.exports.riskDiscussionMessagePatch = async (req, res, next) => {
  try {
    const table = "RiskDiscussionMessage";
    const archiveTable = archiveTablesMap[table];
    const relations = [
      {
        localTable: "RiskDiscussionMessage",
        localField: "authorUserId",
        localForeignIdent: "authorUserUuid",
        foreignTable: "User",
        foreignField: "id",
        foreignIdent: "uuid",
      },
      {
        localTable: "RiskDiscussionMessage",
        localField: "mediaId",
        localForeignIdent: "mediaUuid",
        foreignTable: "Media",
        foreignField: "id",
        foreignIdent: "uuid",
      },
      {
        localTable: "RiskDiscussionMessage",
        localField: "parentId",
        localForeignIdent: "parentUuid",
        foreignTable: "RiskDiscussionMessage",
        foreignField: "id",
        foreignIdent: "uuid",
      },
    ];
    const reqBodySchema = require("./schemas/risk-discussion-message.PATCH.req.body.json");
    const resBodyKeys = [
      "authorUserUuid",
      "parentUuid",
      "mediaUuid",
      "message",
      "timestamp",
      "hasParentMessage",
      "isEdited",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];
    const ident = "uuid";
    const joins = [
      {
        type: "left",
        target: "User",
        alias: "User_0",
        on: { id: "$RiskDiscussionMessage.authorUserId$" },
      },
      {
        type: "left",
        target: "Media",
        alias: "Media_1",
        on: { id: "$RiskDiscussionMessage.mediaId$" },
      },
      {
        type: "left",
        target: "RiskDiscussionMessage",
        alias: "RiskDiscussionMessage_2",
        on: { id: "$RiskDiscussionMessage.parentId$" },
      },
    ];
    const fields = [
      "*",
      { as: "authorUserUuid", expression: "User_0.uuid" },
      { as: "mediaUuid", expression: "Media_1.uuid" },
      { as: "parentUuid", expression: "RiskDiscussionMessage_2.uuid" },
    ];

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const current = await db.queryHead(sqlStringAndValues);

    if (!current) {
      return res.status(404).json({ errors: ["Record not found"] });
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? SET ?", [
        archiveTable,
        {
          ..._.omit(["authorUserUuid", "mediaUuid", "parentUuid"], current),
          modifier: req.headers["x-user-uuid"] || "stub",
        },
      ]);
    }

    if (Object.keys(req.body).length) {
      const body = prepareDateTimeStrings(
        reqBodySchema,
        await mapExposedIdentsToInternal(relations, req.body)
      );
      await db.query("UPDATE ?? SET ? WHERE ?? = ?", [
        table,
        body,
        ident,
        req.params[ident],
      ]);
    } else {
      // Nothing to update.
      const resBody = _.pick(resBodyKeys, current);
      return res.status(200).json(resBody);
    }
    const record = await db.queryHead(
      await getSQLString({
        table,
        fields,
        joins,
        $where: { [ident]: req.params["uuid"] },
      })
    );

    const resBody = _.pick(resBodyKeys, record);
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.riskDiscussionMessagePatchList = async (req, res, next) => {
  try {
    const table = "RiskDiscussionMessage";
    const relations = relationsMap[table];
    const archiveTable = archiveTablesMap[table];
    const reqBodySchema = require("./schemas/risk-discussion-message.PATCH.list.req.body.json");
    const resBodyKeys = [
      "authorUserUuid",
      "parentUuid",
      "mediaUuid",
      "message",
      "timestamp",
      "hasParentMessage",
      "isEdited",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];

    const $where = await prepareWhere(relations, req.query.$where);
    const selectParams = await getSQLString({
      table,
      $where,
    });

    const currents = await db.query(selectParams);
    if (!currents.length) {
      return res.status(200).json([]);
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? (??) VALUES ?", [
        archiveTable,
        [].concat(Object.keys(currents[0])).concat("modifier"),
        currents.map((c) =>
          Object.values(c).concat(req.headers["x-user-uuid"] || "stub")
        ),
      ]);
    }

    if (Object.keys(req.body).length) {
      const body = prepareDateTimeStrings(
        reqBodySchema,
        await mapExposedIdentsToInternal(relations, req.body)
      );

      let sql = "UPDATE ?? SET ?";
      let values = [table, body];

      if (selectParams.sql.includes(" where ")) {
        sql += " where " + selectParams.sql.split(" where ")[1];
        values = values.concat(selectParams.values);
      }

      await db.query(sql, values);
    } else {
      // Nothing to update.
      let resBody = (
        await Promise.all(
          currents.map((current) =>
            mapInternalIdentsToExposed(relations, current)
          )
        )
      ).map((x) => _.pick(resBodyKeys, x));
      return res.status(200).json(resBody);
    }
    const records = await db.query(selectParams);
    const resBody = (
      await Promise.all(
        records.map((record) => mapInternalIdentsToExposed(relations, record))
      )
    ).map((x) => _.pick(resBodyKeys, x));
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.riskDiscussionMessageDelete = async (req, res, next) => {
  try {
    const table = "RiskDiscussionMessage";
    const archiveTable = archiveTablesMap[table];
    const resBodyKeys = [
      "authorUserUuid",
      "parentUuid",
      "mediaUuid",
      "message",
      "timestamp",
      "hasParentMessage",
      "isEdited",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];
    const ident = "uuid";
    const joins = [
      {
        type: "left",
        target: "User",
        alias: "User_0",
        on: { id: "$RiskDiscussionMessage.authorUserId$" },
      },
      {
        type: "left",
        target: "Media",
        alias: "Media_1",
        on: { id: "$RiskDiscussionMessage.mediaId$" },
      },
      {
        type: "left",
        target: "RiskDiscussionMessage",
        alias: "RiskDiscussionMessage_2",
        on: { id: "$RiskDiscussionMessage.parentId$" },
      },
    ];
    const fields = [
      "*",
      { as: "authorUserUuid", expression: "User_0.uuid" },
      { as: "mediaUuid", expression: "Media_1.uuid" },
      { as: "parentUuid", expression: "RiskDiscussionMessage_2.uuid" },
    ];

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const current = await db.queryHead(sqlStringAndValues);

    if (!current) {
      return res.status(404).json({ errors: ["Record not found"] });
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? SET ?", [
        archiveTable,
        {
          ..._.omit(["authorUserUuid", "mediaUuid", "parentUuid"], current),
          modifier: req.headers["x-user-uuid"] || "stub",
          userDeleted: 1,
        },
      ]);
    }

    await db.query("DELETE FROM ?? WHERE ?? = ?", [
      table,
      ident,
      req.params[ident],
    ]);

    const resBody = _.pick(resBodyKeys, current);
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.riskDiscussionMessageDeleteList = async (req, res, next) => {
  try {
    const table = "RiskDiscussionMessage";
    const archiveTable = archiveTablesMap[table];
    const relations = relationsMap[table];
    const resBodyKeys = [
      "authorUserUuid",
      "parentUuid",
      "mediaUuid",
      "message",
      "timestamp",
      "hasParentMessage",
      "isEdited",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];

    const $where = await prepareWhere(relations, req.query.$where);
    const selectParams = await getSQLString({
      table,
      $where,
    });

    const currents = await db.query(selectParams);
    if (!currents.length) {
      return res.status(200).json([]);
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? (??) VALUES ?", [
        archiveTable,
        []
          .concat(Object.keys(currents[0]))
          .concat("modifier")
          .concat("userDeleted"),
        currents.map((c) =>
          Object.values(c)
            .concat(req.headers["x-user-uuid"] || "stub")
            .concat(1)
        ),
      ]);
    }

    let sql = "DELETE FROM ??";
    let values = [table];

    if (selectParams.sql.includes(" where ")) {
      sql += " where " + selectParams.sql.split(" where ")[1];
      values = values.concat(selectParams.values);
    }

    await db.query(sql, values);

    const resBody = (
      await Promise.all(
        currents.map((record) => mapInternalIdentsToExposed(relations, record))
      )
    ).map((x) => _.pick(resBodyKeys, x));
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.riskEvaluationGet = async (req, res, next) => {
  try {
    const table = "RiskEvaluation";
    const ident = "uuid";
    const joins = [
      {
        type: "left",
        target: "Risk",
        alias: "Risk_0",
        on: { id: "$RiskEvaluation.riskId$" },
      },
    ];
    const fields = [
      "type",
      "stage",
      "compositeSeverityOfInjury",
      "compositeFrequencyOfEvent",
      "compositePossibilityOfInjury",
      "severityOfInjuryMin",
      "severityOfInjuryMax",
      "severityOfInjuryVoteAllowed",
      "frequencyOfEventMin",
      "frequencyOfEventMax",
      "frequencyOfEventVoteAllowed",
      "possibilityOfInjuryMin",
      "possibilityOfInjuryMax",
      "possibilityOfInjuryVoteAllowed",
      "compositeRiskScore",
      "riskReductionMeasureComment",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
      { as: "riskUuid", expression: "Risk_0.uuid" },
    ];
    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const record = await db.queryHead(sqlStringAndValues);
    if (!record) {
      return res.status(404).json({ errors: ["Record not found"] });
    }
    return res.status(200).json(record);
  } catch (e) {
    return next(e);
  }
};

module.exports.riskEvaluationGetList = async (req, res, next) => {
  try {
    const table = "RiskEvaluation";
    const relations = [
      {
        localTable: "RiskEvaluation",
        localField: "riskId",
        localForeignIdent: "riskUuid",
        foreignTable: "Risk",
        foreignField: "id",
        foreignIdent: "uuid",
      },
    ];

    const $where = await prepareWhere(relations, req.query.$where);
    const $orderBy = req.query.$orderBy
      ? Array.isArray(req.query.$orderBy)
        ? req.query.$orderBy.map((x) => mapExposedKeysToInternal(relations, x))
        : mapExposedKeysToInternal(relations, req.query.$orderBy)
      : undefined;

    // https://github.com/epoberezkin/ajv/issues/276
    if (req.query.$paginate && req.query.$paginate.page) {
      req.query.$paginate.pageSize = req.query.$paginate.pageSize || 20;
    }

    let rows, totalCount;

    const joins = [
      {
        type: "left",
        target: "Risk",
        alias: "Risk_0",
        on: { id: "$RiskEvaluation.riskId$" },
      },
    ];
    const fields = [
      "id",
      "type",
      "stage",
      "compositeSeverityOfInjury",
      "compositeFrequencyOfEvent",
      "compositePossibilityOfInjury",
      "severityOfInjuryMin",
      "severityOfInjuryMax",
      "severityOfInjuryVoteAllowed",
      "frequencyOfEventMin",
      "frequencyOfEventMax",
      "frequencyOfEventVoteAllowed",
      "possibilityOfInjuryMin",
      "possibilityOfInjuryMax",
      "possibilityOfInjuryVoteAllowed",
      "compositeRiskScore",
      "riskReductionMeasureComment",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
      { as: "riskUuid", expression: "Risk_0.uuid" },
    ];
    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where,
      $orderBy,
      $paginate: req.query.$paginate || undefined,
    });

    if (req.query.$paginate) {
      [rows, totalCount] = await Promise.all([
        db.query(sqlStringAndValues),
        db
          .queryHead(
            await getSQLString({
              table,
              fields: ["COUNT(*)"],
              $where,
              $orderBy,
            })
          )
          .then((d) => d["COUNT(*)"]),
      ]);
    } else {
      rows = await db.query(sqlStringAndValues);
    }

    if (req.query.$paginate) {
      if (typeof req.query.$paginate.limit === "number") {
        const hasMoreResults = rows.length === req.query.$paginate.limit + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }

        res.set("x-pagination-limit", req.query.$paginate.limit);
        res.set("x-pagination-offset", req.query.$paginate.offset);
        res.set(
          "x-pagination-has-previous-page",
          req.query.$paginate.offset > 0
        );
        res.set("x-pagination-has-next-page", !!hasMoreResults);
      } else if (typeof req.query.$paginate.page === "number") {
        const hasMoreResults = rows.length === req.query.$paginate.pageSize + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }

        res.set("x-pagination-page", req.query.$paginate.page);
        res.set("x-pagination-page-size", req.query.$paginate.pageSize);
        res.set("x-pagination-has-previous-page", req.query.$paginate.page > 1);
        res.set("x-pagination-has-next-page", !!hasMoreResults);
      } else {
        const flip =
          typeof req.query.$paginate.first === "number" ? false : true;
        const limit = flip
          ? req.query.$paginate.last
          : req.query.$paginate.first;

        const hasMoreResults = rows.length === limit + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }
        if (flip) {
          rows = rows.reverse();
        }

        const hasPreviousPage = flip ? hasMoreResults : false;
        const hasNextPage = flip ? false : hasMoreResults;
        const startCursor =
          rows[0] && rows[0].id ? encodeCursor(rows[0].id) : null;
        const endCursor =
          rows[rows.length - 1] && rows[rows.length - 1].id
            ? encodeCursor(rows[rows.length - 1].id)
            : null;

        res.set("x-pagination-has-previous-page", hasPreviousPage);
        res.set("x-pagination-has-next-page", hasNextPage);
        if (startCursor != null) {
          res.set("x-pagination-start-cursor", startCursor);
        }
        if (endCursor != null) {
          res.set("x-pagination-end-cursor", endCursor);
        }
      }
    }

    if (typeof totalCount === "number") {
      res.set("x-pagination-total-count", totalCount);
    }

    if (
      typeof totalCount === "number" &&
      req.query.$paginate &&
      req.query.$paginate.pageSize
    ) {
      res.set(
        "x-pagination-last-page",
        Math.ceil(totalCount / req.query.$paginate.pageSize)
      );
    }

    // https://jsperf.com/delete-vs-spread-vs-lodash-omit-vs-lodash-inverse-pick
    for (let row of rows) {
      row.id = undefined;
    }

    return res.status(200).json(rows);
  } catch (e) {
    return next(e);
  }
};

module.exports.riskEvaluationPost = async (req, res, next) => {
  try {
    const table = "RiskEvaluation";
    const relations = [
      {
        localTable: "RiskEvaluation",
        localField: "riskId",
        localForeignIdent: "riskUuid",
        foreignTable: "Risk",
        foreignField: "id",
        foreignIdent: "uuid",
      },
    ];
    const reqBodySchema = require("./schemas/risk-evaluation.POST.req.body.json");
    const ident = "uuid";
    const joins = [
      {
        type: "left",
        target: "Risk",
        alias: "Risk_0",
        on: { id: "$RiskEvaluation.riskId$" },
      },
    ];
    const fields = [
      "type",
      "stage",
      "compositeSeverityOfInjury",
      "compositeFrequencyOfEvent",
      "compositePossibilityOfInjury",
      "severityOfInjuryMin",
      "severityOfInjuryMax",
      "severityOfInjuryVoteAllowed",
      "frequencyOfEventMin",
      "frequencyOfEventMax",
      "frequencyOfEventVoteAllowed",
      "possibilityOfInjuryMin",
      "possibilityOfInjuryMax",
      "possibilityOfInjuryVoteAllowed",
      "compositeRiskScore",
      "riskReductionMeasureComment",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
      { as: "riskUuid", expression: "Risk_0.uuid" },
    ];

    const body = prepareDateTimeStrings(
      reqBodySchema,
      await mapExposedIdentsToInternal(relations, req.body)
    );

    const inserted = await db.query("INSERT INTO ?? SET ?? = UUID(), ?", [
      table,
      ident,
      body,
    ]);
    const id = inserted.insertId;

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { id },
    });
    const record = await db.queryHead(sqlStringAndValues);

    return res.status(200).json(record);
  } catch (e) {
    return next(e);
  }
};

module.exports.riskEvaluationPatch = async (req, res, next) => {
  try {
    const table = "RiskEvaluation";
    const archiveTable = archiveTablesMap[table];
    const relations = [
      {
        localTable: "RiskEvaluation",
        localField: "riskId",
        localForeignIdent: "riskUuid",
        foreignTable: "Risk",
        foreignField: "id",
        foreignIdent: "uuid",
      },
    ];
    const reqBodySchema = require("./schemas/risk-evaluation.PATCH.req.body.json");
    const resBodyKeys = [
      "type",
      "riskUuid",
      "stage",
      "compositeSeverityOfInjury",
      "compositeFrequencyOfEvent",
      "compositePossibilityOfInjury",
      "severityOfInjuryMin",
      "severityOfInjuryMax",
      "severityOfInjuryVoteAllowed",
      "frequencyOfEventMin",
      "frequencyOfEventMax",
      "frequencyOfEventVoteAllowed",
      "possibilityOfInjuryMin",
      "possibilityOfInjuryMax",
      "possibilityOfInjuryVoteAllowed",
      "compositeRiskScore",
      "riskReductionMeasureComment",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];
    const ident = "uuid";
    const joins = [
      {
        type: "left",
        target: "Risk",
        alias: "Risk_0",
        on: { id: "$RiskEvaluation.riskId$" },
      },
    ];
    const fields = ["*", { as: "riskUuid", expression: "Risk_0.uuid" }];

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const current = await db.queryHead(sqlStringAndValues);

    if (!current) {
      return res.status(404).json({ errors: ["Record not found"] });
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? SET ?", [
        archiveTable,
        {
          ..._.omit(["riskUuid"], current),
          modifier: req.headers["x-user-uuid"] || "stub",
        },
      ]);
    }

    if (Object.keys(req.body).length) {
      const body = prepareDateTimeStrings(
        reqBodySchema,
        await mapExposedIdentsToInternal(relations, req.body)
      );
      await db.query("UPDATE ?? SET ? WHERE ?? = ?", [
        table,
        body,
        ident,
        req.params[ident],
      ]);
    } else {
      // Nothing to update.
      const resBody = _.pick(resBodyKeys, current);
      return res.status(200).json(resBody);
    }
    const record = await db.queryHead(
      await getSQLString({
        table,
        fields,
        joins,
        $where: { [ident]: req.params["uuid"] },
      })
    );

    const resBody = _.pick(resBodyKeys, record);
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.riskEvaluationPatchList = async (req, res, next) => {
  try {
    const table = "RiskEvaluation";
    const relations = relationsMap[table];
    const archiveTable = archiveTablesMap[table];
    const reqBodySchema = require("./schemas/risk-evaluation.PATCH.list.req.body.json");
    const resBodyKeys = [
      "type",
      "riskUuid",
      "stage",
      "compositeSeverityOfInjury",
      "compositeFrequencyOfEvent",
      "compositePossibilityOfInjury",
      "severityOfInjuryMin",
      "severityOfInjuryMax",
      "severityOfInjuryVoteAllowed",
      "frequencyOfEventMin",
      "frequencyOfEventMax",
      "frequencyOfEventVoteAllowed",
      "possibilityOfInjuryMin",
      "possibilityOfInjuryMax",
      "possibilityOfInjuryVoteAllowed",
      "compositeRiskScore",
      "riskReductionMeasureComment",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];

    const $where = await prepareWhere(relations, req.query.$where);
    const selectParams = await getSQLString({
      table,
      $where,
    });

    const currents = await db.query(selectParams);
    if (!currents.length) {
      return res.status(200).json([]);
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? (??) VALUES ?", [
        archiveTable,
        [].concat(Object.keys(currents[0])).concat("modifier"),
        currents.map((c) =>
          Object.values(c).concat(req.headers["x-user-uuid"] || "stub")
        ),
      ]);
    }

    if (Object.keys(req.body).length) {
      const body = prepareDateTimeStrings(
        reqBodySchema,
        await mapExposedIdentsToInternal(relations, req.body)
      );

      let sql = "UPDATE ?? SET ?";
      let values = [table, body];

      if (selectParams.sql.includes(" where ")) {
        sql += " where " + selectParams.sql.split(" where ")[1];
        values = values.concat(selectParams.values);
      }

      await db.query(sql, values);
    } else {
      // Nothing to update.
      let resBody = (
        await Promise.all(
          currents.map((current) =>
            mapInternalIdentsToExposed(relations, current)
          )
        )
      ).map((x) => _.pick(resBodyKeys, x));
      return res.status(200).json(resBody);
    }
    const records = await db.query(selectParams);
    const resBody = (
      await Promise.all(
        records.map((record) => mapInternalIdentsToExposed(relations, record))
      )
    ).map((x) => _.pick(resBodyKeys, x));
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.riskEvaluationDelete = async (req, res, next) => {
  try {
    const table = "RiskEvaluation";
    const archiveTable = archiveTablesMap[table];
    const resBodyKeys = [
      "type",
      "riskUuid",
      "stage",
      "compositeSeverityOfInjury",
      "compositeFrequencyOfEvent",
      "compositePossibilityOfInjury",
      "severityOfInjuryMin",
      "severityOfInjuryMax",
      "severityOfInjuryVoteAllowed",
      "frequencyOfEventMin",
      "frequencyOfEventMax",
      "frequencyOfEventVoteAllowed",
      "possibilityOfInjuryMin",
      "possibilityOfInjuryMax",
      "possibilityOfInjuryVoteAllowed",
      "compositeRiskScore",
      "riskReductionMeasureComment",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];
    const ident = "uuid";
    const joins = [
      {
        type: "left",
        target: "Risk",
        alias: "Risk_0",
        on: { id: "$RiskEvaluation.riskId$" },
      },
    ];
    const fields = ["*", { as: "riskUuid", expression: "Risk_0.uuid" }];

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const current = await db.queryHead(sqlStringAndValues);

    if (!current) {
      return res.status(404).json({ errors: ["Record not found"] });
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? SET ?", [
        archiveTable,
        {
          ..._.omit(["riskUuid"], current),
          modifier: req.headers["x-user-uuid"] || "stub",
          userDeleted: 1,
        },
      ]);
    }

    await db.query("DELETE FROM ?? WHERE ?? = ?", [
      table,
      ident,
      req.params[ident],
    ]);

    const resBody = _.pick(resBodyKeys, current);
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.riskEvaluationDeleteList = async (req, res, next) => {
  try {
    const table = "RiskEvaluation";
    const archiveTable = archiveTablesMap[table];
    const relations = relationsMap[table];
    const resBodyKeys = [
      "type",
      "riskUuid",
      "stage",
      "compositeSeverityOfInjury",
      "compositeFrequencyOfEvent",
      "compositePossibilityOfInjury",
      "severityOfInjuryMin",
      "severityOfInjuryMax",
      "severityOfInjuryVoteAllowed",
      "frequencyOfEventMin",
      "frequencyOfEventMax",
      "frequencyOfEventVoteAllowed",
      "possibilityOfInjuryMin",
      "possibilityOfInjuryMax",
      "possibilityOfInjuryVoteAllowed",
      "compositeRiskScore",
      "riskReductionMeasureComment",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];

    const $where = await prepareWhere(relations, req.query.$where);
    const selectParams = await getSQLString({
      table,
      $where,
    });

    const currents = await db.query(selectParams);
    if (!currents.length) {
      return res.status(200).json([]);
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? (??) VALUES ?", [
        archiveTable,
        []
          .concat(Object.keys(currents[0]))
          .concat("modifier")
          .concat("userDeleted"),
        currents.map((c) =>
          Object.values(c)
            .concat(req.headers["x-user-uuid"] || "stub")
            .concat(1)
        ),
      ]);
    }

    let sql = "DELETE FROM ??";
    let values = [table];

    if (selectParams.sql.includes(" where ")) {
      sql += " where " + selectParams.sql.split(" where ")[1];
      values = values.concat(selectParams.values);
    }

    await db.query(sql, values);

    const resBody = (
      await Promise.all(
        currents.map((record) => mapInternalIdentsToExposed(relations, record))
      )
    ).map((x) => _.pick(resBodyKeys, x));
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.riskEvaluationEntryGet = async (req, res, next) => {
  try {
    const table = "RiskEvaluationEntry";
    const ident = "uuid";
    const joins = [
      {
        type: "left",
        target: "Risk",
        alias: "Risk_0",
        on: { id: "$RiskEvaluationEntry.riskId$" },
      },
      {
        type: "left",
        target: "User",
        alias: "User_1",
        on: { id: "$RiskEvaluationEntry.userId$" },
      },
    ];
    const fields = [
      "severityOfInjury",
      "frequencyOfEvent",
      "possibilityOfInjury",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
      { as: "riskUuid", expression: "Risk_0.uuid" },
      { as: "userUuid", expression: "User_1.uuid" },
    ];
    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const record = await db.queryHead(sqlStringAndValues);
    if (!record) {
      return res.status(404).json({ errors: ["Record not found"] });
    }
    return res.status(200).json(record);
  } catch (e) {
    return next(e);
  }
};

module.exports.riskEvaluationEntryGetList = async (req, res, next) => {
  try {
    const table = "RiskEvaluationEntry";
    const relations = [
      {
        localTable: "RiskEvaluationEntry",
        localField: "riskId",
        localForeignIdent: "riskUuid",
        foreignTable: "Risk",
        foreignField: "id",
        foreignIdent: "uuid",
      },
      {
        localTable: "RiskEvaluationEntry",
        localField: "userId",
        localForeignIdent: "userUuid",
        foreignTable: "User",
        foreignField: "id",
        foreignIdent: "uuid",
      },
    ];

    const $where = await prepareWhere(relations, req.query.$where);
    const $orderBy = req.query.$orderBy
      ? Array.isArray(req.query.$orderBy)
        ? req.query.$orderBy.map((x) => mapExposedKeysToInternal(relations, x))
        : mapExposedKeysToInternal(relations, req.query.$orderBy)
      : undefined;

    // https://github.com/epoberezkin/ajv/issues/276
    if (req.query.$paginate && req.query.$paginate.page) {
      req.query.$paginate.pageSize = req.query.$paginate.pageSize || 20;
    }

    let rows, totalCount;

    const joins = [
      {
        type: "left",
        target: "Risk",
        alias: "Risk_0",
        on: { id: "$RiskEvaluationEntry.riskId$" },
      },
      {
        type: "left",
        target: "User",
        alias: "User_1",
        on: { id: "$RiskEvaluationEntry.userId$" },
      },
    ];
    const fields = [
      "id",
      "severityOfInjury",
      "frequencyOfEvent",
      "possibilityOfInjury",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
      { as: "riskUuid", expression: "Risk_0.uuid" },
      { as: "userUuid", expression: "User_1.uuid" },
    ];
    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where,
      $orderBy,
      $paginate: req.query.$paginate || undefined,
    });

    if (req.query.$paginate) {
      [rows, totalCount] = await Promise.all([
        db.query(sqlStringAndValues),
        db
          .queryHead(
            await getSQLString({
              table,
              fields: ["COUNT(*)"],
              $where,
              $orderBy,
            })
          )
          .then((d) => d["COUNT(*)"]),
      ]);
    } else {
      rows = await db.query(sqlStringAndValues);
    }

    if (req.query.$paginate) {
      if (typeof req.query.$paginate.limit === "number") {
        const hasMoreResults = rows.length === req.query.$paginate.limit + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }

        res.set("x-pagination-limit", req.query.$paginate.limit);
        res.set("x-pagination-offset", req.query.$paginate.offset);
        res.set(
          "x-pagination-has-previous-page",
          req.query.$paginate.offset > 0
        );
        res.set("x-pagination-has-next-page", !!hasMoreResults);
      } else if (typeof req.query.$paginate.page === "number") {
        const hasMoreResults = rows.length === req.query.$paginate.pageSize + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }

        res.set("x-pagination-page", req.query.$paginate.page);
        res.set("x-pagination-page-size", req.query.$paginate.pageSize);
        res.set("x-pagination-has-previous-page", req.query.$paginate.page > 1);
        res.set("x-pagination-has-next-page", !!hasMoreResults);
      } else {
        const flip =
          typeof req.query.$paginate.first === "number" ? false : true;
        const limit = flip
          ? req.query.$paginate.last
          : req.query.$paginate.first;

        const hasMoreResults = rows.length === limit + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }
        if (flip) {
          rows = rows.reverse();
        }

        const hasPreviousPage = flip ? hasMoreResults : false;
        const hasNextPage = flip ? false : hasMoreResults;
        const startCursor =
          rows[0] && rows[0].id ? encodeCursor(rows[0].id) : null;
        const endCursor =
          rows[rows.length - 1] && rows[rows.length - 1].id
            ? encodeCursor(rows[rows.length - 1].id)
            : null;

        res.set("x-pagination-has-previous-page", hasPreviousPage);
        res.set("x-pagination-has-next-page", hasNextPage);
        if (startCursor != null) {
          res.set("x-pagination-start-cursor", startCursor);
        }
        if (endCursor != null) {
          res.set("x-pagination-end-cursor", endCursor);
        }
      }
    }

    if (typeof totalCount === "number") {
      res.set("x-pagination-total-count", totalCount);
    }

    if (
      typeof totalCount === "number" &&
      req.query.$paginate &&
      req.query.$paginate.pageSize
    ) {
      res.set(
        "x-pagination-last-page",
        Math.ceil(totalCount / req.query.$paginate.pageSize)
      );
    }

    // https://jsperf.com/delete-vs-spread-vs-lodash-omit-vs-lodash-inverse-pick
    for (let row of rows) {
      row.id = undefined;
    }

    return res.status(200).json(rows);
  } catch (e) {
    return next(e);
  }
};

module.exports.riskEvaluationEntryPost = async (req, res, next) => {
  try {
    const table = "RiskEvaluationEntry";
    const relations = [
      {
        localTable: "RiskEvaluationEntry",
        localField: "riskId",
        localForeignIdent: "riskUuid",
        foreignTable: "Risk",
        foreignField: "id",
        foreignIdent: "uuid",
      },
      {
        localTable: "RiskEvaluationEntry",
        localField: "userId",
        localForeignIdent: "userUuid",
        foreignTable: "User",
        foreignField: "id",
        foreignIdent: "uuid",
      },
    ];
    const reqBodySchema = require("./schemas/risk-evaluation-entry.POST.req.body.json");
    const ident = "uuid";
    const joins = [
      {
        type: "left",
        target: "Risk",
        alias: "Risk_0",
        on: { id: "$RiskEvaluationEntry.riskId$" },
      },
      {
        type: "left",
        target: "User",
        alias: "User_1",
        on: { id: "$RiskEvaluationEntry.userId$" },
      },
    ];
    const fields = [
      "severityOfInjury",
      "frequencyOfEvent",
      "possibilityOfInjury",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
      { as: "riskUuid", expression: "Risk_0.uuid" },
      { as: "userUuid", expression: "User_1.uuid" },
    ];

    const body = prepareDateTimeStrings(
      reqBodySchema,
      await mapExposedIdentsToInternal(relations, req.body)
    );

    const inserted = await db.query("INSERT INTO ?? SET ?? = UUID(), ?", [
      table,
      ident,
      body,
    ]);
    const id = inserted.insertId;

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { id },
    });
    const record = await db.queryHead(sqlStringAndValues);

    return res.status(200).json(record);
  } catch (e) {
    return next(e);
  }
};

module.exports.riskEvaluationEntryPatch = async (req, res, next) => {
  try {
    const table = "RiskEvaluationEntry";
    const archiveTable = archiveTablesMap[table];
    const relations = [
      {
        localTable: "RiskEvaluationEntry",
        localField: "riskId",
        localForeignIdent: "riskUuid",
        foreignTable: "Risk",
        foreignField: "id",
        foreignIdent: "uuid",
      },
      {
        localTable: "RiskEvaluationEntry",
        localField: "userId",
        localForeignIdent: "userUuid",
        foreignTable: "User",
        foreignField: "id",
        foreignIdent: "uuid",
      },
    ];
    const reqBodySchema = require("./schemas/risk-evaluation-entry.PATCH.req.body.json");
    const resBodyKeys = [
      "userUuid",
      "riskUuid",
      "severityOfInjury",
      "frequencyOfEvent",
      "possibilityOfInjury",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];
    const ident = "uuid";
    const joins = [
      {
        type: "left",
        target: "Risk",
        alias: "Risk_0",
        on: { id: "$RiskEvaluationEntry.riskId$" },
      },
      {
        type: "left",
        target: "User",
        alias: "User_1",
        on: { id: "$RiskEvaluationEntry.userId$" },
      },
    ];
    const fields = [
      "*",
      { as: "riskUuid", expression: "Risk_0.uuid" },
      { as: "userUuid", expression: "User_1.uuid" },
    ];

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const current = await db.queryHead(sqlStringAndValues);

    if (!current) {
      return res.status(404).json({ errors: ["Record not found"] });
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? SET ?", [
        archiveTable,
        {
          ..._.omit(["riskUuid", "userUuid"], current),
          modifier: req.headers["x-user-uuid"] || "stub",
        },
      ]);
    }

    if (Object.keys(req.body).length) {
      const body = prepareDateTimeStrings(
        reqBodySchema,
        await mapExposedIdentsToInternal(relations, req.body)
      );
      await db.query("UPDATE ?? SET ? WHERE ?? = ?", [
        table,
        body,
        ident,
        req.params[ident],
      ]);
    } else {
      // Nothing to update.
      const resBody = _.pick(resBodyKeys, current);
      return res.status(200).json(resBody);
    }
    const record = await db.queryHead(
      await getSQLString({
        table,
        fields,
        joins,
        $where: { [ident]: req.params["uuid"] },
      })
    );

    const resBody = _.pick(resBodyKeys, record);
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.riskEvaluationEntryPatchList = async (req, res, next) => {
  try {
    const table = "RiskEvaluationEntry";
    const relations = relationsMap[table];
    const archiveTable = archiveTablesMap[table];
    const reqBodySchema = require("./schemas/risk-evaluation-entry.PATCH.list.req.body.json");
    const resBodyKeys = [
      "userUuid",
      "riskUuid",
      "severityOfInjury",
      "frequencyOfEvent",
      "possibilityOfInjury",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];

    const $where = await prepareWhere(relations, req.query.$where);
    const selectParams = await getSQLString({
      table,
      $where,
    });

    const currents = await db.query(selectParams);
    if (!currents.length) {
      return res.status(200).json([]);
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? (??) VALUES ?", [
        archiveTable,
        [].concat(Object.keys(currents[0])).concat("modifier"),
        currents.map((c) =>
          Object.values(c).concat(req.headers["x-user-uuid"] || "stub")
        ),
      ]);
    }

    if (Object.keys(req.body).length) {
      const body = prepareDateTimeStrings(
        reqBodySchema,
        await mapExposedIdentsToInternal(relations, req.body)
      );

      let sql = "UPDATE ?? SET ?";
      let values = [table, body];

      if (selectParams.sql.includes(" where ")) {
        sql += " where " + selectParams.sql.split(" where ")[1];
        values = values.concat(selectParams.values);
      }

      await db.query(sql, values);
    } else {
      // Nothing to update.
      let resBody = (
        await Promise.all(
          currents.map((current) =>
            mapInternalIdentsToExposed(relations, current)
          )
        )
      ).map((x) => _.pick(resBodyKeys, x));
      return res.status(200).json(resBody);
    }
    const records = await db.query(selectParams);
    const resBody = (
      await Promise.all(
        records.map((record) => mapInternalIdentsToExposed(relations, record))
      )
    ).map((x) => _.pick(resBodyKeys, x));
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.riskEvaluationEntryDelete = async (req, res, next) => {
  try {
    const table = "RiskEvaluationEntry";
    const archiveTable = archiveTablesMap[table];
    const resBodyKeys = [
      "userUuid",
      "riskUuid",
      "severityOfInjury",
      "frequencyOfEvent",
      "possibilityOfInjury",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];
    const ident = "uuid";
    const joins = [
      {
        type: "left",
        target: "Risk",
        alias: "Risk_0",
        on: { id: "$RiskEvaluationEntry.riskId$" },
      },
      {
        type: "left",
        target: "User",
        alias: "User_1",
        on: { id: "$RiskEvaluationEntry.userId$" },
      },
    ];
    const fields = [
      "*",
      { as: "riskUuid", expression: "Risk_0.uuid" },
      { as: "userUuid", expression: "User_1.uuid" },
    ];

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const current = await db.queryHead(sqlStringAndValues);

    if (!current) {
      return res.status(404).json({ errors: ["Record not found"] });
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? SET ?", [
        archiveTable,
        {
          ..._.omit(["riskUuid", "userUuid"], current),
          modifier: req.headers["x-user-uuid"] || "stub",
          userDeleted: 1,
        },
      ]);
    }

    await db.query("DELETE FROM ?? WHERE ?? = ?", [
      table,
      ident,
      req.params[ident],
    ]);

    const resBody = _.pick(resBodyKeys, current);
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.riskEvaluationEntryDeleteList = async (req, res, next) => {
  try {
    const table = "RiskEvaluationEntry";
    const archiveTable = archiveTablesMap[table];
    const relations = relationsMap[table];
    const resBodyKeys = [
      "userUuid",
      "riskUuid",
      "severityOfInjury",
      "frequencyOfEvent",
      "possibilityOfInjury",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];

    const $where = await prepareWhere(relations, req.query.$where);
    const selectParams = await getSQLString({
      table,
      $where,
    });

    const currents = await db.query(selectParams);
    if (!currents.length) {
      return res.status(200).json([]);
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? (??) VALUES ?", [
        archiveTable,
        []
          .concat(Object.keys(currents[0]))
          .concat("modifier")
          .concat("userDeleted"),
        currents.map((c) =>
          Object.values(c)
            .concat(req.headers["x-user-uuid"] || "stub")
            .concat(1)
        ),
      ]);
    }

    let sql = "DELETE FROM ??";
    let values = [table];

    if (selectParams.sql.includes(" where ")) {
      sql += " where " + selectParams.sql.split(" where ")[1];
      values = values.concat(selectParams.values);
    }

    await db.query(sql, values);

    const resBody = (
      await Promise.all(
        currents.map((record) => mapInternalIdentsToExposed(relations, record))
      )
    ).map((x) => _.pick(resBodyKeys, x));
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.riskMediaGet = async (req, res, next) => {
  try {
    const table = "RiskMedia";
    const ident = "uuid";
    const joins = [
      {
        type: "left",
        target: "Media",
        alias: "Media_0",
        on: { id: "$RiskMedia.mediaId$" },
      },
      {
        type: "left",
        target: "Risk",
        alias: "Risk_1",
        on: { id: "$RiskMedia.riskId$" },
      },
    ];
    const fields = [
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
      { as: "mediaUuid", expression: "Media_0.uuid" },
      { as: "riskUuid", expression: "Risk_1.uuid" },
    ];
    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const record = await db.queryHead(sqlStringAndValues);
    if (!record) {
      return res.status(404).json({ errors: ["Record not found"] });
    }
    return res.status(200).json(record);
  } catch (e) {
    return next(e);
  }
};

module.exports.riskMediaGetList = async (req, res, next) => {
  try {
    const table = "RiskMedia";
    const relations = [
      {
        localTable: "RiskMedia",
        localField: "mediaId",
        localForeignIdent: "mediaUuid",
        foreignTable: "Media",
        foreignField: "id",
        foreignIdent: "uuid",
      },
      {
        localTable: "RiskMedia",
        localField: "riskId",
        localForeignIdent: "riskUuid",
        foreignTable: "Risk",
        foreignField: "id",
        foreignIdent: "uuid",
      },
    ];

    const $where = await prepareWhere(relations, req.query.$where);
    const $orderBy = req.query.$orderBy
      ? Array.isArray(req.query.$orderBy)
        ? req.query.$orderBy.map((x) => mapExposedKeysToInternal(relations, x))
        : mapExposedKeysToInternal(relations, req.query.$orderBy)
      : undefined;

    // https://github.com/epoberezkin/ajv/issues/276
    if (req.query.$paginate && req.query.$paginate.page) {
      req.query.$paginate.pageSize = req.query.$paginate.pageSize || 20;
    }

    let rows, totalCount;

    const joins = [
      {
        type: "left",
        target: "Media",
        alias: "Media_0",
        on: { id: "$RiskMedia.mediaId$" },
      },
      {
        type: "left",
        target: "Risk",
        alias: "Risk_1",
        on: { id: "$RiskMedia.riskId$" },
      },
    ];
    const fields = [
      "id",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
      { as: "mediaUuid", expression: "Media_0.uuid" },
      { as: "riskUuid", expression: "Risk_1.uuid" },
    ];
    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where,
      $orderBy,
      $paginate: req.query.$paginate || undefined,
    });

    if (req.query.$paginate) {
      [rows, totalCount] = await Promise.all([
        db.query(sqlStringAndValues),
        db
          .queryHead(
            await getSQLString({
              table,
              fields: ["COUNT(*)"],
              $where,
              $orderBy,
            })
          )
          .then((d) => d["COUNT(*)"]),
      ]);
    } else {
      rows = await db.query(sqlStringAndValues);
    }

    if (req.query.$paginate) {
      if (typeof req.query.$paginate.limit === "number") {
        const hasMoreResults = rows.length === req.query.$paginate.limit + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }

        res.set("x-pagination-limit", req.query.$paginate.limit);
        res.set("x-pagination-offset", req.query.$paginate.offset);
        res.set(
          "x-pagination-has-previous-page",
          req.query.$paginate.offset > 0
        );
        res.set("x-pagination-has-next-page", !!hasMoreResults);
      } else if (typeof req.query.$paginate.page === "number") {
        const hasMoreResults = rows.length === req.query.$paginate.pageSize + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }

        res.set("x-pagination-page", req.query.$paginate.page);
        res.set("x-pagination-page-size", req.query.$paginate.pageSize);
        res.set("x-pagination-has-previous-page", req.query.$paginate.page > 1);
        res.set("x-pagination-has-next-page", !!hasMoreResults);
      } else {
        const flip =
          typeof req.query.$paginate.first === "number" ? false : true;
        const limit = flip
          ? req.query.$paginate.last
          : req.query.$paginate.first;

        const hasMoreResults = rows.length === limit + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }
        if (flip) {
          rows = rows.reverse();
        }

        const hasPreviousPage = flip ? hasMoreResults : false;
        const hasNextPage = flip ? false : hasMoreResults;
        const startCursor =
          rows[0] && rows[0].id ? encodeCursor(rows[0].id) : null;
        const endCursor =
          rows[rows.length - 1] && rows[rows.length - 1].id
            ? encodeCursor(rows[rows.length - 1].id)
            : null;

        res.set("x-pagination-has-previous-page", hasPreviousPage);
        res.set("x-pagination-has-next-page", hasNextPage);
        if (startCursor != null) {
          res.set("x-pagination-start-cursor", startCursor);
        }
        if (endCursor != null) {
          res.set("x-pagination-end-cursor", endCursor);
        }
      }
    }

    if (typeof totalCount === "number") {
      res.set("x-pagination-total-count", totalCount);
    }

    if (
      typeof totalCount === "number" &&
      req.query.$paginate &&
      req.query.$paginate.pageSize
    ) {
      res.set(
        "x-pagination-last-page",
        Math.ceil(totalCount / req.query.$paginate.pageSize)
      );
    }

    // https://jsperf.com/delete-vs-spread-vs-lodash-omit-vs-lodash-inverse-pick
    for (let row of rows) {
      row.id = undefined;
    }

    return res.status(200).json(rows);
  } catch (e) {
    return next(e);
  }
};

module.exports.riskMediaPost = async (req, res, next) => {
  try {
    const table = "RiskMedia";
    const relations = [
      {
        localTable: "RiskMedia",
        localField: "mediaId",
        localForeignIdent: "mediaUuid",
        foreignTable: "Media",
        foreignField: "id",
        foreignIdent: "uuid",
      },
      {
        localTable: "RiskMedia",
        localField: "riskId",
        localForeignIdent: "riskUuid",
        foreignTable: "Risk",
        foreignField: "id",
        foreignIdent: "uuid",
      },
    ];
    const reqBodySchema = require("./schemas/risk-media.POST.req.body.json");
    const ident = "uuid";
    const joins = [
      {
        type: "left",
        target: "Media",
        alias: "Media_0",
        on: { id: "$RiskMedia.mediaId$" },
      },
      {
        type: "left",
        target: "Risk",
        alias: "Risk_1",
        on: { id: "$RiskMedia.riskId$" },
      },
    ];
    const fields = [
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
      { as: "mediaUuid", expression: "Media_0.uuid" },
      { as: "riskUuid", expression: "Risk_1.uuid" },
    ];

    const body = prepareDateTimeStrings(
      reqBodySchema,
      await mapExposedIdentsToInternal(relations, req.body)
    );

    const inserted = await db.query("INSERT INTO ?? SET ?? = UUID(), ?", [
      table,
      ident,
      body,
    ]);
    const id = inserted.insertId;

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { id },
    });
    const record = await db.queryHead(sqlStringAndValues);

    return res.status(200).json(record);
  } catch (e) {
    return next(e);
  }
};

module.exports.riskMediaPatch = async (req, res, next) => {
  try {
    const table = "RiskMedia";
    const archiveTable = archiveTablesMap[table];
    const relations = [
      {
        localTable: "RiskMedia",
        localField: "mediaId",
        localForeignIdent: "mediaUuid",
        foreignTable: "Media",
        foreignField: "id",
        foreignIdent: "uuid",
      },
      {
        localTable: "RiskMedia",
        localField: "riskId",
        localForeignIdent: "riskUuid",
        foreignTable: "Risk",
        foreignField: "id",
        foreignIdent: "uuid",
      },
    ];
    const reqBodySchema = require("./schemas/risk-media.PATCH.req.body.json");
    const resBodyKeys = [
      "riskUuid",
      "mediaUuid",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];
    const ident = "uuid";
    const joins = [
      {
        type: "left",
        target: "Media",
        alias: "Media_0",
        on: { id: "$RiskMedia.mediaId$" },
      },
      {
        type: "left",
        target: "Risk",
        alias: "Risk_1",
        on: { id: "$RiskMedia.riskId$" },
      },
    ];
    const fields = [
      "*",
      { as: "mediaUuid", expression: "Media_0.uuid" },
      { as: "riskUuid", expression: "Risk_1.uuid" },
    ];

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const current = await db.queryHead(sqlStringAndValues);

    if (!current) {
      return res.status(404).json({ errors: ["Record not found"] });
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? SET ?", [
        archiveTable,
        {
          ..._.omit(["mediaUuid", "riskUuid"], current),
          modifier: req.headers["x-user-uuid"] || "stub",
        },
      ]);
    }

    if (Object.keys(req.body).length) {
      const body = prepareDateTimeStrings(
        reqBodySchema,
        await mapExposedIdentsToInternal(relations, req.body)
      );
      await db.query("UPDATE ?? SET ? WHERE ?? = ?", [
        table,
        body,
        ident,
        req.params[ident],
      ]);
    } else {
      // Nothing to update.
      const resBody = _.pick(resBodyKeys, current);
      return res.status(200).json(resBody);
    }
    const record = await db.queryHead(
      await getSQLString({
        table,
        fields,
        joins,
        $where: { [ident]: req.params["uuid"] },
      })
    );

    const resBody = _.pick(resBodyKeys, record);
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.riskMediaPatchList = async (req, res, next) => {
  try {
    const table = "RiskMedia";
    const relations = relationsMap[table];
    const archiveTable = archiveTablesMap[table];
    const reqBodySchema = require("./schemas/risk-media.PATCH.list.req.body.json");
    const resBodyKeys = [
      "riskUuid",
      "mediaUuid",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];

    const $where = await prepareWhere(relations, req.query.$where);
    const selectParams = await getSQLString({
      table,
      $where,
    });

    const currents = await db.query(selectParams);
    if (!currents.length) {
      return res.status(200).json([]);
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? (??) VALUES ?", [
        archiveTable,
        [].concat(Object.keys(currents[0])).concat("modifier"),
        currents.map((c) =>
          Object.values(c).concat(req.headers["x-user-uuid"] || "stub")
        ),
      ]);
    }

    if (Object.keys(req.body).length) {
      const body = prepareDateTimeStrings(
        reqBodySchema,
        await mapExposedIdentsToInternal(relations, req.body)
      );

      let sql = "UPDATE ?? SET ?";
      let values = [table, body];

      if (selectParams.sql.includes(" where ")) {
        sql += " where " + selectParams.sql.split(" where ")[1];
        values = values.concat(selectParams.values);
      }

      await db.query(sql, values);
    } else {
      // Nothing to update.
      let resBody = (
        await Promise.all(
          currents.map((current) =>
            mapInternalIdentsToExposed(relations, current)
          )
        )
      ).map((x) => _.pick(resBodyKeys, x));
      return res.status(200).json(resBody);
    }
    const records = await db.query(selectParams);
    const resBody = (
      await Promise.all(
        records.map((record) => mapInternalIdentsToExposed(relations, record))
      )
    ).map((x) => _.pick(resBodyKeys, x));
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.riskMediaDelete = async (req, res, next) => {
  try {
    const table = "RiskMedia";
    const archiveTable = archiveTablesMap[table];
    const resBodyKeys = [
      "riskUuid",
      "mediaUuid",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];
    const ident = "uuid";
    const joins = [
      {
        type: "left",
        target: "Media",
        alias: "Media_0",
        on: { id: "$RiskMedia.mediaId$" },
      },
      {
        type: "left",
        target: "Risk",
        alias: "Risk_1",
        on: { id: "$RiskMedia.riskId$" },
      },
    ];
    const fields = [
      "*",
      { as: "mediaUuid", expression: "Media_0.uuid" },
      { as: "riskUuid", expression: "Risk_1.uuid" },
    ];

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const current = await db.queryHead(sqlStringAndValues);

    if (!current) {
      return res.status(404).json({ errors: ["Record not found"] });
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? SET ?", [
        archiveTable,
        {
          ..._.omit(["mediaUuid", "riskUuid"], current),
          modifier: req.headers["x-user-uuid"] || "stub",
          userDeleted: 1,
        },
      ]);
    }

    await db.query("DELETE FROM ?? WHERE ?? = ?", [
      table,
      ident,
      req.params[ident],
    ]);

    const resBody = _.pick(resBodyKeys, current);
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.riskMediaDeleteList = async (req, res, next) => {
  try {
    const table = "RiskMedia";
    const archiveTable = archiveTablesMap[table];
    const relations = relationsMap[table];
    const resBodyKeys = [
      "riskUuid",
      "mediaUuid",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];

    const $where = await prepareWhere(relations, req.query.$where);
    const selectParams = await getSQLString({
      table,
      $where,
    });

    const currents = await db.query(selectParams);
    if (!currents.length) {
      return res.status(200).json([]);
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? (??) VALUES ?", [
        archiveTable,
        []
          .concat(Object.keys(currents[0]))
          .concat("modifier")
          .concat("userDeleted"),
        currents.map((c) =>
          Object.values(c)
            .concat(req.headers["x-user-uuid"] || "stub")
            .concat(1)
        ),
      ]);
    }

    let sql = "DELETE FROM ??";
    let values = [table];

    if (selectParams.sql.includes(" where ")) {
      sql += " where " + selectParams.sql.split(" where ")[1];
      values = values.concat(selectParams.values);
    }

    await db.query(sql, values);

    const resBody = (
      await Promise.all(
        currents.map((record) => mapInternalIdentsToExposed(relations, record))
      )
    ).map((x) => _.pick(resBodyKeys, x));
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.riskTypeGet = async (req, res, next) => {
  try {
    const table = "RiskType";
    const ident = "uuid";
    const joins = [
      {
        type: "left",
        target: "RiskType",
        alias: "RiskType_0",
        on: { id: "$RiskType.parentId$" },
      },
    ];
    const fields = [
      "enum",
      "name",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
      { as: "parentUuid", expression: "RiskType_0.uuid" },
    ];
    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const record = await db.queryHead(sqlStringAndValues);
    if (!record) {
      return res.status(404).json({ errors: ["Record not found"] });
    }
    return res.status(200).json(record);
  } catch (e) {
    return next(e);
  }
};

module.exports.riskTypeGetList = async (req, res, next) => {
  try {
    const table = "RiskType";
    const relations = [
      {
        localTable: "RiskType",
        localField: "parentId",
        localForeignIdent: "parentUuid",
        foreignTable: "RiskType",
        foreignField: "id",
        foreignIdent: "uuid",
      },
    ];

    const $where = await prepareWhere(relations, req.query.$where);
    const $orderBy = req.query.$orderBy
      ? Array.isArray(req.query.$orderBy)
        ? req.query.$orderBy.map((x) => mapExposedKeysToInternal(relations, x))
        : mapExposedKeysToInternal(relations, req.query.$orderBy)
      : undefined;

    // https://github.com/epoberezkin/ajv/issues/276
    if (req.query.$paginate && req.query.$paginate.page) {
      req.query.$paginate.pageSize = req.query.$paginate.pageSize || 20;
    }

    let rows, totalCount;

    const joins = [
      {
        type: "left",
        target: "RiskType",
        alias: "RiskType_0",
        on: { id: "$RiskType.parentId$" },
      },
    ];
    const fields = [
      "id",
      "enum",
      "name",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
      { as: "parentUuid", expression: "RiskType_0.uuid" },
    ];
    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where,
      $orderBy,
      $paginate: req.query.$paginate || undefined,
    });

    if (req.query.$paginate) {
      [rows, totalCount] = await Promise.all([
        db.query(sqlStringAndValues),
        db
          .queryHead(
            await getSQLString({
              table,
              fields: ["COUNT(*)"],
              $where,
              $orderBy,
            })
          )
          .then((d) => d["COUNT(*)"]),
      ]);
    } else {
      rows = await db.query(sqlStringAndValues);
    }

    if (req.query.$paginate) {
      if (typeof req.query.$paginate.limit === "number") {
        const hasMoreResults = rows.length === req.query.$paginate.limit + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }

        res.set("x-pagination-limit", req.query.$paginate.limit);
        res.set("x-pagination-offset", req.query.$paginate.offset);
        res.set(
          "x-pagination-has-previous-page",
          req.query.$paginate.offset > 0
        );
        res.set("x-pagination-has-next-page", !!hasMoreResults);
      } else if (typeof req.query.$paginate.page === "number") {
        const hasMoreResults = rows.length === req.query.$paginate.pageSize + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }

        res.set("x-pagination-page", req.query.$paginate.page);
        res.set("x-pagination-page-size", req.query.$paginate.pageSize);
        res.set("x-pagination-has-previous-page", req.query.$paginate.page > 1);
        res.set("x-pagination-has-next-page", !!hasMoreResults);
      } else {
        const flip =
          typeof req.query.$paginate.first === "number" ? false : true;
        const limit = flip
          ? req.query.$paginate.last
          : req.query.$paginate.first;

        const hasMoreResults = rows.length === limit + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }
        if (flip) {
          rows = rows.reverse();
        }

        const hasPreviousPage = flip ? hasMoreResults : false;
        const hasNextPage = flip ? false : hasMoreResults;
        const startCursor =
          rows[0] && rows[0].id ? encodeCursor(rows[0].id) : null;
        const endCursor =
          rows[rows.length - 1] && rows[rows.length - 1].id
            ? encodeCursor(rows[rows.length - 1].id)
            : null;

        res.set("x-pagination-has-previous-page", hasPreviousPage);
        res.set("x-pagination-has-next-page", hasNextPage);
        if (startCursor != null) {
          res.set("x-pagination-start-cursor", startCursor);
        }
        if (endCursor != null) {
          res.set("x-pagination-end-cursor", endCursor);
        }
      }
    }

    if (typeof totalCount === "number") {
      res.set("x-pagination-total-count", totalCount);
    }

    if (
      typeof totalCount === "number" &&
      req.query.$paginate &&
      req.query.$paginate.pageSize
    ) {
      res.set(
        "x-pagination-last-page",
        Math.ceil(totalCount / req.query.$paginate.pageSize)
      );
    }

    // https://jsperf.com/delete-vs-spread-vs-lodash-omit-vs-lodash-inverse-pick
    for (let row of rows) {
      row.id = undefined;
    }

    return res.status(200).json(rows);
  } catch (e) {
    return next(e);
  }
};

module.exports.riskTypePost = async (req, res, next) => {
  try {
    const table = "RiskType";
    const relations = [
      {
        localTable: "RiskType",
        localField: "parentId",
        localForeignIdent: "parentUuid",
        foreignTable: "RiskType",
        foreignField: "id",
        foreignIdent: "uuid",
      },
    ];
    const reqBodySchema = require("./schemas/risk-type.POST.req.body.json");
    const ident = "uuid";
    const joins = [
      {
        type: "left",
        target: "RiskType",
        alias: "RiskType_0",
        on: { id: "$RiskType.parentId$" },
      },
    ];
    const fields = [
      "enum",
      "name",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
      { as: "parentUuid", expression: "RiskType_0.uuid" },
    ];

    const body = prepareDateTimeStrings(
      reqBodySchema,
      await mapExposedIdentsToInternal(relations, req.body)
    );

    const inserted = await db.query("INSERT INTO ?? SET ?? = UUID(), ?", [
      table,
      ident,
      body,
    ]);
    const id = inserted.insertId;

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { id },
    });
    const record = await db.queryHead(sqlStringAndValues);

    return res.status(200).json(record);
  } catch (e) {
    return next(e);
  }
};

module.exports.riskTypePatch = async (req, res, next) => {
  try {
    const table = "RiskType";
    const archiveTable = archiveTablesMap[table];
    const relations = [
      {
        localTable: "RiskType",
        localField: "parentId",
        localForeignIdent: "parentUuid",
        foreignTable: "RiskType",
        foreignField: "id",
        foreignIdent: "uuid",
      },
    ];
    const reqBodySchema = require("./schemas/risk-type.PATCH.req.body.json");
    const resBodyKeys = [
      "enum",
      "name",
      "parentUuid",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];
    const ident = "uuid";
    const joins = [
      {
        type: "left",
        target: "RiskType",
        alias: "RiskType_0",
        on: { id: "$RiskType.parentId$" },
      },
    ];
    const fields = ["*", { as: "parentUuid", expression: "RiskType_0.uuid" }];

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const current = await db.queryHead(sqlStringAndValues);

    if (!current) {
      return res.status(404).json({ errors: ["Record not found"] });
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? SET ?", [
        archiveTable,
        {
          ..._.omit(["parentUuid"], current),
          modifier: req.headers["x-user-uuid"] || "stub",
        },
      ]);
    }

    if (Object.keys(req.body).length) {
      const body = prepareDateTimeStrings(
        reqBodySchema,
        await mapExposedIdentsToInternal(relations, req.body)
      );
      await db.query("UPDATE ?? SET ? WHERE ?? = ?", [
        table,
        body,
        ident,
        req.params[ident],
      ]);
    } else {
      // Nothing to update.
      const resBody = _.pick(resBodyKeys, current);
      return res.status(200).json(resBody);
    }
    const record = await db.queryHead(
      await getSQLString({
        table,
        fields,
        joins,
        $where: { [ident]: req.params["uuid"] },
      })
    );

    const resBody = _.pick(resBodyKeys, record);
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.riskTypePatchList = async (req, res, next) => {
  try {
    const table = "RiskType";
    const relations = relationsMap[table];
    const archiveTable = archiveTablesMap[table];
    const reqBodySchema = require("./schemas/risk-type.PATCH.list.req.body.json");
    const resBodyKeys = [
      "enum",
      "name",
      "parentUuid",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];

    const $where = await prepareWhere(relations, req.query.$where);
    const selectParams = await getSQLString({
      table,
      $where,
    });

    const currents = await db.query(selectParams);
    if (!currents.length) {
      return res.status(200).json([]);
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? (??) VALUES ?", [
        archiveTable,
        [].concat(Object.keys(currents[0])).concat("modifier"),
        currents.map((c) =>
          Object.values(c).concat(req.headers["x-user-uuid"] || "stub")
        ),
      ]);
    }

    if (Object.keys(req.body).length) {
      const body = prepareDateTimeStrings(
        reqBodySchema,
        await mapExposedIdentsToInternal(relations, req.body)
      );

      let sql = "UPDATE ?? SET ?";
      let values = [table, body];

      if (selectParams.sql.includes(" where ")) {
        sql += " where " + selectParams.sql.split(" where ")[1];
        values = values.concat(selectParams.values);
      }

      await db.query(sql, values);
    } else {
      // Nothing to update.
      let resBody = (
        await Promise.all(
          currents.map((current) =>
            mapInternalIdentsToExposed(relations, current)
          )
        )
      ).map((x) => _.pick(resBodyKeys, x));
      return res.status(200).json(resBody);
    }
    const records = await db.query(selectParams);
    const resBody = (
      await Promise.all(
        records.map((record) => mapInternalIdentsToExposed(relations, record))
      )
    ).map((x) => _.pick(resBodyKeys, x));
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.riskTypeDelete = async (req, res, next) => {
  try {
    const table = "RiskType";
    const archiveTable = archiveTablesMap[table];
    const resBodyKeys = [
      "enum",
      "name",
      "parentUuid",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];
    const ident = "uuid";
    const joins = [
      {
        type: "left",
        target: "RiskType",
        alias: "RiskType_0",
        on: { id: "$RiskType.parentId$" },
      },
    ];
    const fields = ["*", { as: "parentUuid", expression: "RiskType_0.uuid" }];

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const current = await db.queryHead(sqlStringAndValues);

    if (!current) {
      return res.status(404).json({ errors: ["Record not found"] });
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? SET ?", [
        archiveTable,
        {
          ..._.omit(["parentUuid"], current),
          modifier: req.headers["x-user-uuid"] || "stub",
          userDeleted: 1,
        },
      ]);
    }

    await db.query("DELETE FROM ?? WHERE ?? = ?", [
      table,
      ident,
      req.params[ident],
    ]);

    const resBody = _.pick(resBodyKeys, current);
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.riskTypeDeleteList = async (req, res, next) => {
  try {
    const table = "RiskType";
    const archiveTable = archiveTablesMap[table];
    const relations = relationsMap[table];
    const resBodyKeys = [
      "enum",
      "name",
      "parentUuid",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];

    const $where = await prepareWhere(relations, req.query.$where);
    const selectParams = await getSQLString({
      table,
      $where,
    });

    const currents = await db.query(selectParams);
    if (!currents.length) {
      return res.status(200).json([]);
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? (??) VALUES ?", [
        archiveTable,
        []
          .concat(Object.keys(currents[0]))
          .concat("modifier")
          .concat("userDeleted"),
        currents.map((c) =>
          Object.values(c)
            .concat(req.headers["x-user-uuid"] || "stub")
            .concat(1)
        ),
      ]);
    }

    let sql = "DELETE FROM ??";
    let values = [table];

    if (selectParams.sql.includes(" where ")) {
      sql += " where " + selectParams.sql.split(" where ")[1];
      values = values.concat(selectParams.values);
    }

    await db.query(sql, values);

    const resBody = (
      await Promise.all(
        currents.map((record) => mapInternalIdentsToExposed(relations, record))
      )
    ).map((x) => _.pick(resBodyKeys, x));
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.roleGet = async (req, res, next) => {
  try {
    const table = "Role";
    const ident = "uuid";
    const joins = [];
    const fields = [
      "enum",
      "name",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];
    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const record = await db.queryHead(sqlStringAndValues);
    if (!record) {
      return res.status(404).json({ errors: ["Record not found"] });
    }
    return res.status(200).json(record);
  } catch (e) {
    return next(e);
  }
};

module.exports.roleGetList = async (req, res, next) => {
  try {
    const table = "Role";
    const relations = [];

    const $where = await prepareWhere(relations, req.query.$where);
    const $orderBy = req.query.$orderBy
      ? Array.isArray(req.query.$orderBy)
        ? req.query.$orderBy.map((x) => mapExposedKeysToInternal(relations, x))
        : mapExposedKeysToInternal(relations, req.query.$orderBy)
      : undefined;

    // https://github.com/epoberezkin/ajv/issues/276
    if (req.query.$paginate && req.query.$paginate.page) {
      req.query.$paginate.pageSize = req.query.$paginate.pageSize || 20;
    }

    let rows, totalCount;

    const joins = [];
    const fields = [
      "id",
      "enum",
      "name",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];
    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where,
      $orderBy,
      $paginate: req.query.$paginate || undefined,
    });

    if (req.query.$paginate) {
      [rows, totalCount] = await Promise.all([
        db.query(sqlStringAndValues),
        db
          .queryHead(
            await getSQLString({
              table,
              fields: ["COUNT(*)"],
              $where,
              $orderBy,
            })
          )
          .then((d) => d["COUNT(*)"]),
      ]);
    } else {
      rows = await db.query(sqlStringAndValues);
    }

    if (req.query.$paginate) {
      if (typeof req.query.$paginate.limit === "number") {
        const hasMoreResults = rows.length === req.query.$paginate.limit + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }

        res.set("x-pagination-limit", req.query.$paginate.limit);
        res.set("x-pagination-offset", req.query.$paginate.offset);
        res.set(
          "x-pagination-has-previous-page",
          req.query.$paginate.offset > 0
        );
        res.set("x-pagination-has-next-page", !!hasMoreResults);
      } else if (typeof req.query.$paginate.page === "number") {
        const hasMoreResults = rows.length === req.query.$paginate.pageSize + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }

        res.set("x-pagination-page", req.query.$paginate.page);
        res.set("x-pagination-page-size", req.query.$paginate.pageSize);
        res.set("x-pagination-has-previous-page", req.query.$paginate.page > 1);
        res.set("x-pagination-has-next-page", !!hasMoreResults);
      } else {
        const flip =
          typeof req.query.$paginate.first === "number" ? false : true;
        const limit = flip
          ? req.query.$paginate.last
          : req.query.$paginate.first;

        const hasMoreResults = rows.length === limit + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }
        if (flip) {
          rows = rows.reverse();
        }

        const hasPreviousPage = flip ? hasMoreResults : false;
        const hasNextPage = flip ? false : hasMoreResults;
        const startCursor =
          rows[0] && rows[0].id ? encodeCursor(rows[0].id) : null;
        const endCursor =
          rows[rows.length - 1] && rows[rows.length - 1].id
            ? encodeCursor(rows[rows.length - 1].id)
            : null;

        res.set("x-pagination-has-previous-page", hasPreviousPage);
        res.set("x-pagination-has-next-page", hasNextPage);
        if (startCursor != null) {
          res.set("x-pagination-start-cursor", startCursor);
        }
        if (endCursor != null) {
          res.set("x-pagination-end-cursor", endCursor);
        }
      }
    }

    if (typeof totalCount === "number") {
      res.set("x-pagination-total-count", totalCount);
    }

    if (
      typeof totalCount === "number" &&
      req.query.$paginate &&
      req.query.$paginate.pageSize
    ) {
      res.set(
        "x-pagination-last-page",
        Math.ceil(totalCount / req.query.$paginate.pageSize)
      );
    }

    // https://jsperf.com/delete-vs-spread-vs-lodash-omit-vs-lodash-inverse-pick
    for (let row of rows) {
      row.id = undefined;
    }

    return res.status(200).json(rows);
  } catch (e) {
    return next(e);
  }
};

module.exports.rolePost = async (req, res, next) => {
  try {
    const table = "Role";
    const relations = [];
    const reqBodySchema = require("./schemas/role.POST.req.body.json");
    const ident = "uuid";
    const joins = [];
    const fields = [
      "enum",
      "name",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];

    const body = prepareDateTimeStrings(
      reqBodySchema,
      await mapExposedIdentsToInternal(relations, req.body)
    );

    const inserted = await db.query("INSERT INTO ?? SET ?? = UUID(), ?", [
      table,
      ident,
      body,
    ]);
    const id = inserted.insertId;

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { id },
    });
    const record = await db.queryHead(sqlStringAndValues);

    return res.status(200).json(record);
  } catch (e) {
    return next(e);
  }
};

module.exports.rolePatch = async (req, res, next) => {
  try {
    const table = "Role";
    const archiveTable = archiveTablesMap[table];
    const relations = [];
    const reqBodySchema = require("./schemas/role.PATCH.req.body.json");
    const resBodyKeys = [
      "enum",
      "name",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];
    const ident = "uuid";
    const joins = [];
    const fields = ["*"];

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const current = await db.queryHead(sqlStringAndValues);

    if (!current) {
      return res.status(404).json({ errors: ["Record not found"] });
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? SET ?", [
        archiveTable,
        {
          ..._.omit([], current),
          modifier: req.headers["x-user-uuid"] || "stub",
        },
      ]);
    }

    if (Object.keys(req.body).length) {
      const body = prepareDateTimeStrings(
        reqBodySchema,
        await mapExposedIdentsToInternal(relations, req.body)
      );
      await db.query("UPDATE ?? SET ? WHERE ?? = ?", [
        table,
        body,
        ident,
        req.params[ident],
      ]);
    } else {
      // Nothing to update.
      const resBody = _.pick(resBodyKeys, current);
      return res.status(200).json(resBody);
    }
    const record = await db.queryHead(
      await getSQLString({
        table,
        fields,
        joins,
        $where: { [ident]: req.params["uuid"] },
      })
    );

    const resBody = _.pick(resBodyKeys, record);
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.rolePatchList = async (req, res, next) => {
  try {
    const table = "Role";
    const relations = relationsMap[table];
    const archiveTable = archiveTablesMap[table];
    const reqBodySchema = require("./schemas/role.PATCH.list.req.body.json");
    const resBodyKeys = [
      "enum",
      "name",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];

    const $where = await prepareWhere(relations, req.query.$where);
    const selectParams = await getSQLString({
      table,
      $where,
    });

    const currents = await db.query(selectParams);
    if (!currents.length) {
      return res.status(200).json([]);
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? (??) VALUES ?", [
        archiveTable,
        [].concat(Object.keys(currents[0])).concat("modifier"),
        currents.map((c) =>
          Object.values(c).concat(req.headers["x-user-uuid"] || "stub")
        ),
      ]);
    }

    if (Object.keys(req.body).length) {
      const body = prepareDateTimeStrings(
        reqBodySchema,
        await mapExposedIdentsToInternal(relations, req.body)
      );

      let sql = "UPDATE ?? SET ?";
      let values = [table, body];

      if (selectParams.sql.includes(" where ")) {
        sql += " where " + selectParams.sql.split(" where ")[1];
        values = values.concat(selectParams.values);
      }

      await db.query(sql, values);
    } else {
      // Nothing to update.
      let resBody = (
        await Promise.all(
          currents.map((current) =>
            mapInternalIdentsToExposed(relations, current)
          )
        )
      ).map((x) => _.pick(resBodyKeys, x));
      return res.status(200).json(resBody);
    }
    const records = await db.query(selectParams);
    const resBody = (
      await Promise.all(
        records.map((record) => mapInternalIdentsToExposed(relations, record))
      )
    ).map((x) => _.pick(resBodyKeys, x));
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.roleDelete = async (req, res, next) => {
  try {
    const table = "Role";
    const archiveTable = archiveTablesMap[table];
    const resBodyKeys = [
      "enum",
      "name",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];
    const ident = "uuid";
    const joins = [];
    const fields = ["*"];

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const current = await db.queryHead(sqlStringAndValues);

    if (!current) {
      return res.status(404).json({ errors: ["Record not found"] });
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? SET ?", [
        archiveTable,
        {
          ..._.omit([], current),
          modifier: req.headers["x-user-uuid"] || "stub",
          userDeleted: 1,
        },
      ]);
    }

    await db.query("DELETE FROM ?? WHERE ?? = ?", [
      table,
      ident,
      req.params[ident],
    ]);

    const resBody = _.pick(resBodyKeys, current);
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.roleDeleteList = async (req, res, next) => {
  try {
    const table = "Role";
    const archiveTable = archiveTablesMap[table];
    const relations = relationsMap[table];
    const resBodyKeys = [
      "enum",
      "name",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];

    const $where = await prepareWhere(relations, req.query.$where);
    const selectParams = await getSQLString({
      table,
      $where,
    });

    const currents = await db.query(selectParams);
    if (!currents.length) {
      return res.status(200).json([]);
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? (??) VALUES ?", [
        archiveTable,
        []
          .concat(Object.keys(currents[0]))
          .concat("modifier")
          .concat("userDeleted"),
        currents.map((c) =>
          Object.values(c)
            .concat(req.headers["x-user-uuid"] || "stub")
            .concat(1)
        ),
      ]);
    }

    let sql = "DELETE FROM ??";
    let values = [table];

    if (selectParams.sql.includes(" where ")) {
      sql += " where " + selectParams.sql.split(" where ")[1];
      values = values.concat(selectParams.values);
    }

    await db.query(sql, values);

    const resBody = (
      await Promise.all(
        currents.map((record) => mapInternalIdentsToExposed(relations, record))
      )
    ).map((x) => _.pick(resBodyKeys, x));
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.tagGet = async (req, res, next) => {
  try {
    const table = "Tag";
    const ident = "uuid";
    const joins = [];
    const fields = [
      "name",
      "rgbColor",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];
    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const record = await db.queryHead(sqlStringAndValues);
    if (!record) {
      return res.status(404).json({ errors: ["Record not found"] });
    }
    return res.status(200).json(record);
  } catch (e) {
    return next(e);
  }
};

module.exports.tagGetList = async (req, res, next) => {
  try {
    const table = "Tag";
    const relations = [];

    const $where = await prepareWhere(relations, req.query.$where);
    const $orderBy = req.query.$orderBy
      ? Array.isArray(req.query.$orderBy)
        ? req.query.$orderBy.map((x) => mapExposedKeysToInternal(relations, x))
        : mapExposedKeysToInternal(relations, req.query.$orderBy)
      : undefined;

    // https://github.com/epoberezkin/ajv/issues/276
    if (req.query.$paginate && req.query.$paginate.page) {
      req.query.$paginate.pageSize = req.query.$paginate.pageSize || 20;
    }

    let rows, totalCount;

    const joins = [];
    const fields = [
      "id",
      "name",
      "rgbColor",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];
    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where,
      $orderBy,
      $paginate: req.query.$paginate || undefined,
    });

    if (req.query.$paginate) {
      [rows, totalCount] = await Promise.all([
        db.query(sqlStringAndValues),
        db
          .queryHead(
            await getSQLString({
              table,
              fields: ["COUNT(*)"],
              $where,
              $orderBy,
            })
          )
          .then((d) => d["COUNT(*)"]),
      ]);
    } else {
      rows = await db.query(sqlStringAndValues);
    }

    if (req.query.$paginate) {
      if (typeof req.query.$paginate.limit === "number") {
        const hasMoreResults = rows.length === req.query.$paginate.limit + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }

        res.set("x-pagination-limit", req.query.$paginate.limit);
        res.set("x-pagination-offset", req.query.$paginate.offset);
        res.set(
          "x-pagination-has-previous-page",
          req.query.$paginate.offset > 0
        );
        res.set("x-pagination-has-next-page", !!hasMoreResults);
      } else if (typeof req.query.$paginate.page === "number") {
        const hasMoreResults = rows.length === req.query.$paginate.pageSize + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }

        res.set("x-pagination-page", req.query.$paginate.page);
        res.set("x-pagination-page-size", req.query.$paginate.pageSize);
        res.set("x-pagination-has-previous-page", req.query.$paginate.page > 1);
        res.set("x-pagination-has-next-page", !!hasMoreResults);
      } else {
        const flip =
          typeof req.query.$paginate.first === "number" ? false : true;
        const limit = flip
          ? req.query.$paginate.last
          : req.query.$paginate.first;

        const hasMoreResults = rows.length === limit + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }
        if (flip) {
          rows = rows.reverse();
        }

        const hasPreviousPage = flip ? hasMoreResults : false;
        const hasNextPage = flip ? false : hasMoreResults;
        const startCursor =
          rows[0] && rows[0].id ? encodeCursor(rows[0].id) : null;
        const endCursor =
          rows[rows.length - 1] && rows[rows.length - 1].id
            ? encodeCursor(rows[rows.length - 1].id)
            : null;

        res.set("x-pagination-has-previous-page", hasPreviousPage);
        res.set("x-pagination-has-next-page", hasNextPage);
        if (startCursor != null) {
          res.set("x-pagination-start-cursor", startCursor);
        }
        if (endCursor != null) {
          res.set("x-pagination-end-cursor", endCursor);
        }
      }
    }

    if (typeof totalCount === "number") {
      res.set("x-pagination-total-count", totalCount);
    }

    if (
      typeof totalCount === "number" &&
      req.query.$paginate &&
      req.query.$paginate.pageSize
    ) {
      res.set(
        "x-pagination-last-page",
        Math.ceil(totalCount / req.query.$paginate.pageSize)
      );
    }

    // https://jsperf.com/delete-vs-spread-vs-lodash-omit-vs-lodash-inverse-pick
    for (let row of rows) {
      row.id = undefined;
    }

    return res.status(200).json(rows);
  } catch (e) {
    return next(e);
  }
};

module.exports.tagPost = async (req, res, next) => {
  try {
    const table = "Tag";
    const relations = [];
    const reqBodySchema = require("./schemas/tag.POST.req.body.json");
    const ident = "uuid";
    const joins = [];
    const fields = [
      "name",
      "rgbColor",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];

    const body = prepareDateTimeStrings(
      reqBodySchema,
      await mapExposedIdentsToInternal(relations, req.body)
    );

    const inserted = await db.query("INSERT INTO ?? SET ?? = UUID(), ?", [
      table,
      ident,
      body,
    ]);
    const id = inserted.insertId;

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { id },
    });
    const record = await db.queryHead(sqlStringAndValues);

    return res.status(200).json(record);
  } catch (e) {
    return next(e);
  }
};

module.exports.tagPatch = async (req, res, next) => {
  try {
    const table = "Tag";
    const archiveTable = archiveTablesMap[table];
    const relations = [];
    const reqBodySchema = require("./schemas/tag.PATCH.req.body.json");
    const resBodyKeys = [
      "name",
      "rgbColor",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];
    const ident = "uuid";
    const joins = [];
    const fields = ["*"];

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const current = await db.queryHead(sqlStringAndValues);

    if (!current) {
      return res.status(404).json({ errors: ["Record not found"] });
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? SET ?", [
        archiveTable,
        {
          ..._.omit([], current),
          modifier: req.headers["x-user-uuid"] || "stub",
        },
      ]);
    }

    if (Object.keys(req.body).length) {
      const body = prepareDateTimeStrings(
        reqBodySchema,
        await mapExposedIdentsToInternal(relations, req.body)
      );
      await db.query("UPDATE ?? SET ? WHERE ?? = ?", [
        table,
        body,
        ident,
        req.params[ident],
      ]);
    } else {
      // Nothing to update.
      const resBody = _.pick(resBodyKeys, current);
      return res.status(200).json(resBody);
    }
    const record = await db.queryHead(
      await getSQLString({
        table,
        fields,
        joins,
        $where: { [ident]: req.params["uuid"] },
      })
    );

    const resBody = _.pick(resBodyKeys, record);
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.tagPatchList = async (req, res, next) => {
  try {
    const table = "Tag";
    const relations = relationsMap[table];
    const archiveTable = archiveTablesMap[table];
    const reqBodySchema = require("./schemas/tag.PATCH.list.req.body.json");
    const resBodyKeys = [
      "name",
      "rgbColor",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];

    const $where = await prepareWhere(relations, req.query.$where);
    const selectParams = await getSQLString({
      table,
      $where,
    });

    const currents = await db.query(selectParams);
    if (!currents.length) {
      return res.status(200).json([]);
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? (??) VALUES ?", [
        archiveTable,
        [].concat(Object.keys(currents[0])).concat("modifier"),
        currents.map((c) =>
          Object.values(c).concat(req.headers["x-user-uuid"] || "stub")
        ),
      ]);
    }

    if (Object.keys(req.body).length) {
      const body = prepareDateTimeStrings(
        reqBodySchema,
        await mapExposedIdentsToInternal(relations, req.body)
      );

      let sql = "UPDATE ?? SET ?";
      let values = [table, body];

      if (selectParams.sql.includes(" where ")) {
        sql += " where " + selectParams.sql.split(" where ")[1];
        values = values.concat(selectParams.values);
      }

      await db.query(sql, values);
    } else {
      // Nothing to update.
      let resBody = (
        await Promise.all(
          currents.map((current) =>
            mapInternalIdentsToExposed(relations, current)
          )
        )
      ).map((x) => _.pick(resBodyKeys, x));
      return res.status(200).json(resBody);
    }
    const records = await db.query(selectParams);
    const resBody = (
      await Promise.all(
        records.map((record) => mapInternalIdentsToExposed(relations, record))
      )
    ).map((x) => _.pick(resBodyKeys, x));
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.tagDelete = async (req, res, next) => {
  try {
    const table = "Tag";
    const archiveTable = archiveTablesMap[table];
    const resBodyKeys = [
      "name",
      "rgbColor",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];
    const ident = "uuid";
    const joins = [];
    const fields = ["*"];

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const current = await db.queryHead(sqlStringAndValues);

    if (!current) {
      return res.status(404).json({ errors: ["Record not found"] });
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? SET ?", [
        archiveTable,
        {
          ..._.omit([], current),
          modifier: req.headers["x-user-uuid"] || "stub",
          userDeleted: 1,
        },
      ]);
    }

    await db.query("DELETE FROM ?? WHERE ?? = ?", [
      table,
      ident,
      req.params[ident],
    ]);

    const resBody = _.pick(resBodyKeys, current);
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.tagDeleteList = async (req, res, next) => {
  try {
    const table = "Tag";
    const archiveTable = archiveTablesMap[table];
    const relations = relationsMap[table];
    const resBodyKeys = [
      "name",
      "rgbColor",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];

    const $where = await prepareWhere(relations, req.query.$where);
    const selectParams = await getSQLString({
      table,
      $where,
    });

    const currents = await db.query(selectParams);
    if (!currents.length) {
      return res.status(200).json([]);
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? (??) VALUES ?", [
        archiveTable,
        []
          .concat(Object.keys(currents[0]))
          .concat("modifier")
          .concat("userDeleted"),
        currents.map((c) =>
          Object.values(c)
            .concat(req.headers["x-user-uuid"] || "stub")
            .concat(1)
        ),
      ]);
    }

    let sql = "DELETE FROM ??";
    let values = [table];

    if (selectParams.sql.includes(" where ")) {
      sql += " where " + selectParams.sql.split(" where ")[1];
      values = values.concat(selectParams.values);
    }

    await db.query(sql, values);

    const resBody = (
      await Promise.all(
        currents.map((record) => mapInternalIdentsToExposed(relations, record))
      )
    ).map((x) => _.pick(resBodyKeys, x));
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.tagOrganizationGet = async (req, res, next) => {
  try {
    const table = "TagOrganization";
    const ident = "uuid";
    const joins = [
      {
        type: "left",
        target: "Organization",
        alias: "Organization_0",
        on: { id: "$TagOrganization.organizationId$" },
      },
      {
        type: "left",
        target: "Tag",
        alias: "Tag_1",
        on: { id: "$TagOrganization.tagId$" },
      },
    ];
    const fields = [
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
      { as: "organizationUuid", expression: "Organization_0.uuid" },
      { as: "tagUuid", expression: "Tag_1.uuid" },
    ];
    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const record = await db.queryHead(sqlStringAndValues);
    if (!record) {
      return res.status(404).json({ errors: ["Record not found"] });
    }
    return res.status(200).json(record);
  } catch (e) {
    return next(e);
  }
};

module.exports.tagOrganizationGetList = async (req, res, next) => {
  try {
    const table = "TagOrganization";
    const relations = [
      {
        localTable: "TagOrganization",
        localField: "organizationId",
        localForeignIdent: "organizationUuid",
        foreignTable: "Organization",
        foreignField: "id",
        foreignIdent: "uuid",
      },
      {
        localTable: "TagOrganization",
        localField: "tagId",
        localForeignIdent: "tagUuid",
        foreignTable: "Tag",
        foreignField: "id",
        foreignIdent: "uuid",
      },
    ];

    const $where = await prepareWhere(relations, req.query.$where);
    const $orderBy = req.query.$orderBy
      ? Array.isArray(req.query.$orderBy)
        ? req.query.$orderBy.map((x) => mapExposedKeysToInternal(relations, x))
        : mapExposedKeysToInternal(relations, req.query.$orderBy)
      : undefined;

    // https://github.com/epoberezkin/ajv/issues/276
    if (req.query.$paginate && req.query.$paginate.page) {
      req.query.$paginate.pageSize = req.query.$paginate.pageSize || 20;
    }

    let rows, totalCount;

    const joins = [
      {
        type: "left",
        target: "Organization",
        alias: "Organization_0",
        on: { id: "$TagOrganization.organizationId$" },
      },
      {
        type: "left",
        target: "Tag",
        alias: "Tag_1",
        on: { id: "$TagOrganization.tagId$" },
      },
    ];
    const fields = [
      "id",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
      { as: "organizationUuid", expression: "Organization_0.uuid" },
      { as: "tagUuid", expression: "Tag_1.uuid" },
    ];
    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where,
      $orderBy,
      $paginate: req.query.$paginate || undefined,
    });

    if (req.query.$paginate) {
      [rows, totalCount] = await Promise.all([
        db.query(sqlStringAndValues),
        db
          .queryHead(
            await getSQLString({
              table,
              fields: ["COUNT(*)"],
              $where,
              $orderBy,
            })
          )
          .then((d) => d["COUNT(*)"]),
      ]);
    } else {
      rows = await db.query(sqlStringAndValues);
    }

    if (req.query.$paginate) {
      if (typeof req.query.$paginate.limit === "number") {
        const hasMoreResults = rows.length === req.query.$paginate.limit + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }

        res.set("x-pagination-limit", req.query.$paginate.limit);
        res.set("x-pagination-offset", req.query.$paginate.offset);
        res.set(
          "x-pagination-has-previous-page",
          req.query.$paginate.offset > 0
        );
        res.set("x-pagination-has-next-page", !!hasMoreResults);
      } else if (typeof req.query.$paginate.page === "number") {
        const hasMoreResults = rows.length === req.query.$paginate.pageSize + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }

        res.set("x-pagination-page", req.query.$paginate.page);
        res.set("x-pagination-page-size", req.query.$paginate.pageSize);
        res.set("x-pagination-has-previous-page", req.query.$paginate.page > 1);
        res.set("x-pagination-has-next-page", !!hasMoreResults);
      } else {
        const flip =
          typeof req.query.$paginate.first === "number" ? false : true;
        const limit = flip
          ? req.query.$paginate.last
          : req.query.$paginate.first;

        const hasMoreResults = rows.length === limit + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }
        if (flip) {
          rows = rows.reverse();
        }

        const hasPreviousPage = flip ? hasMoreResults : false;
        const hasNextPage = flip ? false : hasMoreResults;
        const startCursor =
          rows[0] && rows[0].id ? encodeCursor(rows[0].id) : null;
        const endCursor =
          rows[rows.length - 1] && rows[rows.length - 1].id
            ? encodeCursor(rows[rows.length - 1].id)
            : null;

        res.set("x-pagination-has-previous-page", hasPreviousPage);
        res.set("x-pagination-has-next-page", hasNextPage);
        if (startCursor != null) {
          res.set("x-pagination-start-cursor", startCursor);
        }
        if (endCursor != null) {
          res.set("x-pagination-end-cursor", endCursor);
        }
      }
    }

    if (typeof totalCount === "number") {
      res.set("x-pagination-total-count", totalCount);
    }

    if (
      typeof totalCount === "number" &&
      req.query.$paginate &&
      req.query.$paginate.pageSize
    ) {
      res.set(
        "x-pagination-last-page",
        Math.ceil(totalCount / req.query.$paginate.pageSize)
      );
    }

    // https://jsperf.com/delete-vs-spread-vs-lodash-omit-vs-lodash-inverse-pick
    for (let row of rows) {
      row.id = undefined;
    }

    return res.status(200).json(rows);
  } catch (e) {
    return next(e);
  }
};

module.exports.tagOrganizationPost = async (req, res, next) => {
  try {
    const table = "TagOrganization";
    const relations = [
      {
        localTable: "TagOrganization",
        localField: "organizationId",
        localForeignIdent: "organizationUuid",
        foreignTable: "Organization",
        foreignField: "id",
        foreignIdent: "uuid",
      },
      {
        localTable: "TagOrganization",
        localField: "tagId",
        localForeignIdent: "tagUuid",
        foreignTable: "Tag",
        foreignField: "id",
        foreignIdent: "uuid",
      },
    ];
    const reqBodySchema = require("./schemas/tag-organization.POST.req.body.json");
    const ident = "uuid";
    const joins = [
      {
        type: "left",
        target: "Organization",
        alias: "Organization_0",
        on: { id: "$TagOrganization.organizationId$" },
      },
      {
        type: "left",
        target: "Tag",
        alias: "Tag_1",
        on: { id: "$TagOrganization.tagId$" },
      },
    ];
    const fields = [
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
      { as: "organizationUuid", expression: "Organization_0.uuid" },
      { as: "tagUuid", expression: "Tag_1.uuid" },
    ];

    const body = prepareDateTimeStrings(
      reqBodySchema,
      await mapExposedIdentsToInternal(relations, req.body)
    );

    const inserted = await db.query("INSERT INTO ?? SET ?? = UUID(), ?", [
      table,
      ident,
      body,
    ]);
    const id = inserted.insertId;

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { id },
    });
    const record = await db.queryHead(sqlStringAndValues);

    return res.status(200).json(record);
  } catch (e) {
    return next(e);
  }
};

module.exports.tagOrganizationPatch = async (req, res, next) => {
  try {
    const table = "TagOrganization";
    const archiveTable = archiveTablesMap[table];
    const relations = [
      {
        localTable: "TagOrganization",
        localField: "organizationId",
        localForeignIdent: "organizationUuid",
        foreignTable: "Organization",
        foreignField: "id",
        foreignIdent: "uuid",
      },
      {
        localTable: "TagOrganization",
        localField: "tagId",
        localForeignIdent: "tagUuid",
        foreignTable: "Tag",
        foreignField: "id",
        foreignIdent: "uuid",
      },
    ];
    const reqBodySchema = require("./schemas/tag-organization.PATCH.req.body.json");
    const resBodyKeys = [
      "tagUuid",
      "organizationUuid",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];
    const ident = "uuid";
    const joins = [
      {
        type: "left",
        target: "Organization",
        alias: "Organization_0",
        on: { id: "$TagOrganization.organizationId$" },
      },
      {
        type: "left",
        target: "Tag",
        alias: "Tag_1",
        on: { id: "$TagOrganization.tagId$" },
      },
    ];
    const fields = [
      "*",
      { as: "organizationUuid", expression: "Organization_0.uuid" },
      { as: "tagUuid", expression: "Tag_1.uuid" },
    ];

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const current = await db.queryHead(sqlStringAndValues);

    if (!current) {
      return res.status(404).json({ errors: ["Record not found"] });
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? SET ?", [
        archiveTable,
        {
          ..._.omit(["organizationUuid", "tagUuid"], current),
          modifier: req.headers["x-user-uuid"] || "stub",
        },
      ]);
    }

    if (Object.keys(req.body).length) {
      const body = prepareDateTimeStrings(
        reqBodySchema,
        await mapExposedIdentsToInternal(relations, req.body)
      );
      await db.query("UPDATE ?? SET ? WHERE ?? = ?", [
        table,
        body,
        ident,
        req.params[ident],
      ]);
    } else {
      // Nothing to update.
      const resBody = _.pick(resBodyKeys, current);
      return res.status(200).json(resBody);
    }
    const record = await db.queryHead(
      await getSQLString({
        table,
        fields,
        joins,
        $where: { [ident]: req.params["uuid"] },
      })
    );

    const resBody = _.pick(resBodyKeys, record);
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.tagOrganizationPatchList = async (req, res, next) => {
  try {
    const table = "TagOrganization";
    const relations = relationsMap[table];
    const archiveTable = archiveTablesMap[table];
    const reqBodySchema = require("./schemas/tag-organization.PATCH.list.req.body.json");
    const resBodyKeys = [
      "tagUuid",
      "organizationUuid",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];

    const $where = await prepareWhere(relations, req.query.$where);
    const selectParams = await getSQLString({
      table,
      $where,
    });

    const currents = await db.query(selectParams);
    if (!currents.length) {
      return res.status(200).json([]);
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? (??) VALUES ?", [
        archiveTable,
        [].concat(Object.keys(currents[0])).concat("modifier"),
        currents.map((c) =>
          Object.values(c).concat(req.headers["x-user-uuid"] || "stub")
        ),
      ]);
    }

    if (Object.keys(req.body).length) {
      const body = prepareDateTimeStrings(
        reqBodySchema,
        await mapExposedIdentsToInternal(relations, req.body)
      );

      let sql = "UPDATE ?? SET ?";
      let values = [table, body];

      if (selectParams.sql.includes(" where ")) {
        sql += " where " + selectParams.sql.split(" where ")[1];
        values = values.concat(selectParams.values);
      }

      await db.query(sql, values);
    } else {
      // Nothing to update.
      let resBody = (
        await Promise.all(
          currents.map((current) =>
            mapInternalIdentsToExposed(relations, current)
          )
        )
      ).map((x) => _.pick(resBodyKeys, x));
      return res.status(200).json(resBody);
    }
    const records = await db.query(selectParams);
    const resBody = (
      await Promise.all(
        records.map((record) => mapInternalIdentsToExposed(relations, record))
      )
    ).map((x) => _.pick(resBodyKeys, x));
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.tagOrganizationDelete = async (req, res, next) => {
  try {
    const table = "TagOrganization";
    const archiveTable = archiveTablesMap[table];
    const resBodyKeys = [
      "tagUuid",
      "organizationUuid",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];
    const ident = "uuid";
    const joins = [
      {
        type: "left",
        target: "Organization",
        alias: "Organization_0",
        on: { id: "$TagOrganization.organizationId$" },
      },
      {
        type: "left",
        target: "Tag",
        alias: "Tag_1",
        on: { id: "$TagOrganization.tagId$" },
      },
    ];
    const fields = [
      "*",
      { as: "organizationUuid", expression: "Organization_0.uuid" },
      { as: "tagUuid", expression: "Tag_1.uuid" },
    ];

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const current = await db.queryHead(sqlStringAndValues);

    if (!current) {
      return res.status(404).json({ errors: ["Record not found"] });
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? SET ?", [
        archiveTable,
        {
          ..._.omit(["organizationUuid", "tagUuid"], current),
          modifier: req.headers["x-user-uuid"] || "stub",
          userDeleted: 1,
        },
      ]);
    }

    await db.query("DELETE FROM ?? WHERE ?? = ?", [
      table,
      ident,
      req.params[ident],
    ]);

    const resBody = _.pick(resBodyKeys, current);
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.tagOrganizationDeleteList = async (req, res, next) => {
  try {
    const table = "TagOrganization";
    const archiveTable = archiveTablesMap[table];
    const relations = relationsMap[table];
    const resBodyKeys = [
      "tagUuid",
      "organizationUuid",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];

    const $where = await prepareWhere(relations, req.query.$where);
    const selectParams = await getSQLString({
      table,
      $where,
    });

    const currents = await db.query(selectParams);
    if (!currents.length) {
      return res.status(200).json([]);
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? (??) VALUES ?", [
        archiveTable,
        []
          .concat(Object.keys(currents[0]))
          .concat("modifier")
          .concat("userDeleted"),
        currents.map((c) =>
          Object.values(c)
            .concat(req.headers["x-user-uuid"] || "stub")
            .concat(1)
        ),
      ]);
    }

    let sql = "DELETE FROM ??";
    let values = [table];

    if (selectParams.sql.includes(" where ")) {
      sql += " where " + selectParams.sql.split(" where ")[1];
      values = values.concat(selectParams.values);
    }

    await db.query(sql, values);

    const resBody = (
      await Promise.all(
        currents.map((record) => mapInternalIdentsToExposed(relations, record))
      )
    ).map((x) => _.pick(resBodyKeys, x));
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.tagProjectGet = async (req, res, next) => {
  try {
    const table = "TagProject";
    const ident = "uuid";
    const joins = [
      {
        type: "left",
        target: "Project",
        alias: "Project_0",
        on: { id: "$TagProject.projectId$" },
      },
      {
        type: "left",
        target: "Tag",
        alias: "Tag_1",
        on: { id: "$TagProject.tagId$" },
      },
    ];
    const fields = [
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
      { as: "projectUuid", expression: "Project_0.uuid" },
      { as: "tagUuid", expression: "Tag_1.uuid" },
    ];
    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const record = await db.queryHead(sqlStringAndValues);
    if (!record) {
      return res.status(404).json({ errors: ["Record not found"] });
    }
    return res.status(200).json(record);
  } catch (e) {
    return next(e);
  }
};

module.exports.tagProjectGetList = async (req, res, next) => {
  try {
    const table = "TagProject";
    const relations = [
      {
        localTable: "TagProject",
        localField: "projectId",
        localForeignIdent: "projectUuid",
        foreignTable: "Project",
        foreignField: "id",
        foreignIdent: "uuid",
      },
      {
        localTable: "TagProject",
        localField: "tagId",
        localForeignIdent: "tagUuid",
        foreignTable: "Tag",
        foreignField: "id",
        foreignIdent: "uuid",
      },
    ];

    const $where = await prepareWhere(relations, req.query.$where);
    const $orderBy = req.query.$orderBy
      ? Array.isArray(req.query.$orderBy)
        ? req.query.$orderBy.map((x) => mapExposedKeysToInternal(relations, x))
        : mapExposedKeysToInternal(relations, req.query.$orderBy)
      : undefined;

    // https://github.com/epoberezkin/ajv/issues/276
    if (req.query.$paginate && req.query.$paginate.page) {
      req.query.$paginate.pageSize = req.query.$paginate.pageSize || 20;
    }

    let rows, totalCount;

    const joins = [
      {
        type: "left",
        target: "Project",
        alias: "Project_0",
        on: { id: "$TagProject.projectId$" },
      },
      {
        type: "left",
        target: "Tag",
        alias: "Tag_1",
        on: { id: "$TagProject.tagId$" },
      },
    ];
    const fields = [
      "id",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
      { as: "projectUuid", expression: "Project_0.uuid" },
      { as: "tagUuid", expression: "Tag_1.uuid" },
    ];
    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where,
      $orderBy,
      $paginate: req.query.$paginate || undefined,
    });

    if (req.query.$paginate) {
      [rows, totalCount] = await Promise.all([
        db.query(sqlStringAndValues),
        db
          .queryHead(
            await getSQLString({
              table,
              fields: ["COUNT(*)"],
              $where,
              $orderBy,
            })
          )
          .then((d) => d["COUNT(*)"]),
      ]);
    } else {
      rows = await db.query(sqlStringAndValues);
    }

    if (req.query.$paginate) {
      if (typeof req.query.$paginate.limit === "number") {
        const hasMoreResults = rows.length === req.query.$paginate.limit + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }

        res.set("x-pagination-limit", req.query.$paginate.limit);
        res.set("x-pagination-offset", req.query.$paginate.offset);
        res.set(
          "x-pagination-has-previous-page",
          req.query.$paginate.offset > 0
        );
        res.set("x-pagination-has-next-page", !!hasMoreResults);
      } else if (typeof req.query.$paginate.page === "number") {
        const hasMoreResults = rows.length === req.query.$paginate.pageSize + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }

        res.set("x-pagination-page", req.query.$paginate.page);
        res.set("x-pagination-page-size", req.query.$paginate.pageSize);
        res.set("x-pagination-has-previous-page", req.query.$paginate.page > 1);
        res.set("x-pagination-has-next-page", !!hasMoreResults);
      } else {
        const flip =
          typeof req.query.$paginate.first === "number" ? false : true;
        const limit = flip
          ? req.query.$paginate.last
          : req.query.$paginate.first;

        const hasMoreResults = rows.length === limit + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }
        if (flip) {
          rows = rows.reverse();
        }

        const hasPreviousPage = flip ? hasMoreResults : false;
        const hasNextPage = flip ? false : hasMoreResults;
        const startCursor =
          rows[0] && rows[0].id ? encodeCursor(rows[0].id) : null;
        const endCursor =
          rows[rows.length - 1] && rows[rows.length - 1].id
            ? encodeCursor(rows[rows.length - 1].id)
            : null;

        res.set("x-pagination-has-previous-page", hasPreviousPage);
        res.set("x-pagination-has-next-page", hasNextPage);
        if (startCursor != null) {
          res.set("x-pagination-start-cursor", startCursor);
        }
        if (endCursor != null) {
          res.set("x-pagination-end-cursor", endCursor);
        }
      }
    }

    if (typeof totalCount === "number") {
      res.set("x-pagination-total-count", totalCount);
    }

    if (
      typeof totalCount === "number" &&
      req.query.$paginate &&
      req.query.$paginate.pageSize
    ) {
      res.set(
        "x-pagination-last-page",
        Math.ceil(totalCount / req.query.$paginate.pageSize)
      );
    }

    // https://jsperf.com/delete-vs-spread-vs-lodash-omit-vs-lodash-inverse-pick
    for (let row of rows) {
      row.id = undefined;
    }

    return res.status(200).json(rows);
  } catch (e) {
    return next(e);
  }
};

module.exports.tagProjectPost = async (req, res, next) => {
  try {
    const table = "TagProject";
    const relations = [
      {
        localTable: "TagProject",
        localField: "projectId",
        localForeignIdent: "projectUuid",
        foreignTable: "Project",
        foreignField: "id",
        foreignIdent: "uuid",
      },
      {
        localTable: "TagProject",
        localField: "tagId",
        localForeignIdent: "tagUuid",
        foreignTable: "Tag",
        foreignField: "id",
        foreignIdent: "uuid",
      },
    ];
    const reqBodySchema = require("./schemas/tag-project.POST.req.body.json");
    const ident = "uuid";
    const joins = [
      {
        type: "left",
        target: "Project",
        alias: "Project_0",
        on: { id: "$TagProject.projectId$" },
      },
      {
        type: "left",
        target: "Tag",
        alias: "Tag_1",
        on: { id: "$TagProject.tagId$" },
      },
    ];
    const fields = [
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
      { as: "projectUuid", expression: "Project_0.uuid" },
      { as: "tagUuid", expression: "Tag_1.uuid" },
    ];

    const body = prepareDateTimeStrings(
      reqBodySchema,
      await mapExposedIdentsToInternal(relations, req.body)
    );

    const inserted = await db.query("INSERT INTO ?? SET ?? = UUID(), ?", [
      table,
      ident,
      body,
    ]);
    const id = inserted.insertId;

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { id },
    });
    const record = await db.queryHead(sqlStringAndValues);

    return res.status(200).json(record);
  } catch (e) {
    return next(e);
  }
};

module.exports.tagProjectPatch = async (req, res, next) => {
  try {
    const table = "TagProject";
    const archiveTable = archiveTablesMap[table];
    const relations = [
      {
        localTable: "TagProject",
        localField: "projectId",
        localForeignIdent: "projectUuid",
        foreignTable: "Project",
        foreignField: "id",
        foreignIdent: "uuid",
      },
      {
        localTable: "TagProject",
        localField: "tagId",
        localForeignIdent: "tagUuid",
        foreignTable: "Tag",
        foreignField: "id",
        foreignIdent: "uuid",
      },
    ];
    const reqBodySchema = require("./schemas/tag-project.PATCH.req.body.json");
    const resBodyKeys = [
      "tagUuid",
      "projectUuid",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];
    const ident = "uuid";
    const joins = [
      {
        type: "left",
        target: "Project",
        alias: "Project_0",
        on: { id: "$TagProject.projectId$" },
      },
      {
        type: "left",
        target: "Tag",
        alias: "Tag_1",
        on: { id: "$TagProject.tagId$" },
      },
    ];
    const fields = [
      "*",
      { as: "projectUuid", expression: "Project_0.uuid" },
      { as: "tagUuid", expression: "Tag_1.uuid" },
    ];

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const current = await db.queryHead(sqlStringAndValues);

    if (!current) {
      return res.status(404).json({ errors: ["Record not found"] });
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? SET ?", [
        archiveTable,
        {
          ..._.omit(["projectUuid", "tagUuid"], current),
          modifier: req.headers["x-user-uuid"] || "stub",
        },
      ]);
    }

    if (Object.keys(req.body).length) {
      const body = prepareDateTimeStrings(
        reqBodySchema,
        await mapExposedIdentsToInternal(relations, req.body)
      );
      await db.query("UPDATE ?? SET ? WHERE ?? = ?", [
        table,
        body,
        ident,
        req.params[ident],
      ]);
    } else {
      // Nothing to update.
      const resBody = _.pick(resBodyKeys, current);
      return res.status(200).json(resBody);
    }
    const record = await db.queryHead(
      await getSQLString({
        table,
        fields,
        joins,
        $where: { [ident]: req.params["uuid"] },
      })
    );

    const resBody = _.pick(resBodyKeys, record);
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.tagProjectPatchList = async (req, res, next) => {
  try {
    const table = "TagProject";
    const relations = relationsMap[table];
    const archiveTable = archiveTablesMap[table];
    const reqBodySchema = require("./schemas/tag-project.PATCH.list.req.body.json");
    const resBodyKeys = [
      "tagUuid",
      "projectUuid",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];

    const $where = await prepareWhere(relations, req.query.$where);
    const selectParams = await getSQLString({
      table,
      $where,
    });

    const currents = await db.query(selectParams);
    if (!currents.length) {
      return res.status(200).json([]);
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? (??) VALUES ?", [
        archiveTable,
        [].concat(Object.keys(currents[0])).concat("modifier"),
        currents.map((c) =>
          Object.values(c).concat(req.headers["x-user-uuid"] || "stub")
        ),
      ]);
    }

    if (Object.keys(req.body).length) {
      const body = prepareDateTimeStrings(
        reqBodySchema,
        await mapExposedIdentsToInternal(relations, req.body)
      );

      let sql = "UPDATE ?? SET ?";
      let values = [table, body];

      if (selectParams.sql.includes(" where ")) {
        sql += " where " + selectParams.sql.split(" where ")[1];
        values = values.concat(selectParams.values);
      }

      await db.query(sql, values);
    } else {
      // Nothing to update.
      let resBody = (
        await Promise.all(
          currents.map((current) =>
            mapInternalIdentsToExposed(relations, current)
          )
        )
      ).map((x) => _.pick(resBodyKeys, x));
      return res.status(200).json(resBody);
    }
    const records = await db.query(selectParams);
    const resBody = (
      await Promise.all(
        records.map((record) => mapInternalIdentsToExposed(relations, record))
      )
    ).map((x) => _.pick(resBodyKeys, x));
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.tagProjectDelete = async (req, res, next) => {
  try {
    const table = "TagProject";
    const archiveTable = archiveTablesMap[table];
    const resBodyKeys = [
      "tagUuid",
      "projectUuid",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];
    const ident = "uuid";
    const joins = [
      {
        type: "left",
        target: "Project",
        alias: "Project_0",
        on: { id: "$TagProject.projectId$" },
      },
      {
        type: "left",
        target: "Tag",
        alias: "Tag_1",
        on: { id: "$TagProject.tagId$" },
      },
    ];
    const fields = [
      "*",
      { as: "projectUuid", expression: "Project_0.uuid" },
      { as: "tagUuid", expression: "Tag_1.uuid" },
    ];

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const current = await db.queryHead(sqlStringAndValues);

    if (!current) {
      return res.status(404).json({ errors: ["Record not found"] });
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? SET ?", [
        archiveTable,
        {
          ..._.omit(["projectUuid", "tagUuid"], current),
          modifier: req.headers["x-user-uuid"] || "stub",
          userDeleted: 1,
        },
      ]);
    }

    await db.query("DELETE FROM ?? WHERE ?? = ?", [
      table,
      ident,
      req.params[ident],
    ]);

    const resBody = _.pick(resBodyKeys, current);
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.tagProjectDeleteList = async (req, res, next) => {
  try {
    const table = "TagProject";
    const archiveTable = archiveTablesMap[table];
    const relations = relationsMap[table];
    const resBodyKeys = [
      "tagUuid",
      "projectUuid",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];

    const $where = await prepareWhere(relations, req.query.$where);
    const selectParams = await getSQLString({
      table,
      $where,
    });

    const currents = await db.query(selectParams);
    if (!currents.length) {
      return res.status(200).json([]);
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? (??) VALUES ?", [
        archiveTable,
        []
          .concat(Object.keys(currents[0]))
          .concat("modifier")
          .concat("userDeleted"),
        currents.map((c) =>
          Object.values(c)
            .concat(req.headers["x-user-uuid"] || "stub")
            .concat(1)
        ),
      ]);
    }

    let sql = "DELETE FROM ??";
    let values = [table];

    if (selectParams.sql.includes(" where ")) {
      sql += " where " + selectParams.sql.split(" where ")[1];
      values = values.concat(selectParams.values);
    }

    await db.query(sql, values);

    const resBody = (
      await Promise.all(
        currents.map((record) => mapInternalIdentsToExposed(relations, record))
      )
    ).map((x) => _.pick(resBodyKeys, x));
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.userGet = async (req, res, next) => {
  try {
    const table = "User";
    const ident = "uuid";
    const joins = [
      {
        type: "left",
        target: "Role",
        alias: "Role_0",
        on: { id: "$User.primaryRoleId$" },
      },
    ];
    const fields = [
      "primaryRoleEnum",
      "firstName",
      "lastName",
      "username",
      "email",
      "password",
      "accountType",
      "clientId",
      "clientSecret",
      "externalIdProvider",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
      { as: "primaryRoleUuid", expression: "Role_0.uuid" },
    ];
    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const record = await db.queryHead(sqlStringAndValues);
    if (!record) {
      return res.status(404).json({ errors: ["Record not found"] });
    }
    return res.status(200).json(record);
  } catch (e) {
    return next(e);
  }
};

module.exports.userGetList = async (req, res, next) => {
  try {
    const table = "User";
    const relations = [
      {
        localTable: "User",
        localField: "primaryRoleId",
        localForeignIdent: "primaryRoleUuid",
        foreignTable: "Role",
        foreignField: "id",
        foreignIdent: "uuid",
      },
    ];

    const $where = await prepareWhere(relations, req.query.$where);
    const $orderBy = req.query.$orderBy
      ? Array.isArray(req.query.$orderBy)
        ? req.query.$orderBy.map((x) => mapExposedKeysToInternal(relations, x))
        : mapExposedKeysToInternal(relations, req.query.$orderBy)
      : undefined;

    // https://github.com/epoberezkin/ajv/issues/276
    if (req.query.$paginate && req.query.$paginate.page) {
      req.query.$paginate.pageSize = req.query.$paginate.pageSize || 20;
    }

    let rows, totalCount;

    const joins = [
      {
        type: "left",
        target: "Role",
        alias: "Role_0",
        on: { id: "$User.primaryRoleId$" },
      },
    ];
    const fields = [
      "id",
      "primaryRoleEnum",
      "firstName",
      "lastName",
      "username",
      "email",
      "password",
      "accountType",
      "clientId",
      "clientSecret",
      "externalIdProvider",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
      { as: "primaryRoleUuid", expression: "Role_0.uuid" },
    ];
    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where,
      $orderBy,
      $paginate: req.query.$paginate || undefined,
    });

    if (req.query.$paginate) {
      [rows, totalCount] = await Promise.all([
        db.query(sqlStringAndValues),
        db
          .queryHead(
            await getSQLString({
              table,
              fields: ["COUNT(*)"],
              $where,
              $orderBy,
            })
          )
          .then((d) => d["COUNT(*)"]),
      ]);
    } else {
      rows = await db.query(sqlStringAndValues);
    }

    if (req.query.$paginate) {
      if (typeof req.query.$paginate.limit === "number") {
        const hasMoreResults = rows.length === req.query.$paginate.limit + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }

        res.set("x-pagination-limit", req.query.$paginate.limit);
        res.set("x-pagination-offset", req.query.$paginate.offset);
        res.set(
          "x-pagination-has-previous-page",
          req.query.$paginate.offset > 0
        );
        res.set("x-pagination-has-next-page", !!hasMoreResults);
      } else if (typeof req.query.$paginate.page === "number") {
        const hasMoreResults = rows.length === req.query.$paginate.pageSize + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }

        res.set("x-pagination-page", req.query.$paginate.page);
        res.set("x-pagination-page-size", req.query.$paginate.pageSize);
        res.set("x-pagination-has-previous-page", req.query.$paginate.page > 1);
        res.set("x-pagination-has-next-page", !!hasMoreResults);
      } else {
        const flip =
          typeof req.query.$paginate.first === "number" ? false : true;
        const limit = flip
          ? req.query.$paginate.last
          : req.query.$paginate.first;

        const hasMoreResults = rows.length === limit + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }
        if (flip) {
          rows = rows.reverse();
        }

        const hasPreviousPage = flip ? hasMoreResults : false;
        const hasNextPage = flip ? false : hasMoreResults;
        const startCursor =
          rows[0] && rows[0].id ? encodeCursor(rows[0].id) : null;
        const endCursor =
          rows[rows.length - 1] && rows[rows.length - 1].id
            ? encodeCursor(rows[rows.length - 1].id)
            : null;

        res.set("x-pagination-has-previous-page", hasPreviousPage);
        res.set("x-pagination-has-next-page", hasNextPage);
        if (startCursor != null) {
          res.set("x-pagination-start-cursor", startCursor);
        }
        if (endCursor != null) {
          res.set("x-pagination-end-cursor", endCursor);
        }
      }
    }

    if (typeof totalCount === "number") {
      res.set("x-pagination-total-count", totalCount);
    }

    if (
      typeof totalCount === "number" &&
      req.query.$paginate &&
      req.query.$paginate.pageSize
    ) {
      res.set(
        "x-pagination-last-page",
        Math.ceil(totalCount / req.query.$paginate.pageSize)
      );
    }

    // https://jsperf.com/delete-vs-spread-vs-lodash-omit-vs-lodash-inverse-pick
    for (let row of rows) {
      row.id = undefined;
    }

    return res.status(200).json(rows);
  } catch (e) {
    return next(e);
  }
};

module.exports.userPost = async (req, res, next) => {
  try {
    const table = "User";
    const relations = [
      {
        localTable: "User",
        localField: "primaryRoleId",
        localForeignIdent: "primaryRoleUuid",
        foreignTable: "Role",
        foreignField: "id",
        foreignIdent: "uuid",
      },
    ];
    const reqBodySchema = require("./schemas/user.POST.req.body.json");
    const ident = "uuid";
    const joins = [
      {
        type: "left",
        target: "Role",
        alias: "Role_0",
        on: { id: "$User.primaryRoleId$" },
      },
    ];
    const fields = [
      "primaryRoleEnum",
      "firstName",
      "lastName",
      "username",
      "email",
      "password",
      "accountType",
      "clientId",
      "clientSecret",
      "externalIdProvider",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
      { as: "primaryRoleUuid", expression: "Role_0.uuid" },
    ];

    const body = prepareDateTimeStrings(
      reqBodySchema,
      await mapExposedIdentsToInternal(relations, req.body)
    );

    const inserted = await db.query("INSERT INTO ?? SET ?? = UUID(), ?", [
      table,
      ident,
      body,
    ]);
    const id = inserted.insertId;

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { id },
    });
    const record = await db.queryHead(sqlStringAndValues);

    return res.status(200).json(record);
  } catch (e) {
    return next(e);
  }
};

module.exports.userPatch = async (req, res, next) => {
  try {
    const table = "User";
    const archiveTable = archiveTablesMap[table];
    const relations = [
      {
        localTable: "User",
        localField: "primaryRoleId",
        localForeignIdent: "primaryRoleUuid",
        foreignTable: "Role",
        foreignField: "id",
        foreignIdent: "uuid",
      },
    ];
    const reqBodySchema = require("./schemas/user.PATCH.req.body.json");
    const resBodyKeys = [
      "primaryRoleUuid",
      "primaryRoleEnum",
      "firstName",
      "lastName",
      "username",
      "email",
      "password",
      "accountType",
      "clientId",
      "clientSecret",
      "externalIdProvider",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];
    const ident = "uuid";
    const joins = [
      {
        type: "left",
        target: "Role",
        alias: "Role_0",
        on: { id: "$User.primaryRoleId$" },
      },
    ];
    const fields = ["*", { as: "primaryRoleUuid", expression: "Role_0.uuid" }];

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const current = await db.queryHead(sqlStringAndValues);

    if (!current) {
      return res.status(404).json({ errors: ["Record not found"] });
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? SET ?", [
        archiveTable,
        {
          ..._.omit(["primaryRoleUuid"], current),
          modifier: req.headers["x-user-uuid"] || "stub",
        },
      ]);
    }

    if (Object.keys(req.body).length) {
      const body = prepareDateTimeStrings(
        reqBodySchema,
        await mapExposedIdentsToInternal(relations, req.body)
      );
      await db.query("UPDATE ?? SET ? WHERE ?? = ?", [
        table,
        body,
        ident,
        req.params[ident],
      ]);
    } else {
      // Nothing to update.
      const resBody = _.pick(resBodyKeys, current);
      return res.status(200).json(resBody);
    }
    const record = await db.queryHead(
      await getSQLString({
        table,
        fields,
        joins,
        $where: { [ident]: req.params["uuid"] },
      })
    );

    const resBody = _.pick(resBodyKeys, record);
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.userPatchList = async (req, res, next) => {
  try {
    const table = "User";
    const relations = relationsMap[table];
    const archiveTable = archiveTablesMap[table];
    const reqBodySchema = require("./schemas/user.PATCH.list.req.body.json");
    const resBodyKeys = [
      "primaryRoleUuid",
      "primaryRoleEnum",
      "firstName",
      "lastName",
      "username",
      "email",
      "password",
      "accountType",
      "clientId",
      "clientSecret",
      "externalIdProvider",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];

    const $where = await prepareWhere(relations, req.query.$where);
    const selectParams = await getSQLString({
      table,
      $where,
    });

    const currents = await db.query(selectParams);
    if (!currents.length) {
      return res.status(200).json([]);
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? (??) VALUES ?", [
        archiveTable,
        [].concat(Object.keys(currents[0])).concat("modifier"),
        currents.map((c) =>
          Object.values(c).concat(req.headers["x-user-uuid"] || "stub")
        ),
      ]);
    }

    if (Object.keys(req.body).length) {
      const body = prepareDateTimeStrings(
        reqBodySchema,
        await mapExposedIdentsToInternal(relations, req.body)
      );

      let sql = "UPDATE ?? SET ?";
      let values = [table, body];

      if (selectParams.sql.includes(" where ")) {
        sql += " where " + selectParams.sql.split(" where ")[1];
        values = values.concat(selectParams.values);
      }

      await db.query(sql, values);
    } else {
      // Nothing to update.
      let resBody = (
        await Promise.all(
          currents.map((current) =>
            mapInternalIdentsToExposed(relations, current)
          )
        )
      ).map((x) => _.pick(resBodyKeys, x));
      return res.status(200).json(resBody);
    }
    const records = await db.query(selectParams);
    const resBody = (
      await Promise.all(
        records.map((record) => mapInternalIdentsToExposed(relations, record))
      )
    ).map((x) => _.pick(resBodyKeys, x));
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.userDelete = async (req, res, next) => {
  try {
    const table = "User";
    const archiveTable = archiveTablesMap[table];
    const resBodyKeys = [
      "primaryRoleUuid",
      "primaryRoleEnum",
      "firstName",
      "lastName",
      "username",
      "email",
      "password",
      "accountType",
      "clientId",
      "clientSecret",
      "externalIdProvider",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];
    const ident = "uuid";
    const joins = [
      {
        type: "left",
        target: "Role",
        alias: "Role_0",
        on: { id: "$User.primaryRoleId$" },
      },
    ];
    const fields = ["*", { as: "primaryRoleUuid", expression: "Role_0.uuid" }];

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const current = await db.queryHead(sqlStringAndValues);

    if (!current) {
      return res.status(404).json({ errors: ["Record not found"] });
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? SET ?", [
        archiveTable,
        {
          ..._.omit(["primaryRoleUuid"], current),
          modifier: req.headers["x-user-uuid"] || "stub",
          userDeleted: 1,
        },
      ]);
    }

    await db.query("DELETE FROM ?? WHERE ?? = ?", [
      table,
      ident,
      req.params[ident],
    ]);

    const resBody = _.pick(resBodyKeys, current);
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.userDeleteList = async (req, res, next) => {
  try {
    const table = "User";
    const archiveTable = archiveTablesMap[table];
    const relations = relationsMap[table];
    const resBodyKeys = [
      "primaryRoleUuid",
      "primaryRoleEnum",
      "firstName",
      "lastName",
      "username",
      "email",
      "password",
      "accountType",
      "clientId",
      "clientSecret",
      "externalIdProvider",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];

    const $where = await prepareWhere(relations, req.query.$where);
    const selectParams = await getSQLString({
      table,
      $where,
    });

    const currents = await db.query(selectParams);
    if (!currents.length) {
      return res.status(200).json([]);
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? (??) VALUES ?", [
        archiveTable,
        []
          .concat(Object.keys(currents[0]))
          .concat("modifier")
          .concat("userDeleted"),
        currents.map((c) =>
          Object.values(c)
            .concat(req.headers["x-user-uuid"] || "stub")
            .concat(1)
        ),
      ]);
    }

    let sql = "DELETE FROM ??";
    let values = [table];

    if (selectParams.sql.includes(" where ")) {
      sql += " where " + selectParams.sql.split(" where ")[1];
      values = values.concat(selectParams.values);
    }

    await db.query(sql, values);

    const resBody = (
      await Promise.all(
        currents.map((record) => mapInternalIdentsToExposed(relations, record))
      )
    ).map((x) => _.pick(resBodyKeys, x));
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.userOrganizationGet = async (req, res, next) => {
  try {
    const table = "UserOrganization";
    const ident = "uuid";
    const joins = [
      {
        type: "left",
        target: "Organization",
        alias: "Organization_0",
        on: { id: "$UserOrganization.organizationId$" },
      },
      {
        type: "left",
        target: "User",
        alias: "User_1",
        on: { id: "$UserOrganization.userId$" },
      },
    ];
    const fields = [
      "isSelected",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
      { as: "organizationUuid", expression: "Organization_0.uuid" },
      { as: "userUuid", expression: "User_1.uuid" },
    ];
    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const record = await db.queryHead(sqlStringAndValues);
    if (!record) {
      return res.status(404).json({ errors: ["Record not found"] });
    }
    return res.status(200).json(record);
  } catch (e) {
    return next(e);
  }
};

module.exports.userOrganizationGetList = async (req, res, next) => {
  try {
    const table = "UserOrganization";
    const relations = [
      {
        localTable: "UserOrganization",
        localField: "organizationId",
        localForeignIdent: "organizationUuid",
        foreignTable: "Organization",
        foreignField: "id",
        foreignIdent: "uuid",
      },
      {
        localTable: "UserOrganization",
        localField: "userId",
        localForeignIdent: "userUuid",
        foreignTable: "User",
        foreignField: "id",
        foreignIdent: "uuid",
      },
    ];

    const $where = await prepareWhere(relations, req.query.$where);
    const $orderBy = req.query.$orderBy
      ? Array.isArray(req.query.$orderBy)
        ? req.query.$orderBy.map((x) => mapExposedKeysToInternal(relations, x))
        : mapExposedKeysToInternal(relations, req.query.$orderBy)
      : undefined;

    // https://github.com/epoberezkin/ajv/issues/276
    if (req.query.$paginate && req.query.$paginate.page) {
      req.query.$paginate.pageSize = req.query.$paginate.pageSize || 20;
    }

    let rows, totalCount;

    const joins = [
      {
        type: "left",
        target: "Organization",
        alias: "Organization_0",
        on: { id: "$UserOrganization.organizationId$" },
      },
      {
        type: "left",
        target: "User",
        alias: "User_1",
        on: { id: "$UserOrganization.userId$" },
      },
    ];
    const fields = [
      "id",
      "isSelected",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
      { as: "organizationUuid", expression: "Organization_0.uuid" },
      { as: "userUuid", expression: "User_1.uuid" },
    ];
    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where,
      $orderBy,
      $paginate: req.query.$paginate || undefined,
    });

    if (req.query.$paginate) {
      [rows, totalCount] = await Promise.all([
        db.query(sqlStringAndValues),
        db
          .queryHead(
            await getSQLString({
              table,
              fields: ["COUNT(*)"],
              $where,
              $orderBy,
            })
          )
          .then((d) => d["COUNT(*)"]),
      ]);
    } else {
      rows = await db.query(sqlStringAndValues);
    }

    if (req.query.$paginate) {
      if (typeof req.query.$paginate.limit === "number") {
        const hasMoreResults = rows.length === req.query.$paginate.limit + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }

        res.set("x-pagination-limit", req.query.$paginate.limit);
        res.set("x-pagination-offset", req.query.$paginate.offset);
        res.set(
          "x-pagination-has-previous-page",
          req.query.$paginate.offset > 0
        );
        res.set("x-pagination-has-next-page", !!hasMoreResults);
      } else if (typeof req.query.$paginate.page === "number") {
        const hasMoreResults = rows.length === req.query.$paginate.pageSize + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }

        res.set("x-pagination-page", req.query.$paginate.page);
        res.set("x-pagination-page-size", req.query.$paginate.pageSize);
        res.set("x-pagination-has-previous-page", req.query.$paginate.page > 1);
        res.set("x-pagination-has-next-page", !!hasMoreResults);
      } else {
        const flip =
          typeof req.query.$paginate.first === "number" ? false : true;
        const limit = flip
          ? req.query.$paginate.last
          : req.query.$paginate.first;

        const hasMoreResults = rows.length === limit + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }
        if (flip) {
          rows = rows.reverse();
        }

        const hasPreviousPage = flip ? hasMoreResults : false;
        const hasNextPage = flip ? false : hasMoreResults;
        const startCursor =
          rows[0] && rows[0].id ? encodeCursor(rows[0].id) : null;
        const endCursor =
          rows[rows.length - 1] && rows[rows.length - 1].id
            ? encodeCursor(rows[rows.length - 1].id)
            : null;

        res.set("x-pagination-has-previous-page", hasPreviousPage);
        res.set("x-pagination-has-next-page", hasNextPage);
        if (startCursor != null) {
          res.set("x-pagination-start-cursor", startCursor);
        }
        if (endCursor != null) {
          res.set("x-pagination-end-cursor", endCursor);
        }
      }
    }

    if (typeof totalCount === "number") {
      res.set("x-pagination-total-count", totalCount);
    }

    if (
      typeof totalCount === "number" &&
      req.query.$paginate &&
      req.query.$paginate.pageSize
    ) {
      res.set(
        "x-pagination-last-page",
        Math.ceil(totalCount / req.query.$paginate.pageSize)
      );
    }

    // https://jsperf.com/delete-vs-spread-vs-lodash-omit-vs-lodash-inverse-pick
    for (let row of rows) {
      row.id = undefined;
    }

    return res.status(200).json(rows);
  } catch (e) {
    return next(e);
  }
};

module.exports.userOrganizationPost = async (req, res, next) => {
  try {
    const table = "UserOrganization";
    const relations = [
      {
        localTable: "UserOrganization",
        localField: "organizationId",
        localForeignIdent: "organizationUuid",
        foreignTable: "Organization",
        foreignField: "id",
        foreignIdent: "uuid",
      },
      {
        localTable: "UserOrganization",
        localField: "userId",
        localForeignIdent: "userUuid",
        foreignTable: "User",
        foreignField: "id",
        foreignIdent: "uuid",
      },
    ];
    const reqBodySchema = require("./schemas/user-organization.POST.req.body.json");
    const ident = "uuid";
    const joins = [
      {
        type: "left",
        target: "Organization",
        alias: "Organization_0",
        on: { id: "$UserOrganization.organizationId$" },
      },
      {
        type: "left",
        target: "User",
        alias: "User_1",
        on: { id: "$UserOrganization.userId$" },
      },
    ];
    const fields = [
      "isSelected",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
      { as: "organizationUuid", expression: "Organization_0.uuid" },
      { as: "userUuid", expression: "User_1.uuid" },
    ];

    const body = prepareDateTimeStrings(
      reqBodySchema,
      await mapExposedIdentsToInternal(relations, req.body)
    );

    const inserted = await db.query("INSERT INTO ?? SET ?? = UUID(), ?", [
      table,
      ident,
      body,
    ]);
    const id = inserted.insertId;

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { id },
    });
    const record = await db.queryHead(sqlStringAndValues);

    return res.status(200).json(record);
  } catch (e) {
    return next(e);
  }
};

module.exports.userOrganizationPatch = async (req, res, next) => {
  try {
    const table = "UserOrganization";
    const archiveTable = archiveTablesMap[table];
    const relations = [
      {
        localTable: "UserOrganization",
        localField: "organizationId",
        localForeignIdent: "organizationUuid",
        foreignTable: "Organization",
        foreignField: "id",
        foreignIdent: "uuid",
      },
      {
        localTable: "UserOrganization",
        localField: "userId",
        localForeignIdent: "userUuid",
        foreignTable: "User",
        foreignField: "id",
        foreignIdent: "uuid",
      },
    ];
    const reqBodySchema = require("./schemas/user-organization.PATCH.req.body.json");
    const resBodyKeys = [
      "userUuid",
      "organizationUuid",
      "isSelected",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];
    const ident = "uuid";
    const joins = [
      {
        type: "left",
        target: "Organization",
        alias: "Organization_0",
        on: { id: "$UserOrganization.organizationId$" },
      },
      {
        type: "left",
        target: "User",
        alias: "User_1",
        on: { id: "$UserOrganization.userId$" },
      },
    ];
    const fields = [
      "*",
      { as: "organizationUuid", expression: "Organization_0.uuid" },
      { as: "userUuid", expression: "User_1.uuid" },
    ];

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const current = await db.queryHead(sqlStringAndValues);

    if (!current) {
      return res.status(404).json({ errors: ["Record not found"] });
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? SET ?", [
        archiveTable,
        {
          ..._.omit(["organizationUuid", "userUuid"], current),
          modifier: req.headers["x-user-uuid"] || "stub",
        },
      ]);
    }

    if (Object.keys(req.body).length) {
      const body = prepareDateTimeStrings(
        reqBodySchema,
        await mapExposedIdentsToInternal(relations, req.body)
      );
      await db.query("UPDATE ?? SET ? WHERE ?? = ?", [
        table,
        body,
        ident,
        req.params[ident],
      ]);
    } else {
      // Nothing to update.
      const resBody = _.pick(resBodyKeys, current);
      return res.status(200).json(resBody);
    }
    const record = await db.queryHead(
      await getSQLString({
        table,
        fields,
        joins,
        $where: { [ident]: req.params["uuid"] },
      })
    );

    const resBody = _.pick(resBodyKeys, record);
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.userOrganizationPatchList = async (req, res, next) => {
  try {
    const table = "UserOrganization";
    const relations = relationsMap[table];
    const archiveTable = archiveTablesMap[table];
    const reqBodySchema = require("./schemas/user-organization.PATCH.list.req.body.json");
    const resBodyKeys = [
      "userUuid",
      "organizationUuid",
      "isSelected",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];

    const $where = await prepareWhere(relations, req.query.$where);
    const selectParams = await getSQLString({
      table,
      $where,
    });

    const currents = await db.query(selectParams);
    if (!currents.length) {
      return res.status(200).json([]);
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? (??) VALUES ?", [
        archiveTable,
        [].concat(Object.keys(currents[0])).concat("modifier"),
        currents.map((c) =>
          Object.values(c).concat(req.headers["x-user-uuid"] || "stub")
        ),
      ]);
    }

    if (Object.keys(req.body).length) {
      const body = prepareDateTimeStrings(
        reqBodySchema,
        await mapExposedIdentsToInternal(relations, req.body)
      );

      let sql = "UPDATE ?? SET ?";
      let values = [table, body];

      if (selectParams.sql.includes(" where ")) {
        sql += " where " + selectParams.sql.split(" where ")[1];
        values = values.concat(selectParams.values);
      }

      await db.query(sql, values);
    } else {
      // Nothing to update.
      let resBody = (
        await Promise.all(
          currents.map((current) =>
            mapInternalIdentsToExposed(relations, current)
          )
        )
      ).map((x) => _.pick(resBodyKeys, x));
      return res.status(200).json(resBody);
    }
    const records = await db.query(selectParams);
    const resBody = (
      await Promise.all(
        records.map((record) => mapInternalIdentsToExposed(relations, record))
      )
    ).map((x) => _.pick(resBodyKeys, x));
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.userOrganizationDelete = async (req, res, next) => {
  try {
    const table = "UserOrganization";
    const archiveTable = archiveTablesMap[table];
    const resBodyKeys = [
      "userUuid",
      "organizationUuid",
      "isSelected",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];
    const ident = "uuid";
    const joins = [
      {
        type: "left",
        target: "Organization",
        alias: "Organization_0",
        on: { id: "$UserOrganization.organizationId$" },
      },
      {
        type: "left",
        target: "User",
        alias: "User_1",
        on: { id: "$UserOrganization.userId$" },
      },
    ];
    const fields = [
      "*",
      { as: "organizationUuid", expression: "Organization_0.uuid" },
      { as: "userUuid", expression: "User_1.uuid" },
    ];

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const current = await db.queryHead(sqlStringAndValues);

    if (!current) {
      return res.status(404).json({ errors: ["Record not found"] });
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? SET ?", [
        archiveTable,
        {
          ..._.omit(["organizationUuid", "userUuid"], current),
          modifier: req.headers["x-user-uuid"] || "stub",
          userDeleted: 1,
        },
      ]);
    }

    await db.query("DELETE FROM ?? WHERE ?? = ?", [
      table,
      ident,
      req.params[ident],
    ]);

    const resBody = _.pick(resBodyKeys, current);
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.userOrganizationDeleteList = async (req, res, next) => {
  try {
    const table = "UserOrganization";
    const archiveTable = archiveTablesMap[table];
    const relations = relationsMap[table];
    const resBodyKeys = [
      "userUuid",
      "organizationUuid",
      "isSelected",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];

    const $where = await prepareWhere(relations, req.query.$where);
    const selectParams = await getSQLString({
      table,
      $where,
    });

    const currents = await db.query(selectParams);
    if (!currents.length) {
      return res.status(200).json([]);
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? (??) VALUES ?", [
        archiveTable,
        []
          .concat(Object.keys(currents[0]))
          .concat("modifier")
          .concat("userDeleted"),
        currents.map((c) =>
          Object.values(c)
            .concat(req.headers["x-user-uuid"] || "stub")
            .concat(1)
        ),
      ]);
    }

    let sql = "DELETE FROM ??";
    let values = [table];

    if (selectParams.sql.includes(" where ")) {
      sql += " where " + selectParams.sql.split(" where ")[1];
      values = values.concat(selectParams.values);
    }

    await db.query(sql, values);

    const resBody = (
      await Promise.all(
        currents.map((record) => mapInternalIdentsToExposed(relations, record))
      )
    ).map((x) => _.pick(resBodyKeys, x));
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.userOrganizationRoleGet = async (req, res, next) => {
  try {
    const table = "UserOrganizationRole";
    const ident = "uuid";
    const joins = [
      {
        type: "left",
        target: "OrganizationRole",
        alias: "OrganizationRole_0",
        on: { id: "$UserOrganizationRole.organizationRoleId$" },
      },
      {
        type: "left",
        target: "User",
        alias: "User_1",
        on: { id: "$UserOrganizationRole.userId$" },
      },
    ];
    const fields = [
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
      { as: "organizationRoleUuid", expression: "OrganizationRole_0.uuid" },
      { as: "userUuid", expression: "User_1.uuid" },
    ];
    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const record = await db.queryHead(sqlStringAndValues);
    if (!record) {
      return res.status(404).json({ errors: ["Record not found"] });
    }
    return res.status(200).json(record);
  } catch (e) {
    return next(e);
  }
};

module.exports.userOrganizationRoleGetList = async (req, res, next) => {
  try {
    const table = "UserOrganizationRole";
    const relations = [
      {
        localTable: "UserOrganizationRole",
        localField: "organizationRoleId",
        localForeignIdent: "organizationRoleUuid",
        foreignTable: "OrganizationRole",
        foreignField: "id",
        foreignIdent: "uuid",
      },
      {
        localTable: "UserOrganizationRole",
        localField: "userId",
        localForeignIdent: "userUuid",
        foreignTable: "User",
        foreignField: "id",
        foreignIdent: "uuid",
      },
    ];

    const $where = await prepareWhere(relations, req.query.$where);
    const $orderBy = req.query.$orderBy
      ? Array.isArray(req.query.$orderBy)
        ? req.query.$orderBy.map((x) => mapExposedKeysToInternal(relations, x))
        : mapExposedKeysToInternal(relations, req.query.$orderBy)
      : undefined;

    // https://github.com/epoberezkin/ajv/issues/276
    if (req.query.$paginate && req.query.$paginate.page) {
      req.query.$paginate.pageSize = req.query.$paginate.pageSize || 20;
    }

    let rows, totalCount;

    const joins = [
      {
        type: "left",
        target: "OrganizationRole",
        alias: "OrganizationRole_0",
        on: { id: "$UserOrganizationRole.organizationRoleId$" },
      },
      {
        type: "left",
        target: "User",
        alias: "User_1",
        on: { id: "$UserOrganizationRole.userId$" },
      },
    ];
    const fields = [
      "id",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
      { as: "organizationRoleUuid", expression: "OrganizationRole_0.uuid" },
      { as: "userUuid", expression: "User_1.uuid" },
    ];
    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where,
      $orderBy,
      $paginate: req.query.$paginate || undefined,
    });

    if (req.query.$paginate) {
      [rows, totalCount] = await Promise.all([
        db.query(sqlStringAndValues),
        db
          .queryHead(
            await getSQLString({
              table,
              fields: ["COUNT(*)"],
              $where,
              $orderBy,
            })
          )
          .then((d) => d["COUNT(*)"]),
      ]);
    } else {
      rows = await db.query(sqlStringAndValues);
    }

    if (req.query.$paginate) {
      if (typeof req.query.$paginate.limit === "number") {
        const hasMoreResults = rows.length === req.query.$paginate.limit + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }

        res.set("x-pagination-limit", req.query.$paginate.limit);
        res.set("x-pagination-offset", req.query.$paginate.offset);
        res.set(
          "x-pagination-has-previous-page",
          req.query.$paginate.offset > 0
        );
        res.set("x-pagination-has-next-page", !!hasMoreResults);
      } else if (typeof req.query.$paginate.page === "number") {
        const hasMoreResults = rows.length === req.query.$paginate.pageSize + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }

        res.set("x-pagination-page", req.query.$paginate.page);
        res.set("x-pagination-page-size", req.query.$paginate.pageSize);
        res.set("x-pagination-has-previous-page", req.query.$paginate.page > 1);
        res.set("x-pagination-has-next-page", !!hasMoreResults);
      } else {
        const flip =
          typeof req.query.$paginate.first === "number" ? false : true;
        const limit = flip
          ? req.query.$paginate.last
          : req.query.$paginate.first;

        const hasMoreResults = rows.length === limit + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }
        if (flip) {
          rows = rows.reverse();
        }

        const hasPreviousPage = flip ? hasMoreResults : false;
        const hasNextPage = flip ? false : hasMoreResults;
        const startCursor =
          rows[0] && rows[0].id ? encodeCursor(rows[0].id) : null;
        const endCursor =
          rows[rows.length - 1] && rows[rows.length - 1].id
            ? encodeCursor(rows[rows.length - 1].id)
            : null;

        res.set("x-pagination-has-previous-page", hasPreviousPage);
        res.set("x-pagination-has-next-page", hasNextPage);
        if (startCursor != null) {
          res.set("x-pagination-start-cursor", startCursor);
        }
        if (endCursor != null) {
          res.set("x-pagination-end-cursor", endCursor);
        }
      }
    }

    if (typeof totalCount === "number") {
      res.set("x-pagination-total-count", totalCount);
    }

    if (
      typeof totalCount === "number" &&
      req.query.$paginate &&
      req.query.$paginate.pageSize
    ) {
      res.set(
        "x-pagination-last-page",
        Math.ceil(totalCount / req.query.$paginate.pageSize)
      );
    }

    // https://jsperf.com/delete-vs-spread-vs-lodash-omit-vs-lodash-inverse-pick
    for (let row of rows) {
      row.id = undefined;
    }

    return res.status(200).json(rows);
  } catch (e) {
    return next(e);
  }
};

module.exports.userOrganizationRolePost = async (req, res, next) => {
  try {
    const table = "UserOrganizationRole";
    const relations = [
      {
        localTable: "UserOrganizationRole",
        localField: "organizationRoleId",
        localForeignIdent: "organizationRoleUuid",
        foreignTable: "OrganizationRole",
        foreignField: "id",
        foreignIdent: "uuid",
      },
      {
        localTable: "UserOrganizationRole",
        localField: "userId",
        localForeignIdent: "userUuid",
        foreignTable: "User",
        foreignField: "id",
        foreignIdent: "uuid",
      },
    ];
    const reqBodySchema = require("./schemas/user-organization-role.POST.req.body.json");
    const ident = "uuid";
    const joins = [
      {
        type: "left",
        target: "OrganizationRole",
        alias: "OrganizationRole_0",
        on: { id: "$UserOrganizationRole.organizationRoleId$" },
      },
      {
        type: "left",
        target: "User",
        alias: "User_1",
        on: { id: "$UserOrganizationRole.userId$" },
      },
    ];
    const fields = [
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
      { as: "organizationRoleUuid", expression: "OrganizationRole_0.uuid" },
      { as: "userUuid", expression: "User_1.uuid" },
    ];

    const body = prepareDateTimeStrings(
      reqBodySchema,
      await mapExposedIdentsToInternal(relations, req.body)
    );

    const inserted = await db.query("INSERT INTO ?? SET ?? = UUID(), ?", [
      table,
      ident,
      body,
    ]);
    const id = inserted.insertId;

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { id },
    });
    const record = await db.queryHead(sqlStringAndValues);

    return res.status(200).json(record);
  } catch (e) {
    return next(e);
  }
};

module.exports.userOrganizationRolePatch = async (req, res, next) => {
  try {
    const table = "UserOrganizationRole";
    const archiveTable = archiveTablesMap[table];
    const relations = [
      {
        localTable: "UserOrganizationRole",
        localField: "organizationRoleId",
        localForeignIdent: "organizationRoleUuid",
        foreignTable: "OrganizationRole",
        foreignField: "id",
        foreignIdent: "uuid",
      },
      {
        localTable: "UserOrganizationRole",
        localField: "userId",
        localForeignIdent: "userUuid",
        foreignTable: "User",
        foreignField: "id",
        foreignIdent: "uuid",
      },
    ];
    const reqBodySchema = require("./schemas/user-organization-role.PATCH.req.body.json");
    const resBodyKeys = [
      "userUuid",
      "organizationRoleUuid",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];
    const ident = "uuid";
    const joins = [
      {
        type: "left",
        target: "OrganizationRole",
        alias: "OrganizationRole_0",
        on: { id: "$UserOrganizationRole.organizationRoleId$" },
      },
      {
        type: "left",
        target: "User",
        alias: "User_1",
        on: { id: "$UserOrganizationRole.userId$" },
      },
    ];
    const fields = [
      "*",
      { as: "organizationRoleUuid", expression: "OrganizationRole_0.uuid" },
      { as: "userUuid", expression: "User_1.uuid" },
    ];

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const current = await db.queryHead(sqlStringAndValues);

    if (!current) {
      return res.status(404).json({ errors: ["Record not found"] });
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? SET ?", [
        archiveTable,
        {
          ..._.omit(["organizationRoleUuid", "userUuid"], current),
          modifier: req.headers["x-user-uuid"] || "stub",
        },
      ]);
    }

    if (Object.keys(req.body).length) {
      const body = prepareDateTimeStrings(
        reqBodySchema,
        await mapExposedIdentsToInternal(relations, req.body)
      );
      await db.query("UPDATE ?? SET ? WHERE ?? = ?", [
        table,
        body,
        ident,
        req.params[ident],
      ]);
    } else {
      // Nothing to update.
      const resBody = _.pick(resBodyKeys, current);
      return res.status(200).json(resBody);
    }
    const record = await db.queryHead(
      await getSQLString({
        table,
        fields,
        joins,
        $where: { [ident]: req.params["uuid"] },
      })
    );

    const resBody = _.pick(resBodyKeys, record);
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.userOrganizationRolePatchList = async (req, res, next) => {
  try {
    const table = "UserOrganizationRole";
    const relations = relationsMap[table];
    const archiveTable = archiveTablesMap[table];
    const reqBodySchema = require("./schemas/user-organization-role.PATCH.list.req.body.json");
    const resBodyKeys = [
      "userUuid",
      "organizationRoleUuid",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];

    const $where = await prepareWhere(relations, req.query.$where);
    const selectParams = await getSQLString({
      table,
      $where,
    });

    const currents = await db.query(selectParams);
    if (!currents.length) {
      return res.status(200).json([]);
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? (??) VALUES ?", [
        archiveTable,
        [].concat(Object.keys(currents[0])).concat("modifier"),
        currents.map((c) =>
          Object.values(c).concat(req.headers["x-user-uuid"] || "stub")
        ),
      ]);
    }

    if (Object.keys(req.body).length) {
      const body = prepareDateTimeStrings(
        reqBodySchema,
        await mapExposedIdentsToInternal(relations, req.body)
      );

      let sql = "UPDATE ?? SET ?";
      let values = [table, body];

      if (selectParams.sql.includes(" where ")) {
        sql += " where " + selectParams.sql.split(" where ")[1];
        values = values.concat(selectParams.values);
      }

      await db.query(sql, values);
    } else {
      // Nothing to update.
      let resBody = (
        await Promise.all(
          currents.map((current) =>
            mapInternalIdentsToExposed(relations, current)
          )
        )
      ).map((x) => _.pick(resBodyKeys, x));
      return res.status(200).json(resBody);
    }
    const records = await db.query(selectParams);
    const resBody = (
      await Promise.all(
        records.map((record) => mapInternalIdentsToExposed(relations, record))
      )
    ).map((x) => _.pick(resBodyKeys, x));
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.userOrganizationRoleDelete = async (req, res, next) => {
  try {
    const table = "UserOrganizationRole";
    const archiveTable = archiveTablesMap[table];
    const resBodyKeys = [
      "userUuid",
      "organizationRoleUuid",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];
    const ident = "uuid";
    const joins = [
      {
        type: "left",
        target: "OrganizationRole",
        alias: "OrganizationRole_0",
        on: { id: "$UserOrganizationRole.organizationRoleId$" },
      },
      {
        type: "left",
        target: "User",
        alias: "User_1",
        on: { id: "$UserOrganizationRole.userId$" },
      },
    ];
    const fields = [
      "*",
      { as: "organizationRoleUuid", expression: "OrganizationRole_0.uuid" },
      { as: "userUuid", expression: "User_1.uuid" },
    ];

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const current = await db.queryHead(sqlStringAndValues);

    if (!current) {
      return res.status(404).json({ errors: ["Record not found"] });
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? SET ?", [
        archiveTable,
        {
          ..._.omit(["organizationRoleUuid", "userUuid"], current),
          modifier: req.headers["x-user-uuid"] || "stub",
          userDeleted: 1,
        },
      ]);
    }

    await db.query("DELETE FROM ?? WHERE ?? = ?", [
      table,
      ident,
      req.params[ident],
    ]);

    const resBody = _.pick(resBodyKeys, current);
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.userOrganizationRoleDeleteList = async (req, res, next) => {
  try {
    const table = "UserOrganizationRole";
    const archiveTable = archiveTablesMap[table];
    const relations = relationsMap[table];
    const resBodyKeys = [
      "userUuid",
      "organizationRoleUuid",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];

    const $where = await prepareWhere(relations, req.query.$where);
    const selectParams = await getSQLString({
      table,
      $where,
    });

    const currents = await db.query(selectParams);
    if (!currents.length) {
      return res.status(200).json([]);
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? (??) VALUES ?", [
        archiveTable,
        []
          .concat(Object.keys(currents[0]))
          .concat("modifier")
          .concat("userDeleted"),
        currents.map((c) =>
          Object.values(c)
            .concat(req.headers["x-user-uuid"] || "stub")
            .concat(1)
        ),
      ]);
    }

    let sql = "DELETE FROM ??";
    let values = [table];

    if (selectParams.sql.includes(" where ")) {
      sql += " where " + selectParams.sql.split(" where ")[1];
      values = values.concat(selectParams.values);
    }

    await db.query(sql, values);

    const resBody = (
      await Promise.all(
        currents.map((record) => mapInternalIdentsToExposed(relations, record))
      )
    ).map((x) => _.pick(resBodyKeys, x));
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.userProjectGet = async (req, res, next) => {
  try {
    const table = "UserProject";
    const ident = "uuid";
    const joins = [
      {
        type: "left",
        target: "OrganizationRole",
        alias: "OrganizationRole_0",
        on: { id: "$UserProject.organizationRoleId$" },
      },
      {
        type: "left",
        target: "Project",
        alias: "Project_1",
        on: { id: "$UserProject.projectId$" },
      },
      {
        type: "left",
        target: "User",
        alias: "User_2",
        on: { id: "$UserProject.userId$" },
      },
    ];
    const fields = [
      "projectRole",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
      { as: "organizationRoleUuid", expression: "OrganizationRole_0.uuid" },
      { as: "projectUuid", expression: "Project_1.uuid" },
      { as: "userUuid", expression: "User_2.uuid" },
    ];
    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const record = await db.queryHead(sqlStringAndValues);
    if (!record) {
      return res.status(404).json({ errors: ["Record not found"] });
    }
    return res.status(200).json(record);
  } catch (e) {
    return next(e);
  }
};

module.exports.userProjectGetList = async (req, res, next) => {
  try {
    const table = "UserProject";
    const relations = [
      {
        localTable: "UserProject",
        localField: "organizationRoleId",
        localForeignIdent: "organizationRoleUuid",
        foreignTable: "OrganizationRole",
        foreignField: "id",
        foreignIdent: "uuid",
      },
      {
        localTable: "UserProject",
        localField: "projectId",
        localForeignIdent: "projectUuid",
        foreignTable: "Project",
        foreignField: "id",
        foreignIdent: "uuid",
      },
      {
        localTable: "UserProject",
        localField: "userId",
        localForeignIdent: "userUuid",
        foreignTable: "User",
        foreignField: "id",
        foreignIdent: "uuid",
      },
    ];

    const $where = await prepareWhere(relations, req.query.$where);
    const $orderBy = req.query.$orderBy
      ? Array.isArray(req.query.$orderBy)
        ? req.query.$orderBy.map((x) => mapExposedKeysToInternal(relations, x))
        : mapExposedKeysToInternal(relations, req.query.$orderBy)
      : undefined;

    // https://github.com/epoberezkin/ajv/issues/276
    if (req.query.$paginate && req.query.$paginate.page) {
      req.query.$paginate.pageSize = req.query.$paginate.pageSize || 20;
    }

    let rows, totalCount;

    const joins = [
      {
        type: "left",
        target: "OrganizationRole",
        alias: "OrganizationRole_0",
        on: { id: "$UserProject.organizationRoleId$" },
      },
      {
        type: "left",
        target: "Project",
        alias: "Project_1",
        on: { id: "$UserProject.projectId$" },
      },
      {
        type: "left",
        target: "User",
        alias: "User_2",
        on: { id: "$UserProject.userId$" },
      },
    ];
    const fields = [
      "id",
      "projectRole",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
      { as: "organizationRoleUuid", expression: "OrganizationRole_0.uuid" },
      { as: "projectUuid", expression: "Project_1.uuid" },
      { as: "userUuid", expression: "User_2.uuid" },
    ];
    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where,
      $orderBy,
      $paginate: req.query.$paginate || undefined,
    });

    if (req.query.$paginate) {
      [rows, totalCount] = await Promise.all([
        db.query(sqlStringAndValues),
        db
          .queryHead(
            await getSQLString({
              table,
              fields: ["COUNT(*)"],
              $where,
              $orderBy,
            })
          )
          .then((d) => d["COUNT(*)"]),
      ]);
    } else {
      rows = await db.query(sqlStringAndValues);
    }

    if (req.query.$paginate) {
      if (typeof req.query.$paginate.limit === "number") {
        const hasMoreResults = rows.length === req.query.$paginate.limit + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }

        res.set("x-pagination-limit", req.query.$paginate.limit);
        res.set("x-pagination-offset", req.query.$paginate.offset);
        res.set(
          "x-pagination-has-previous-page",
          req.query.$paginate.offset > 0
        );
        res.set("x-pagination-has-next-page", !!hasMoreResults);
      } else if (typeof req.query.$paginate.page === "number") {
        const hasMoreResults = rows.length === req.query.$paginate.pageSize + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }

        res.set("x-pagination-page", req.query.$paginate.page);
        res.set("x-pagination-page-size", req.query.$paginate.pageSize);
        res.set("x-pagination-has-previous-page", req.query.$paginate.page > 1);
        res.set("x-pagination-has-next-page", !!hasMoreResults);
      } else {
        const flip =
          typeof req.query.$paginate.first === "number" ? false : true;
        const limit = flip
          ? req.query.$paginate.last
          : req.query.$paginate.first;

        const hasMoreResults = rows.length === limit + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }
        if (flip) {
          rows = rows.reverse();
        }

        const hasPreviousPage = flip ? hasMoreResults : false;
        const hasNextPage = flip ? false : hasMoreResults;
        const startCursor =
          rows[0] && rows[0].id ? encodeCursor(rows[0].id) : null;
        const endCursor =
          rows[rows.length - 1] && rows[rows.length - 1].id
            ? encodeCursor(rows[rows.length - 1].id)
            : null;

        res.set("x-pagination-has-previous-page", hasPreviousPage);
        res.set("x-pagination-has-next-page", hasNextPage);
        if (startCursor != null) {
          res.set("x-pagination-start-cursor", startCursor);
        }
        if (endCursor != null) {
          res.set("x-pagination-end-cursor", endCursor);
        }
      }
    }

    if (typeof totalCount === "number") {
      res.set("x-pagination-total-count", totalCount);
    }

    if (
      typeof totalCount === "number" &&
      req.query.$paginate &&
      req.query.$paginate.pageSize
    ) {
      res.set(
        "x-pagination-last-page",
        Math.ceil(totalCount / req.query.$paginate.pageSize)
      );
    }

    // https://jsperf.com/delete-vs-spread-vs-lodash-omit-vs-lodash-inverse-pick
    for (let row of rows) {
      row.id = undefined;
    }

    return res.status(200).json(rows);
  } catch (e) {
    return next(e);
  }
};

module.exports.userProjectPost = async (req, res, next) => {
  try {
    const table = "UserProject";
    const relations = [
      {
        localTable: "UserProject",
        localField: "organizationRoleId",
        localForeignIdent: "organizationRoleUuid",
        foreignTable: "OrganizationRole",
        foreignField: "id",
        foreignIdent: "uuid",
      },
      {
        localTable: "UserProject",
        localField: "projectId",
        localForeignIdent: "projectUuid",
        foreignTable: "Project",
        foreignField: "id",
        foreignIdent: "uuid",
      },
      {
        localTable: "UserProject",
        localField: "userId",
        localForeignIdent: "userUuid",
        foreignTable: "User",
        foreignField: "id",
        foreignIdent: "uuid",
      },
    ];
    const reqBodySchema = require("./schemas/user-project.POST.req.body.json");
    const ident = "uuid";
    const joins = [
      {
        type: "left",
        target: "OrganizationRole",
        alias: "OrganizationRole_0",
        on: { id: "$UserProject.organizationRoleId$" },
      },
      {
        type: "left",
        target: "Project",
        alias: "Project_1",
        on: { id: "$UserProject.projectId$" },
      },
      {
        type: "left",
        target: "User",
        alias: "User_2",
        on: { id: "$UserProject.userId$" },
      },
    ];
    const fields = [
      "projectRole",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
      { as: "organizationRoleUuid", expression: "OrganizationRole_0.uuid" },
      { as: "projectUuid", expression: "Project_1.uuid" },
      { as: "userUuid", expression: "User_2.uuid" },
    ];

    const body = prepareDateTimeStrings(
      reqBodySchema,
      await mapExposedIdentsToInternal(relations, req.body)
    );

    const inserted = await db.query("INSERT INTO ?? SET ?? = UUID(), ?", [
      table,
      ident,
      body,
    ]);
    const id = inserted.insertId;

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { id },
    });
    const record = await db.queryHead(sqlStringAndValues);

    return res.status(200).json(record);
  } catch (e) {
    return next(e);
  }
};

module.exports.userProjectPatch = async (req, res, next) => {
  try {
    const table = "UserProject";
    const archiveTable = archiveTablesMap[table];
    const relations = [
      {
        localTable: "UserProject",
        localField: "organizationRoleId",
        localForeignIdent: "organizationRoleUuid",
        foreignTable: "OrganizationRole",
        foreignField: "id",
        foreignIdent: "uuid",
      },
      {
        localTable: "UserProject",
        localField: "projectId",
        localForeignIdent: "projectUuid",
        foreignTable: "Project",
        foreignField: "id",
        foreignIdent: "uuid",
      },
      {
        localTable: "UserProject",
        localField: "userId",
        localForeignIdent: "userUuid",
        foreignTable: "User",
        foreignField: "id",
        foreignIdent: "uuid",
      },
    ];
    const reqBodySchema = require("./schemas/user-project.PATCH.req.body.json");
    const resBodyKeys = [
      "userUuid",
      "projectUuid",
      "organizationRoleUuid",
      "projectRole",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];
    const ident = "uuid";
    const joins = [
      {
        type: "left",
        target: "OrganizationRole",
        alias: "OrganizationRole_0",
        on: { id: "$UserProject.organizationRoleId$" },
      },
      {
        type: "left",
        target: "Project",
        alias: "Project_1",
        on: { id: "$UserProject.projectId$" },
      },
      {
        type: "left",
        target: "User",
        alias: "User_2",
        on: { id: "$UserProject.userId$" },
      },
    ];
    const fields = [
      "*",
      { as: "organizationRoleUuid", expression: "OrganizationRole_0.uuid" },
      { as: "projectUuid", expression: "Project_1.uuid" },
      { as: "userUuid", expression: "User_2.uuid" },
    ];

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const current = await db.queryHead(sqlStringAndValues);

    if (!current) {
      return res.status(404).json({ errors: ["Record not found"] });
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? SET ?", [
        archiveTable,
        {
          ..._.omit(
            ["organizationRoleUuid", "projectUuid", "userUuid"],
            current
          ),
          modifier: req.headers["x-user-uuid"] || "stub",
        },
      ]);
    }

    if (Object.keys(req.body).length) {
      const body = prepareDateTimeStrings(
        reqBodySchema,
        await mapExposedIdentsToInternal(relations, req.body)
      );
      await db.query("UPDATE ?? SET ? WHERE ?? = ?", [
        table,
        body,
        ident,
        req.params[ident],
      ]);
    } else {
      // Nothing to update.
      const resBody = _.pick(resBodyKeys, current);
      return res.status(200).json(resBody);
    }
    const record = await db.queryHead(
      await getSQLString({
        table,
        fields,
        joins,
        $where: { [ident]: req.params["uuid"] },
      })
    );

    const resBody = _.pick(resBodyKeys, record);
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.userProjectPatchList = async (req, res, next) => {
  try {
    const table = "UserProject";
    const relations = relationsMap[table];
    const archiveTable = archiveTablesMap[table];
    const reqBodySchema = require("./schemas/user-project.PATCH.list.req.body.json");
    const resBodyKeys = [
      "userUuid",
      "projectUuid",
      "organizationRoleUuid",
      "projectRole",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];

    const $where = await prepareWhere(relations, req.query.$where);
    const selectParams = await getSQLString({
      table,
      $where,
    });

    const currents = await db.query(selectParams);
    if (!currents.length) {
      return res.status(200).json([]);
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? (??) VALUES ?", [
        archiveTable,
        [].concat(Object.keys(currents[0])).concat("modifier"),
        currents.map((c) =>
          Object.values(c).concat(req.headers["x-user-uuid"] || "stub")
        ),
      ]);
    }

    if (Object.keys(req.body).length) {
      const body = prepareDateTimeStrings(
        reqBodySchema,
        await mapExposedIdentsToInternal(relations, req.body)
      );

      let sql = "UPDATE ?? SET ?";
      let values = [table, body];

      if (selectParams.sql.includes(" where ")) {
        sql += " where " + selectParams.sql.split(" where ")[1];
        values = values.concat(selectParams.values);
      }

      await db.query(sql, values);
    } else {
      // Nothing to update.
      let resBody = (
        await Promise.all(
          currents.map((current) =>
            mapInternalIdentsToExposed(relations, current)
          )
        )
      ).map((x) => _.pick(resBodyKeys, x));
      return res.status(200).json(resBody);
    }
    const records = await db.query(selectParams);
    const resBody = (
      await Promise.all(
        records.map((record) => mapInternalIdentsToExposed(relations, record))
      )
    ).map((x) => _.pick(resBodyKeys, x));
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.userProjectDelete = async (req, res, next) => {
  try {
    const table = "UserProject";
    const archiveTable = archiveTablesMap[table];
    const resBodyKeys = [
      "userUuid",
      "projectUuid",
      "organizationRoleUuid",
      "projectRole",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];
    const ident = "uuid";
    const joins = [
      {
        type: "left",
        target: "OrganizationRole",
        alias: "OrganizationRole_0",
        on: { id: "$UserProject.organizationRoleId$" },
      },
      {
        type: "left",
        target: "Project",
        alias: "Project_1",
        on: { id: "$UserProject.projectId$" },
      },
      {
        type: "left",
        target: "User",
        alias: "User_2",
        on: { id: "$UserProject.userId$" },
      },
    ];
    const fields = [
      "*",
      { as: "organizationRoleUuid", expression: "OrganizationRole_0.uuid" },
      { as: "projectUuid", expression: "Project_1.uuid" },
      { as: "userUuid", expression: "User_2.uuid" },
    ];

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const current = await db.queryHead(sqlStringAndValues);

    if (!current) {
      return res.status(404).json({ errors: ["Record not found"] });
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? SET ?", [
        archiveTable,
        {
          ..._.omit(
            ["organizationRoleUuid", "projectUuid", "userUuid"],
            current
          ),
          modifier: req.headers["x-user-uuid"] || "stub",
          userDeleted: 1,
        },
      ]);
    }

    await db.query("DELETE FROM ?? WHERE ?? = ?", [
      table,
      ident,
      req.params[ident],
    ]);

    const resBody = _.pick(resBodyKeys, current);
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.userProjectDeleteList = async (req, res, next) => {
  try {
    const table = "UserProject";
    const archiveTable = archiveTablesMap[table];
    const relations = relationsMap[table];
    const resBodyKeys = [
      "userUuid",
      "projectUuid",
      "organizationRoleUuid",
      "projectRole",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];

    const $where = await prepareWhere(relations, req.query.$where);
    const selectParams = await getSQLString({
      table,
      $where,
    });

    const currents = await db.query(selectParams);
    if (!currents.length) {
      return res.status(200).json([]);
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? (??) VALUES ?", [
        archiveTable,
        []
          .concat(Object.keys(currents[0]))
          .concat("modifier")
          .concat("userDeleted"),
        currents.map((c) =>
          Object.values(c)
            .concat(req.headers["x-user-uuid"] || "stub")
            .concat(1)
        ),
      ]);
    }

    let sql = "DELETE FROM ??";
    let values = [table];

    if (selectParams.sql.includes(" where ")) {
      sql += " where " + selectParams.sql.split(" where ")[1];
      values = values.concat(selectParams.values);
    }

    await db.query(sql, values);

    const resBody = (
      await Promise.all(
        currents.map((record) => mapInternalIdentsToExposed(relations, record))
      )
    ).map((x) => _.pick(resBodyKeys, x));
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.userRoleGet = async (req, res, next) => {
  try {
    const table = "UserRole";
    const ident = "uuid";
    const joins = [
      {
        type: "left",
        target: "Role",
        alias: "Role_0",
        on: { id: "$UserRole.roleId$" },
      },
      {
        type: "left",
        target: "User",
        alias: "User_1",
        on: { id: "$UserRole.userId$" },
      },
    ];
    const fields = [
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
      { as: "roleUuid", expression: "Role_0.uuid" },
      { as: "userUuid", expression: "User_1.uuid" },
    ];
    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const record = await db.queryHead(sqlStringAndValues);
    if (!record) {
      return res.status(404).json({ errors: ["Record not found"] });
    }
    return res.status(200).json(record);
  } catch (e) {
    return next(e);
  }
};

module.exports.userRoleGetList = async (req, res, next) => {
  try {
    const table = "UserRole";
    const relations = [
      {
        localTable: "UserRole",
        localField: "roleId",
        localForeignIdent: "roleUuid",
        foreignTable: "Role",
        foreignField: "id",
        foreignIdent: "uuid",
      },
      {
        localTable: "UserRole",
        localField: "userId",
        localForeignIdent: "userUuid",
        foreignTable: "User",
        foreignField: "id",
        foreignIdent: "uuid",
      },
    ];

    const $where = await prepareWhere(relations, req.query.$where);
    const $orderBy = req.query.$orderBy
      ? Array.isArray(req.query.$orderBy)
        ? req.query.$orderBy.map((x) => mapExposedKeysToInternal(relations, x))
        : mapExposedKeysToInternal(relations, req.query.$orderBy)
      : undefined;

    // https://github.com/epoberezkin/ajv/issues/276
    if (req.query.$paginate && req.query.$paginate.page) {
      req.query.$paginate.pageSize = req.query.$paginate.pageSize || 20;
    }

    let rows, totalCount;

    const joins = [
      {
        type: "left",
        target: "Role",
        alias: "Role_0",
        on: { id: "$UserRole.roleId$" },
      },
      {
        type: "left",
        target: "User",
        alias: "User_1",
        on: { id: "$UserRole.userId$" },
      },
    ];
    const fields = [
      "id",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
      { as: "roleUuid", expression: "Role_0.uuid" },
      { as: "userUuid", expression: "User_1.uuid" },
    ];
    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where,
      $orderBy,
      $paginate: req.query.$paginate || undefined,
    });

    if (req.query.$paginate) {
      [rows, totalCount] = await Promise.all([
        db.query(sqlStringAndValues),
        db
          .queryHead(
            await getSQLString({
              table,
              fields: ["COUNT(*)"],
              $where,
              $orderBy,
            })
          )
          .then((d) => d["COUNT(*)"]),
      ]);
    } else {
      rows = await db.query(sqlStringAndValues);
    }

    if (req.query.$paginate) {
      if (typeof req.query.$paginate.limit === "number") {
        const hasMoreResults = rows.length === req.query.$paginate.limit + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }

        res.set("x-pagination-limit", req.query.$paginate.limit);
        res.set("x-pagination-offset", req.query.$paginate.offset);
        res.set(
          "x-pagination-has-previous-page",
          req.query.$paginate.offset > 0
        );
        res.set("x-pagination-has-next-page", !!hasMoreResults);
      } else if (typeof req.query.$paginate.page === "number") {
        const hasMoreResults = rows.length === req.query.$paginate.pageSize + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }

        res.set("x-pagination-page", req.query.$paginate.page);
        res.set("x-pagination-page-size", req.query.$paginate.pageSize);
        res.set("x-pagination-has-previous-page", req.query.$paginate.page > 1);
        res.set("x-pagination-has-next-page", !!hasMoreResults);
      } else {
        const flip =
          typeof req.query.$paginate.first === "number" ? false : true;
        const limit = flip
          ? req.query.$paginate.last
          : req.query.$paginate.first;

        const hasMoreResults = rows.length === limit + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }
        if (flip) {
          rows = rows.reverse();
        }

        const hasPreviousPage = flip ? hasMoreResults : false;
        const hasNextPage = flip ? false : hasMoreResults;
        const startCursor =
          rows[0] && rows[0].id ? encodeCursor(rows[0].id) : null;
        const endCursor =
          rows[rows.length - 1] && rows[rows.length - 1].id
            ? encodeCursor(rows[rows.length - 1].id)
            : null;

        res.set("x-pagination-has-previous-page", hasPreviousPage);
        res.set("x-pagination-has-next-page", hasNextPage);
        if (startCursor != null) {
          res.set("x-pagination-start-cursor", startCursor);
        }
        if (endCursor != null) {
          res.set("x-pagination-end-cursor", endCursor);
        }
      }
    }

    if (typeof totalCount === "number") {
      res.set("x-pagination-total-count", totalCount);
    }

    if (
      typeof totalCount === "number" &&
      req.query.$paginate &&
      req.query.$paginate.pageSize
    ) {
      res.set(
        "x-pagination-last-page",
        Math.ceil(totalCount / req.query.$paginate.pageSize)
      );
    }

    // https://jsperf.com/delete-vs-spread-vs-lodash-omit-vs-lodash-inverse-pick
    for (let row of rows) {
      row.id = undefined;
    }

    return res.status(200).json(rows);
  } catch (e) {
    return next(e);
  }
};

module.exports.userRolePost = async (req, res, next) => {
  try {
    const table = "UserRole";
    const relations = [
      {
        localTable: "UserRole",
        localField: "roleId",
        localForeignIdent: "roleUuid",
        foreignTable: "Role",
        foreignField: "id",
        foreignIdent: "uuid",
      },
      {
        localTable: "UserRole",
        localField: "userId",
        localForeignIdent: "userUuid",
        foreignTable: "User",
        foreignField: "id",
        foreignIdent: "uuid",
      },
    ];
    const reqBodySchema = require("./schemas/user-role.POST.req.body.json");
    const ident = "uuid";
    const joins = [
      {
        type: "left",
        target: "Role",
        alias: "Role_0",
        on: { id: "$UserRole.roleId$" },
      },
      {
        type: "left",
        target: "User",
        alias: "User_1",
        on: { id: "$UserRole.userId$" },
      },
    ];
    const fields = [
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
      { as: "roleUuid", expression: "Role_0.uuid" },
      { as: "userUuid", expression: "User_1.uuid" },
    ];

    const body = prepareDateTimeStrings(
      reqBodySchema,
      await mapExposedIdentsToInternal(relations, req.body)
    );

    const inserted = await db.query("INSERT INTO ?? SET ?? = UUID(), ?", [
      table,
      ident,
      body,
    ]);
    const id = inserted.insertId;

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { id },
    });
    const record = await db.queryHead(sqlStringAndValues);

    return res.status(200).json(record);
  } catch (e) {
    return next(e);
  }
};

module.exports.userRolePatch = async (req, res, next) => {
  try {
    const table = "UserRole";
    const archiveTable = archiveTablesMap[table];
    const relations = [
      {
        localTable: "UserRole",
        localField: "roleId",
        localForeignIdent: "roleUuid",
        foreignTable: "Role",
        foreignField: "id",
        foreignIdent: "uuid",
      },
      {
        localTable: "UserRole",
        localField: "userId",
        localForeignIdent: "userUuid",
        foreignTable: "User",
        foreignField: "id",
        foreignIdent: "uuid",
      },
    ];
    const reqBodySchema = require("./schemas/user-role.PATCH.req.body.json");
    const resBodyKeys = [
      "userUuid",
      "roleUuid",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];
    const ident = "uuid";
    const joins = [
      {
        type: "left",
        target: "Role",
        alias: "Role_0",
        on: { id: "$UserRole.roleId$" },
      },
      {
        type: "left",
        target: "User",
        alias: "User_1",
        on: { id: "$UserRole.userId$" },
      },
    ];
    const fields = [
      "*",
      { as: "roleUuid", expression: "Role_0.uuid" },
      { as: "userUuid", expression: "User_1.uuid" },
    ];

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const current = await db.queryHead(sqlStringAndValues);

    if (!current) {
      return res.status(404).json({ errors: ["Record not found"] });
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? SET ?", [
        archiveTable,
        {
          ..._.omit(["roleUuid", "userUuid"], current),
          modifier: req.headers["x-user-uuid"] || "stub",
        },
      ]);
    }

    if (Object.keys(req.body).length) {
      const body = prepareDateTimeStrings(
        reqBodySchema,
        await mapExposedIdentsToInternal(relations, req.body)
      );
      await db.query("UPDATE ?? SET ? WHERE ?? = ?", [
        table,
        body,
        ident,
        req.params[ident],
      ]);
    } else {
      // Nothing to update.
      const resBody = _.pick(resBodyKeys, current);
      return res.status(200).json(resBody);
    }
    const record = await db.queryHead(
      await getSQLString({
        table,
        fields,
        joins,
        $where: { [ident]: req.params["uuid"] },
      })
    );

    const resBody = _.pick(resBodyKeys, record);
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.userRolePatchList = async (req, res, next) => {
  try {
    const table = "UserRole";
    const relations = relationsMap[table];
    const archiveTable = archiveTablesMap[table];
    const reqBodySchema = require("./schemas/user-role.PATCH.list.req.body.json");
    const resBodyKeys = [
      "userUuid",
      "roleUuid",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];

    const $where = await prepareWhere(relations, req.query.$where);
    const selectParams = await getSQLString({
      table,
      $where,
    });

    const currents = await db.query(selectParams);
    if (!currents.length) {
      return res.status(200).json([]);
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? (??) VALUES ?", [
        archiveTable,
        [].concat(Object.keys(currents[0])).concat("modifier"),
        currents.map((c) =>
          Object.values(c).concat(req.headers["x-user-uuid"] || "stub")
        ),
      ]);
    }

    if (Object.keys(req.body).length) {
      const body = prepareDateTimeStrings(
        reqBodySchema,
        await mapExposedIdentsToInternal(relations, req.body)
      );

      let sql = "UPDATE ?? SET ?";
      let values = [table, body];

      if (selectParams.sql.includes(" where ")) {
        sql += " where " + selectParams.sql.split(" where ")[1];
        values = values.concat(selectParams.values);
      }

      await db.query(sql, values);
    } else {
      // Nothing to update.
      let resBody = (
        await Promise.all(
          currents.map((current) =>
            mapInternalIdentsToExposed(relations, current)
          )
        )
      ).map((x) => _.pick(resBodyKeys, x));
      return res.status(200).json(resBody);
    }
    const records = await db.query(selectParams);
    const resBody = (
      await Promise.all(
        records.map((record) => mapInternalIdentsToExposed(relations, record))
      )
    ).map((x) => _.pick(resBodyKeys, x));
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.userRoleDelete = async (req, res, next) => {
  try {
    const table = "UserRole";
    const archiveTable = archiveTablesMap[table];
    const resBodyKeys = [
      "userUuid",
      "roleUuid",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];
    const ident = "uuid";
    const joins = [
      {
        type: "left",
        target: "Role",
        alias: "Role_0",
        on: { id: "$UserRole.roleId$" },
      },
      {
        type: "left",
        target: "User",
        alias: "User_1",
        on: { id: "$UserRole.userId$" },
      },
    ];
    const fields = [
      "*",
      { as: "roleUuid", expression: "Role_0.uuid" },
      { as: "userUuid", expression: "User_1.uuid" },
    ];

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const current = await db.queryHead(sqlStringAndValues);

    if (!current) {
      return res.status(404).json({ errors: ["Record not found"] });
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? SET ?", [
        archiveTable,
        {
          ..._.omit(["roleUuid", "userUuid"], current),
          modifier: req.headers["x-user-uuid"] || "stub",
          userDeleted: 1,
        },
      ]);
    }

    await db.query("DELETE FROM ?? WHERE ?? = ?", [
      table,
      ident,
      req.params[ident],
    ]);

    const resBody = _.pick(resBodyKeys, current);
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.userRoleDeleteList = async (req, res, next) => {
  try {
    const table = "UserRole";
    const archiveTable = archiveTablesMap[table];
    const relations = relationsMap[table];
    const resBodyKeys = [
      "userUuid",
      "roleUuid",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];

    const $where = await prepareWhere(relations, req.query.$where);
    const selectParams = await getSQLString({
      table,
      $where,
    });

    const currents = await db.query(selectParams);
    if (!currents.length) {
      return res.status(200).json([]);
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? (??) VALUES ?", [
        archiveTable,
        []
          .concat(Object.keys(currents[0]))
          .concat("modifier")
          .concat("userDeleted"),
        currents.map((c) =>
          Object.values(c)
            .concat(req.headers["x-user-uuid"] || "stub")
            .concat(1)
        ),
      ]);
    }

    let sql = "DELETE FROM ??";
    let values = [table];

    if (selectParams.sql.includes(" where ")) {
      sql += " where " + selectParams.sql.split(" where ")[1];
      values = values.concat(selectParams.values);
    }

    await db.query(sql, values);

    const resBody = (
      await Promise.all(
        currents.map((record) => mapInternalIdentsToExposed(relations, record))
      )
    ).map((x) => _.pick(resBodyKeys, x));
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.attributeBaseGet = async (req, res, next) => {
  try {
    const table = "_AttributeBase";
    const ident = "uuid";
    const joins = [];
    const fields = [
      "name",
      "value",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];
    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const record = await db.queryHead(sqlStringAndValues);
    if (!record) {
      return res.status(404).json({ errors: ["Record not found"] });
    }
    return res.status(200).json(record);
  } catch (e) {
    return next(e);
  }
};

module.exports.attributeBaseGetList = async (req, res, next) => {
  try {
    const table = "_AttributeBase";
    const relations = [];

    const $where = await prepareWhere(relations, req.query.$where);
    const $orderBy = req.query.$orderBy
      ? Array.isArray(req.query.$orderBy)
        ? req.query.$orderBy.map((x) => mapExposedKeysToInternal(relations, x))
        : mapExposedKeysToInternal(relations, req.query.$orderBy)
      : undefined;

    // https://github.com/epoberezkin/ajv/issues/276
    if (req.query.$paginate && req.query.$paginate.page) {
      req.query.$paginate.pageSize = req.query.$paginate.pageSize || 20;
    }

    let rows, totalCount;

    const joins = [];
    const fields = [
      "id",
      "name",
      "value",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];
    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where,
      $orderBy,
      $paginate: req.query.$paginate || undefined,
    });

    if (req.query.$paginate) {
      [rows, totalCount] = await Promise.all([
        db.query(sqlStringAndValues),
        db
          .queryHead(
            await getSQLString({
              table,
              fields: ["COUNT(*)"],
              $where,
              $orderBy,
            })
          )
          .then((d) => d["COUNT(*)"]),
      ]);
    } else {
      rows = await db.query(sqlStringAndValues);
    }

    if (req.query.$paginate) {
      if (typeof req.query.$paginate.limit === "number") {
        const hasMoreResults = rows.length === req.query.$paginate.limit + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }

        res.set("x-pagination-limit", req.query.$paginate.limit);
        res.set("x-pagination-offset", req.query.$paginate.offset);
        res.set(
          "x-pagination-has-previous-page",
          req.query.$paginate.offset > 0
        );
        res.set("x-pagination-has-next-page", !!hasMoreResults);
      } else if (typeof req.query.$paginate.page === "number") {
        const hasMoreResults = rows.length === req.query.$paginate.pageSize + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }

        res.set("x-pagination-page", req.query.$paginate.page);
        res.set("x-pagination-page-size", req.query.$paginate.pageSize);
        res.set("x-pagination-has-previous-page", req.query.$paginate.page > 1);
        res.set("x-pagination-has-next-page", !!hasMoreResults);
      } else {
        const flip =
          typeof req.query.$paginate.first === "number" ? false : true;
        const limit = flip
          ? req.query.$paginate.last
          : req.query.$paginate.first;

        const hasMoreResults = rows.length === limit + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }
        if (flip) {
          rows = rows.reverse();
        }

        const hasPreviousPage = flip ? hasMoreResults : false;
        const hasNextPage = flip ? false : hasMoreResults;
        const startCursor =
          rows[0] && rows[0].id ? encodeCursor(rows[0].id) : null;
        const endCursor =
          rows[rows.length - 1] && rows[rows.length - 1].id
            ? encodeCursor(rows[rows.length - 1].id)
            : null;

        res.set("x-pagination-has-previous-page", hasPreviousPage);
        res.set("x-pagination-has-next-page", hasNextPage);
        if (startCursor != null) {
          res.set("x-pagination-start-cursor", startCursor);
        }
        if (endCursor != null) {
          res.set("x-pagination-end-cursor", endCursor);
        }
      }
    }

    if (typeof totalCount === "number") {
      res.set("x-pagination-total-count", totalCount);
    }

    if (
      typeof totalCount === "number" &&
      req.query.$paginate &&
      req.query.$paginate.pageSize
    ) {
      res.set(
        "x-pagination-last-page",
        Math.ceil(totalCount / req.query.$paginate.pageSize)
      );
    }

    // https://jsperf.com/delete-vs-spread-vs-lodash-omit-vs-lodash-inverse-pick
    for (let row of rows) {
      row.id = undefined;
    }

    return res.status(200).json(rows);
  } catch (e) {
    return next(e);
  }
};

module.exports.attributeBasePost = async (req, res, next) => {
  try {
    const table = "_AttributeBase";
    const relations = [];
    const reqBodySchema = require("./schemas/_attribute-base.POST.req.body.json");
    const ident = "uuid";
    const joins = [];
    const fields = [
      "name",
      "value",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];

    const body = prepareDateTimeStrings(
      reqBodySchema,
      await mapExposedIdentsToInternal(relations, req.body)
    );

    const inserted = await db.query("INSERT INTO ?? SET ?? = UUID(), ?", [
      table,
      ident,
      body,
    ]);
    const id = inserted.insertId;

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { id },
    });
    const record = await db.queryHead(sqlStringAndValues);

    return res.status(200).json(record);
  } catch (e) {
    return next(e);
  }
};

module.exports.attributeBasePatch = async (req, res, next) => {
  try {
    const table = "_AttributeBase";
    const archiveTable = archiveTablesMap[table];
    const relations = [];
    const reqBodySchema = require("./schemas/_attribute-base.PATCH.req.body.json");
    const resBodyKeys = [
      "name",
      "value",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];
    const ident = "uuid";
    const joins = [];
    const fields = ["*"];

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const current = await db.queryHead(sqlStringAndValues);

    if (!current) {
      return res.status(404).json({ errors: ["Record not found"] });
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? SET ?", [
        archiveTable,
        {
          ..._.omit([], current),
          modifier: req.headers["x-user-uuid"] || "stub",
        },
      ]);
    }

    if (Object.keys(req.body).length) {
      const body = prepareDateTimeStrings(
        reqBodySchema,
        await mapExposedIdentsToInternal(relations, req.body)
      );
      await db.query("UPDATE ?? SET ? WHERE ?? = ?", [
        table,
        body,
        ident,
        req.params[ident],
      ]);
    } else {
      // Nothing to update.
      const resBody = _.pick(resBodyKeys, current);
      return res.status(200).json(resBody);
    }
    const record = await db.queryHead(
      await getSQLString({
        table,
        fields,
        joins,
        $where: { [ident]: req.params["uuid"] },
      })
    );

    const resBody = _.pick(resBodyKeys, record);
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.attributeBasePatchList = async (req, res, next) => {
  try {
    const table = "_AttributeBase";
    const relations = relationsMap[table];
    const archiveTable = archiveTablesMap[table];
    const reqBodySchema = require("./schemas/_attribute-base.PATCH.list.req.body.json");
    const resBodyKeys = [
      "name",
      "value",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];

    const $where = await prepareWhere(relations, req.query.$where);
    const selectParams = await getSQLString({
      table,
      $where,
    });

    const currents = await db.query(selectParams);
    if (!currents.length) {
      return res.status(200).json([]);
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? (??) VALUES ?", [
        archiveTable,
        [].concat(Object.keys(currents[0])).concat("modifier"),
        currents.map((c) =>
          Object.values(c).concat(req.headers["x-user-uuid"] || "stub")
        ),
      ]);
    }

    if (Object.keys(req.body).length) {
      const body = prepareDateTimeStrings(
        reqBodySchema,
        await mapExposedIdentsToInternal(relations, req.body)
      );

      let sql = "UPDATE ?? SET ?";
      let values = [table, body];

      if (selectParams.sql.includes(" where ")) {
        sql += " where " + selectParams.sql.split(" where ")[1];
        values = values.concat(selectParams.values);
      }

      await db.query(sql, values);
    } else {
      // Nothing to update.
      let resBody = (
        await Promise.all(
          currents.map((current) =>
            mapInternalIdentsToExposed(relations, current)
          )
        )
      ).map((x) => _.pick(resBodyKeys, x));
      return res.status(200).json(resBody);
    }
    const records = await db.query(selectParams);
    const resBody = (
      await Promise.all(
        records.map((record) => mapInternalIdentsToExposed(relations, record))
      )
    ).map((x) => _.pick(resBodyKeys, x));
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.attributeBaseDelete = async (req, res, next) => {
  try {
    const table = "_AttributeBase";
    const archiveTable = archiveTablesMap[table];
    const resBodyKeys = [
      "name",
      "value",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];
    const ident = "uuid";
    const joins = [];
    const fields = ["*"];

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const current = await db.queryHead(sqlStringAndValues);

    if (!current) {
      return res.status(404).json({ errors: ["Record not found"] });
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? SET ?", [
        archiveTable,
        {
          ..._.omit([], current),
          modifier: req.headers["x-user-uuid"] || "stub",
          userDeleted: 1,
        },
      ]);
    }

    await db.query("DELETE FROM ?? WHERE ?? = ?", [
      table,
      ident,
      req.params[ident],
    ]);

    const resBody = _.pick(resBodyKeys, current);
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.attributeBaseDeleteList = async (req, res, next) => {
  try {
    const table = "_AttributeBase";
    const archiveTable = archiveTablesMap[table];
    const relations = relationsMap[table];
    const resBodyKeys = [
      "name",
      "value",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];

    const $where = await prepareWhere(relations, req.query.$where);
    const selectParams = await getSQLString({
      table,
      $where,
    });

    const currents = await db.query(selectParams);
    if (!currents.length) {
      return res.status(200).json([]);
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? (??) VALUES ?", [
        archiveTable,
        []
          .concat(Object.keys(currents[0]))
          .concat("modifier")
          .concat("userDeleted"),
        currents.map((c) =>
          Object.values(c)
            .concat(req.headers["x-user-uuid"] || "stub")
            .concat(1)
        ),
      ]);
    }

    let sql = "DELETE FROM ??";
    let values = [table];

    if (selectParams.sql.includes(" where ")) {
      sql += " where " + selectParams.sql.split(" where ")[1];
      values = values.concat(selectParams.values);
    }

    await db.query(sql, values);

    const resBody = (
      await Promise.all(
        currents.map((record) => mapInternalIdentsToExposed(relations, record))
      )
    ).map((x) => _.pick(resBodyKeys, x));
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.attributeTypeBaseGet = async (req, res, next) => {
  try {
    const table = "_AttributeTypeBase";
    const ident = "uuid";
    const joins = [];
    const fields = [
      "enum",
      "name",
      "labelNumber",
      "defaultValue",
      "isRequired",
      "jsonSchema",
      "label",
      "placeholderText",
      "helpMarkdownText",
      "isMedia",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];
    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const record = await db.queryHead(sqlStringAndValues);
    if (!record) {
      return res.status(404).json({ errors: ["Record not found"] });
    }
    return res.status(200).json(record);
  } catch (e) {
    return next(e);
  }
};

module.exports.attributeTypeBaseGetList = async (req, res, next) => {
  try {
    const table = "_AttributeTypeBase";
    const relations = [];

    const $where = await prepareWhere(relations, req.query.$where);
    const $orderBy = req.query.$orderBy
      ? Array.isArray(req.query.$orderBy)
        ? req.query.$orderBy.map((x) => mapExposedKeysToInternal(relations, x))
        : mapExposedKeysToInternal(relations, req.query.$orderBy)
      : undefined;

    // https://github.com/epoberezkin/ajv/issues/276
    if (req.query.$paginate && req.query.$paginate.page) {
      req.query.$paginate.pageSize = req.query.$paginate.pageSize || 20;
    }

    let rows, totalCount;

    const joins = [];
    const fields = [
      "id",
      "enum",
      "name",
      "labelNumber",
      "defaultValue",
      "isRequired",
      "jsonSchema",
      "label",
      "placeholderText",
      "helpMarkdownText",
      "isMedia",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];
    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where,
      $orderBy,
      $paginate: req.query.$paginate || undefined,
    });

    if (req.query.$paginate) {
      [rows, totalCount] = await Promise.all([
        db.query(sqlStringAndValues),
        db
          .queryHead(
            await getSQLString({
              table,
              fields: ["COUNT(*)"],
              $where,
              $orderBy,
            })
          )
          .then((d) => d["COUNT(*)"]),
      ]);
    } else {
      rows = await db.query(sqlStringAndValues);
    }

    if (req.query.$paginate) {
      if (typeof req.query.$paginate.limit === "number") {
        const hasMoreResults = rows.length === req.query.$paginate.limit + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }

        res.set("x-pagination-limit", req.query.$paginate.limit);
        res.set("x-pagination-offset", req.query.$paginate.offset);
        res.set(
          "x-pagination-has-previous-page",
          req.query.$paginate.offset > 0
        );
        res.set("x-pagination-has-next-page", !!hasMoreResults);
      } else if (typeof req.query.$paginate.page === "number") {
        const hasMoreResults = rows.length === req.query.$paginate.pageSize + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }

        res.set("x-pagination-page", req.query.$paginate.page);
        res.set("x-pagination-page-size", req.query.$paginate.pageSize);
        res.set("x-pagination-has-previous-page", req.query.$paginate.page > 1);
        res.set("x-pagination-has-next-page", !!hasMoreResults);
      } else {
        const flip =
          typeof req.query.$paginate.first === "number" ? false : true;
        const limit = flip
          ? req.query.$paginate.last
          : req.query.$paginate.first;

        const hasMoreResults = rows.length === limit + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }
        if (flip) {
          rows = rows.reverse();
        }

        const hasPreviousPage = flip ? hasMoreResults : false;
        const hasNextPage = flip ? false : hasMoreResults;
        const startCursor =
          rows[0] && rows[0].id ? encodeCursor(rows[0].id) : null;
        const endCursor =
          rows[rows.length - 1] && rows[rows.length - 1].id
            ? encodeCursor(rows[rows.length - 1].id)
            : null;

        res.set("x-pagination-has-previous-page", hasPreviousPage);
        res.set("x-pagination-has-next-page", hasNextPage);
        if (startCursor != null) {
          res.set("x-pagination-start-cursor", startCursor);
        }
        if (endCursor != null) {
          res.set("x-pagination-end-cursor", endCursor);
        }
      }
    }

    if (typeof totalCount === "number") {
      res.set("x-pagination-total-count", totalCount);
    }

    if (
      typeof totalCount === "number" &&
      req.query.$paginate &&
      req.query.$paginate.pageSize
    ) {
      res.set(
        "x-pagination-last-page",
        Math.ceil(totalCount / req.query.$paginate.pageSize)
      );
    }

    // https://jsperf.com/delete-vs-spread-vs-lodash-omit-vs-lodash-inverse-pick
    for (let row of rows) {
      row.id = undefined;
    }

    return res.status(200).json(rows);
  } catch (e) {
    return next(e);
  }
};

module.exports.attributeTypeBasePost = async (req, res, next) => {
  try {
    const table = "_AttributeTypeBase";
    const relations = [];
    const reqBodySchema = require("./schemas/_attribute-type-base.POST.req.body.json");
    const ident = "uuid";
    const joins = [];
    const fields = [
      "enum",
      "name",
      "labelNumber",
      "defaultValue",
      "isRequired",
      "jsonSchema",
      "label",
      "placeholderText",
      "helpMarkdownText",
      "isMedia",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];

    const body = prepareDateTimeStrings(
      reqBodySchema,
      await mapExposedIdentsToInternal(relations, req.body)
    );

    const inserted = await db.query("INSERT INTO ?? SET ?? = UUID(), ?", [
      table,
      ident,
      body,
    ]);
    const id = inserted.insertId;

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { id },
    });
    const record = await db.queryHead(sqlStringAndValues);

    return res.status(200).json(record);
  } catch (e) {
    return next(e);
  }
};

module.exports.attributeTypeBasePatch = async (req, res, next) => {
  try {
    const table = "_AttributeTypeBase";
    const archiveTable = archiveTablesMap[table];
    const relations = [];
    const reqBodySchema = require("./schemas/_attribute-type-base.PATCH.req.body.json");
    const resBodyKeys = [
      "enum",
      "name",
      "labelNumber",
      "defaultValue",
      "isRequired",
      "jsonSchema",
      "label",
      "placeholderText",
      "helpMarkdownText",
      "isMedia",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];
    const ident = "uuid";
    const joins = [];
    const fields = ["*"];

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const current = await db.queryHead(sqlStringAndValues);

    if (!current) {
      return res.status(404).json({ errors: ["Record not found"] });
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? SET ?", [
        archiveTable,
        {
          ..._.omit([], current),
          modifier: req.headers["x-user-uuid"] || "stub",
        },
      ]);
    }

    if (Object.keys(req.body).length) {
      const body = prepareDateTimeStrings(
        reqBodySchema,
        await mapExposedIdentsToInternal(relations, req.body)
      );
      await db.query("UPDATE ?? SET ? WHERE ?? = ?", [
        table,
        body,
        ident,
        req.params[ident],
      ]);
    } else {
      // Nothing to update.
      const resBody = _.pick(resBodyKeys, current);
      return res.status(200).json(resBody);
    }
    const record = await db.queryHead(
      await getSQLString({
        table,
        fields,
        joins,
        $where: { [ident]: req.params["uuid"] },
      })
    );

    const resBody = _.pick(resBodyKeys, record);
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.attributeTypeBasePatchList = async (req, res, next) => {
  try {
    const table = "_AttributeTypeBase";
    const relations = relationsMap[table];
    const archiveTable = archiveTablesMap[table];
    const reqBodySchema = require("./schemas/_attribute-type-base.PATCH.list.req.body.json");
    const resBodyKeys = [
      "enum",
      "name",
      "labelNumber",
      "defaultValue",
      "isRequired",
      "jsonSchema",
      "label",
      "placeholderText",
      "helpMarkdownText",
      "isMedia",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];

    const $where = await prepareWhere(relations, req.query.$where);
    const selectParams = await getSQLString({
      table,
      $where,
    });

    const currents = await db.query(selectParams);
    if (!currents.length) {
      return res.status(200).json([]);
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? (??) VALUES ?", [
        archiveTable,
        [].concat(Object.keys(currents[0])).concat("modifier"),
        currents.map((c) =>
          Object.values(c).concat(req.headers["x-user-uuid"] || "stub")
        ),
      ]);
    }

    if (Object.keys(req.body).length) {
      const body = prepareDateTimeStrings(
        reqBodySchema,
        await mapExposedIdentsToInternal(relations, req.body)
      );

      let sql = "UPDATE ?? SET ?";
      let values = [table, body];

      if (selectParams.sql.includes(" where ")) {
        sql += " where " + selectParams.sql.split(" where ")[1];
        values = values.concat(selectParams.values);
      }

      await db.query(sql, values);
    } else {
      // Nothing to update.
      let resBody = (
        await Promise.all(
          currents.map((current) =>
            mapInternalIdentsToExposed(relations, current)
          )
        )
      ).map((x) => _.pick(resBodyKeys, x));
      return res.status(200).json(resBody);
    }
    const records = await db.query(selectParams);
    const resBody = (
      await Promise.all(
        records.map((record) => mapInternalIdentsToExposed(relations, record))
      )
    ).map((x) => _.pick(resBodyKeys, x));
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.attributeTypeBaseDelete = async (req, res, next) => {
  try {
    const table = "_AttributeTypeBase";
    const archiveTable = archiveTablesMap[table];
    const resBodyKeys = [
      "enum",
      "name",
      "labelNumber",
      "defaultValue",
      "isRequired",
      "jsonSchema",
      "label",
      "placeholderText",
      "helpMarkdownText",
      "isMedia",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];
    const ident = "uuid";
    const joins = [];
    const fields = ["*"];

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const current = await db.queryHead(sqlStringAndValues);

    if (!current) {
      return res.status(404).json({ errors: ["Record not found"] });
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? SET ?", [
        archiveTable,
        {
          ..._.omit([], current),
          modifier: req.headers["x-user-uuid"] || "stub",
          userDeleted: 1,
        },
      ]);
    }

    await db.query("DELETE FROM ?? WHERE ?? = ?", [
      table,
      ident,
      req.params[ident],
    ]);

    const resBody = _.pick(resBodyKeys, current);
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.attributeTypeBaseDeleteList = async (req, res, next) => {
  try {
    const table = "_AttributeTypeBase";
    const archiveTable = archiveTablesMap[table];
    const relations = relationsMap[table];
    const resBodyKeys = [
      "enum",
      "name",
      "labelNumber",
      "defaultValue",
      "isRequired",
      "jsonSchema",
      "label",
      "placeholderText",
      "helpMarkdownText",
      "isMedia",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];

    const $where = await prepareWhere(relations, req.query.$where);
    const selectParams = await getSQLString({
      table,
      $where,
    });

    const currents = await db.query(selectParams);
    if (!currents.length) {
      return res.status(200).json([]);
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? (??) VALUES ?", [
        archiveTable,
        []
          .concat(Object.keys(currents[0]))
          .concat("modifier")
          .concat("userDeleted"),
        currents.map((c) =>
          Object.values(c)
            .concat(req.headers["x-user-uuid"] || "stub")
            .concat(1)
        ),
      ]);
    }

    let sql = "DELETE FROM ??";
    let values = [table];

    if (selectParams.sql.includes(" where ")) {
      sql += " where " + selectParams.sql.split(" where ")[1];
      values = values.concat(selectParams.values);
    }

    await db.query(sql, values);

    const resBody = (
      await Promise.all(
        currents.map((record) => mapInternalIdentsToExposed(relations, record))
      )
    ).map((x) => _.pick(resBodyKeys, x));
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.attributeTypeValueBaseGet = async (req, res, next) => {
  try {
    const table = "_AttributeTypeValueBase";
    const ident = "uuid";
    const joins = [];
    const fields = [
      "enum",
      "name",
      "value",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];
    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const record = await db.queryHead(sqlStringAndValues);
    if (!record) {
      return res.status(404).json({ errors: ["Record not found"] });
    }
    return res.status(200).json(record);
  } catch (e) {
    return next(e);
  }
};

module.exports.attributeTypeValueBaseGetList = async (req, res, next) => {
  try {
    const table = "_AttributeTypeValueBase";
    const relations = [];

    const $where = await prepareWhere(relations, req.query.$where);
    const $orderBy = req.query.$orderBy
      ? Array.isArray(req.query.$orderBy)
        ? req.query.$orderBy.map((x) => mapExposedKeysToInternal(relations, x))
        : mapExposedKeysToInternal(relations, req.query.$orderBy)
      : undefined;

    // https://github.com/epoberezkin/ajv/issues/276
    if (req.query.$paginate && req.query.$paginate.page) {
      req.query.$paginate.pageSize = req.query.$paginate.pageSize || 20;
    }

    let rows, totalCount;

    const joins = [];
    const fields = [
      "id",
      "enum",
      "name",
      "value",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];
    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where,
      $orderBy,
      $paginate: req.query.$paginate || undefined,
    });

    if (req.query.$paginate) {
      [rows, totalCount] = await Promise.all([
        db.query(sqlStringAndValues),
        db
          .queryHead(
            await getSQLString({
              table,
              fields: ["COUNT(*)"],
              $where,
              $orderBy,
            })
          )
          .then((d) => d["COUNT(*)"]),
      ]);
    } else {
      rows = await db.query(sqlStringAndValues);
    }

    if (req.query.$paginate) {
      if (typeof req.query.$paginate.limit === "number") {
        const hasMoreResults = rows.length === req.query.$paginate.limit + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }

        res.set("x-pagination-limit", req.query.$paginate.limit);
        res.set("x-pagination-offset", req.query.$paginate.offset);
        res.set(
          "x-pagination-has-previous-page",
          req.query.$paginate.offset > 0
        );
        res.set("x-pagination-has-next-page", !!hasMoreResults);
      } else if (typeof req.query.$paginate.page === "number") {
        const hasMoreResults = rows.length === req.query.$paginate.pageSize + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }

        res.set("x-pagination-page", req.query.$paginate.page);
        res.set("x-pagination-page-size", req.query.$paginate.pageSize);
        res.set("x-pagination-has-previous-page", req.query.$paginate.page > 1);
        res.set("x-pagination-has-next-page", !!hasMoreResults);
      } else {
        const flip =
          typeof req.query.$paginate.first === "number" ? false : true;
        const limit = flip
          ? req.query.$paginate.last
          : req.query.$paginate.first;

        const hasMoreResults = rows.length === limit + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }
        if (flip) {
          rows = rows.reverse();
        }

        const hasPreviousPage = flip ? hasMoreResults : false;
        const hasNextPage = flip ? false : hasMoreResults;
        const startCursor =
          rows[0] && rows[0].id ? encodeCursor(rows[0].id) : null;
        const endCursor =
          rows[rows.length - 1] && rows[rows.length - 1].id
            ? encodeCursor(rows[rows.length - 1].id)
            : null;

        res.set("x-pagination-has-previous-page", hasPreviousPage);
        res.set("x-pagination-has-next-page", hasNextPage);
        if (startCursor != null) {
          res.set("x-pagination-start-cursor", startCursor);
        }
        if (endCursor != null) {
          res.set("x-pagination-end-cursor", endCursor);
        }
      }
    }

    if (typeof totalCount === "number") {
      res.set("x-pagination-total-count", totalCount);
    }

    if (
      typeof totalCount === "number" &&
      req.query.$paginate &&
      req.query.$paginate.pageSize
    ) {
      res.set(
        "x-pagination-last-page",
        Math.ceil(totalCount / req.query.$paginate.pageSize)
      );
    }

    // https://jsperf.com/delete-vs-spread-vs-lodash-omit-vs-lodash-inverse-pick
    for (let row of rows) {
      row.id = undefined;
    }

    return res.status(200).json(rows);
  } catch (e) {
    return next(e);
  }
};

module.exports.attributeTypeValueBasePost = async (req, res, next) => {
  try {
    const table = "_AttributeTypeValueBase";
    const relations = [];
    const reqBodySchema = require("./schemas/_attribute-type-value-base.POST.req.body.json");
    const ident = "uuid";
    const joins = [];
    const fields = [
      "enum",
      "name",
      "value",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];

    const body = prepareDateTimeStrings(
      reqBodySchema,
      await mapExposedIdentsToInternal(relations, req.body)
    );

    const inserted = await db.query("INSERT INTO ?? SET ?? = UUID(), ?", [
      table,
      ident,
      body,
    ]);
    const id = inserted.insertId;

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { id },
    });
    const record = await db.queryHead(sqlStringAndValues);

    return res.status(200).json(record);
  } catch (e) {
    return next(e);
  }
};

module.exports.attributeTypeValueBasePatch = async (req, res, next) => {
  try {
    const table = "_AttributeTypeValueBase";
    const archiveTable = archiveTablesMap[table];
    const relations = [];
    const reqBodySchema = require("./schemas/_attribute-type-value-base.PATCH.req.body.json");
    const resBodyKeys = [
      "enum",
      "name",
      "value",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];
    const ident = "uuid";
    const joins = [];
    const fields = ["*"];

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const current = await db.queryHead(sqlStringAndValues);

    if (!current) {
      return res.status(404).json({ errors: ["Record not found"] });
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? SET ?", [
        archiveTable,
        {
          ..._.omit([], current),
          modifier: req.headers["x-user-uuid"] || "stub",
        },
      ]);
    }

    if (Object.keys(req.body).length) {
      const body = prepareDateTimeStrings(
        reqBodySchema,
        await mapExposedIdentsToInternal(relations, req.body)
      );
      await db.query("UPDATE ?? SET ? WHERE ?? = ?", [
        table,
        body,
        ident,
        req.params[ident],
      ]);
    } else {
      // Nothing to update.
      const resBody = _.pick(resBodyKeys, current);
      return res.status(200).json(resBody);
    }
    const record = await db.queryHead(
      await getSQLString({
        table,
        fields,
        joins,
        $where: { [ident]: req.params["uuid"] },
      })
    );

    const resBody = _.pick(resBodyKeys, record);
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.attributeTypeValueBasePatchList = async (req, res, next) => {
  try {
    const table = "_AttributeTypeValueBase";
    const relations = relationsMap[table];
    const archiveTable = archiveTablesMap[table];
    const reqBodySchema = require("./schemas/_attribute-type-value-base.PATCH.list.req.body.json");
    const resBodyKeys = [
      "enum",
      "name",
      "value",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];

    const $where = await prepareWhere(relations, req.query.$where);
    const selectParams = await getSQLString({
      table,
      $where,
    });

    const currents = await db.query(selectParams);
    if (!currents.length) {
      return res.status(200).json([]);
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? (??) VALUES ?", [
        archiveTable,
        [].concat(Object.keys(currents[0])).concat("modifier"),
        currents.map((c) =>
          Object.values(c).concat(req.headers["x-user-uuid"] || "stub")
        ),
      ]);
    }

    if (Object.keys(req.body).length) {
      const body = prepareDateTimeStrings(
        reqBodySchema,
        await mapExposedIdentsToInternal(relations, req.body)
      );

      let sql = "UPDATE ?? SET ?";
      let values = [table, body];

      if (selectParams.sql.includes(" where ")) {
        sql += " where " + selectParams.sql.split(" where ")[1];
        values = values.concat(selectParams.values);
      }

      await db.query(sql, values);
    } else {
      // Nothing to update.
      let resBody = (
        await Promise.all(
          currents.map((current) =>
            mapInternalIdentsToExposed(relations, current)
          )
        )
      ).map((x) => _.pick(resBodyKeys, x));
      return res.status(200).json(resBody);
    }
    const records = await db.query(selectParams);
    const resBody = (
      await Promise.all(
        records.map((record) => mapInternalIdentsToExposed(relations, record))
      )
    ).map((x) => _.pick(resBodyKeys, x));
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.attributeTypeValueBaseDelete = async (req, res, next) => {
  try {
    const table = "_AttributeTypeValueBase";
    const archiveTable = archiveTablesMap[table];
    const resBodyKeys = [
      "enum",
      "name",
      "value",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];
    const ident = "uuid";
    const joins = [];
    const fields = ["*"];

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const current = await db.queryHead(sqlStringAndValues);

    if (!current) {
      return res.status(404).json({ errors: ["Record not found"] });
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? SET ?", [
        archiveTable,
        {
          ..._.omit([], current),
          modifier: req.headers["x-user-uuid"] || "stub",
          userDeleted: 1,
        },
      ]);
    }

    await db.query("DELETE FROM ?? WHERE ?? = ?", [
      table,
      ident,
      req.params[ident],
    ]);

    const resBody = _.pick(resBodyKeys, current);
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.attributeTypeValueBaseDeleteList = async (req, res, next) => {
  try {
    const table = "_AttributeTypeValueBase";
    const archiveTable = archiveTablesMap[table];
    const relations = relationsMap[table];
    const resBodyKeys = [
      "enum",
      "name",
      "value",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];

    const $where = await prepareWhere(relations, req.query.$where);
    const selectParams = await getSQLString({
      table,
      $where,
    });

    const currents = await db.query(selectParams);
    if (!currents.length) {
      return res.status(200).json([]);
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? (??) VALUES ?", [
        archiveTable,
        []
          .concat(Object.keys(currents[0]))
          .concat("modifier")
          .concat("userDeleted"),
        currents.map((c) =>
          Object.values(c)
            .concat(req.headers["x-user-uuid"] || "stub")
            .concat(1)
        ),
      ]);
    }

    let sql = "DELETE FROM ??";
    let values = [table];

    if (selectParams.sql.includes(" where ")) {
      sql += " where " + selectParams.sql.split(" where ")[1];
      values = values.concat(selectParams.values);
    }

    await db.query(sql, values);

    const resBody = (
      await Promise.all(
        currents.map((record) => mapInternalIdentsToExposed(relations, record))
      )
    ).map((x) => _.pick(resBodyKeys, x));
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.baseGet = async (req, res, next) => {
  try {
    const table = "_Base";
    const ident = "uuid";
    const joins = [];
    const fields = [
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];
    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const record = await db.queryHead(sqlStringAndValues);
    if (!record) {
      return res.status(404).json({ errors: ["Record not found"] });
    }
    return res.status(200).json(record);
  } catch (e) {
    return next(e);
  }
};

module.exports.baseGetList = async (req, res, next) => {
  try {
    const table = "_Base";
    const relations = [];

    const $where = await prepareWhere(relations, req.query.$where);
    const $orderBy = req.query.$orderBy
      ? Array.isArray(req.query.$orderBy)
        ? req.query.$orderBy.map((x) => mapExposedKeysToInternal(relations, x))
        : mapExposedKeysToInternal(relations, req.query.$orderBy)
      : undefined;

    // https://github.com/epoberezkin/ajv/issues/276
    if (req.query.$paginate && req.query.$paginate.page) {
      req.query.$paginate.pageSize = req.query.$paginate.pageSize || 20;
    }

    let rows, totalCount;

    const joins = [];
    const fields = [
      "id",
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];
    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where,
      $orderBy,
      $paginate: req.query.$paginate || undefined,
    });

    if (req.query.$paginate) {
      [rows, totalCount] = await Promise.all([
        db.query(sqlStringAndValues),
        db
          .queryHead(
            await getSQLString({
              table,
              fields: ["COUNT(*)"],
              $where,
              $orderBy,
            })
          )
          .then((d) => d["COUNT(*)"]),
      ]);
    } else {
      rows = await db.query(sqlStringAndValues);
    }

    if (req.query.$paginate) {
      if (typeof req.query.$paginate.limit === "number") {
        const hasMoreResults = rows.length === req.query.$paginate.limit + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }

        res.set("x-pagination-limit", req.query.$paginate.limit);
        res.set("x-pagination-offset", req.query.$paginate.offset);
        res.set(
          "x-pagination-has-previous-page",
          req.query.$paginate.offset > 0
        );
        res.set("x-pagination-has-next-page", !!hasMoreResults);
      } else if (typeof req.query.$paginate.page === "number") {
        const hasMoreResults = rows.length === req.query.$paginate.pageSize + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }

        res.set("x-pagination-page", req.query.$paginate.page);
        res.set("x-pagination-page-size", req.query.$paginate.pageSize);
        res.set("x-pagination-has-previous-page", req.query.$paginate.page > 1);
        res.set("x-pagination-has-next-page", !!hasMoreResults);
      } else {
        const flip =
          typeof req.query.$paginate.first === "number" ? false : true;
        const limit = flip
          ? req.query.$paginate.last
          : req.query.$paginate.first;

        const hasMoreResults = rows.length === limit + 1;

        if (hasMoreResults) {
          // because we peeked
          rows = rows.slice(0, -1);
        }
        if (flip) {
          rows = rows.reverse();
        }

        const hasPreviousPage = flip ? hasMoreResults : false;
        const hasNextPage = flip ? false : hasMoreResults;
        const startCursor =
          rows[0] && rows[0].id ? encodeCursor(rows[0].id) : null;
        const endCursor =
          rows[rows.length - 1] && rows[rows.length - 1].id
            ? encodeCursor(rows[rows.length - 1].id)
            : null;

        res.set("x-pagination-has-previous-page", hasPreviousPage);
        res.set("x-pagination-has-next-page", hasNextPage);
        if (startCursor != null) {
          res.set("x-pagination-start-cursor", startCursor);
        }
        if (endCursor != null) {
          res.set("x-pagination-end-cursor", endCursor);
        }
      }
    }

    if (typeof totalCount === "number") {
      res.set("x-pagination-total-count", totalCount);
    }

    if (
      typeof totalCount === "number" &&
      req.query.$paginate &&
      req.query.$paginate.pageSize
    ) {
      res.set(
        "x-pagination-last-page",
        Math.ceil(totalCount / req.query.$paginate.pageSize)
      );
    }

    // https://jsperf.com/delete-vs-spread-vs-lodash-omit-vs-lodash-inverse-pick
    for (let row of rows) {
      row.id = undefined;
    }

    return res.status(200).json(rows);
  } catch (e) {
    return next(e);
  }
};

module.exports.basePost = async (req, res, next) => {
  try {
    const table = "_Base";
    const relations = [];
    const reqBodySchema = require("./schemas/_base.POST.req.body.json");
    const ident = "uuid";
    const joins = [];
    const fields = [
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];

    const body = prepareDateTimeStrings(
      reqBodySchema,
      await mapExposedIdentsToInternal(relations, req.body)
    );

    const inserted = await db.query("INSERT INTO ?? SET ?? = UUID(), ?", [
      table,
      ident,
      body,
    ]);
    const id = inserted.insertId;

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { id },
    });
    const record = await db.queryHead(sqlStringAndValues);

    return res.status(200).json(record);
  } catch (e) {
    return next(e);
  }
};

module.exports.basePatch = async (req, res, next) => {
  try {
    const table = "_Base";
    const archiveTable = archiveTablesMap[table];
    const relations = [];
    const reqBodySchema = require("./schemas/_base.PATCH.req.body.json");
    const resBodyKeys = [
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];
    const ident = "uuid";
    const joins = [];
    const fields = ["*"];

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const current = await db.queryHead(sqlStringAndValues);

    if (!current) {
      return res.status(404).json({ errors: ["Record not found"] });
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? SET ?", [
        archiveTable,
        {
          ..._.omit([], current),
          modifier: req.headers["x-user-uuid"] || "stub",
        },
      ]);
    }

    if (Object.keys(req.body).length) {
      const body = prepareDateTimeStrings(
        reqBodySchema,
        await mapExposedIdentsToInternal(relations, req.body)
      );
      await db.query("UPDATE ?? SET ? WHERE ?? = ?", [
        table,
        body,
        ident,
        req.params[ident],
      ]);
    } else {
      // Nothing to update.
      const resBody = _.pick(resBodyKeys, current);
      return res.status(200).json(resBody);
    }
    const record = await db.queryHead(
      await getSQLString({
        table,
        fields,
        joins,
        $where: { [ident]: req.params["uuid"] },
      })
    );

    const resBody = _.pick(resBodyKeys, record);
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.basePatchList = async (req, res, next) => {
  try {
    const table = "_Base";
    const relations = relationsMap[table];
    const archiveTable = archiveTablesMap[table];
    const reqBodySchema = require("./schemas/_base.PATCH.list.req.body.json");
    const resBodyKeys = [
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];

    const $where = await prepareWhere(relations, req.query.$where);
    const selectParams = await getSQLString({
      table,
      $where,
    });

    const currents = await db.query(selectParams);
    if (!currents.length) {
      return res.status(200).json([]);
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? (??) VALUES ?", [
        archiveTable,
        [].concat(Object.keys(currents[0])).concat("modifier"),
        currents.map((c) =>
          Object.values(c).concat(req.headers["x-user-uuid"] || "stub")
        ),
      ]);
    }

    if (Object.keys(req.body).length) {
      const body = prepareDateTimeStrings(
        reqBodySchema,
        await mapExposedIdentsToInternal(relations, req.body)
      );

      let sql = "UPDATE ?? SET ?";
      let values = [table, body];

      if (selectParams.sql.includes(" where ")) {
        sql += " where " + selectParams.sql.split(" where ")[1];
        values = values.concat(selectParams.values);
      }

      await db.query(sql, values);
    } else {
      // Nothing to update.
      let resBody = (
        await Promise.all(
          currents.map((current) =>
            mapInternalIdentsToExposed(relations, current)
          )
        )
      ).map((x) => _.pick(resBodyKeys, x));
      return res.status(200).json(resBody);
    }
    const records = await db.query(selectParams);
    const resBody = (
      await Promise.all(
        records.map((record) => mapInternalIdentsToExposed(relations, record))
      )
    ).map((x) => _.pick(resBodyKeys, x));
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.baseDelete = async (req, res, next) => {
  try {
    const table = "_Base";
    const archiveTable = archiveTablesMap[table];
    const resBodyKeys = [
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];
    const ident = "uuid";
    const joins = [];
    const fields = ["*"];

    const sqlStringAndValues = await getSQLString({
      table,
      fields,
      joins,
      $where: { [ident]: req.params["uuid"] },
    });

    const current = await db.queryHead(sqlStringAndValues);

    if (!current) {
      return res.status(404).json({ errors: ["Record not found"] });
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? SET ?", [
        archiveTable,
        {
          ..._.omit([], current),
          modifier: req.headers["x-user-uuid"] || "stub",
          userDeleted: 1,
        },
      ]);
    }

    await db.query("DELETE FROM ?? WHERE ?? = ?", [
      table,
      ident,
      req.params[ident],
    ]);

    const resBody = _.pick(resBodyKeys, current);
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};

module.exports.baseDeleteList = async (req, res, next) => {
  try {
    const table = "_Base";
    const archiveTable = archiveTablesMap[table];
    const relations = relationsMap[table];
    const resBodyKeys = [
      "uuid",
      "shortDescription",
      "longDescription",
      "created",
      "creator",
      "metadata",
      "updated",
      "updaterIdentityUuid",
      "valid",
      "archived",
      "cacheKey",
      "integrityKey",
      "deidentified",
      "deidentifiedTimestamp",
      "markedForExpungepment",
      "expungementTimestamp",
      "containsSensitiveData",
      "sensitivityClassificationTypeEnum",
      "version",
      "correlationUuid",
      "externalId",
      "comment",
      "recordType",
    ];

    const $where = await prepareWhere(relations, req.query.$where);
    const selectParams = await getSQLString({
      table,
      $where,
    });

    const currents = await db.query(selectParams);
    if (!currents.length) {
      return res.status(200).json([]);
    }

    if (archiveTable) {
      await db.query("INSERT INTO ?? (??) VALUES ?", [
        archiveTable,
        []
          .concat(Object.keys(currents[0]))
          .concat("modifier")
          .concat("userDeleted"),
        currents.map((c) =>
          Object.values(c)
            .concat(req.headers["x-user-uuid"] || "stub")
            .concat(1)
        ),
      ]);
    }

    let sql = "DELETE FROM ??";
    let values = [table];

    if (selectParams.sql.includes(" where ")) {
      sql += " where " + selectParams.sql.split(" where ")[1];
      values = values.concat(selectParams.values);
    }

    await db.query(sql, values);

    const resBody = (
      await Promise.all(
        currents.map((record) => mapInternalIdentsToExposed(relations, record))
      )
    ).map((x) => _.pick(resBodyKeys, x));
    return res.status(200).json(resBody);
  } catch (e) {
    return next(e);
  }
};
