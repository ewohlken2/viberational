import { act, render, screen } from "@testing-library/react";
import TypingText from "../components/TypingText";

jest.useFakeTimers();

test("shows cursor immediately but no text", () => {
  render(<TypingText startDelay={200}>Hello</TypingText>);

  expect(screen.getByTestId("typing-text-cursor")).toBeInTheDocument();
  expect(screen.queryByText("Hello")).not.toBeInTheDocument();
});

test("types text after delay and fades cursor", async () => {
  const onFinishTyping = jest.fn();
  render(
    <TypingText
      startDelay={100}
      typeSpeed={50}
      cursorFadeOutMs={200}
      onFinishTyping={onFinishTyping}
    >
      Hi
    </TypingText>
  );

  await act(async () => {
    jest.advanceTimersByTime(100);
  });

  await act(async () => {
    jest.advanceTimersByTime(150);
  });

  expect(screen.getByText("Hi")).toBeInTheDocument();
  expect(onFinishTyping).toHaveBeenCalledTimes(1);

  await act(async () => {
    // Allow the cursor fade-out effect to schedule its timer.
    await Promise.resolve();
  });

  await act(async () => {
    jest.advanceTimersByTime(300);
  });

  expect(screen.getByTestId("typing-text-cursor")).toBeInTheDocument();
});
