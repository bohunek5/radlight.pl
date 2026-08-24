import asyncio
from playwright.async_api import async_playwright
import http.server
import socketserver
import threading
import os

PORT = 8105
DIRECTORY = "/Users/karolbohdanowicz/my-ai-agents"

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
        context = await browser.new_context(
            viewport={"width": 390, "height": 844},
            user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
            is_mobile=True,
            has_touch=True
        )
        page = await context.new_page()

        # Mobile Root Index Night
        await page.goto(f"http://localhost:{PORT}/index.html", wait_until="networkidle")
        await page.screenshot(path=os.path.join(output_dir, "v_mobile_root_index_night.png"), full_page=False)

        # Mobile Root Index Day
        await page.locator("#theme-toggle-btn").click()
        await page.wait_for_timeout(300)
        await page.screenshot(path=os.path.join(output_dir, "v_mobile_root_index_day.png"), full_page=False)

        # Mobile Apartamenty Subpage
        await page.goto(f"http://localhost:{PORT}/apartamenty.html", wait_until="networkidle")
        await page.screenshot(path=os.path.join(output_dir, "v_mobile_root_apartamenty.png"), full_page=False)

        await browser.close()
        print("Root mobile tests completed successfully!")

if __name__ == "__main__":
    asyncio.run(main())
