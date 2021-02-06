import * as _ from "../../routes/no-auth/user/node_modules/lodash";

import * as db from "../../../../lib/database";

export const bulkSqlInsert = async ({
  sqlTableName,
  baselineDataArray,
  updateDataFcn,
  chunkSize = 1000,
}) => {
  const fieldList = await db
    .queryAsync(`DESCRIBE ${sqlTableName}`, [])
    .map((x) => x.Field);

  const valuesMatrix = baselineDataArray
    .map(updateDataFcn)
    .filter((x) => x !== null)
    .map((data) => {
      let out = {};
      for (let k of fieldList) {
        out[k] = data[k];
      }
      return Object.values(out);
    });

  const valuesMatrixChunks = _.chunk(valuesMatrix, chunkSize);

  await Promise.all(
    valuesMatrixChunks.map((valuesMatrix) => {
      return db.queryAsync({
        sql: `INSERT INTO ${sqlTableName} (${fieldList.join(",")}) VALUES ?`,
        values: [valuesMatrix],
      });
    })
  ).catch((err) => {
    console.error("SQL Insert Failed");
    console.error({
      code: err.code,
      errno: err.errno,
      sqlMessage: err.sqlMessage,
      sql: err.sql.length > 80 ? err.sql.substring(0, 80) + "..." : err.sql,
    });
  });
};

export const bulkSqlUpdate = async ({
  sqlTableName,
  subFieldList = null,
  baselineDataArray,
  updateDataFcn,
  chunkSize = 1000,
}: {
  sqlTableName: string;
  subFieldList: string[] | null;
  baselineDataArray: any[];
  updateDataFcn: any;
  chunkSize: number;
}) => {
  let fieldList: any = subFieldList;

  if (!fieldList) {
    fieldList = await db
      .queryAsync(`DESCRIBE ${sqlTableName}`, [])
      .map((x) => x.Field);
  }

  const valuesMatrix = baselineDataArray
    .map(updateDataFcn)
    .filter((x: any) => x !== null)
    .filter((x: any) => !!x.id) // all records must have an ID field
    .map((data: any) => {
      let out = {};
      for (let k of fieldList) {
        out[k] = data[k];
      }
      return Object.values(out);
    });

  const fieldUpdateList = fieldList
    .filter((f) => f !== "id")
    .filter((f) => f !== "uuid")
    .map((f) => `${f}=VALUES(${f})`);

  const valuesMatrixChunks = _.chunk(valuesMatrix, chunkSize);

  await Promise.all(
    valuesMatrixChunks.map((valuesMatrix) => {
      return db.queryAsync({
        sql: `INSERT INTO ${sqlTableName} (${fieldList.join(
          ","
        )}) VALUES ? ON DUPLICATE KEY UPDATE ${fieldUpdateList.join(",")}`,
        values: [valuesMatrix],
      });
    })
  ).catch((err) => {
    console.error("SQL Update Failed");
    console.error({
      code: err.code,
      errno: err.errno,
      sqlMessage: err.sqlMessage,
      sql: err.sql.length > 80 ? err.sql.substring(0, 80) + "..." : err.sql,
    });
  });
};

export const bulkSqlUpdateOneVar = async ({
  sqlTableName,
  fieldName,
  baselineDataArray,
  updateDataFcn,
  chunkSize = 1000,
}: {
  sqlTableName: string;
  fieldName: string;
  baselineDataArray: any[];
  updateDataFcn: any;
  chunkSize: number;
}) => {
  const valueList = baselineDataArray
    .map(updateDataFcn)
    .filter((x: any) => x.id !== undefined && x.id !== null)
    .map((x: any) => ({ id: x.id, value: x.value }));

  const valueListChunks = _.chunk(valueList, chunkSize);

  //  UPDATE table SET column2 = (CASE column1 WHEN 1 THEN 'val1' WHEN 2 THEN 'val2' WHEN 3 THEN 'val3' END) WHERE column1 IN(1, 2 ,3);

  await Promise.all(
    valueListChunks.map((valueList) => {
      const whenThenStatement = valueList.map(() => "WHEN ? THEN ?").join(" ");
      const whenThenValues = valueList.reduce((cum, cur) => {
        cum.push(cur.id);
        cum.push(cur.value);
        return cum;
      }, []);
      const idList = valueList.map((x) => x.id);

      const sql = `UPDATE ?? SET ?? = (CASE id ${whenThenStatement} END) WHERE id IN (?)`;
      const values = [sqlTableName, fieldName]
        .concat(whenThenValues)
        .concat([idList]);

      return db.queryAsync({
        sql,
        values,
      });
    })
  ).catch((err) => {
    console.error("SQL Bulk UpdateOne Failed");
    console.error({
      code: err.code,
      errno: err.errno,
      sqlMessage: err.sqlMessage,
      sql: err.sql.length > 300 ? err.sql.substring(0, 300) + "..." : err.sql,
    });
  });
};
