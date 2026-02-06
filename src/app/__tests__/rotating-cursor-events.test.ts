import {
  shouldHandleCursorLeave,
  shouldHandleCursorEnter,
  shouldReleaseCursorOnNavigationClick,
} from "../portfolio/rotatingCursor";

function createCursorDom() {
  const wrapper = document.createElement("div");
  wrapper.setAttribute("data-cursor", "");

  const childA = document.createElement("span");
  const childB = document.createElement("button");
  wrapper.appendChild(childA);
  wrapper.appendChild(childB);

  const outside = document.createElement("p");

  document.body.appendChild(wrapper);
  document.body.appendChild(outside);

  return { wrapper, childA, childB, outside };
}

test("does not leave when moving between children inside the same data-cursor wrapper", () => {
  const { wrapper, childA, childB } = createCursorDom();

  expect(
    shouldHandleCursorLeave({
      target: childA,
      relatedTarget: childB,
      hoveredElement: wrapper,
    }),
  ).toBe(false);
});

test("leaves when moving from data-cursor wrapper to outside element", () => {
  const { wrapper, childA, outside } = createCursorDom();

  expect(
    shouldHandleCursorLeave({
      target: childA,
      relatedTarget: outside,
      hoveredElement: wrapper,
    }),
  ).toBe(true);
});

test("ignores enter when still inside the same hovered data-cursor wrapper", () => {
  const { wrapper, childA } = createCursorDom();

  expect(
    shouldHandleCursorEnter({
      target: childA,
      hoveredElement: wrapper,
    }),
  ).toBe(false);
});

test("releases cursor when clicking an internal link to a different route", () => {
  const link = document.createElement("a");
  link.href = "/about";
  const child = document.createElement("span");
  link.appendChild(child);
  document.body.appendChild(link);

  expect(
    shouldReleaseCursorOnNavigationClick({
      target: child,
      currentPathname: "/",
    }),
  ).toBe(true);
});

test("does not release cursor when clicking a link to the current route", () => {
  const link = document.createElement("a");
  link.href = "/about";
  const child = document.createElement("span");
  link.appendChild(child);
  document.body.appendChild(link);

  expect(
    shouldReleaseCursorOnNavigationClick({
      target: child,
      currentPathname: "/about",
    }),
  ).toBe(false);
});
