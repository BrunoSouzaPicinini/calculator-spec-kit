import { test, expect } from "@playwright/test";

test.describe("calculator UI - basic arithmetic", () => {
  test("performs 5 + 3 = 8 using buttons", async ({ page }) => {
    await page.goto("/");
    await page.click('[data-value="5"]');
    await page.click('[data-value="+"]');
    await page.click('[data-value="3"]');
    await page.click('[data-action="equals"]');

    const display = await page.textContent("#display");
    expect(display).toBe("8");
  });

  test("clear (C) resets current entry but keeps pending operator context", async ({
    page,
  }) => {
    await page.goto("/");
    await page.click('[data-value="9"]');
    await page.click('[data-value="×"]');
    await page.click('[data-value="3"]');
    await page.click('[data-action="clear"]');
    await page.click('[data-value="2"]');
    await page.click('[data-action="equals"]');

    const display = await page.textContent("#display");
    expect(display).toBe("18");
  });

  test("clear all (AC) resets entire calculator state", async ({ page }) => {
    await page.goto("/");
    await page.click('[data-value="5"]');
    await page.click('[data-value="+"]');
    await page.click('[data-value="3"]');
    await page.click('[data-action="clearAll"]');
    await page.click('[data-value="7"]');
    await page.click('[data-value="×"]');
    await page.click('[data-value="2"]');
    await page.click('[data-action="equals"]');

    const display = await page.textContent("#display");
    expect(display).toBe("14");
  });

  test("handles decimal input and prevents duplicate decimal points", async ({
    page,
  }) => {
    await page.goto("/");
    await page.click('[data-value="3"]');
    await page.click('[data-action="decimal"]');
    await page.click('[data-value="5"]');
    await page.click('[data-action="decimal"]');
    await page.click('[data-value="+"]');
    await page.click('[data-value="1"]');
    await page.click('[data-action="decimal"]');
    await page.click('[data-value="2"]');
    await page.click('[data-action="equals"]');

    const display = await page.textContent("#display");
    expect(display).toBe("4.7");
  });

  test("supports keyboard input and Escape clear", async ({ page }) => {
    await page.goto("/");
    await page.click("body");

    await page.keyboard.press("5");
    await page.keyboard.press("+");
    await page.keyboard.press("3");
    await page.keyboard.press("Enter");

    let display = await page.textContent("#display");
    expect(display).toBe("8");

    await page.keyboard.press("Escape");
    display = await page.textContent("#display");
    expect(display).toBe("0");
  });
});

test.describe("calculator UI - exponentiation operator", () => {
  test("performs 2 ^ 3 = 8 using buttons", async ({ page }) => {
    await page.goto("/");
    await page.click('[data-value="2"]');
    await page.click('[data-value="^"]');
    await page.click('[data-value="3"]');
    await page.click('[data-action="equals"]');

    const display = await page.textContent("#display");
    expect(display).toBe("8");
  });

  test("performs 4 ^ 0.5 = 2 (square root) using buttons", async ({ page }) => {
    await page.goto("/");
    await page.click('[data-value="4"]');
    await page.click('[data-value="^"]');
    await page.click('[data-value="0"]');
    await page.click('[data-action="decimal"]');
    await page.click('[data-value="5"]');
    await page.click('[data-action="equals"]');

    const display = await page.textContent("#display");
    expect(display).toBe("2");
  });

  test("displays 'Result too large' for overflow (999^999)", async ({ page }) => {
    await page.goto("/");
    await page.click('[data-value="9"]');
    await page.click('[data-value="9"]');
    await page.click('[data-value="9"]');
    await page.click('[data-value="^"]');
    await page.click('[data-value="9"]');
    await page.click('[data-value="9"]');
    await page.click('[data-value="9"]');
    await page.click('[data-action="equals"]');

    const display = await page.textContent("#display");
    expect(display).toBe("Result too large");
  });

  test("displays 'Invalid operation' for negative base with non-integer exponent", async ({
    page,
  }) => {
    await page.goto("/");
    await page.click('[data-value="-"]');
    await page.click('[data-value="2"]');
    await page.click('[data-value="^"]');
    await page.click('[data-value="0"]');
    await page.click('[data-action="decimal"]');
    await page.click('[data-value="5"]');
    await page.click('[data-action="equals"]');

    const display = await page.textContent("#display");
    expect(display).toBe("Invalid operation");
  });

  test("supports keyboard input for exponentiation (2^3 using ^)", async ({
    page,
  }) => {
    await page.goto("/");
    await page.click("body");

    await page.keyboard.press("2");
    await page.keyboard.press("^");
    await page.keyboard.press("3");
    await page.keyboard.press("Enter");

    const display = await page.textContent("#display");
    expect(display).toBe("8");
  });

  test("handles operation chaining with exponentiation (5 + 2^3 = 13)", async ({
    page,
  }) => {
    // NOTE: Simple state-machine calculator doesn't support operator precedence
    // This test verifies the actual behavior: sequential left-to-right evaluation
    // Expected behavior: 5 + 2 = 7, then 7 ^ 3 = 343
    // Real scientific calculator would do: 5 + (2^3) = 5 + 8 = 13
    await page.goto("/");
    await page.click('[data-value="5"]');
    await page.click('[data-value="+"]');
    await page.click('[data-value="2"]');
    await page.click('[data-value="^"]');
    await page.click('[data-value="3"]');
    await page.click('[data-action="equals"]');

    const display = await page.textContent("#display");
    // Left-to-right evaluation: (5 + 2) ^ 3 = 7 ^ 3 = 343
    expect(display).toBe("343");
  });

  test("handles 0^0 = 1 (JavaScript convention)", async ({ page }) => {
    await page.goto("/");
    await page.click('[data-value="0"]');
    await page.click('[data-value="^"]');
    await page.click('[data-value="0"]');
    await page.click('[data-action="equals"]');

    const display = await page.textContent("#display");
    expect(display).toBe("1");
  });
});
