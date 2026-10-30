import { defineField, defineType } from "sanity";

export const job = defineType({
  name: "job",
  title: "Job opening",
  type: "document",
  groups: [
    { name: "basics", title: "Basics", default: true },
    { name: "details", title: "Description" },
  ],
  fields: [
    defineField({ name: "title", type: "string", group: "basics", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "slug", group: "basics", options: { source: "title" }, description: "Used in the link that opens this job." }),
    defineField({ name: "open", title: "Currently open", type: "boolean", group: "basics", initialValue: true }),
    defineField({ name: "department", title: "Team / practice", type: "string", group: "basics" }),
    defineField({ name: "location", type: "string", group: "basics", initialValue: "Lagos" }),
    defineField({
      name: "type",
      type: "string",
      group: "basics",
      options: { list: ["Full-time", "Part-time", "Internship", "NYSC", "Contract"] },
      initialValue: "Full-time",
    }),
    defineField({ name: "experience", title: "Experience required", type: "string", group: "basics", description: "e.g. 4–6 years’ post-call" }),
    defineField({ name: "closingDate", title: "Closing date", type: "date", group: "basics" }),
    defineField({ name: "applyUrl", title: "Apply link or email", type: "string", group: "basics", description: "A web link, or mailto:careers@… to open an email." }),
    defineField({ name: "summary", title: "Short summary", type: "text", rows: 3, group: "details", description: "Shown at the top of the drawer." }),
    defineField({ name: "description", title: "About the role", type: "array", of: [{ type: "block" }], group: "details" }),
    defineField({ name: "responsibilities", title: "What you’ll do", type: "array", of: [{ type: "string" }], group: "details" }),
    defineField({ name: "requirements", title: "What we’re looking for", type: "array", of: [{ type: "string" }], group: "details" }),
    defineField({ name: "benefits", title: "What we offer", type: "array", of: [{ type: "string" }], group: "details" }),
  ],
  preview: { select: { title: "title", subtitle: "type" } },
});
