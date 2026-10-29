import { defineArrayMember, defineField, defineType } from "sanity";

export const insight = defineType({
  name: "insight",
  title: "Insight",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({
      name: "kind",
      title: "Type",
      type: "string",
      options: { list: ["Article", "Legal update", "Newsletter", "Podcast", "Event"], layout: "radio" },
      initialValue: "Article",
      validation: (r) => r.required(),
    }),
    defineField({ name: "publishedAt", type: "date", validation: (r) => r.required() }),
    defineField({ name: "standfirst", title: "Standfirst", type: "text", rows: 2 }),
    defineField({ name: "authors", type: "array", of: [{ type: "reference", to: [{ type: "person" }] }] }),
    defineField({ name: "practiceArea", type: "reference", to: [{ type: "practiceArea" }] }),
    defineField({ name: "featured", title: "Feature on homepage", type: "boolean", initialValue: false }),
    defineField({ name: "image", type: "image", options: { hotspot: true } }),
    defineField({ name: "readingMinutes", title: "Reading time (minutes)", type: "number" }),
    defineField({
      name: "body",
      type: "array",
      of: [
        defineArrayMember({ type: "block" }),
        defineArrayMember({
          name: "pullQuote",
          title: "Pull quote",
          type: "object",
          fields: [defineField({ name: "text", type: "text", rows: 2 })],
        }),
      ],
    }),
    defineField({ name: "takeaways", title: "Key takeaways", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "footnotes", title: "Notes / citations", type: "array", of: [{ type: "text", rows: 2 }] }),
    defineField({ name: "pdf", title: "PDF (newsletters, full reports)", type: "file", options: { accept: "application/pdf" } }),
  ],
  orderings: [{ title: "Newest first", name: "dateDesc", by: [{ field: "publishedAt", direction: "desc" }] }],
  preview: { select: { title: "title", subtitle: "kind", media: "image" } },
});
