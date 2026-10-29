import { defineField, defineType } from "sanity";

export const person = defineType({
  name: "person",
  title: "Person",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "name" }, validation: (r) => r.required() }),
    defineField({
      name: "role",
      type: "string",
      options: { list: ["Managing Partner", "Partner", "Senior Associate", "Associate", "Counsel", "Business Services"] },
      validation: (r) => r.required(),
    }),
    defineField({ name: "order", title: "Display order", type: "number" }),
    defineField({ name: "practiceAreas", type: "array", of: [{ type: "reference", to: [{ type: "practiceArea" }] }] }),
    defineField({ name: "barAdmission", title: "Called to the Bar (year)", type: "string" }),
    defineField({ name: "email", type: "string" }),
    defineField({ name: "portrait", type: "image", options: { hotspot: true } }),
    defineField({ name: "shortBio", title: "Short bio", type: "text", rows: 3 }),
    defineField({ name: "bio", title: "Full bio", type: "array", of: [{ type: "block" }] }),
    defineField({ name: "featured", title: "Show on homepage", type: "boolean", initialValue: false }),
  ],
  preview: { select: { title: "name", subtitle: "role", media: "portrait" } },
});
