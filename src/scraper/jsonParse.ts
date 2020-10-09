export const jsonParse = (input: string, defaultVal: any = null) => {
  if (typeof input === "string") {
    try {
      return JSON.parse(input);
    } catch {}
  }

  if (typeof input === "object") {
    return input;
  }

  return defaultVal;
};
