import { render, screen } from "@testing-library/react";
import AuroraBackground from "../components/AuroraBackground";

test("applies default contact palette and medium intensity", () => {
  render(
    <AuroraBackground>
      <div>Content</div>
    </AuroraBackground>,
  );

  const wrapper = screen.getByText("Content").parentElement as HTMLElement;

  expect(wrapper.style.getPropertyValue("--aurora-before-opacity")).toBe("0.9");
  expect(wrapper.style.getPropertyValue("--aurora-grid-opacity")).toBe("0.25");
  expect(wrapper.style.getPropertyValue("--aurora-main-gradient")).toContain(
    "83, 214, 255",
  );
});

test("supports custom palette and intensity presets", () => {
  render(
    <AuroraBackground palette="violet" intensity="low">
      <div>Preset</div>
    </AuroraBackground>,
  );

  const wrapper = screen.getByText("Preset").parentElement as HTMLElement;

  expect(wrapper.style.getPropertyValue("--aurora-before-opacity")).toBe("0.7");
  expect(wrapper.style.getPropertyValue("--aurora-grid-opacity")).toBe("0.16");
  expect(wrapper.style.getPropertyValue("--aurora-main-gradient")).toContain(
    "181, 133, 255",
  );
});
