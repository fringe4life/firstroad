/** biome-ignore-all lint/suspicious/noExplicitAny: documentation code */
/** biome-ignore-all lint/suspicious/noAssignInExpressions: documentation code */
import { auth } from "@/lib/auth";

let _schema: ReturnType<typeof auth.api.generateOpenAPISchema> | undefined;
const getSchema = () => {
  if (_schema === undefined) {
    _schema = auth.api.generateOpenAPISchema();
  }
  return _schema;
};

export const OpenAPI = {
  components: getSchema().then(({ components }) => components) as Promise<any>,
  getPaths: (prefix = "/auth/api") =>
    getSchema().then(({ paths }) => {
      const reference: typeof paths = Object.create(null);

      for (const path of Object.keys(paths)) {
        const key = prefix + path;
        reference[key] = paths[path];

        for (const method of Object.keys(paths[path])) {
          const operation = (reference[key] as any)[method];

          operation.tags = ["Better Auth"];
        }
      }

      return reference;
    }) as Promise<any>,
} as const;
