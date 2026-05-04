import test from "node:test";
import assert from "node:assert/strict";

import { matchesCatalogSearch, normalizeCatalogSearchText } from "./catalog-search";

const sampleApp = {
  title: "Product Design Applicator",
  description: "패션 상품 이미지에 디자인 카피를 합성하는 도구",
};

test("normalizeCatalogSearchText trims and collapses spaces", () => {
  assert.equal(
    normalizeCatalogSearchText("  Product   Design   Applicator  "),
    "product design applicator"
  );
});

test("matchesCatalogSearch matches an exact app title", () => {
  assert.equal(matchesCatalogSearch(sampleApp, "Product Design Applicator"), true);
});

test("matchesCatalogSearch matches a title query with irregular spacing", () => {
  assert.equal(matchesCatalogSearch(sampleApp, "  Product   Design  "), true);
});

test("matchesCatalogSearch matches title queries case-insensitively", () => {
  assert.equal(matchesCatalogSearch(sampleApp, "product design applicator"), true);
});

test("matchesCatalogSearch still supports description matches", () => {
  assert.equal(matchesCatalogSearch(sampleApp, "디자인 카피"), true);
});