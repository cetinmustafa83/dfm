import asyncio
from playwright.async_api import async_playwright, expect

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        # Wait for dev server to start
        await asyncio.sleep(10)

        # German
        await page.goto("http://localhost:3000/de")
        await expect(page.get_by_role("heading", name="WIR PFLEGEN MIT HERZ UND VERSTAND")).to_be_visible(timeout=30000)
        await page.screenshot(path="jules-scratch/verification/screenshot_de.png", full_page=True)

        # English
        await page.goto("http://localhost:3000/en")
        await expect(page.get_by_role("heading", name="WE CARE WITH HEART AND MIND")).to_be_visible(timeout=30000)
        await page.screenshot(path="jules-scratch/verification/screenshot_en.png", full_page=True)

        # Turkish
        await page.goto("http://localhost:3000/tr")
        await expect(page.get_by_role("heading", name="KALP VE AKILLA BAKIM YAPIYORUZ")).to_be_visible(timeout=30000)
        await page.screenshot(path="jules-scratch/verification/screenshot_tr.png", full_page=True)

        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
