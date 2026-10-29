"use client";

import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { apiVersion, dataset, projectId } from "./sanity/env";
import { schemaTypes } from "./sanity/schemaTypes";

export default defineConfig({
  basePath: "/studio",
  title: "NOAH LEGAL",
  projectId: projectId || "missing-project-id",
  dataset,
  schema: { types: schemaTypes },
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.listItem().title("Site settings").id("siteSettings").child(S.document().schemaType("siteSettings").documentId("siteSettings")),
            S.divider(),
            S.documentTypeListItem("insight").title("Insights"),
            S.documentTypeListItem("person").title("People"),
            S.documentTypeListItem("practiceArea").title("Practice areas"),
            S.documentTypeListItem("job").title("Job openings"),
          ]),
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
