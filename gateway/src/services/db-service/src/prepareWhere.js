const _ = require("lodash/fp");
const { db } = require("../core-js/index");

module.exports = async function prepareWhere(relations, data = {}) {
  let out = {};
  // eslint-disable-next-line no-unused-vars
  await traverse(relations, data, async (where, ptr, parentPtr, root) => {
    const path = ptr.split("/").slice(1);
    const opIndex = path.length - 1;

    if (ops.includes(path[opIndex])) {
      const newPath = path.slice();
      const index = newPath.length - 2;
      const key = newPath[index];
      const related = relations.find(r => r.localForeignIdent === key);

      if (related) {
        newPath[index] = related.localField;
        let newVal = Array.isArray(where)
          ? await Promise.all(
              where.map(v =>
                db
                  .queryHead("SELECT ?? FROM ?? WHERE ?? = ?", [
                    related.foreignField,
                    related.foreignTable,
                    related.foreignIdent,
                    v
                  ])
                  .then(_.property(related.foreignField))
              )
            )
          : await db
              .queryHead("SELECT ?? FROM ?? WHERE ?? = ?", [
                related.foreignField,
                related.foreignTable,
                related.foreignIdent,
                where
              ])
              .then(_.property(related.foreignField));
        if (newVal === undefined) {
          // No match, e.g. because of an invalid UUID. In this case, we want
          // the condition to evaluate to false. Unfortunately, the way that we
          // accomplish this is hacky. We use the fact that `getSQLString.js`
          // turns `{key: {$in: []}}` into `key = NULL` (note: not `key IS NULL`),
          // which is never true. We can't do the more obvious
          // `{key: {$eq: null}}`, since `getSQLString.js` uses `IS` when the
          // value is null :/
          newPath[opIndex] = "$in";
          newVal = [];
        }
        out = _.set(newPath, newVal, out);
        out = _.set(path.slice(0, path.length - 1), undefined, out);
        return;
      }
    } else {
      const key = path[path.length - 1];
      const related = relations.find(r => r.localForeignIdent === key);

      if (related) {
        const newPath = path
          .slice(0, path.length - 1)
          .concat(related.localField);
        let newVal = Array.isArray(where)
          ? await Promise.all(
              where.map(v =>
                db
                  .queryHead("SELECT ?? FROM ?? WHERE ?? = ?", [
                    related.foreignField,
                    related.foreignTable,
                    related.foreignIdent,
                    v
                  ])
                  .then(_.property(related.foreignField))
              )
            )
          : await db
              .queryHead("SELECT ?? FROM ?? WHERE ?? = ?", [
                related.foreignField,
                related.foreignTable,
                related.foreignIdent,
                where
              ])
              .then(_.property(related.foreignField));
        if (newVal === undefined) {
          // See note above.
          newPath.push("$in");
          newVal = [];
        }
        out = _.set(newPath, newVal, out);
        out = _.set(path, undefined, out);
      } else {
        out = path.length ? _.set(path, where, out) : where;
      }
    }
  });

  // Remove keys with undefined values.
  return JSON.parse(JSON.stringify(out));
};

const ops = [
  "$eq",
  "$neq",
  "$gt",
  "$gte",
  "$lt",
  "$lte",
  "$in",
  "$nin",
  "$like",
  "$btwn",
  "$nbtwn",
  "$not",
  "$custom"
];

async function traverse(relations, where, cb) {
  return await _traverse(cb, where, "", where);
}

const _traverse = async function(cb, where, ptr, root, parentPtr) {
  await cb(where, ptr, parentPtr, root);
  if (where && typeof where == "object" && !Array.isArray(where)) {
    for (let key in where) {
      const sch = where[key];
      if (key === "$and" || key == "$or") {
        await Promise.all(
          sch.map(async (s, i) => {
            await _traverse(
              cb,
              s,
              ptr + "/" + key + "/" + i,
              root,
              ptr,
              key,
              where,
              parentPtr,
              i
            );
          })
        );
      } else if (typeof sch === "object") {
        for (let prop in sch) {
          await _traverse(
            cb,
            sch[prop],
            ptr + "/" + key + "/" + escapePtr(prop),
            root,
            ptr,
            key,
            where,
            prop
          );
        }
      } else {
        await _traverse(cb, sch, ptr + "/" + key, root, ptr, key, where);
      }
    }
  }
};

function escapePtr(str) {
  return str.replace(/~/g, "~0").replace(/\//g, "~1");
}
