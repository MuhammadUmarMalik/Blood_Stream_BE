import { rules, schema } from "@ioc:Adonis/Core/Validator";

//student validations
export const Createvalidations = schema.create({
  phone_number: schema.string({}, [
    rules.required(),
    rules.regex(/^\+\d{12}$/), // Custom form at for phone number (e.g., +923171600808)
  ]),
  name: schema.string({}, [rules.required()]),
  gender: schema.string({}, [rules.required()]),
  blood_group: schema.string({}, [rules.required()]),
  address: schema.string({}, [rules.required()]),
  city: schema.string({}, [rules.required()]),
});

export const Updatevalidations = schema.create({
  // name: schema.string({}, [rules.required()]),
  // gender: schema.string({}, [rules.required()]),
  // blood_group: schema.string({}, [rules.required()]),
  // address: schema.string({}, [rules.required()]),
  // city: schema.string({}, [rules.required()]),
  // phone_number: schema.string({}, [
  //   rules.required(),
  //   rules.regex(/^\+\d{12}$/), // Custom format for phone number (e.g., +923171600808)
  // ]),
});
