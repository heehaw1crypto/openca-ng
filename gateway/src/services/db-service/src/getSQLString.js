const qb = require("mongo-sql");
const queryBuilder = require("mongo-sql/lib/query-builder");
const { db } = require("../core-js/index");
const decodeCursor = require("./decodeCursor");

// https://github.com/goodybag/mongo-sql/blob/master/helpers/conditional.js
const valuesThatUseIsOrIsNot = ["true", "false", true, false, null];

function getValueEqualityOperator(value) {
  return valuesThatUseIsOrIsNot.indexOf(value) > -1 ? "is" : "=";
}

function getValueInequalityOperator(value) {
  return valuesThatUseIsOrIsNot.indexOf(value) > -1 ? "is not" : "!=";
}

qb.conditionalHelpers.add(
  "$eq",
  // eslint-disable-next-line no-unused-vars
  (column, value, values, collection, original) => {
    return column + " " + getValueEqualityOperator(value) + " " + value;
  }
);

qb.conditionalHelpers.add(
  "$neq",
  // eslint-disable-next-line no-unused-vars
  (column, value, values, collection, original) => {
    return column + " " + getValueInequalityOperator(value) + " " + value;
  }
);

// Fork because we want custom behavior when array is empty.
qb.conditionalHelpers.add(
  "$in",
  { cascade: false },
  // eslint-disable-next-line no-unused-vars
  (column, set, values, collection, original) => {
    if (Array.isArray(set)) {
      if (!set.length) {
        // Hack: we don't want matches when the list is empty, so use a
        // clause that we know will never be true: `WHERE column = NULL`.
        return column + " = null";
      }

      const hasNulls = set.indexOf(null) > -1;

      return (
        column +
        " in (" +
        set
          .filter((val) => val !== undefined && val !== null)
          .map((val) => "$" + values.push(val))
          .join(", ") +
        ")" +
        (hasNulls ? " or " + column + " is null" : "")
      );
    }

    return column + " in (" + queryBuilder(set, values).toString() + ")";
  }
);

qb.conditionalHelpers.add(
  "$nin",
  { cascade: false },
  // eslint-disable-next-line no-unused-vars
  (column, set, values, collection, original) => {
    if (Array.isArray(set)) {
      if (!set.length) {
        // We don't want to filter, so don't add a clause.
        return "";
      }

      const hasNulls = set.indexOf(null) > -1;

      return (
        column +
        " not in (" +
        set
          .filter((val) => {
            return val !== undefined && val !== null;
          })
          .map((val) => {
            return "$" + values.push(val);
          })
          .join(", ") +
        ")" +
        (hasNulls ? " or " + column + " is null" : "")
      );
    }

    return column + " not in (" + queryBuilder(set, values).toString() + ")";
  }
);

qb.conditionalHelpers.add(
  "$btwn",
  { cascade: false },
  // eslint-disable-next-line no-unused-vars
  (column, value, values, collection, original) => {
    values.push(value[0]);
    values.push(value[1]);
    return column + " BETWEEN ? AND ?";
  }
);

qb.conditionalHelpers.add(
  "$nbtwn",
  { cascade: false },
  // eslint-disable-next-line no-unused-vars
  (column, value, values, collection, original) => {
    values.push(value[0]);
    values.push(value[1]);
    return column + " NOT BETWEEN ? AND ?";
  }
);

