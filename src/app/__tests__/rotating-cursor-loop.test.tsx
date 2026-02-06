import { render } from "@testing-library/react";
import RotatingCursor from "../portfolio/rotatingCursor";

const mockUsePathname = jest.fn();

jest.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
}));

function createContext2dMock(): CanvasRenderingContext2D {
  return {
    clearRect: jest.fn(),
    save: jest.fn(),
    restore: jest.fn(),
    translate: jest.fn(),
    scale: jest.fn(),
    rotate: jest.fn(),
    beginPath: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    stroke: jest.fn(),
    arc: jest.fn(),
    fill: jest.fn(),
    strokeStyle: "",
    fillStyle: "",
    lineWidth: 0,
  } as unknown as CanvasRenderingContext2D;
}

beforeEach(() => {
  mockUsePathname.mockReset();
  jest.restoreAllMocks();
});

test("does not start additional animation loops when pathname changes", () => {
  const context2d = createContext2dMock();
  jest
    .spyOn(HTMLCanvasElement.prototype, "getContext")
    .mockReturnValue(context2d);
  const rafSpy = jest
    .spyOn(window, "requestAnimationFrame")
    .mockImplementation(() => 1);

  mockUsePathname.mockReturnValue("/about");
  const { rerender } = render(<RotatingCursor />);

  expect(rafSpy).toHaveBeenCalledTimes(1);

  mockUsePathname.mockReturnValue("/blog");
  rerender(<RotatingCursor />);

  expect(rafSpy).toHaveBeenCalledTimes(1);
});
