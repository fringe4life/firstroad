import type { ReactDoctorConfig } from "react-doctor/api";

export default {
  serverAuthFunctionNames: [
    "getUser",
    "getUserOrRedirect",
    "getAdminOwnerOrRedirect",
  ],
  diff: false,
  ignore: {
    overrides: [
      {
        files: ["src/app/@auth/**"],
        rules: ["react-doctor/nextjs-missing-metadata"],
      },
      {
        files: ["src/app/sign-out/**"],
        rules: ["react-doctor/nextjs-missing-metadata"],
      },
      {
        files: ["src/components/ui/**"],
        rules: ["react-doctor/no-multi-comp"],
      },
    ],
    rules: [
      "react-doctor/only-export-components",
      "react-doctor/server-auth-actions",
      "deslop/unused-file",
      "deslop/unused-dev-dependency",
    ],
  },
  verbose: true,
  share: false,
} satisfies ReactDoctorConfig;
