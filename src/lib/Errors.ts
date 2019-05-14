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

export const E_NO_POOLING = ErrorHub.define(
    null,
    "E_NO_POOLING",
    ""
);

export const E_DUP_CONSTRAINT = ErrorHub.define(
    null,
    "E_DUP_CONSTRAINT",
    ""
);

export const E_SYNTAX_ERROR = ErrorHub.define(
    null,
    "E_SYNTAX_ERROR",
    ""
);

export const E_TABLE_NOT_FOUND = ErrorHub.define(
    null,
    "E_TABLE_NOT_FOUND",
    ""
);

export const E_COLUMN_NOT_FOUND = ErrorHub.define(
    null,
    "E_COLUMN_NOT_FOUND",
    ""
);
