/*
  In Step 1 ...
*/

import Adapter from 'appkit/microdata/adapter';
import Store from 'appkit/microdata/store';
import Model from 'appkit/microdata/model';
import attr from 'appkit/microdata/attr';

step(1, "Basic Definitions");

test("Adapter", function() {
  ok(Adapter, "exists");
});

test("Model", function() {
  ok(Model, "exists");
});

test("attr exists", function() {
  ok(attr, "attr exists");
  ok(typeof(attr) === 'function', "attr is a macro");
});

test("store exists", function() {
  ok(Store, "Store exists");
});

