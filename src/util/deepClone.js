import { ObjectId } from "mongodb";
export const DeepClone = (value) => {
  if (value === null || typeof value !== "object") {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((value) => DeepClone(value));
  }

  if (value instanceof ObjectId) {
    return new ObjectId(value);
  }

  if (typeof value === "object") {
    const clonedObj = {};
    for (let key in value) {
      clonedObj[key] = DeepClone(value[key]);
    }
    return clonedObj;
  }
};
