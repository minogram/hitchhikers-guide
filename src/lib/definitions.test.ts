import test from "node:test";
import assert from "node:assert/strict";

import { getPasswordRequirementChecks } from "./definitions";

test("getPasswordRequirementChecks reports unmet requirements", () => {
  assert.deepEqual(getPasswordRequirementChecks("abc"), [
    { key: "length", label: "8자 이상", met: false },
    { key: "letter", label: "영문 1자 이상 포함", met: true },
    { key: "number", label: "숫자 1자 이상 포함", met: false },
  ]);
});

test("getPasswordRequirementChecks reports all requirements met", () => {
  assert.deepEqual(getPasswordRequirementChecks("abc12345"), [
    { key: "length", label: "8자 이상", met: true },
    { key: "letter", label: "영문 1자 이상 포함", met: true },
    { key: "number", label: "숫자 1자 이상 포함", met: true },
  ]);
});