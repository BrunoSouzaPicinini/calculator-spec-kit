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
