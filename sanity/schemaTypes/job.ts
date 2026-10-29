import { defineField, defineType } from "sanity";

export const job = defineType({
  name: "job",
  title: "Job opening",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "location", type: "string", initialValue: "Lagos" }),
    defineField({
      name: "type",
      type: "string",
      options: { list: ["Full-time", "Part-time", "Internship", "NYSC", "Contract"] },
      initialValue: "Full-time",
    }),
    defineField({ name: "applyUrl", title: "Apply link or mailto:", type: "string" }),
    defineField({ name: "open", title: "Currently open", type: "boolean", initialValue: true }),
  ],
  preview: { select: { title: "title", subtitle: "type" } },
});
