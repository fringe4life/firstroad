import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { Resend } from "resend";

const apiKey = process.env.RESEND_FULL_ACCESS;

if (!apiKey) {
  console.error("Error: RESEND_FULL_ACCESS environment variable is not set");
  console.error("Template management requires Full Access permissions.");
  process.exit(1);
}

const resend = new Resend(apiKey);
const outputDir = "./emails/downloaded";

async function downloadTemplates() {
  // Create output directory
  await mkdir(outputDir, { recursive: true });

  // List all templates
  const { data: listData, error: listError } = await resend.templates.list();

  if (listError) {
    console.error("Error listing templates:", listError);
    process.exit(1);
  }

  if (!listData?.data?.length) {
    console.log("No templates found to download");
    process.exit(0);
  }

  console.log(`\n📥 Downloading ${listData.data.length} templates...\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const template of listData.data) {
    const { data, error } = await resend.templates.get(template.id);

    if (error) {
      console.error(`❌ Error fetching ${template.name}:`, error);
      errorCount++;
      // Still wait before next request to respect rate limit
      await new Promise((resolve) => setTimeout(resolve, 600));
      continue;
    }

    if (data) {
      const safeName = (data.name || data.id).replace(/[^a-zA-Z0-9-_]/g, "-");

      // Save HTML content
      if (data.html) {
        await writeFile(join(outputDir, `${safeName}.html`), data.html);
      }

      // Save plain text content
      if (data.text) {
        await writeFile(join(outputDir, `${safeName}.txt`), data.text);
      }

      // Save metadata as JSON (excluding HTML/text for readability)
      const metadata = {
        id: data.id,
        name: data.name,
        subject: data.subject,
        from: data.from,
        reply_to: data.reply_to,
        variables: data.variables,
        created_at: data.created_at,
        updated_at: data.updated_at,
        status: data.status,
      };
      await writeFile(
        join(outputDir, `${safeName}.json`),
        JSON.stringify(metadata, null, 2),
      );

      console.log(`✅ Downloaded: ${data.name}`);
      successCount++;
    }

    // Wait 600ms between requests to stay under Resend's rate limit (2 req/sec)
    await new Promise((resolve) => setTimeout(resolve, 600));
  }

  console.log("\n📊 Summary:");
  console.log(`   ✅ Success: ${successCount}`);
  if (errorCount > 0) {
    console.log(`   ❌ Errors: ${errorCount}`);
  }
  console.log(`   📁 Output: ${outputDir}\n`);
}

downloadTemplates();
