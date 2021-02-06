export function getScalarKeys<
  T extends { properties: { [k: string]: { type?: any } | { $ref?: any } } }
>(
  schema: T
): // Array<AllowedNames<T["properties"], string | number | boolean>>
// Use never instead of any; if we use any, other typos, e.g. {name: "zzz"},
// aren't caught
Array<never> {
  const properties = schema?.properties;
  if (!properties) {
    console.log("return early");
    return [] as any;
  }

  return Object.entries(properties)
    .filter((x: any) =>
      ["string", "number", "integer", "boolean"].includes(x?.[1]?.type)
    )
    .map(([k]) => k) as any;
}
