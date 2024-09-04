const { number } = require("joi");

const DeepClone = (value) => {
  if (typeof value === "string" || typeof value === "number") {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((value) => DeepClone(value));
  }

  if (typeof value === "object") {
    const clonedObj = {};
    for (let key in value) {
      clonedObj[key] = DeepClone(value[key]);
    }
    return clonedObj;
  }
};

console.log(
  DeepClone({
    name: "John",
    age: 30,
    address: {
      street: "123 Main St",
      city: "New York",
    },
    hobbies: ["reading", "painting"],
  })
);
