import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  fields: [
    defineField({ name: "address", type: "text", rows: 3 }),
    defineField({ name: "phone", type: "string" }),
    defineField({ name: "email", type: "string" }),
    defineField({ name: "hours", type: "string" }),
    defineField({ name: "linkedin", title: "LinkedIn URL", type: "url" }),
    defineField({ name: "instagram", title: "Instagram URL", type: "url" }),
    defineField({ name: "x", title: "X URL", type: "url" }),
    defineField({ name: "foundedYear", type: "string" }),
    defineField({ name: "lawyerCount", type: "string" }),
    defineField({ name: "officeCount", type: "string" }),
    defineField({ name: "firmIntro", title: "Firm intro (homepage)", type: "text", rows: 4 }),
    defineField({ name: "managingPartnerQuote", type: "text", rows: 3 }),
  ],
  preview: { prepare: () => ({ title: "Site settings" }) },
});
