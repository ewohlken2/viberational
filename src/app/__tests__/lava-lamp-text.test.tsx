import { render, screen, act } from "@testing-library/react";
import LavaLampText from "../components/LavaLampText";

test("renders inline text with opaque base and animated gradient overlay", () => {
  let rafCallback: FrameRequestCallback | null = null;

  const rafSpy = jest
    .spyOn(window, "requestAnimationFrame")
    .mockImplementation((callback: FrameRequestCallback) => {
      rafCallback = callback;
      return 1;
    });

  const cancelSpy = jest
    .spyOn(window, "cancelAnimationFrame")
    .mockImplementation(() => {});

  const palette = ["#000000", "#ffffff", "#ff0000", "#00ff00"];

  const { container, unmount } = render(
    <LavaLampText palette={palette}>Hello World</LavaLampText>
  );

  const base = screen.getByTestId("lava-base");
  const overlay = screen.getByTestId("lava-overlay");
  const wrapper = screen.getByTestId("lava-wrapper");
  expect(wrapper).toBeInTheDocument();
  expect(base.textContent).toBe("Hello World");
  expect(overlay.textContent).toBe("Hello World");

  act(() => {
    rafCallback?.(0);
  });

  const initialX = overlay.style.getPropertyValue("--lava-x1");
  const initialY = overlay.style.getPropertyValue("--lava-y1");
  const initialBg = overlay.style.backgroundImage;

  expect(base.style.color).toBe("rgb(221, 109, 255)");
  expect(overlay.style.color).toBe("transparent");
  expect(overlay.style.backgroundClip).toBe("text");
  expect(initialBg).not.toBe("");
  expect(initialX).not.toBe("");
  expect(initialY).not.toBe("");

  act(() => {
    rafCallback?.(1000);
  });

  expect(overlay.style.getPropertyValue("--lava-x1")).not.toBe(initialX);
  expect(overlay.style.getPropertyValue("--lava-y1")).not.toBe(initialY);

  unmount();
  expect(cancelSpy).toHaveBeenCalled();

  rafSpy.mockRestore();
  cancelSpy.mockRestore();
});
