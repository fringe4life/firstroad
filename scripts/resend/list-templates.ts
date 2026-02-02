import { Resend } from "resend";

const apiKey = process.env.RESEND_FULL_ACCESS;

if (!apiKey) {
  console.error("Error: RESEND_FULL_ACCESS environment variable is not set");
  console.error("Template management requires Full Access permissions.");
  process.exit(1);
}

const resend = new Resend(apiKey);

const { data, error } = await resend.templates.list();

if (error) {
  console.error("Error fetching templates:", error);
  process.exit(1);
}

if (!data?.data?.length) {
  console.log("No templates found");
  process.exit(0);
}

console.log("\n📧 Resend Templates:\n");
console.table(
  data.data.map((template) => ({
    id: template.id,
    name: template.name,
    created_at: template.created_at,
  })),
);
console.log(`\nTotal: ${data.data.length} templates\n`);