module.exports = async function getSQLString(input) {
  const { table, fields, joins, $where, $orderBy, $paginate } = input;

  let q = await addLimitOffset(table, $paginate, {
    type: "select",
    table,
    columns: fields,
    joins,
    where: $where,
    order: Array.isArray($orderBy)
      ? $orderBy
      : typeof $orderBy === "object"
      ? [$orderBy]
      : undefined,
  });

  q = {
    ...q,
    order: q.order
      ? q.order.map((x) =>
          Object.entries(x)
            .map(([k, v]) => [db.escapeId(k), v])[0]
            .join(" ")
        )
      : undefined,
  };

  const result = qb.sql(q);

  return {
    sql: result
      .toString()
      .replace(/"/g, "`")
      .replace(/\$[0-9]+/g, "?"),
    values: result.values,
  };
};

async function addLimitOffset(table, $paginate, q) {
  // http://www.django-rest-framework.org/api-guide/pagination/
  // https://slack.engineering/evolving-api-pagination-at-slack-1c1f644f8e12
  // https://use-the-index-luke.com/sql/partial-results/fetch-next-page

  if (!$paginate) {
    return q;
  }
  // limit + offset pagination
  if (typeof $paginate.limit === "number") {
    // + 1 to peek if there is more data
    return {
      ...q,
      limit: $paginate.limit + 1,
      offset: $paginate.offset,
      order: (q.order || []).concat({ id: "asc" }),
    };
  }
  // page number pagination
  if (typeof $paginate.page === "number") {
    // + 1 to peek if there is more data
    return {
      ...q,
      limit: $paginate.pageSize + 1,
      offset: ($paginate.page - 1) * $paginate.pageSize,
      order: (q.order || []).concat({ id: "asc" }),
    };
  }

  // cursor pagination
  // https://facebook.github.io/relay/graphql/connections.htm
  // https://github.com/graphql/graphql-relay-js/issues/94
  // https://github.com/facebook/relay/issues/540
  // https://gist.github.com/pcattori/2bb645d587e45c9fdbcabf5cef7a7106
  if ($paginate.after) {
    q = await addCursorWhereClause(table, $paginate, $paginate.after, q);
  }
  if ($paginate.before) {
    q = await addCursorWhereClause(table, $paginate, $paginate.before, q);
  }

  if (typeof $paginate.first === "number") {
    // + 1 to peek if there is more data
    return {
      ...q,
      limit: $paginate.first + 1,
      order: (q.order || [])
        .filter((x) => Object.keys(x)[0] !== "id")
        .concat({ id: "asc" }),
    };
  }
  if (typeof $paginate.last === "number") {
    // + 1 to peek if there is more data
    return {
      ...q,
      limit: $paginate.last + 1,
      order: (q.order || [])
        .filter((x) => Object.keys(x)[0] !== "id")
        // Need to flip if we're paginating backwards.
        .map((x) => {
          const [k, v] = Object.entries(x)[0];
          return { [k]: v === "asc" ? "desc" : "asc" };
        })
        .concat({ id: "desc" }),
    };
  }
  return q;
}

async function addCursorWhereClause(table, $paginate, cursor, q) {
  const idDir = typeof $paginate.first === "number" ? "asc" : "desc";

  if (q.order) {
    const getCompOp = (dir) => (dir === "asc" ? ">" : "<");
    const row = await db.queryHead("SELECT * FROM ?? WHERE id = ?", [
      table,
      decodeCursor(cursor),
    ]);

    const orders = q.order
      .map((x) => Object.entries(x)[0])
      .concat([["id", idDir]]);

    const cond = orders
      // eslint-disable-next-line no-unused-vars
      .map(([col, dir], i) => {
        const a = orders
          .slice(0, i + 1)
          .map(([col2], j, arr) => {
            const field = `${db.escapeId(table)}.${db.escapeId(col2)}`;
            return j === arr.length - 1
              ? `${field} ${getCompOp(dir)} ${db.escape(row[col2])}`
              : `${field} = ${db.escape(row[col2])}`;
          })
          .join(" AND ");
        return "(" + a + ")";
      })
      .join(" OR ");

    // const params = _.flatten(
    //   // eslint-disable-next-line no-unused-vars
    //   orders.map(([col], i) =>
    //     orders.slice(0, i + 1).map(([col2]) => row[col2])
    //   )
    // );

    return {
      ...q,
      where: {
        ...(q.where || {}),
        // Couldn't get it to work, so just escape directly above.
        // $custom: [cond, ...params]
        $custom: ["(" + cond + ")"],
      },
      order: (q.order || []).concat({ id: idDir }),
    };
  }

  const getCompOp = (dir) => (dir === "asc" ? "$gt" : "$lt");
  return {
    ...q,
    where: {
      ...(q.where || {}),
      id: { [getCompOp(idDir)]: decodeCursor(cursor) },
    },
  };
}
