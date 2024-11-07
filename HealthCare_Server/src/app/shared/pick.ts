const pick = <T extends Record<string, unknown>, k extends keyof T>(
  obj: T,
  val: k[]
) => {
  const finalObj: Partial<T> = {};
  for (const key of val) {
    if (obj && obj.hasOwnProperty.call(obj, key)) {
      finalObj[key] = obj[key];
    }
  }

  return finalObj;
};

export default pick;
