import * as L from "@litert/core";

export const ErrorHub = L.createErrorHub("@litert/databar");

export const E_QUERY_FAILED = ErrorHub.define(
    null,
    "E_QUERY_FAILED",
    ""
);

export const E_CONNECT_FAILED = ErrorHub.define(
    null,
    "E_CONNECT_FAILED",
    ""
);
