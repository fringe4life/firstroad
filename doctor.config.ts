import type { ReactDoctorConfig } from "react-doctor/api";

export default {
  deadCode: false,
  ignore: {
    overrides: [
      {
        files: ["src/app/@auth/**"],
        rules: ["react-doctor/nextjs-missing-metadata"],
      },
      {
        files: ["src/app/(password)/sign-out/**"],
        rules: ["react-doctor/nextjs-missing-metadata"],
      },
      {
        files: ["src/components/ui/**"],
        rules: [
          "react-doctor/no-multi-comp",
          "react-doctor/label-has-associated-control",
        ],
      },
      {
        files: ["package.json"],
        rules: ["socket/low-supply-chain-score"],
      },
    ],
    rules: [
      "react-doctor/only-export-components",
      "react-doctor/server-auth-actions",
    ],
  },
  rootDir: "apps/web",
  rules: {
    "duplicate-prop-shape": "warn",
    "prop-drilling": "warn",
    "thin-wrapper": "warn",
  },
  scope: "full",
  serverAuthFunctionNames: [
    "getUser",
    "getUserOrRedirect",
    "getAdminOwnerOrRedirect",
  ],
  share: false,
  verbose: true,
} satisfies ReactDoctorConfig;
