import asyncio
from playwright.async_api import async_playwright
import http.server
import socketserver
import threading
import os

PORT = 8099
DIRECTORY = "/Users/karolbohdanowicz/my-ai-agents/radlight"

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

def start_server():
    socketserver.TCPServer.allow_reuse_address = True
    httpd = socketserver.TCPServer(("", PORT), Handler)
    httpd.serve_forever()

async def main():
    server_thread = threading.Thread(target=start_server, daemon=True)
    server_thread.start()
    await asyncio.sleep(1)

    output_dir = "/Users/karolbohdanowicz/.gemini/antigravity-ide/brain/a1190e37-c0f5-4af0-ade9-a02d1501a425"
    os.makedirs(output_dir, exist_ok=True)

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(viewport={"width": 1440, "height": 900})
        page = await context.new_page()

        # Check magazyny.html
        await page.goto(f"http://localhost:{PORT}/magazyny.html", wait_until="networkidle")
        await page.screenshot(path=os.path.join(output_dir, "v_magazyny_hero.png"), full_page=False)

        # Check helipad.html
        await page.goto(f"http://localhost:{PORT}/helipad.html", wait_until="networkidle")
        await page.screenshot(path=os.path.join(output_dir, "v_helipad_hero.png"), full_page=False)

        # Check zimowanie-jachtow.html
        await page.goto(f"http://localhost:{PORT}/zimowanie-jachtow.html", wait_until="networkidle")
        await page.screenshot(path=os.path.join(output_dir, "v_zimowanie_hero.png"), full_page=False)

        # Check sprzatanie.html
        await page.goto(f"http://localhost:{PORT}/sprzatanie.html", wait_until="networkidle")
        await page.screenshot(path=os.path.join(output_dir, "v_sprzatanie_hero.png"), full_page=False)

        await browser.close()
        print("All 4 subpages verified with screenshots!")

if __name__ == "__main__":
    asyncio.run(main())
